const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'travelmate',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Use promises for better async/await support
const promisePool = pool.promise();

// Log connection status
promisePool.getConnection()
    .then(connection => {
        console.log(`MySQL Connected to database: ${process.env.DB_NAME}`);
        connection.release();
    })
    .catch(err => {
        console.error('MySQL connection error:', err.message);
    });

module.exports = promisePool;
