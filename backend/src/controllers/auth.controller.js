import User from '../models/user.model.js'
import { generateOTP } from '../utils/otp_generate.js'
import { mailsender } from '../utils/mailSender.js'
import jwt from "jsonwebtoken"

export const requestOtp = async (req, res) => {
    try {
        const { email, phone } = req.body

        //  atleast one must be provided
        if (!email && !phone) {
            return res.status(404).json({
                success: false,
                message: 'Please provide either phone number or email.',
            })
        }

        //  Validate email or phone format
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format.',
            });
        }

        if (phone && !/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number.',
            });
        }

        // find or create user
        let user = null
        if (email) {
            user = await User.findOne({ email })
            if (!user) {
                user = await new User({ email }).save()
            }
        }
        else if (phone) {
            user = await User.findOne({ phone })
            if (!user) {
                user = await new User({ phone }).save()
            }
        }

        // clear previous otp and otpExpiresAt
        await User.clearExpiredOtps()

        // generate otp
        const { otp, otpExpiresAt } = generateOTP()

        // save otp and expiry
        user.otp = otp
        user.otpExpiresAt = otpExpiresAt
        await user.save()

        // send otp if email is provided
        if (email) {
            const emailsent = await mailsender(email, otp)
            if (!emailsent) {
                throw new Error("Failed to send OTP on email")
            }
        }

        // If phone is provided, you would integrate with an SMS service here
        else if (phone) {
            // TODO: Implement SMS service integration
            console.log(`SMS OTP for ${phone}: ${otp}`);
        }

        res.status(200).json({
            success: true,
            message: `Otp sent successfully to ${email || phone}`,
            user
        })
    }
    catch (error) {
        console.log("error in requestOtp controller")
        res.status(500).json({
            success: false,
            error: error.message,
            message: "OTP cannot be sent"
        })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        // extract otp
        const { otp } = req.body

        // clear expired otp
        await User.clearExpiredOtps()

        // check if otp is sent by user
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP missing"
            })
        }

        // check if the otp exist and match with the stored one
        let user = await User.findOne({ otp })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        // check if it is expired
        if (user.otpExpiresAt < new Date()) {
            return res.status(401).json({
                success: false,
                message: "OTP expired"
            })
        }

        // generate jwt token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        // After successful verification
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        user.isVerified = true;
        await user.save();

        // set cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        })

        // send response
        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            token,
            user
        })
    }
    catch (error) {
        console.log("error in verifyOtp controller")
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Invalid OTP"
        })
    }
}