const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Using fields for multer to accept different keys for guide files
const cpUpload = upload.fields([
    { name: 'profile_photo', maxCount: 1 },
    { name: 'government_id_upload', maxCount: 1 }
]);

router.post('/register', cpUpload, registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
