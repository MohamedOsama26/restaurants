const User = require("../models/User");
const {isValidEmail, isValidMobile} = require("../utils/validators");

// Update FCM Token
const updateFcmToken = async (req, res) => {
    try {
        const { fcmToken } = req.body;
        await User.findByIdAndUpdate(req.user.id, { fcmToken });
        res.status(200).json({ message: "FCM token updated." });
    } catch (err) {
        res.status(500).json({ error: "Failed to update token." });
    }
};

// Admin - Update Profile
const updateAdminProfile = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updatedAdmin = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, phone },
            { new: true }
        ).select("-password");

        res.status(200).json({ msg: "Admin profile updated", user: updatedAdmin });
    } catch (err) {
        res.status(500).json({ error: "Failed to update admin profile" });
    }
};

// Admin - Get Logged In Profile
const getLoggedInAdminProfile = async (req, res) => {
    try {
        console.log(req.user);
        const admin = await User.findById(req.user.id).select("-password");
        res.status(200).json(admin);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve profile" });
    }
};

// User - Update Profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, email, phone, dob, addresses } = req.body;
        if(email !== null && !isValidEmail(email)){
            return res.status(400).json({ error: "This email is invalid." });
        }else if(phone !== null && !isValidMobile(phone)){
            return res.status(400).json({ error: "Phone is invalid." });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, phone, dob, addresses },
            { new: true }
        ).select("-password");
        res.status(200).json({ msg: "User profile updated", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: "Failed to update user profile" });
    }
};

// User - Get Logged In Profile
const getLoggedInUserProfile = async (req, res) => {
    try {
        console.log('--------------');
        console.log(req.user);
        console.log(req);
        console.log('--------------');
        const user = await User.findById(req.user.id).select("-password");
        console.log(user);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve user profile" });
    }
};

const createUser = async (req, res) => {

};

module.exports = {
    updateFcmToken,
    updateAdminProfile,
    getLoggedInAdminProfile,
    updateUserProfile,
    getLoggedInUserProfile,
    createUser
};