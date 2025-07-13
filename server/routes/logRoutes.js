const express = require('express');
const router = express.Router();
const { getUserLogs } = require('../controllers/logActivity');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getUserLogs);

module.exports = router;
