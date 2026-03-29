const Booking = require('../models/bookingModel');

const createBooking = async (req, res) => {
    const { guide_id, booking_date, group_size, duration, message, total_price } = req.body;

    try {
        if (!guide_id || !booking_date || !duration || !total_price) {
            return res.status(400).json({ message: 'Please provide all required fields including duration and price' });
        }

        const bookingId = await Booking.create({
            user_id: req.user.id,
            guide_id,
            booking_date,
            group_size: group_size || 1,
            duration,
            message,
            total_price,
            status: 'pending'
        });

        // --- NOTIFICATION HOOK: Booking Request ---
        try {
            const Notification = require('../models/notificationModel');
            const db = require('../config/db');
            // guide_id from bookings refers to guides.id. Must map to user_id.
            const [[guideRec]] = await db.query('SELECT user_id FROM guides WHERE id = ?', [guide_id]);
            if (guideRec && guideRec.user_id) {
                await Notification.create(guideRec.user_id, 'booking_request', 'You have a new booking request');
                console.log(`[DEBUG] NOTIFICATION INSERTED - Type: booking_request, Message: You have a new booking request`);
                console.log(`[DEBUG] Receiving user_id: ${guideRec.user_id}`);
            }
        } catch (notifErr) { console.error('[DEBUG] Fault propagating booking request notification:', notifErr); }

        res.status(201).json({ id: bookingId, message: 'Booking request sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating booking' });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findByUserId(req.params.userId || req.user.id);
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving bookings' });
    }
};

const getGuideBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`\n[DEBUG - STEP 4] Fetching Guide Bookings`);
        console.log(`[DEBUG] Logged in user_id: ${userId}`);

        const Guide = require('../models/guideModel');
        const guide = await Guide.findByUserId(userId);
        
        if (!guide) {
            console.log(`[DEBUG] No guide profile configured for user_id: ${userId}`);
            return res.status(404).json({ message: 'Guide profile not found' });
        }
        
        console.log(`[DEBUG] Resolved guide_id: ${guide.id}`);

        // STEP 2 & 3: Ensure backend uses properly mapped ids to query guide bookings
        const bookings = await Booking.findByGuideId(userId);
        
        console.log(`[DEBUG] Fetched ${bookings.length} individual bookings for mapped guide_id: ${guide.id}`);
        
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving guide bookings' });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Please provide a valid status' });
        }
        const success = await Booking.updateStatus(req.params.id, status);
        if (!success) {
            return res.status(404).json({ message: 'Booking not found or no changes made' });
        }
        
        // --- NOTIFICATION HOOK: Booking Accept / Reject ---
        try {
            const Notification = require('../models/notificationModel');
            const db = require('../config/db');
            const [[booking]] = await db.query('SELECT user_id FROM bookings WHERE id = ?', [req.params.id]);
            
            if (booking && booking.user_id) {
                if (status === 'approved' || status === 'confirmed') {
                    await Notification.create(booking.user_id, 'booking_accepted', 'Your booking has been accepted');
                    console.log(`[DEBUG] NOTIFICATION INSERTED - Type: booking_accepted, Message: Your booking has been accepted`);
                    console.log(`[DEBUG] Receiving user_id: ${booking.user_id}`);
                } else if (status === 'rejected') {
                    await Notification.create(booking.user_id, 'booking_rejected', 'Your booking has been rejected');
                    console.log(`[DEBUG] NOTIFICATION INSERTED - Type: booking_rejected, Message: Your booking has been rejected`);
                    console.log(`[DEBUG] Receiving user_id: ${booking.user_id}`);
                } else if (status === 'completed') {
                    await db.query('UPDATE users SET points = points + 20 WHERE id = ?', [booking.user_id]);
                    console.log(`[DEBUG] Points system: Assigned +20 to traveler ${booking.user_id}`);
                }
            }
        } catch (notifErr) { console.error('[DEBUG] Trapped notify fault in booking states:', notifErr); }

        res.status(200).json({ message: 'Booking status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating booking status' });
    }
};

const getGuideEarnings = async (req, res) => {
    try {
        const db = require('../config/db');
        const [guides] = await db.query('SELECT id FROM guides WHERE user_id = ?', [req.user.id]);
        if (!guides.length) return res.status(404).json({ message: 'Guide not found' });
        const guideId = guides[0].id;

        const query = `
            SELECT DATE_FORMAT(booking_date, '%Y-%m') as month, SUM(total_price) as total
            FROM bookings
            WHERE guide_id = ? AND status = 'completed' AND booking_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY month
            ORDER BY month ASC
        `;
        const [rows] = await db.query(query, [guideId]);

        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving earnings' });
    }
};

module.exports = { createBooking, getMyBookings, getGuideBookings, updateBookingStatus, getGuideEarnings };
