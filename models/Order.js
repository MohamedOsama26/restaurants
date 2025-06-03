const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderItem',
        }
    ],
    totalAmount: Number,
    status: {
        type: String,
        enum: ['pending', 'preparing', 'delivering', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
    paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
    deliveryAddress: String,
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
