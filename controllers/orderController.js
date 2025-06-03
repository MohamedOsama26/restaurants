const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const Meal = require('../models/Meal');
const User = require('../models/User');

const changeOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        await order.save();

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }

};

const viewSpecificOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('user', 'name email');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};

const viewOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const query = {};
        if (status) query.status = status;
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('user', 'name email');

        const count = await Order.countDocuments(query);

        res.json({
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / limit),
            orders
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ _id: id, user: req.user.id });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order details', error });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

const createNewOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Optional: validate items exist and have valid prices
        let total = 0;
        const orderItems = cart.items.map(item => {
            total += item.price * item.quantity;
            return {
                meal: item.meal,
                quantity: item.quantity,
                price: item.price
            };
        });

        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalPrice: total,
            status: 'pending'
        });

        // Clear cart after order placed
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Order created', order });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

module.exports = {
    changeOrderStatus,
    viewSpecificOrder,
    viewOrders,
    getOrderDetails,
    getMyOrders,
    createNewOrder,
};