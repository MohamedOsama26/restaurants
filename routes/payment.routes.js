const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const {authorize} = require("../middleware/role.middleware");

// POST
router.post(
    '/paymob',
    authorize('staff', 'admin','owner','customer'),
    paymentController.startPaymobPayment,
);

// POST
router.post(
    '/webhook',
    authorize('staff', 'admin','owner','customer'),
    paymentController.paymobWebhookCallback,
);


module.exports = router;