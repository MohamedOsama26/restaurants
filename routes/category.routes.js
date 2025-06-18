const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const {authorize} = require("../middleware/role.middleware");

// GET
router.get(
    '/categories',
    authorize(),
    categoryController.getCategories,
);

// GET
router.get(
    '/category/:id',
    authorize(),
    categoryController.getCategory,
);

// POST
router.post(
    '/admin/categories',
    authorize('admin','owner'),
    categoryController.createCategory,
);

// PUT
router.put(
    '/admin/categories/:id',
    authorize('admin','owner'),
    categoryController.updateCategory,
);

// DELETE
router.delete(
    '/admin/category/:id',
    authorize('admin','owner'),
    categoryController.deleteCategory,
);


module.exports = router;