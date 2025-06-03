const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {auth,resetAuth} = require("../middleware/authMiddleware");


router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh', authController.refresh);
router.post('/logout',auth, authController.logout);
router.post('/request-otp', authController.requestOtp);
router.post('/verify-login-otp', authController.verifyLoginOtp);
router.post('/verify-reset-otp',authController.verifyResetOtp);
router.post('/reset-password', resetAuth, authController.resetPassword);
router.post('/find-email',authController.findEmail);
router.post('/google-login',authController.googleLogin);


//admin routes
router.post('/admin/login',authController.adminLogin);

module.exports = router;