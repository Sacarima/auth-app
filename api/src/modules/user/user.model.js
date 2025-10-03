import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// helper for setting password
userSchema.methods.setPassword = async function (plain) {
  const saltRounds = 10;
  this.passwordHash = await bcrypt.hash(plain, saltRounds);
};

// helper for comparing password
userSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
