require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function migrate() {
    try {
        console.log("Altering users table...");
        await pool.query("ALTER TABLE users MODIFY COLUMN role ENUM('User', 'Guide', 'Both', 'Admin') DEFAULT 'User'");

        console.log("Altering guides table...");
        await pool.query("ALTER TABLE guides ADD COLUMN is_approved BOOLEAN DEFAULT FALSE");

        console.log("Migration successful");
        process.exit(0);
    } catch (err) {
        console.log("Failed: " + err.message);
        process.exit(1);
    }
}
migrate();
