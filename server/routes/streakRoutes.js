const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getStreak } = require('../controllers/streakController');

router.get('/streak', protect, getStreak);

module.exports = router;
