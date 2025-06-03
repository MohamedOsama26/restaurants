const User = require('../models/User');
const isAdmin = async (req, res, next) => {
    try {
        console.log('req.user:', req.user); // Should contain `id`

        const user = await User.findById(req.user.id);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Fetched user:', user.toObject()); // Show raw data
        console.log('User role:', user.role);

        if (user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
        }
    } catch (err) {
        console.error('Error in isAdmin middleware:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { isAdmin };