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

module.exports = { createBooking, getMyBookings };
