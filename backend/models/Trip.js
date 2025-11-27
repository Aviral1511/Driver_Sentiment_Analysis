import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const TripSchema = new Schema(
  {
    driverId: { type: Types.ObjectId, ref: 'Driver', index: true, required: true },
    riderId:  { type: Types.ObjectId, ref: 'User' },
    startedAt: { type: Date, index: true },
    endedAt:   { type: Date, index: true }
  },
  { timestamps: true }
);

const Trip = model('Trip', TripSchema);
export default Trip;