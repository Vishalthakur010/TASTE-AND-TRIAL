import User from '../models/user.model.js'
import { generateOTP } from '../utils/otp_generate.js'
import {mailsender} from '../utils/mailSender.js'

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
        if(email){
            user = await User.findOne({email})
            if(!user){
                await new User({email}).save()
            }
        }
        else if(phone){
            user = await User.findOne({phone})
            if(!user){
                await new User({phone}).save()
            } 
        }

        // generate otp
        const {otp, otpExpiresAt} = generateOTP()

        // save otp and expiry
        user.otp = otp
        user.otpExpiresAt = otpExpiresAt
        await user.save()

        // send otp if email is provided
        if(email){
            const emailsent = await mailsender(email, otp)
            if(!emailsent){
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
            message:`Otp sent successfully to ${email || phone}`,
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