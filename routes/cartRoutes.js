const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const {auth} = require("../middleware/authMiddleware");

router.get('/cart',auth,cartController.getCurrentCart);
router.post('/cart',auth,cartController.addItemToCart);
router.put('cart/:itemId',auth,cartController.updateItemQuantity);
router.delete('/cart/:itemId',auth,cartController.removeCartItem);
router.delete('/cart',auth,cartController.clearCart);
router.post('/cart/checkout',auth,cartController.checkout);

module.exports = router;