const db = require('../config/db');

const Guide = {
  // Get all guides along with their expertise and pricing
  findAll: async () => {
    const query = `
      SELECT g.id, g.user_id, g.city_location, g.languages_spoken, g.years_of_experience,
             g.guide_type, g.short_bio, g.profile_photo,
             u.full_name, u.email, u.phone_number,
             gp.price_per_day, gp.max_group_size,
             ge.areas_you_guide, ge.special_skills
      FROM guides g
      JOIN users u ON g.user_id = u.id
      LEFT JOIN guide_pricing gp ON g.id = gp.guide_id
      LEFT JOIN guide_expertise ge ON g.id = ge.guide_id
      WHERE g.is_approved = TRUE
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  // Get single guide
  findById: async (id) => {
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
  }
};

module.exports = Guide;
