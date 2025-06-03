const router = require('express').Router();
const restaurantController = require('../controllers/restaurantController');
const {auth} = require('../middleware/authMiddleware');
const {isAdmin} = require('../middleware/roleMiddleware');
const upload = require("../config/multer");


router.get('/admin/restaurant',auth,restaurantController.getRestaurantInfo);

// Admin routes
router.put('/admin/restaurant',auth,isAdmin,restaurantController.updateRestaurantInfo);
router.put('/admin/restaurant',auth,isAdmin,upload.fields([{ name: 'logo' }, { name: 'banner' }]),restaurantController.updateRestaurantInfo);
router.post('/admin/restaurant',auth,isAdmin,restaurantController.createRestaurant);
router.delete('/admin/restaurant',auth,isAdmin,restaurantController.deleteRestaurant);


module.exports = router;