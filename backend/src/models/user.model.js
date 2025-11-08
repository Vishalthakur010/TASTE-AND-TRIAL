// src/models/user.model.js
const mongoose = require('mongoose');

/**
 * User Schema (OTP-based authentication)
 *
 * - Users log in using their phone or email by verifying an OTP.
 * - No password or passwordHash is stored.
 * - Includes role-based access: user, restaurantOwner, admin.
 * - Optional email for notifications and identification.
 * - OTP fields store the current active OTP and its expiry time.
 */

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true,
    match: [/^\d{10}$/, 'Please add a valid 10-digit phone number']
  },
  role: {
    type: String,
    enum: ['user', 'restaurantOwner', 'admin'],
    default: 'user'
  },

  // OTP-based login fields
  otp: {
    type: String,
    select: false // don’t include in query results by default
  },
  otpExpiresAt: {
    type: Date,
    select: false
  },

  isVerified: {
    type: Boolean,
    default: false // becomes true once OTP verified for the first time
  }

}, { timestamps: true });

/**
 * Static method: clearExpiredOtps
 * - Optional utility to clean up old OTPs if you want to use CRON jobs later.
 */
UserSchema.statics.clearExpiredOtps = async function () {
  await this.updateMany(
    { otpExpiresAt: { $lt: new Date() } },
    { $unset: { otp: "", otpExpiresAt: "" } }
  );
};

module.exports = mongoose.model('User', UserSchema);
