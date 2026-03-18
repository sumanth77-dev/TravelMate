const db = require('../config/db');

const Review = {
    create: async (data) => {
        const { user_id, guide_id, rating, review_text } = data;
        const [result] = await db.query(
            'INSERT INTO reviews (user_id, guide_id, rating, review_text) VALUES (?, ?, ?, ?)',
            [user_id, guide_id, rating, review_text]
        );
        return result.insertId;
    },

    findByGuideId: async (guideId) => {
        const query = `
      SELECT r.*, u.full_name AS user_name, u.profile_photo AS user_photo 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.guide_id = ?
      ORDER BY r.created_at DESC
    `;
        const [rows] = await db.query(query, [guideId]);
        return rows;
    }
};

module.exports = Review;
