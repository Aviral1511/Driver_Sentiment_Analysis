import Job from '../models/Job.js';
import {
  getWorkerStats,
  processNextJob,
  pauseFeedbackWorker,
  resumeFeedbackWorker,
  isWorkerPaused,
} from '../workers/feedbackWorker.js';

export async function workerStatus(req, res) {
  const stats = await getWorkerStats();
  res.json(stats);
}

export async function workerRunOnce(req, res) {
  const result = await processNextJob();
  res.json(result);
}

export async function workerPause(req, res) {
  pauseFeedbackWorker();
  res.json({ paused: true });
}

export async function workerResume(req, res) {
  resumeFeedbackWorker();
  res.json({ paused: isWorkerPaused() });
}
