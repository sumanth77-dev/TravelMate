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

const getGuideMe = async (req, res) => {
    try {
        const guide = await Guide.findByUserId(req.user.id);
        if (!guide) {
            return res.status(404).json({ message: 'Guide profile not found' });
        }
        res.status(200).json(guide);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving your guide profile' });
    }
};

const updateGuideMe = async (req, res) => {
    try {
        const city_location = req.body.city_location !== undefined ? req.body.city_location : null;
        const short_bio = req.body.short_bio !== undefined ? req.body.short_bio : null;
        const languages_spoken = req.body.languages_spoken !== undefined ? req.body.languages_spoken : null;
        const years_of_experience = req.body.years_of_experience !== undefined ? req.body.years_of_experience : null;

        // Update main guides table
        await require('../config/db').query(`
            UPDATE guides SET 
                city_location = COALESCE(?, city_location),
                short_bio = COALESCE(?, short_bio),
                languages_spoken = COALESCE(?, languages_spoken),
                years_of_experience = COALESCE(?, years_of_experience)
            WHERE user_id = ?
        `, [city_location, short_bio, languages_spoken, years_of_experience, req.user.id]);

        res.status(200).json({ message: 'Guide profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating guide profile' });
    }
};

module.exports = { getGuides, getGuideById, getGuideMe, updateGuideMe };
