const Destination = require('../models/destinationModel');

const getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.findAll();
        res.status(200).json(destinations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving destinations' });
    }
};

const addDestination = async (req, res) => {
    try {
        const { name, location, badge_text, image_url, price_text, tags } = req.body;
        if (!name || !location || !badge_text || !image_url || !price_text) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        
        const badge_class = badge_text.toLowerCase() === 'city' ? 'badge-gold' : 'badge-teal';

        const insertId = await Destination.create({
            name, location, badge_text, badge_class,
            badge_style: '', image_url, rating: 5.0,
            reviews_count: '0', price_text, link: `community.html?place=${location.toLowerCase()}`, tags: tags || ''
        });

        res.status(201).json({ message: 'Destination added successfully', id: insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding destination' });
    }
};

module.exports = { getDestinations, addDestination };
