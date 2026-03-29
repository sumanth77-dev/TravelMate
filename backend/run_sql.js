const db = require('./config/db');

async function createTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        guide_id INT,
        booking_id INT,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Ratings table created');
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

createTable();
