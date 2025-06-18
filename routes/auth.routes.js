const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {auth,resetAuth} = require("../middleware/auth.middleware");

// POST
router.post(
    '/register',
    authController.register,
);

// POST
router.post(
    '/refresh',
    authController.refresh,
);

router.post('/login', authController.login);
router.post('/logout',auth, authController.logout);
router.post('/request-otp', authController.requestOtp);
router.post('/verify-login-otp', authController.verifyLoginOtp);
router.post('/verify-reset-otp',authController.verifyResetOtp);
router.post('/reset-password', resetAuth, authController.resetPassword);
router.post('/find-email',authController.findEmail);
router.post('/google-login',authController.googleLogin);



module.exports = router;