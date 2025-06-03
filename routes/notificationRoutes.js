const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const {auth} = require("../middleware/authMiddleware");
const {isAdmin} = require("../middleware/roleMiddleware");


router.get('/notifications',auth,notificationController.GetNotifications);
router.put('/notification/:id',auth,notificationController.markAsRead);

// Admin routes
router.post('/admin/notifications',auth,isAdmin,notificationController.sendNotificationToUser);

module.exports = router;