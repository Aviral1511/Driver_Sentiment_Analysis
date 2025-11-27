import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

/**
 * Single document per driver to throttle alerts.
 * expireAt has a TTL index so it auto-deletes after cooldown.
 */
const AlertLockSchema = new Schema(
  {
    driverId: { type: Types.ObjectId, ref: 'Driver', unique: true, required: true },
    expireAt: { type: Date, required: true, index: { expires: 0 } } // TTL: expires exactly at expireAt
  },
  { timestamps: true }
);

// AlertLockSchema.index({ driverId: 1 }, { unique: true });

const AlertLock = model('AlertLock', AlertLockSchema);
export default AlertLock;