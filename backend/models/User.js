import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    hash: { type: String, required: true }, // bcrypt hash
    role: { type: String, enum: ['admin', 'rider', 'ops'], default: 'rider', index: true }
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

const User = model('User', UserSchema);
export default User;