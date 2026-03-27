const express = require('express');
const router = express.Router();
const {
    getAnalytics,
    getUsers,
    getGuides,
    approveGuide,
    rejectGuide,
    getBookings
} = require('../controllers/adminController');
const { adminProtect } = require('../middleware/adminMiddleware');

router.use(adminProtect); // All routes below require Admin privileges

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.get('/guides', getGuides);
router.put('/guides/:id/approve', approveGuide);
router.delete('/guides/:id/reject', rejectGuide);
router.get('/bookings', getBookings);

module.exports = router;
