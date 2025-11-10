// const app = require('./app');
// const connectDB  = require('./utils/db');
// require('dotenv').config();

import app from './app.js'
import connectDB from './utils/db.js'
import 'dotenv/config'

const PORT = process.env.PORT;

connectDB()

//server activation
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
})