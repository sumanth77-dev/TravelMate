const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserPoints } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/points')
    .get(protect, getUserPoints);

module.exports = router;
