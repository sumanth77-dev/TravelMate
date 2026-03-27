const express = require('express');
const router = express.Router();
const { getGuides, getGuideById, getGuideMe, updateGuideMe } = require('../controllers/guideController');
const { protect } = require('../middleware/authMiddleware');

// Guide Registration is handled in /auth/register to enforce atomic db writes

router.route('/')
    .get(getGuides);

router.route('/me')
    .get(protect, getGuideMe)
    .put(protect, updateGuideMe);

router.route('/:id')
    .get(getGuideById);

module.exports = router;
