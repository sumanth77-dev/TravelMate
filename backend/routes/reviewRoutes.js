const express = require('express');
const router = express.Router();
const { createReview, getGuideReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createReview);

router.route('/:guideId')
    .get(getGuideReviews);

module.exports = router;
