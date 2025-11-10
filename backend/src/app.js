// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const authRoutes = require('./routes/auth.routes');
// const restaurantRoutes = require('./routes/restaurant.routes');
// const menuRoutes = require('./routes/menu.routes');
// const reviewRoutes = require('./routes/review.routes');
// const bookingRoutes = require('./routes/booking.routes');
// const errorMiddleware = require('./middlewares/error.middleware');

import express from 'express'
// import bodyParser from 'body-parser'
import authRoutes from './routes/auth.routes.js'
// import restaurantRoutes from './routes/restaurant.routes.js'
// import menuRoutes from './routes/menu.routes.js'
// import reviewRoutes from './routes/review.routes.js'
// import bookingRoutes from './routes/booking.routes.js'
// import errorMiddleware from './middlewares/error.middleware.js'

// create app
const app = express();

// Middleware
app.use(express.json());  // For JSON data
app.use(express.urlencoded({ extended: true }));  // For form data


// Routes
app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/restaurants', restaurantRoutes);
// app.use('/api/v1/restaurants', menuRoutes); // menu nested under restaurant
// app.use('/api/v1/restaurants', reviewRoutes); // reviews nested under restaurant
// app.use('/api/v1/bookings', bookingRoutes);


// Error handling
// app.use(errorMiddleware);


export default app;