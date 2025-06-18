const Restaurant = require("../models/Restaurant");
const Meal = require("../models/Meal");
const {isValidMobile} = require("../utils/validators");

const getRestaurants = async (req, res) => {
    try {
        const {
            search = '',
            page = 1,
            limit = 10,
            isActive,
            owner,
        } = req.query;

        const skip = (page - 1) * limit;

        // Step 1: Get restaurant IDs from meals matching search (if search provided)
        let mealRestaurantIds = [];

        if (search.trim()) {
            const meals = await Meal.find({
                name: { $regex: search, $options: 'i' }
            }).distinct('restaurant');

            mealRestaurantIds = meals.map(id => new mongoose.Types.ObjectId(id));
        }

        // Step 2: Build Restaurant filter
        const filter = {};

        if (search.trim()) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
                { _id: { $in: mealRestaurantIds } } // restaurants that have meals matching search
            ];
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true'; // 'true' => true, 'false' => false
        }

        if (owner) {
            filter.owner = owner; // must be ObjectId string
        }

        const total = await Restaurant.countDocuments(filter);

        const restaurants = await Restaurant.find(filter)
            .populate('owner', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            total,
            page: page,
            pages: Math.ceil(total / limit),
            data: restaurants
        });
    } catch (error) {
        return res.status(500).json({ msg: 'Failed to fetch restaurants', error: error.message });
    }
};

const changeLogo = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if file was uploaded
        if (!req.files || !req.files.logo || req.files.logo.length === 0) {
            return res.status(400).json({ msg: 'No logo file uploaded' });
        }

        const logoFile = req.files.logo[0];

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            id,
            { logo: logoFile.filename }, // Or use logoFile.path if you're storing full path
            { new: true }
        );

        if (!updatedRestaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        return res.status(200).json({
            msg: 'Logo updated successfully',
            restaurant: updatedRestaurant
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

const changeBanner = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.files || !req.files.banner || req.files.banner.length === 0) {
            return res.status(400).json({ msg: 'No banner file uploaded' });
        }

        const bannerFile = req.files.banner[0];

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            id,
            { banner: bannerFile.filename },
            { new: true }
        );

        if (!updatedRestaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        return res.status(200).json({
            msg: 'Banner updated successfully',
            restaurant: updatedRestaurant
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

const getRestaurantInfo = async (req, res) => {

    const {id} = req.query.params;
    console.log(id);

    try {
        const restaurant = await Restaurant.findOne(); // assuming only one restaurant
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant info not found' });
        }

        return res.status(200).json({ restaurant });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ msg: 'Failed to fetch restaurant info', error: error.message });
    }
};

const updateRestaurantInfo = async (req, res) => {
    try {
        const updateFields = req.body;

        // If you're supporting image uploads for logo/banner, handle that separately
        const restaurant = await Restaurant.findOneAndUpdate({}, updateFields, { new: true });

        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        return res.status(200).json({ msg: 'Restaurant updated successfully', restaurant });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ msg: 'Failed to update restaurant info', error: error.message });
    }
};

const deleteRestaurant = async (req, res) => {
    try{
        const {id} = req.body;
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({msg: 'Restaurant not found'});
        }
        await restaurant.deleteOne();
        return res.status(200).json({msg: 'Restaurant deleted successfully'});
    }catch (error){
        console.error(error.message);
        return res.status(500).json({msg: 'Failed to delete restaurant', error: error.message});
    }
}

const createRestaurant = async (req, res) => {
    try{
        const {
            name,
            description,
            address,
            phone,
            logo,
            banner,
            isActive = true,
            owner,
        } = req.body;

        if (!name || !address || !phone) {
            return res.status(400).json({msg: 'Please provide all required fields'});
        }
        if (!isValidMobile(phone)) {
            return res.status(400).json({msg: 'Invalid phone number'});
        }
        const restaurant = new Restaurant({
            name,
            description,
            address,
            phone,
            banner,
            logo,
            isActive,
            owner,
        });
        await restaurant.save();
        return res.status(201).json({msg: 'Restaurant created successfully', restaurant});
    }catch (error){
        console.error(error.message);
        return res.status(500).json({msg: 'Failed to create restaurant', error: error.message});
    }

}

module.exports = {
    getRestaurantInfo,
    updateRestaurantInfo,
    createRestaurant,
    deleteRestaurant,
    getRestaurants,
    changeBanner,
    changeLogo,
};