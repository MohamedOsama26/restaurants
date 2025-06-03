const Category = require('../models/Category');

const getCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.body;
        const query = {};
        // Apply search by name (case-insensitive)
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const total = await Category.countDocuments(query);
        const categories = await Category.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            categories
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories', error });
    }
};

const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get category', error });
    }
}

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const existing = await Category.findOne({ name });
        if (existing) return res.status(400).json({ message: 'Category already exists' });

        const category = new Category({ name });
        await category.save();

        res.status(201).json({ message: 'Category created', category });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create category', error });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );

        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({ message: 'Category updated', category });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update category', error });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete category', error });
    }
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
}