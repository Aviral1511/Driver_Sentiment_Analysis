import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const FeedbackSchema = new Schema(
  {
    driverId: { type: Types.ObjectId, ref: 'Driver', index: true, required: true },
    tripId:   { type: Types.ObjectId, ref: 'Trip' },
    riderId:  { type: Types.ObjectId, ref: 'User' },
    text:     { type: String, required: true, trim: true },
    stars:    { type: Number, min: 1, max: 5 }, // optional if you want text-only
    sentiment: {
      label: { type: String, enum: ['negative','neutral','positive'] },
      score: { type: Number },          // rule-based raw score (can be negative/positive)
      mappedStars: { type: Number, min: 1, max: 5 } // 1..5
    },
    createdAt: { type: Date, default: () => new Date(), index: true },
    dedupeKey: { type: String, unique: true, sparse: true } // idempotency key
  },
  { timestamps: true }
);

FeedbackSchema.index({ driverId: 1, createdAt: -1 });

const Feedback = model('Feedback', FeedbackSchema);
export default Feedback;