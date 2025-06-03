const mongoose = require('mongoose');

const paymentLogSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    amount: Number,
    method: String,
    gateway: String,
    transactionId: String,
    status: String,
    responseData: Object
}, { timestamps: true });

module.exports = mongoose.model('PaymentLog', paymentLogSchema);