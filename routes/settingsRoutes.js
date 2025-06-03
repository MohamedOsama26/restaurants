const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const {auth} = require("../middleware/authMiddleware");
const {isAdmin} = require("../middleware/roleMiddleware");


// Admin routes
router.get('/admin/settings',auth,isAdmin,settingsController.viewGlobalSettings);
router.put('/admin/settings',auth,isAdmin,settingsController.updateSettings);


module.exports = router;