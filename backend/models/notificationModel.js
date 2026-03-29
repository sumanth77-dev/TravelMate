const db = require('../config/db');

const Notification = {
    // Create new notification
    create: async (userId, type, message) => {
        try {
            const [result] = await db.query(
                'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
                [userId, type, message]
            );
            return result.insertId;
        } catch (error) {
            console.error('[DEBUG] Error creating notification:', error);
            throw error;
        }
    },

    // Get notifications for a specific user
    findByUserId: async (userId) => {
        try {
            const [rows] = await db.query(
                'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
                [userId]
            );
            return rows;
        } catch (error) {
            console.error('[DEBUG] Error fetching notifications:', error);
            throw error;
        }
    },

    // Mark notification as read
    markAsRead: async (id, userId) => {
        try {
            const [result] = await db.query(
                'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
                [id, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[DEBUG] Error marking notification read:', error);
            throw error;
        }
    },

    // Utility: Notify multiple users in bulk
    createBulk: async (userIds, type, message) => {
        try {
            if (!userIds || userIds.length === 0) return;
            // Map values for bulk insert: [[user_id1, type, message], [user_id2, type, message], ...]
            const values = userIds.map(id => [id, type, message]);
            await db.query(
                'INSERT INTO notifications (user_id, type, message) VALUES ?',
                [values]
            );
        } catch (error) {
            console.error('[DEBUG] Error bulk creating notifications:', error);
            throw error;
        }
    }
};

module.exports = Notification;
