const express = require('express');
const router = express.Router();
const { getDestinations } = require('../controllers/destinationController');

router.route('/')
    .get(getDestinations);

module.exports = router;
