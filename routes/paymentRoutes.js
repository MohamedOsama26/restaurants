const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const {auth} = require("../middleware/authMiddleware");


router.post('/paymob',auth,paymentController.startPaymobPayment);
router.post('/webhook',auth,paymentController.paymobWebhookCallback);


module.exports = router;