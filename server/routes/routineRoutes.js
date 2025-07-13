const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  completeActivity,
  getRoutineLogs,
  getStreakStats,
} = require('../controllers/routineController');

router.post('/complete', protect, completeActivity);
router.get('/logs', protect, getRoutineLogs);
router.get('/streaks', protect, getStreakStats);

module.exports = router;
