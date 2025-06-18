const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const {authorize} = require("../middleware/role.middleware");

// POST
router.post(
    '/reviews',
    authorize('customer'),
    reviewController.addReview,
);

// GET
router.get(
    '/reviews',
    authorize(),
    reviewController.viewAllReviews,
);

// PUT
router.put(
    '/reviews/:id',
    authorize('customer'),
    reviewController.editReview,
);

// DELETE
router.delete(
    '/reviews/:id',
    authorize('customer','admin'),
    reviewController.deleteReview,
);

module.exports = router;