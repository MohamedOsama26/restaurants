const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const {authorize} = require("../middleware/role.middleware");

// POST
router.post(
    '/admin/notifications',
    authorize('admin','staff'),
    notificationController.sendNotificationToUser,
);

// GET
router.get(
    '/notifications',
    authorize(),
    notificationController.GetNotifications,
);

// PATCH
router.patch(
    '/notification/:id',
    authorize(),
    notificationController.markAsRead,
);

module.exports = router;