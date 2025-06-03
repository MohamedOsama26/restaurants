const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    order: { type: Schema.Types.ObjectId, ref: 'Order',required: true, },
    meal: { type: Schema.Types.ObjectId, ref: 'Meal',required: true, },
    quantity: { type: Number, required: true, min:1,},
    price: { type: Number, required: true, },
    total: { type: Number, required: true, },
})

module.exports = mongoose.model('OrderItem', orderItemSchema);