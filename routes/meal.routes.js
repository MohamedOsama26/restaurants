const express = require('express');
const router = express.Router();
const mealController = require('../controllers/meal.controller');
const {authorize} = require("../middleware/role.middleware");
const upload = require('../config/multer');

// GET
router.get(
    '/meals',
    authorize(),
    mealController.getMeals,
);

// GET
router.get(
    '/meals/:id',
    authorize(),
    mealController.getMeal,
);

// POST
router.post(
    '/meals',
    authorize('admin','owner'),
    upload.single('image'),
    mealController.addMeal,
);

// PUT
router.put(
    '/meals/:id',
    authorize('admin','owner'),
    mealController.updateMeal,
);

// PATCH
router.patch(
    '/meals/:id',
    authorize('admin','owner','staff'),
    mealController.toggleAvailability,
);

router.delete(
    '/meals/:id',
    authorize('admin','owner'),
    mealController.deleteMeal,
);



module.exports = router;