const Cart = require('../models/Cart');
const Meal = require('../models/Meal');

const getCurrentCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.meal');
        if (!cart) return res.status(200).json({ items: [] });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get cart', error });
    }
};

const addItemToCart = async (req, res) => {
    try {
        const { mealId, quantity } = req.body;
        const meal = await Meal.findById(mealId);
        if (!meal) return res.status(404).json({ message: 'Meal not found' });

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: [],
            });
        }

        const itemIndex = cart.items.findIndex(item => item.meal.toString() === mealId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({
                meal: mealId,
                quantity,
                price: meal.price,
            });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add item to cart', error });
    }
};

const updateItemQuantity = async (req, res) => {
    try {
        const { mealId, quantity } = req.body;
        if (quantity < 1) return res.status(400).json({ message: 'Quantity must be >= 1' });
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(item => item.meal.toString() === mealId);
        if (!item) return res.status(404).json({ message: 'Item not in cart' });

        item.quantity = quantity;

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update item quantity', error });
    }
};

const removeCartItem = async (req, res) => {
    try {
        const { mealId } = req.body;
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.meal.toString() !== mealId);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove item', error });
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        cart.items = [];
        await cart.save();

        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to clear cart', error });
    }
};

const checkout = async (req, res) => {
    try {
        // Future: You should validate payment, create an Order, etc.
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        // Example subtotal calculation
        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // Optional: you could create an Order here, deduct stock, trigger payment flow, etc.
        res.status(200).json({ message: 'Checkout success', total, items: cart.items });
    } catch (error) {
        res.status(500).json({ message: 'Failed to checkout', error });
    }
};

module.exports = {
    addItemToCart,
    getCurrentCart,
    removeCartItem,
    updateItemQuantity,
    clearCart,
    checkout,
}