const Branch = require('../models/Branch');

const listBranches = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', restaurantId } = req.query;
        console.log(req);

        const query = {};

        // Optional search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // case-insensitive
        }

        // Optional filter by restaurant ID
        if (restaurantId) {
            query.restaurant = restaurantId;
        }

        const total = await Branch.countDocuments(query);

        const branches = await Branch.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 }); // newest first

        res.status(200).json({
            total,
            page: Number(page),
            limit: Number(limit),
            data: branches,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch branches', error });
    }
};

const getBranch = async (req, res) => {
    try {
        const { id } = req.body;
        const branch = await Branch.findById(id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.status(200).json(branch);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch branch', error });
    }
};

const createBranch = async (req, res) => {
    try {
        const { name, address, phone, location, restaurantId } = req.body;
        const branch = new Branch({
            name,
            address,
            phone,
            location,
            restaurant: restaurantId,
        });
        await branch.save();
        res.status(201).json(branch);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create branch', error });
    }
};

const updateBranch = async (req, res) => {
    try {
        const { name, address, phone, location } = req.body;

        const branch = await Branch.findByIdAndUpdate(
            req.params.id,
            {
                name,
                address,
                phone,
                location,
            },
            { new: true }
        );

        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        res.status(200).json(branch);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update branch', error });
    }
};

const deleteBranch = async (req, res) => {
    try {
        const { id } = req.body;
        const branch = await Branch.findByIdAndDelete(id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.status(200).json({ message: 'Branch deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete branch', error });
    }
};

module.exports = {
    listBranches,
    getBranch,
    createBranch,
    updateBranch,
    deleteBranch,
};