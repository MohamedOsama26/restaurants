const express = require('express');
const router = express.Router();
const {auth} = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const {isAdmin} = require("../middleware/roleMiddleware");


router.post('/update-fcm-token',auth,userController.updateFcmToken)
router.get('/profile',auth, userController.getLoggedInUserProfile); //OK 1
router.put('/profile',auth,userController.updateUserProfile); //OK 1

// Admin routes
router.get('/admin/profile',auth,isAdmin,userController.getLoggedInAdminProfile);
router.put('/admin/profile',auth,isAdmin,userController.updateAdminProfile);

module.exports = router;