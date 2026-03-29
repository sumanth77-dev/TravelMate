const Guide = require('../models/guideModel');

const getGuides = async (req, res) => {
    try {
        const search = req.query.search;
        const guides = await Guide.findAll(search);
        res.status(200).json(guides);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving guides' });
    }
};

const getGuideById = async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id);
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }
        res.status(200).json(guide);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving guide' });
    }
};

const getGuideMe = async (req, res) => {
    try {
        const guide = await Guide.findByUserId(req.user.id);
        if (!guide) {
            return res.status(404).json({ message: 'Guide profile not found' });
        }
        res.status(200).json(guide);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving your guide profile' });
    }
};

const updateGuideMe = async (req, res) => {
    try {
        const city_location = req.body.city_location !== undefined ? req.body.city_location : null;
        const short_bio = req.body.short_bio !== undefined ? req.body.short_bio : null;
        const languages_spoken = req.body.languages_spoken !== undefined ? req.body.languages_spoken : null;
        const years_of_experience = req.body.years_of_experience !== undefined ? req.body.years_of_experience : null;

        await require('../config/db').query(`
            UPDATE guides SET 
                city_location = COALESCE(?, city_location),
                short_bio = COALESCE(?, short_bio),
                languages_spoken = COALESCE(?, languages_spoken),
                years_of_experience = COALESCE(?, years_of_experience)
            WHERE user_id = ?
        `, [city_location, short_bio, languages_spoken, years_of_experience, req.user.id]);

        res.status(200).json({ message: 'Guide profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating guide profile' });
    }
};

const getGuideEarnings = async (req, res) => {
    try {
        const db = require('../config/db');
        const [guides] = await db.query('SELECT id FROM guides WHERE user_id = ?', [req.user.id]);
        if (!guides.length) return res.status(404).json({ message: 'Guide not found' });
        const guideId = guides[0].id;

        const query = `
            SELECT SUM(total_price) AS total
            FROM bookings
            WHERE guide_id = ? AND status = 'completed'
        `;
        const [rows] = await db.query(query, [guideId]);
        res.status(200).json({ total: rows[0].total || 0 });
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving earnings' });
    }
};

const updatePricing = async (req, res) => {
    try {
        const { price_per_day, max_group_size } = req.body;
        await Guide.updatePricing(req.user.id, { price_per_day, max_group_size });
        res.status(200).json({ message: 'Pricing updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating pricing' });
    }
};

const updateAvailability = async (req, res) => {
    try {
        const { available_days, available_timings } = req.body;
        await Guide.updateAvailability(req.user.id, { available_days, available_timings });
        res.status(200).json({ message: 'Availability updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating availability' });
    }
};

const updateExpertise = async (req, res) => {
    try {
        const { areas_you_guide, special_skills } = req.body;
        await Guide.updateExpertise(req.user.id, { areas_you_guide, special_skills });
        res.status(200).json({ message: 'Expertise updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating expertise' });
    }
};

const getGuideAvgRating = async (req, res) => {
    try {
        const db = require('../config/db');
        const [rows] = await db.query('SELECT AVG(rating) AS avg_rating FROM ratings WHERE guide_id = ?', [req.params.guideId]);
        res.status(200).json({ avg_rating: rows[0].avg_rating || null });
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving avg rating' });
    }
};

const getGuideTravellers = async (req, res) => {
    try {
        const db = require('../config/db');
        const [rows] = await db.query("SELECT SUM(group_size) AS total_travellers FROM bookings WHERE guide_id = ? AND status = 'completed'", [req.params.guideId]);
        res.status(200).json({ total_travellers: rows[0].total_travellers || 0 });
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving travellers' });
    }
};

const getDashboardStats = async (req, res) => {
  try {
    const db = require('../config/db');

    // Get guide id
    const [guideRow] = await db.query(
      'SELECT id FROM guides WHERE user_id = ?',
      [req.user.id]
    );

    if (!guideRow.length) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    const guideId = guideRow[0].id;

    const [[total]] = await db.query(
      'SELECT COUNT(*) AS total FROM bookings WHERE guide_id = ?',
      [guideId]
    );

    const [[completed]] = await db.query(
      "SELECT COUNT(*) AS total FROM bookings WHERE guide_id = ? AND status='completed'",
      [guideId]
    );

    const [[earnings]] = await db.query(
      `SELECT SUM(total_price) AS total
       FROM bookings
       WHERE guide_id = ? AND status='completed'`,
      [guideId]
    );

    const [[travellers]] = await db.query(
      `SELECT SUM(group_size) AS total
       FROM bookings
       WHERE guide_id = ? AND status='completed'`,
      [guideId]
    );

    const [[rating]] = await db.query(
      `SELECT AVG(rating) AS avg FROM reviews WHERE guide_id = ?`,
      [guideId]
    );

    const [[points]] = await db.query(
      `SELECT u.points
       FROM users u
       JOIN guides g ON g.user_id = u.id
       WHERE g.id = ?`,
      [guideId]
    );

    res.json({
      totalBookings: total.total ?? 0,
      completedBookings: completed.total ?? 0,
      estimatedEarnings: earnings.total ?? 0,
      travellersServed: travellers.total ?? 0,
      avgRating: rating.avg ?? 0,
      points: points?.points ?? 0
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getGuides, getGuideById, getGuideMe, updateGuideMe, updatePricing, updateAvailability, updateExpertise, getGuideEarnings, getGuideAvgRating, getGuideTravellers, getDashboardStats };
