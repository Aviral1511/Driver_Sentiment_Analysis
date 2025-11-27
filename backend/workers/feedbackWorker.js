import Job from '../models/Job.js';
import Feedback from '../models/Feedback.js';
import { classifySentiment } from '../services/sentiment.js';
import { applyIncrementalUpdate } from '../services/driverStats.js';
import { maybeEmitAlert } from '../services/alerts.js';

let _timer = null;
let _paused = false;

const _stats = {
  loopIntervalMs: 250,
  claimed: 0,
  processed: 0,
  failed: 0,
  lastJobId: null,
  lastError: null,
  runningSince: null,
  lastRunAt: null
};

/** Internal: claim the oldest queued job */
async function claimJob() {
  return Job.findOneAndUpdate(
    { type: 'process_feedback', status: 'queued' },
    { $set: { status: 'processing', startedAt: new Date() }, $inc: { attempts: 1 } },
    { new: true, sort: { createdAt: 1 } }
  ).lean();
}

/** Internal: handle a single job */
async function handleJob(job) {
  const { feedbackId } = job.payload || {};
  if (!feedbackId) return;

  const fb = await Feedback.findById(feedbackId).lean();
  if (!fb) return;

  const sentiment = classifySentiment(fb.text, fb.stars);

  await Feedback.updateOne(
    { _id: feedbackId },
    { $set: { sentiment } }
  );

  const newAvg = await applyIncrementalUpdate(fb.driverId, sentiment.mappedStars);
  await maybeEmitAlert(fb.driverId, newAvg);
}

/** Public: run a single iteration (used by /api/worker/run-once) */
export async function processNextJob() {
  if (_paused) return { ok: false, reason: 'paused' };

  let job = null;
  try {
    job = await claimJob();
    if (!job) {
      _stats.lastRunAt = new Date();
      return { ok: true, claimed: false };
    }
    _stats.claimed += 1;
    _stats.lastJobId = String(job._id);

    await handleJob(job);

    await Job.updateOne(
      { _id: job._id },
      { $set: { status: 'done', finishedAt: new Date() } }
    );

    _stats.processed += 1;
    _stats.lastRunAt = new Date();
    return { ok: true, claimed: true, processed: true, jobId: String(job._id) };
  } catch (e) {
    _stats.failed += 1;
    _stats.lastError = e.message;

    if (job) {
      const attempts = job.attempts ?? 1;
      const nextStatus = attempts >= 3 ? 'failed' : 'queued';
      await Job.updateOne(
        { _id: job._id },
        { $set: { status: nextStatus, lastError: e.message } }
      );
    }
    return { ok: false, error: e.message };
  }
}

/** Public: start background polling loop (called from app.js) */
export function startFeedbackWorker() {
  if (_timer) return; // already running
  _paused = false;
  _stats.runningSince = new Date();
  _timer = setInterval(async () => {
    if (_paused) return;
    await processNextJob();
  }, _stats.loopIntervalMs);
  console.log('[worker] Feedback worker started');
}

/** Public: pause/resume + status */
export function pauseFeedbackWorker() {
  _paused = true;
}
export function resumeFeedbackWorker() {
  _paused = false;
}
export function isWorkerPaused() {
  return _paused;
}
export function getWorkerStats() {
  return {
    ..._stats,
    paused: _paused
  };
}
