import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ConfigSchema = new Schema(
  {
    _id: { type: String, default: 'global' }, // always 'global'
    alert: {
      threshold:       { type: Number, default: 2.5 },  // alert when driver avg < threshold
      cooldownMinutes: { type: Number, default: 30 },    // no repeated alerts within cooldown
      burstWindowSec:  { type: Number, default: 120 }    // allow only 1 alert per window
    },
    features: {
      driverFeedback:  { type: Boolean, default: true },
      tripFeedback:    { type: Boolean, default: true },
      appFeedback:     { type: Boolean, default: true },
      marshalFeedback: { type: Boolean, default: false }
    }
  },
  { timestamps: true, _id: false }
);

const Config = model('Config', ConfigSchema);
export default Config;