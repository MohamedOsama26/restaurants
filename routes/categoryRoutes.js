const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {auth} = require("../middleware/authMiddleware");
const {isAdmin} = require("../middleware/roleMiddleware");


router.get('/categories',categoryController.getCategories);
router.get('/category/:id',categoryController.getCategory);

// Admin routes
// router.get('/admin/categories',auth,isAdmin,categoryController.getCategories);
router.post('/admin/categories',auth,isAdmin,categoryController.createCategory);
router.put('/admin/categories/:id',auth,isAdmin,categoryController.updateCategory);
router.delete('/admin/category/:id',auth,isAdmin,categoryController.deleteCategory);


module.exports = router;