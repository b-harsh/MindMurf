const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
// router.put('/preferences', protect, updatePreferences);

module.exports = router;
