const Notification = require('../models/Notification');
const User = require('../models/User');

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { id: req.params.id, user: req.user.id },
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }
        res.status(200).json({ message: 'Marked as read.', notification });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update notification.' });
    }
};
const GetNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
};

const sendNotificationToUser = async (req, res) => {
    try {
        const { userId, title, body } = req.body;

        const user = await User.findById(userId);
        if (!user || !user.fcmToken) {
            return res.status(404).json({ message: "User or FCM token not found." });
        }

        const message = {
            notification: { title, body },
            token: user.fcmToken,
        };

        await admin.messaging().send(message);

        // Save to DB
        const notification = new Notification({
            user: userId,
            title,
            body,
        });
        await notification.save();

        res.status(200).json({ message: "Notification sent." });
    } catch (err) {
        res.status(500).json({ error: "Failed to send notification." });
    }
}

module.exports = {
    markAsRead,
    GetNotifications,
    sendNotificationToUser,
}