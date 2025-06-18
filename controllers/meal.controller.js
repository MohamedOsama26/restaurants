const Meal = require('../models/Meal');

const getMeals = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', category, branch } = req.query;
        const query = {};
        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        // Filter by category
        if (category) {
            query.category = category;
        }
        // Filter by branch
        if (branch) {
            query.branch = branch;
        }
        const total = await Meal.countDocuments(query);
        const meals = await Meal.find(query)
            .populate('category', 'name')
            .populate('branch', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            meals
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch meals', error });
    }
};

const getMeal = async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id)
            .populate('category', 'name')
            .populate('branch', 'name');
        if (!meal) return res.status(404).json({ message: 'Meal not found' });
        res.status(200).json(meal);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get meal', error });
    }
};

const addMeal = async (req, res) => {
    try {
        const { name, description, price, category, branch } = req.body;
        if (!name || !price || !category || !branch) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const image = req.file ? req.file.path : null;
        const meal = new Meal({
            name,
            description,
            price,
            category,
            branch,
            image
        });
        await meal.save();
        res.status(201).json({ message: 'Meal added successfully', meal });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add meal', error });
    }
};

const updateMeal = async (req, res) => {
    try {
        const { name, description, price, category, branch, image } = req.body;
        const meal = await Meal.findByIdAndUpdate(
            req.params.id,
            { name, description, price, category, branch, image },
            { new: true }
        );
        if (!meal) return res.status(404).json({ message: 'Meal not found' });
        res.status(200).json({ message: 'Meal updated', meal });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update meal', error });
    }
};

const deleteMeal = async (req, res) => {
    try {
        const meal = await Meal.findByIdAndDelete(req.params.id);
        if (!meal) return res.status(404).json({ message: 'Meal not found' });
        res.status(200).json({ message: 'Meal deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete meal', error });
    }
};

const toggleAvailability = async (req, res) => {};

module.exports = {
    getMeals,
    getMeal,
    addMeal,
    updateMeal,
    deleteMeal,
    toggleAvailability,
}