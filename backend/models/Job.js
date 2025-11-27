import mongoose from "mongoose";
const { Schema, model } = mongoose;

const JobSchema = new Schema(
  {
    type:     { type: String, enum: ['process_feedback'], index: true, required: true },
    payload:  { type: Object, required: true },
    status:   { type: String, enum: ['queued','processing','done','failed'], default: 'queued', index: true },
    attempts: { type: Number, default: 0 },
    lastError:{ type: String },
    createdAt:{ type: Date, default: () => new Date(), index: true },
    startedAt:{ type: Date },
    finishedAt:{ type: Date }
  },
  { timestamps: true }
);

JobSchema.index({ status: 1, createdAt: 1 }); // quickly claim oldest queued jobs

const Job = model('Job', JobSchema);
export default Job;