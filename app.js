const express = require('express');
// const expressOasGenerator = require('express-oas-generator');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth.routes');
const branchRoutes = require('./routes/branch.routes');
const userRoutes = require('./routes/user.routes');
const cartRoutes = require('./routes/cart.routes');
const reviewRoutes = require('./routes/review.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const notificationRoutes = require('./routes/notification.routes');
const settingsRoutes = require('./routes/settings.routes');
const categoryRoutes = require('./routes/category.routes');
const mealRoutes = require('./routes/meal.routes');
const restaurantRoutes = require('./routes/restaurant.routes');


const app = express();
app.use(cors());
app.use(express.json());
// expressOasGenerator.init(app, {})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/restaurants', restaurantRoutes);


console.log('✅ Routes added to app:');
console.log('---------------------------');
// console.log(app.router.stack);
// console.log('---------------------------');
// console.log();
// console.log('---------------------------');
// console.log(app._router.stack
//     .filter(r => r.route)
//     .map(r => r.route.path));

module.exports = app;