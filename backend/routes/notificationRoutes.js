const express = require('express');
const router = express.Router();
const { getMyNotifications, markAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Mount routes with protection
router.get('/', protect, getMyNotifications);
router.put('/read/:id', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
