const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const {authorize} = require("../middleware/role.middleware");

// GET - get all items in cart
router.get(
    '/cart',
    authorize('customer'),
    cartController.getCurrentCart,
);

// POST - add item to cart
router.post(
    '/cart',
    authorize('customer'),
    cartController.addItemToCart,
);

// PATCH - edit item amount
router.patch(
    'cart/:id',
    authorize('customer'),
    cartController.updateItemQuantity,
);

// DELETE - delete item from cart
router.delete(
    '/cart/:id',
    authorize('customer'),
    cartController.removeCartItem,
);

// DELETE - clear cart
router.delete(
    '/cart',
    authorize('customer'),
    cartController.clearCart,
);

module.exports = router;