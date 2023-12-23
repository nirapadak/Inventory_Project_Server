const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["0","1"],
      default: "0",
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 64,
      min: 6
    }
}, {
    timestamps: true,
  versionKey: false
})

const User =model('User', userSchema);
module.exports = User;

