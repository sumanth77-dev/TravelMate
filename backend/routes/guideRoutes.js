const express = require('express');
const router = express.Router();
const { getGuides, getGuideById, getGuideMe, updateGuideMe, updatePricing, updateAvailability, updateExpertise, getGuideEarnings, getGuideAvgRating, getGuideTravellers, getDashboardStats } = require('../controllers/guideController');
const { protect } = require('../middleware/authMiddleware');

// Guide Registration is handled in /auth/register to enforce atomic db writes

router.route('/')
    .get(getGuides);

router.route('/me')
    .get(protect, getGuideMe)
    .put(protect, updateGuideMe);

router.route('/me/pricing')
    .put(protect, updatePricing);

router.route('/me/availability')
    .put(protect, updateAvailability);

router.route('/me/expertise')
    .put(protect, updateExpertise);

router.route('/earnings')
    .get(protect, getGuideEarnings);

router.route('/dashboard-stats')
    .get(protect, getDashboardStats);

router.route('/:guideId/avg-rating')
    .get(getGuideAvgRating);

router.route('/:guideId/travellers')
    .get(getGuideTravellers);

router.route('/:id')
    .get(getGuideById);

module.exports = router;
