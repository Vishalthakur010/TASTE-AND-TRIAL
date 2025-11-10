// const nodemailer = require('nodemailer')
import nodemailer from 'nodemailer'

export const mailsender = async (email, otp) => {
    try {
        // create a transport
        const transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        // send mail
        let info = await transport.sendMail({
            from: process.env.EMAIL_FROM,
            to: `${email}`,
            subject: `Verification email from Taste And Trial`,
            html: `
            <h2>Your OTP for login</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 5 minutes.</p>
        `
        })
        return info
    }
    catch (error) {
        console.log("error sending email : ", error)
    }
}