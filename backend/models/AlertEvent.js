import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const AlertEventSchema = new Schema(
  {
    driverId:   { type: Types.ObjectId, ref: 'Driver', index: true, required: true },
    avgAtEvent: { type: Number, required: true },
    // createdAt:  { type: Date, default: () => new Date(), index: true },
    userId:   { type: Types.ObjectId, ref: 'User', index:true },
  },
  { timestamps: true }
);

// AlertEventSchema.index({ driverId: 1, createdAt: 1 });

const AlertEvent = model('AlertEvent', AlertEventSchema);
export default AlertEvent;