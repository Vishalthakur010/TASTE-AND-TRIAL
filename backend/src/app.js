const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const menuRoutes = require('./routes/menu.routes');
const reviewRoutes = require('./routes/review.routes');
const bookingRoutes = require('./routes/booking.routes');
const errorMiddleware = require('./middlewares/error.middleware');


// Middleware
app.use(bodyParser.json());


// Routes
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/restaurants', restaurantRoutes);
// app.use('/api/v1/restaurants', menuRoutes); // menu nested under restaurant
// app.use('/api/v1/restaurants', reviewRoutes); // reviews nested under restaurant
// app.use('/api/v1/bookings', bookingRoutes);


// Error handling
// app.use(errorMiddleware);


module.exports = app;