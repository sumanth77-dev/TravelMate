const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const registerUser = async (req, res) => {
    // role comes from req.body.role ("User" or "Guide")
    const { full_name, email, phone_number, password, role } = req.body;

    try {
        const userExists = await User.findByEmail(email);

        // Handle existing user role upgrade
        if (userExists) {
            const isMatch = await bcrypt.compare(password, userExists.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'User already exists with different credentials. Please login or use the correct password to upgrade your account.' });
            }

            if (userExists.role === role || userExists.role === 'Both') {
                return res.status(400).json({ message: 'You are already registered with this role. Please login.' });
            }

            // Upgrade role to 'Both'
            if (role === 'Guide') {
                const connection = await db.getConnection();
                await connection.beginTransaction();

                try {
                    await connection.query('UPDATE users SET role = ? WHERE id = ?', ['Both', userExists.id]);

                    // Retrieve file paths using Multer
                    const profilePhotoPath = req.files['profile_photo'] ? req.files['profile_photo'][0].path.replace(/\\/g, '/') : null;
                    const governmentIdPath = req.files['government_id_upload'] ? req.files['government_id_upload'][0].path.replace(/\\/g, '/') : null;

                    // Extract guide specifics
                    const { city_location, languages_spoken, years_of_experience, guide_type, short_bio,
                        areas_you_guide, special_skills, price_per_day, max_group_size,
                        available_days, available_timings, accepted_terms, accepted_guide_policy } = req.body;

                    // Insert Guide Basic
                    const [guideResult] = await connection.query(
                        'INSERT INTO guides (user_id, city_location, languages_spoken, years_of_experience, guide_type, short_bio, profile_photo, government_id_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        [userExists.id, city_location, languages_spoken, years_of_experience, guide_type, short_bio, profilePhotoPath, governmentIdPath]
                    );
                    const guideId = guideResult.insertId;

                    // Insert Expertise
                    await connection.query(
                        'INSERT INTO guide_expertise (guide_id, areas_you_guide, special_skills) VALUES (?, ?, ?)',
                        [guideId, areas_you_guide, special_skills]
                    );

                    // Insert Pricing
                    await connection.query(
                        'INSERT INTO guide_pricing (guide_id, price_per_day, max_group_size) VALUES (?, ?, ?)',
                        [guideId, price_per_day, max_group_size]
                    );

                    // Insert Availability
                    await connection.query(
                        'INSERT INTO guide_availability (guide_id, available_days, available_timings) VALUES (?, ?, ?)',
                        [guideId, available_days, available_timings]
                    );

                    // Insert Verification
                    await connection.query(
                        'INSERT INTO guide_verification (guide_id, accepted_terms, accepted_guide_policy) VALUES (?, ?, ?)',
                        [guideId, accepted_terms === 'true' || accepted_terms === true, accepted_guide_policy === 'true' || accepted_guide_policy === true]
                    );

                    await connection.commit();
                    connection.release();

                    return res.status(200).json({ id: userExists.id, full_name: userExists.full_name, role: 'Both', token: generateToken(userExists.id) });
                } catch (err) {
                    await connection.rollback();
                    connection.release();
                    console.error(err);
                    return res.status(500).json({ message: 'Error upgrading account to guide' });
                }
            } else {
                // Changing from Guide to User (role = 'Both')
                await User.updateRole(userExists.id, 'Both');
                return res.status(200).json({ id: userExists.id, full_name: userExists.full_name, email: userExists.email, role: 'Both', token: generateToken(userExists.id) });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (role === 'Guide') {
            // Guide Registration with Transaction
            const connection = await db.getConnection();
            await connection.beginTransaction();

            try {
                // Insert User
                const [userResult] = await connection.query(
                    'INSERT INTO users (full_name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?)',
                    [full_name, email, phone_number, hashedPassword, 'Guide']
                );
                const userId = userResult.insertId;

                // Retrieve file paths using Multer
                const profilePhotoPath = req.files['profile_photo'] ? req.files['profile_photo'][0].path.replace(/\\/g, '/') : null;
                const governmentIdPath = req.files['government_id_upload'] ? req.files['government_id_upload'][0].path.replace(/\\/g, '/') : null;

                // Extract guide specifics
                const { city_location, languages_spoken, years_of_experience, guide_type, short_bio,
                    areas_you_guide, special_skills, price_per_day, max_group_size,
                    available_days, available_timings, accepted_terms, accepted_guide_policy } = req.body;

                // Insert Guide Basic
                const [guideResult] = await connection.query(
                    'INSERT INTO guides (user_id, city_location, languages_spoken, years_of_experience, guide_type, short_bio, profile_photo, government_id_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [userId, city_location, languages_spoken, years_of_experience, guide_type, short_bio, profilePhotoPath, governmentIdPath]
                );
                const guideId = guideResult.insertId;

                // Insert Expertise
                await connection.query(
                    'INSERT INTO guide_expertise (guide_id, areas_you_guide, special_skills) VALUES (?, ?, ?)',
                    [guideId, areas_you_guide, special_skills]
                );

                // Insert Pricing
                await connection.query(
                    'INSERT INTO guide_pricing (guide_id, price_per_day, max_group_size) VALUES (?, ?, ?)',
                    [guideId, price_per_day, max_group_size]
                );

                // Insert Availability
                await connection.query(
                    'INSERT INTO guide_availability (guide_id, available_days, available_timings) VALUES (?, ?, ?)',
                    [guideId, available_days, available_timings]
                );

                // Insert Verification
                await connection.query(
                    'INSERT INTO guide_verification (guide_id, accepted_terms, accepted_guide_policy) VALUES (?, ?, ?)',
                    [guideId, accepted_terms === 'true' || accepted_terms === true, accepted_guide_policy === 'true' || accepted_guide_policy === true]
                );

                await connection.commit();
                connection.release();

                res.status(201).json({ id: userId, full_name, role: 'Guide', token: generateToken(userId) });
            } catch (err) {
                await connection.rollback();
                connection.release();
                console.error(err);
                return res.status(500).json({ message: 'Error processing guide registration' });
            }
        } else {
            // Standard Traveller Registration
            const userId = await User.createTraveller({ full_name, email, phone_number, password: hashedPassword });
            res.status(201).json({ id: userId, full_name, email, role: 'User', token: generateToken(userId) });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {

            // Explicit guard for pending guides preventing dashboard entry
            if (role === 'Guide' && (user.role === 'Guide' || user.role === 'Both')) {
                const [[guide]] = await db.query("SELECT is_approved FROM guides WHERE user_id = ?", [user.id]);
                if (guide && !guide.is_approved) {
                    return res.status(403).json({ success: false, message: 'Your account is under review. Please wait for admin approval.' });
                }
            }

            res.json({ id: user.id, full_name: user.full_name, email: user.email, role: user.role, token: generateToken(user.id) });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, getMe };
