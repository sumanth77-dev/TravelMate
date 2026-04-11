const db = require('../config/db');

const Destination = {
  findAll: async () => {
    const query = `SELECT * FROM destinations`;
    const [rows] = await db.query(query);
    return rows;
  },
  create: async (data) => {
    const { name, location, badge_text, badge_class, badge_style, image_url, rating, reviews_count, price_text, link, tags } = data;
    const query = `
      INSERT INTO destinations 
      (name, location, badge_text, badge_class, badge_style, image_url, rating, reviews_count, price_text, link, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      name, location, badge_text, badge_class || 'badge-teal', badge_style || '', 
      image_url, rating || 5.0, reviews_count || '0', price_text, link || '', tags || ''
    ]);
    return result.insertId;
  }
};

module.exports = Destination;
