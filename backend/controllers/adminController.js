const db = require('../config/db');

const getAnalytics = async (req, res) => {
    try {
        const [[usersCount]] = await db.query("SELECT COUNT(*) as count FROM users WHERE role != 'Admin'");
        const [[guidesCount]] = await db.query("SELECT COUNT(*) as count FROM guides");
        const [[approvedGuidesCount]] = await db.query("SELECT COUNT(*) as count FROM guides WHERE is_approved = 1");
        const [[bookingsCount]] = await db.query("SELECT COUNT(*) as count FROM bookings");

        res.status(200).json({
            users: usersCount.count,
            guidesTotal: guidesCount.count,
            guidesApproved: approvedGuidesCount.count,
            guidesPending: guidesCount.count - approvedGuidesCount.count,
            bookings: bookingsCount.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving analytics' });
    }
};

const getUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, full_name, email, phone_number, role, created_at FROM users WHERE role != 'Admin' ORDER BY created_at DESC");
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving users' });
    }
};

const getGuides = async (req, res) => {
    try {
        const query = `
            SELECT g.id, g.user_id, g.city_location, g.languages_spoken, g.years_of_experience, g.guide_type, g.is_approved, g.short_bio,
                   u.full_name, u.email, u.phone_number,
                   gp.price_per_day
            FROM guides g
            JOIN users u ON g.user_id = u.id
            LEFT JOIN guide_pricing gp ON g.id = gp.guide_id
            ORDER BY g.is_approved ASC, u.created_at DESC
        `;
        const [guides] = await db.query(query);
        res.status(200).json(guides);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving guides' });
    }
};

const approveGuide = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE guides SET is_approved = 1 WHERE id = ?", [id]);
        
        // --- NOTIFICATION HOOK: Guide Approved ---
        try {
            const Notification = require('../models/notificationModel');
            const [[guide]] = await db.query("SELECT user_id FROM guides WHERE id = ?", [id]);
            if (guide) {
                await Notification.create(guide.user_id, 'guide', 'Your guide profile has been approved');
                console.log(`[DEBUG] Notified user_id ${guide.user_id} about guide approval`);
            }
        } catch (notifErr) { console.error('[DEBUG] Fault submitting approval notification:', notifErr); }
        
        res.status(200).json({ message: 'Guide successfully approved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error approving guide' });
    }
};

const rejectGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const [[guide]] = await db.query("SELECT user_id FROM guides WHERE id = ?", [id]);

        if (guide) {
            // Option: downgrade the user role if they were officially a Guide via 'Both' vs 'Guide'
            const [[user]] = await db.query("SELECT role FROM users WHERE id = ?", [guide.user_id]);
            if (user && user.role === 'Both') {
                await db.query("UPDATE users SET role = 'User' WHERE id = ?", [guide.user_id]);
            } else if (user && user.role === 'Guide') {
                // If they strictly signed up as a guide only, perhaps we just leave them but they can't operate.
                // Or downgrade to User so they can still browse.
                await db.query("UPDATE users SET role = 'User' WHERE id = ?", [guide.user_id]);
            }

            // Delete from guides
            await db.query("DELETE FROM guides WHERE id = ?", [id]);
            
            // --- NOTIFICATION HOOK: Guide Rejected ---
            try {
                const Notification = require('../models/notificationModel');
                await Notification.create(guide.user_id, 'admin', 'Your guide profile has been rejected');
                console.log(`[DEBUG] Notified user_id ${guide.user_id} about guide rejection`);
            } catch (notifErr) { console.error('[DEBUG] Fault submitting rejection notification:', notifErr); }
        }

        res.status(200).json({ message: 'Guide successfully rejected and removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error rejecting guide' });
    }
};

const getBookings = async (req, res) => {
    try {
        const query = `
            SELECT b.id, b.status, b.start_date, b.end_date, b.total_price,
                   u.full_name as traveller_name,
                   gu.full_name as guide_name
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN guides g ON b.guide_id = g.id
            JOIN users gu ON g.user_id = gu.id
            ORDER BY b.created_at DESC
        `;
        const [bookings] = await db.query(query);
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving bookings' });
    }
};

module.exports = {
    getAnalytics,
    getUsers,
    getGuides,
    approveGuide,
    rejectGuide,
    getBookings
};
