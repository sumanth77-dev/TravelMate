const db = require('./config/db');

async function fixDB() {
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
    console.log('Ratings table verified/created');
  } catch (err) {
    console.error(err);
  }

  try {
    await db.query(`ALTER TABLE users ADD COLUMN points INT DEFAULT 0;`);
    console.log('Points column added');
  } catch (err) {
    console.log('Points column might already exist:', err.message);
  }
  process.exit();
}

fixDB();
