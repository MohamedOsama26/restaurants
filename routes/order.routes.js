const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const {authorize} = require("../middleware/role.middleware");

// POST
router.post(
    '/orders',
    authorize(),
    orderController.createNewOrder,
);

// GET
router.get(
    '/orders',
    authorize(),
    orderController.viewOrders,
);

// GET
router.get(
    '/orders/:id',
    authorize(),
    orderController.getOrderDetails,
);

// PATCH
router.patch(
    '/orders/:id/status',
    authorize('staff', 'admin','owner'),
    orderController.changeOrderStatus,
);

// GET
router.put(
    '/orders/:id',
    authorize(),
    orderController.editOrder,
);

// DELETE
router.delete(
    '/orders/:id',
    authorize(),
    orderController.deleteOrder,
);


module.exports = router;