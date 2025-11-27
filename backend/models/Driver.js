import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const DriverSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    active: { type: Boolean, default: true },
    stats: {
      n: { type: Number, default: 0 },           // total feedback count
      sum: { type: Number, default: 0 },         // sum of mapped stars (1..5)
      // avg: { type: Number, default: 0, index: true },
      lastUpdatedAt: { type: Date }
    },
    alert: {
      lastAlertAt: { type: Date },
      mutedUntil:  { type: Date }
    }
  },
  { timestamps: true }
);

DriverSchema.index({ 'stats.avg': 1 }); // for “risky drivers” queries

const Driver = model('Driver', DriverSchema);
export default Driver;