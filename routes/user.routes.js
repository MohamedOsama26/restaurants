const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");
const {authorize} = require("../middleware/role.middleware");

// POST
router.post(
    '/update-fcm-token',
    authorize(),
    userController.updateFcmToken,
);

// GET
router.get(
    '/profile',
    authorize(),
    userController.getLoggedInUserProfile,
);

// PUT
router.put(
    '/profile',
    authorize(),
    userController.updateUserProfile,
);

// GET
router.get(
    '/admin-profile',
    authorize('admin'),
    userController.getLoggedInAdminProfile,
);

// PUT
router.put(
    '/admin/profile',
    authorize('admin'),
    userController.updateAdminProfile,
);

module.exports = router;