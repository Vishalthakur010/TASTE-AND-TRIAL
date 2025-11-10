// const mongoose = require('mongoose')
// require('dotenv').config();
import mongoose from 'mongoose'
import 'dotenv/config'

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connection successfull")
    }
    catch(error){
        console.log("Database connection failed")
        console.error(error)
        process.exit(1)
    }
}

export default connectDB