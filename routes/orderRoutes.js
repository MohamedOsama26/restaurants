const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {auth} = require("../middleware/authMiddleware");
const {isAdmin} = require("../middleware/roleMiddleware");

router.post('/orders',auth,orderController.createNewOrder);
router.get('/orders',auth,orderController.getMyOrders);
router.get('/orders/:id',auth,orderController.getOrderDetails);

// Admin routes
router.get('/admin/orders',auth,isAdmin,orderController.viewOrders);
router.get('/admin/orders/:id',auth,isAdmin,orderController.viewSpecificOrder);
router.put('/admin/orders/:id/status',auth,isAdmin,orderController.changeOrderStatus);


module.exports = router;