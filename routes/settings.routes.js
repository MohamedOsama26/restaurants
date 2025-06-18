const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const {authorize} = require("../middleware/role.middleware");


// Admin routes
router.get(
    '/settings',
    authorize('admin'),
    settingsController.viewGlobalSettings,
);

router.put(
    '/settings',
    authorize('admin'),
    settingsController.updateSettings,
);


module.exports = router;