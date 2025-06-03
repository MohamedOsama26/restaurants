const Restaurant = require("../models/Restaurant");
const {isValidMobileNumber} = require("../utils/validators");

const getRestaurantInfo = async (req, res) => {
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
        const {name, description, address, phone, image, logo, isActive = true} = req.body;
        if (!name || !address || !phone) {
            return res.status(400).json({msg: 'Please provide all required fields'});
        }
        if (!isValidMobileNumber(phone)) {
            return res.status(400).json({msg: 'Invalid phone number'});
        }
        const restaurant = new Restaurant({
            name,
            description,
            address,
            phone,
            image,
            logo,
            isActive
        });
        await restaurant.save();
        return res.status(201).json({msg: 'Restaurant created successfully', restaurant});
    }catch (error){
        console.error(error.message);
        return res.status(500).json({msg: 'Failed to create restaurant', error: error.message});
    }

}

module.exports = { getRestaurantInfo, updateRestaurantInfo, createRestaurant, deleteRestaurant };