const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  generateSpeech,
  analyzeAndRespond,
  getAudioHistory,
} = require('../controllers/ttsController');

router.post('/speak', protect, generateSpeech);
router.post('/analyze', protect, analyzeAndRespond);
router.get('/history', protect, getAudioHistory);

module.exports = router;
