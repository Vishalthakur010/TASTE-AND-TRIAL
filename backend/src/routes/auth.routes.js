// const express = require('express')
import express from 'express'
const router = express.Router()


// import auth controller
import { requestOtp, verifyOtp } from '../controllers/auth.controller.js';

router.post('/request-otp', requestOtp)
router.post('/verify-otp', verifyOtp)

export default router;