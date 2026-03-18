const Guide = require('../models/guideModel');

const getGuides = async (req, res) => {
    try {
        const guides = await Guide.findAll();
        res.status(200).json(guides);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving guides' });
    }
};

const getGuideById = async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id);
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }
        res.status(200).json(guide);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving guide' });
    }
};

module.exports = { getGuides, getGuideById };
