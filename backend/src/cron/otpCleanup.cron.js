// src/cron/otpCleanup.cron.js
import cron from 'node-cron'
import User from '../models/user.model.js'

/**
 * Cron Job: Clear Expired OTPs
 *
 * Runs every 5 minutes to clean up OTPs that are expired.
 * This ensures your database stays clean and prevents leftover OTP clutter.
 */

export const startOtpCleanupJob = () => {
  // Schedule: every 5 minutes -> "*/5 * * * *"
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('🧹 Running OTP cleanup job...')
      const result = await User.updateMany(
        { otpExpiresAt: { $lt: new Date() } },
        { $unset: { otp: "", otpExpiresAt: "" } }
      )
      console.log(`✅ OTP cleanup completed. ${result.modifiedCount} users cleaned.`)
    } catch (error) {
      console.error('❌ Error in OTP cleanup job:', error)
    }
  })
}