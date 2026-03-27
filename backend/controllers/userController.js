const User = require('../models/userModel');
const db = require('../config/db');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { full_name, email, phone_number, location, bio } = req.body;
        await db.query(
            'UPDATE users SET full_name = ?, email = ?, phone_number = ?, location = ?, bio = ? WHERE id = ?',
            [full_name, email, phone_number, location, bio, req.user.id]
        );

        const updatedUser = await User.findById(req.user.id);
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

module.exports = { getUserProfile, updateUserProfile };
