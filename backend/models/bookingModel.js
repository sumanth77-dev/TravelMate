const db = require('../config/db');

const Booking = {
    create: async (data, connection = db) => {
        const { user_id, guide_id, booking_date, group_size, duration, message, total_price, status = 'pending' } = data;
        const [result] = await connection.query(
            'INSERT INTO bookings (user_id, guide_id, booking_date, group_size, duration, message, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, guide_id, booking_date, group_size, duration, message, total_price, status]
        );
        return result.insertId;
    },

    findByUserId: async (userId) => {
        const query = `
      SELECT b.*, g.city_location, u.full_name AS guide_name 
      FROM bookings b 
      JOIN guides g ON b.guide_id = g.id 
      JOIN users u ON g.user_id = u.id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC
    `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    },

    findByGuideId: async (userId) => {
        const query = `
      SELECT b.*, u.full_name AS traveler_name, u.email AS traveler_email, NULL AS traveler_photo
      FROM bookings b 
      JOIN users u ON b.user_id = u.id
      WHERE b.guide_id = (
          SELECT id FROM guides WHERE user_id = ?
      )
      ORDER BY b.booking_date DESC
    `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    },

    updateStatus: async (bookingId, status) => {
        const [result] = await db.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, bookingId]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Booking;
