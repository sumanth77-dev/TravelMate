const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getGuideBookings, updateBookingStatus, getGuideEarnings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createBooking);

// GET /api/bookings/user - Get authenticated user's bookings
router.route('/user')
    .get(protect, getMyBookings);

router.route('/guide')
    .get(protect, getGuideBookings);

router.route('/guide/earnings')
    .get(protect, getGuideEarnings);

router.route('/:id/status')
    .put(protect, updateBookingStatus);

router.route('/:userId')
    .get(protect, getMyBookings);

module.exports = router;
