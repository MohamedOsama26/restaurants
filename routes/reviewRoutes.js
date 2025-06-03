const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const {auth} = require("../middleware/authMiddleware");
const {isAdmin} = require("../middleware/roleMiddleware");


router.post('/reviews',auth,reviewController.addReview);
router.get('/reviews/:mealId',auth,reviewController.getMealReviews);

// Admin routes
router.get('/admin/reviews',auth,isAdmin,reviewController.viewAllReviews);
router.delete('/admin/reviews/:id',auth,isAdmin,reviewController.deleteReview);

module.exports = router;