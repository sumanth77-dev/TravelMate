const db = require('../config/db');

const Guide = {
  // Get all guides along with their expertise and pricing
  findAll: async (searchStr = null) => {
    let query = `
      SELECT g.id, g.user_id, g.city_location, g.languages_spoken, g.years_of_experience,
             g.guide_type, g.short_bio, g.profile_photo,
             u.full_name, u.email, u.phone_number,
             gp.price_per_day, gp.max_group_size,
             ge.areas_you_guide, ge.special_skills,
             COALESCE(g.fixed_rating, r.avg_rating, 0) AS average_rating,
             COALESCE(g.fixed_reviews, r.review_count, 0) AS review_count
      FROM guides g
      JOIN users u ON g.user_id = u.id
      LEFT JOIN guide_pricing gp ON g.id = gp.guide_id
      LEFT JOIN guide_expertise ge ON g.id = ge.guide_id
      LEFT JOIN (
        SELECT guide_id, AVG(rating) as avg_rating, COUNT(id) as review_count 
        FROM reviews 
        GROUP BY guide_id
      ) r ON g.id = r.guide_id
      WHERE g.is_approved = TRUE
    `;
    const params = [];

    if (searchStr) {
      query += ` AND (u.full_name LIKE ? OR g.city_location LIKE ? OR ge.special_skills LIKE ?)`;
      const searchRegex = `%${searchStr}%`;
      params.push(searchRegex, searchRegex, searchRegex);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  // Get single guide
  findById: async (id) => {
    const query = `
      SELECT g.*, u.full_name, u.email, u.phone_number,
             gp.price_per_day, gp.max_group_size,
             ge.areas_you_guide, ge.special_skills,
             ga.available_days, ga.available_timings,
             COALESCE(g.fixed_rating, r.avg_rating, 0) AS average_rating,
             COALESCE(g.fixed_reviews, r.review_count, 0) AS review_count
      FROM guides g
      JOIN users u ON g.user_id = u.id
      LEFT JOIN guide_pricing gp ON g.id = gp.guide_id
      LEFT JOIN guide_expertise ge ON g.id = ge.guide_id
      LEFT JOIN guide_availability ga ON g.id = ga.guide_id
      LEFT JOIN (
        SELECT guide_id, AVG(rating) as avg_rating, COUNT(id) as review_count 
        FROM reviews 
        GROUP BY guide_id
      ) r ON g.id = r.guide_id
      WHERE g.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },

  // Get guide by User ID for self-lookup
  findByUserId: async (userId) => {
    const query = `
      SELECT g.*, u.full_name, u.email, u.phone_number,
             gp.price_per_day, gp.max_group_size,
             ge.areas_you_guide, ge.special_skills,
             ga.available_days, ga.available_timings
      FROM guides g
      JOIN users u ON g.user_id = u.id
      LEFT JOIN guide_pricing gp ON g.id = gp.guide_id
      LEFT JOIN guide_expertise ge ON g.id = ge.guide_id
      LEFT JOIN guide_availability ga ON g.id = ga.guide_id
      WHERE g.user_id = ?
    `;
    const [rows] = await db.query(query, [userId]);
    return rows[0];
  },

  updatePricing: async (userId, { price_per_day, max_group_size }) => {
    const [guides] = await db.query('SELECT id FROM guides WHERE user_id = ?', [userId]);
    if (!guides.length) return;
    const guideId = guides[0].id;
    
    const [existing] = await db.query('SELECT id FROM guide_pricing WHERE guide_id = ?', [guideId]);
    if (existing.length > 0) {
      await db.query('UPDATE guide_pricing SET price_per_day = ?, max_group_size = ? WHERE guide_id = ?', [price_per_day, max_group_size, guideId]);
    } else {
      await db.query('INSERT INTO guide_pricing (guide_id, price_per_day, max_group_size) VALUES (?, ?, ?)', [guideId, price_per_day, max_group_size]);
    }
  },

  updateAvailability: async (userId, { available_days, available_timings }) => {
    const [guides] = await db.query('SELECT id FROM guides WHERE user_id = ?', [userId]);
    if (!guides.length) return;
    const guideId = guides[0].id;

    const [existing] = await db.query('SELECT id FROM guide_availability WHERE guide_id = ?', [guideId]);
    if (existing.length > 0) {
      await db.query('UPDATE guide_availability SET available_days = ?, available_timings = ? WHERE guide_id = ?', [available_days, available_timings, guideId]);
    } else {
      await db.query('INSERT INTO guide_availability (guide_id, available_days, available_timings) VALUES (?, ?, ?)', [guideId, available_days, available_timings]);
    }
  },

  updateExpertise: async (userId, { areas_you_guide, special_skills }) => {
    const [guides] = await db.query('SELECT id FROM guides WHERE user_id = ?', [userId]);
    if (!guides.length) return;
    const guideId = guides[0].id;

    const [existing] = await db.query('SELECT id FROM guide_expertise WHERE guide_id = ?', [guideId]);
    if (existing.length > 0) {
      await db.query('UPDATE guide_expertise SET areas_you_guide = ?, special_skills = ? WHERE guide_id = ?', [areas_you_guide, special_skills, guideId]);
    } else {
      await db.query('INSERT INTO guide_expertise (guide_id, areas_you_guide, special_skills) VALUES (?, ?, ?)', [guideId, areas_you_guide, special_skills]);
    }
  }
};

module.exports = Guide;
