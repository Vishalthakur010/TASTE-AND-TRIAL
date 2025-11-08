/**
 * Generates a 6-digit OTP and its expiry time.
 * @param {number} expiryMinutes - Validity duration in minutes (default: 5)
 * @returns {Object} { otp, otpExpiresAt }
 */

exports.generateOTP = function (expiryMinutes = 5) {

    // Generate a random 6-digit OTP (e.g., 123456)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Set expiry time (e.g., 5 minutes from now)
    const otpExpiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000)

    return { otp, otpExpiresAt }
}