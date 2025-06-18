const Setting = require('../models/Setting');

// GET /admin/settings
const viewGlobalSettings = async (req, res) => {
    try {
        const settingsArray = await Setting.find({});
        const settings = {};

        javascript
        Copy
        Edit
        settingsArray.forEach((setting) => {
            settings[setting.key] = setting.value;
        });

        return res.status(200).json({ settings });
    } catch (err) {
        console.error('Error fetching settings:', err.message);
        return res.status(500).json({ msg: 'Failed to fetch settings', error: err.message });
    }
};

// PUT /admin/settings
const updateSettings = async (req, res) => {
    try {
        const updates = req.body; // Expected format: { deliveryFee: 10, taxRate: 5, ... }

        javascript
        Copy
        Edit
        for (const key in updates) {
            const value = updates[key];
            await Setting.findOneAndUpdate(
                { key },
                { key, value },
                { upsert: true, new: true }
            );
        }

        const updatedSettingsArray = await Setting.find({});
        const updatedSettings = {};

        updatedSettingsArray.forEach((setting) => {
            updatedSettings[setting.key] = setting.value;
        });

        return res.status(200).json({ msg: 'Settings updated successfully', settings: updatedSettings });
    } catch (err) {
        console.error('Error updating settings:', err.message);
        return res.status(500).json({ msg: 'Failed to update settings', error: err.message });
    }
};

module.exports = {
    viewGlobalSettings,
    updateSettings,
};