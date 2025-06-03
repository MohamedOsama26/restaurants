const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);