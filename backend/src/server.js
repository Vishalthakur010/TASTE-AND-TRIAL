// const app = require('./app');
// const connectDB  = require('./utils/db');
// require('dotenv').config();

import app from './app.js'
import connectDB from './utils/db.js'
import 'dotenv/config'
import {startOtpCleanupJob} from './cron/otpCleanup.cron.js'

const PORT = process.env.PORT;

// connect to database
connectDB()

// start cron job
// startOtpCleanupJob()

//server activation
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
})