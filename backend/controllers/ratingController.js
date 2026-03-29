const db = require('../config/db');

const createRating = async (req, res) => {
    const { guide_id, booking_id, rating, review } = req.body;
    try {
        const [bookings] = await db.query("SELECT * FROM bookings WHERE id = ? AND user_id = ? AND status = 'completed'", [booking_id, req.user.id]);
        if (!bookings.length) return res.status(403).json({ message: 'Can only rate completed bookings' });

        const [existing] = await db.query('SELECT id FROM ratings WHERE booking_id = ?', [booking_id]);
        if (existing.length) return res.status(400).json({ message: 'Rating already submitted for this booking' });

        if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Invalid rating. Must be 1-5.' });

        await db.query('INSERT INTO ratings (user_id, guide_id, booking_id, rating, review) VALUES (?, ?, ?, ?, ?)', [req.user.id, guide_id, booking_id, rating, review]);
        
        let pointsToAdd = 5;
        if (rating >= 4) {
            pointsToAdd += 10;
        }
        
        const [guideUsers] = await db.query('SELECT user_id FROM guides WHERE id = ?', [guide_id]);
        if (guideUsers.length > 0) {
            await db.query('UPDATE users SET points = points + ? WHERE id = ?', [pointsToAdd, guideUsers[0].user_id]);
        }
        
        res.status(201).json({ message: 'Rating added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating rating' });
    }
};

module.exports = { createRating };
