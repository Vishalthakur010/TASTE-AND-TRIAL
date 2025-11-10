// const express = require('express')
import express from 'express'
const router = express.Router()


// import auth controller
import { requestOtp } from '../controllers/auth.controller.js';

router.post('/requestOTP', requestOtp)

export default router;