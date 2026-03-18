const express = require('express');
const router = express.Router();
const { getGuides, getGuideById } = require('../controllers/guideController');

// Guide Registration is handled in /auth/register to enforce atomic db writes

router.route('/')
    .get(getGuides);

router.route('/:id')
    .get(getGuideById);

module.exports = router;
