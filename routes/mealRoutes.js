const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const {auth} = require("../middleware/authMiddleware");
const {isAdmin} = require("../middleware/roleMiddleware");
const upload = require('../config/multer');

router.get('/meals',auth,mealController.getMeals);
router.get('/meals/:id',auth,mealController.getMeal);

// Admin routes
// router.get('/admin/meals',auth,isAdmin,upload.single('image'),mealController.getMeals);
router.post('/admin/meals',auth,isAdmin,upload.single('image'),mealController.addMeal);
router.put('/admin/meals/:id',auth,isAdmin,mealController.updateMeal);
router.delete('/admin/meals/:id',auth,isAdmin,mealController.deleteMeal);



module.exports = router;