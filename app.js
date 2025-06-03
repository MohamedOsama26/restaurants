const express = require('express');
// const expressOasGenerator = require('express-oas-generator');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const branchRoutes = require('./routes/branchRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const mealRoutes = require('./routes/mealRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');


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
console.log(app.router.stack);
console.log('---------------------------');
console.log();
console.log('---------------------------');
// console.log(app._router.stack
//     .filter(r => r.route)
//     .map(r => r.route.path));

module.exports = app;