const router = require('express').Router();
const restaurantController = require('../controllers/restaurant.controller');
const {authorize} = require('../middleware/role.middleware');
const upload = require("../config/multer");

// GET
router.get(
    '/restaurant',
    // authorize('admin', 'owner', 'customer'),
    restaurantController.getRestaurants,
);

// GET
router.get(
    '/restaurant/:id',
    authorize('admin', 'owner', 'customer'),
    restaurantController.getRestaurantInfo,
);

// PUT
router.put(
    '/restaurant/:id',
    authorize('admin', 'owner',),
    restaurantController.updateRestaurantInfo,
);

// PATCH
router.patch(
    '/restaurant/:id',
    authorize('admin', 'owner', 'customer'),
    upload.fields([{ name: 'logo' }]),
    restaurantController.changeLogo,
);

// PATCH
router.patch(
    '/restaurant/:id',
    authorize('admin', 'owner', 'customer'),
    upload.fields([ { name: 'banner' }]),
    restaurantController.changeBanner,
);

// POST
router.post(
    '/restaurant',
    authorize('admin'),
    upload.fields([{ name: 'logo' },{name:'banner'}],),
    restaurantController.createRestaurant,
);

// DELETE
router.delete(
    '/restaurant/:id',
    authorize('admin'),
    restaurantController.deleteRestaurant,
);


module.exports = router;