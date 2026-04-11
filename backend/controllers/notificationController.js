const Notification = require('../models/notificationModel');

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`[DEBUG] Attempting to fetch notifications for user_id: ${userId}`);
        
        const notifications = await Notification.findByUserId(userId);
        console.log(`[DEBUG] Fetched ${notifications.length} notifications successfully for user_id: ${userId}`);
        
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/read/:id
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id;
        
        console.log(`[DEBUG] Marking notification ${notificationId} as read for user_id: ${userId}`);
        
        const success = await Notification.markAsRead(notificationId, userId);
        
        if (!success) {
            console.log(`[DEBUG] Notification ${notificationId} not found or already read`);
            return res.status(404).json({ message: 'Notification not found or unauthorized' });
        }
        
        console.log(`[DEBUG] Successfully marked notification ${notificationId} as read`);
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating notification status' });
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id;
        
        console.log(`[DEBUG] Deleting notification ${notificationId} for user_id: ${userId}`);
        
        const success = await Notification.deleteNotification(notificationId, userId);
        
        if (!success) {
            console.log(`[DEBUG] Notification ${notificationId} not found or unauthorized`);
            return res.status(404).json({ message: 'Notification not found or unauthorized' });
        }
        
        console.log(`[DEBUG] Successfully deleted notification ${notificationId}`);
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting notification' });
    }
};

module.exports = {
    getMyNotifications,
    markAsRead,
    deleteNotification
};
