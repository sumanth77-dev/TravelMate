const express = require('express');
const router = express.Router();

const { createReview, getGuideReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Create review
router.post('/', protect, createReview);

// Get reviews of a guide
router.get('/:guideId', getGuideReviews);

module.exports = router;