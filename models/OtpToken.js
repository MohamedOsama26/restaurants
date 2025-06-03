const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    otp:{
        type: String,
        required: true,
    },
    expiresAt:{
        type: Date,
        required: true,
    },
}, {
    timestamps: true,

});

module.exports = mongoose.model('OtpToken', otpSchema);