const express = require('express');
const router = express.Router();
const { getDestinations, addDestination } = require('../controllers/destinationController');
const { adminProtect } = require('../middleware/adminMiddleware');

router.route('/')
    .get(getDestinations);
    
router.post('/add', adminProtect, addDestination);

module.exports = router;
