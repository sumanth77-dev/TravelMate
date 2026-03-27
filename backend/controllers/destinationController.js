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

module.exports = { getDestinations };
