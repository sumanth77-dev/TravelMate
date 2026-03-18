const Review = require('../models/reviewModel');

const createReview = async (req, res) => {
    const { guide_id, rating, review_text } = req.body;
    try {
        const reviewId = await Review.create({
            user_id: req.user.id,
            guide_id,
            rating,
            review_text
        });
        res.status(201).json({ id: reviewId, message: 'Review added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating review' });
    }
};

const getGuideReviews = async (req, res) => {
    try {
        const reviews = await Review.findByGuideId(req.params.guideId);
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving reviews' });
    }
};

module.exports = { createReview, getGuideReviews };
