const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure Multer specifically for array parsing since community posts can take multiple pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'community_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Public routes
router.get('/posts', communityController.getPosts);
router.get('/trending', communityController.getTrending);
router.get('/top-travelers', communityController.getTopTravelers);
router.get('/categories', communityController.getCategories);

// Protected functionality (Requires authentic JWT token)
router.post('/posts', protect, upload.array('images', 5), communityController.createPost);
router.put('/posts/:id/like', protect, communityController.toggleLike);

// Comment routes
router.get('/posts/:id/comments', communityController.getComments);
router.post('/posts/:id/comments', protect, communityController.addComment);

module.exports = router;
