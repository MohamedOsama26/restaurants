const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['owner', 'branch-admin'], default: 'branch-admin' },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);