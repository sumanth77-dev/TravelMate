const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load config
dotenv.config();

// Route files
const authRoutes = require('./routes/authRoutes');
const guideRoutes = require('./routes/guideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const communityRoutes = require('./routes/communityRoutes');

const app = express();

// Body parser
app.use(express.json());
// Form data parser mapping natively supplied via express
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Expose static folders for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);

// Database check route for safety checks
app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend is running correctly.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`TravelMate Backend server running on port ${PORT}`));
