const Review = require('../models/Review');
const Meal = require('../models/Meal');
const mongoose = require('mongoose');

// Add a new review
const addReview = async (req, res) => {
    try {
        const { mealId, rating, comment } = req.body;
        const userId = req.user.id;

        php
        Copy
        Edit
        if (!mongoose.Types.ObjectId.isValid(mealId)) {
            return res.status(400).json({ msg: 'Invalid meal ID' });
        }

        const meal = await Meal.findById(mealId);
        if (!meal) {
            return res.status(404).json({ msg: 'Meal not found' });
        }

// Check if user already reviewed this meal
        const existingReview = await Review.findOne({ user: userId, meal: mealId });
        if (existingReview) {
            return res.status(400).json({ msg: 'You have already reviewed this meal' });
        }

        const review = new Review({
            user: userId,
            meal: mealId,
            rating,
            comment,
        });

        await review.save();

        res.status(201).json({ msg: 'Review added successfully', review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to add review', error: err.message });
    }
};

// Get reviews for a specific meal
const getMealReviews = async (req, res) => {
    try {
        const mealId = req.params.mealId;

        less
        Copy
        Edit
        if (!mongoose.Types.ObjectId.isValid(mealId)) {
            return res.status(400).json({ msg: 'Invalid meal ID' });
        }

        const reviews = await Review.find({ meal: mealId }).populate('user', 'name');

        res.status(200).json({ reviews });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to fetch reviews', error: err.message });
    }
};

// Admin: View all reviews with optional pagination and search
const viewAllReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        php
        Copy
        Edit
        const query = search
            ? {
                $or: [
                    { comment: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const total = await Review.countDocuments(query);

        const reviews = await Review.find(query)
            .populate('user', 'name')
            .populate('meal', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to fetch reviews', error: err.message });
    }
};

// Admin: Delete a review
const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ msg: 'Invalid review ID' });
        }

        const deleted = await Review.findByIdAndDelete(reviewId);
        if (!deleted) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        res.status(200).json({ msg: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to delete review', error: err.message });
    }
};

const editReview = async (req, res) => {};

module.exports = {
    addReview,
    getMealReviews,
    viewAllReviews,
    deleteReview,
    editReview,
};