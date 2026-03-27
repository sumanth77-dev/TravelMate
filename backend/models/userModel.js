const db = require('../config/db');

const User = {
    // Find a user by email
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // Find a user by ID
    findById: async (id) => {
        const [rows] = await db.query('SELECT id, full_name, email, phone_number, role, location, bio, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    // Update a user's role
    updateRole: async (id, role) => {
        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    },

    // Note: the create function for user alone is simple, but we will handle full registration inside the controller via Transactions if it's a guide to save cross-table records cleanly!
    createTraveller: async (userData) => {
        const { full_name, email, phone_number, password } = userData;
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?)',
            [full_name, email, phone_number, password, 'User']
        );
        return result.insertId;
    }
};

module.exports = User;
