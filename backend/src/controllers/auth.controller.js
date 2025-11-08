import User from '../models/user.model'
import { generateOTP } from '../utils/otp_generate'

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
            if(!user) new User({email})
        }
        else if(phone){
            user = await User.findOne({phone})
            if(!phone) new User({phone})
        }

        // generate otp
        const {otp, otpExpiresAt} = generateOTP()

        // save otp and expiry
        user.otp = otp
        user.otpExpiresAt = otpExpiresAt
        user.save()

        res.status(200).json({
            success: true,
            message:`Otp sent successfully to ${email || phone}`
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