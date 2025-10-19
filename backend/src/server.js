const app = require('./app');
const connectDB  = require('./utils/db');
require('dotenv').config();

const PORT = process.env.PORT;

connectDB()

//server activation
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
})