const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    phone: {
        type: String,
        unique: true,
        required: true,

    },
    image: String,
    dob: Date,
    addresses: [
        {
            label: String,
            city: String,
            street: String,
            building: String,
            floor: String,
            notes: String
        }
    ],
    userType: { type: String, enum: ['admin', 'owner', 'staff', 'customer'], default: 'customer' },
    fcmToken: {
        type: String,
        default: null,
    },
    isActive: { type: Boolean, default: true },
    refreshTokens: [
        {
            userId: {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            token: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            expiresAt: {
                type: Date,
                required: true,
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);