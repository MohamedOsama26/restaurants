const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    phone: String,
    logo: String,
    image: String,
    address: String,
    isActive: { type: Boolean, default: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);