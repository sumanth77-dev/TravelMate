require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate_community() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Connected to database. Executing Community schemas...');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS community_posts (
              id INT PRIMARY KEY AUTO_INCREMENT,
              user_id INT NOT NULL,
              author_name VARCHAR(100) NOT NULL,
              author_avatar VARCHAR(255),
              place_name VARCHAR(255) NOT NULL,
              location VARCHAR(255) NOT NULL,
              category ENUM('City', 'Beach', 'Mountain', 'Temple', 'Adventure', 'Food', 'All', 'Other') DEFAULT 'Other',
              budget INT,
              best_time VARCHAR(100),
              caption TEXT NOT NULL,
              tips TEXT,
              rating INT DEFAULT 0,
              likes INT DEFAULT 0,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('- Table community_posts configured.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS post_images (
              id INT PRIMARY KEY AUTO_INCREMENT,
              post_id INT NOT NULL,
              image_url VARCHAR(255) NOT NULL,
              FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE
            )
        `);
        console.log('- Table post_images configured.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS post_likes (
              user_id INT NOT NULL,
              post_id INT NOT NULL,
              PRIMARY KEY(user_id, post_id),
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
              FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE
            )
        `);
        console.log('- Table post_likes configured.');

        await connection.end();
        console.log('Migration complete.');
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

migrate_community();
