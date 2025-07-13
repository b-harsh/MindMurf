const express = require('express');
const router = express.Router();
const {
  uploadVideoandDub,
  uploadVideo,
  getAllVideos,
} = require('../controllers/videoController');
const { isAdmin } = require('../middleware/isAdmin');
const { protect } = require('../middleware/authMiddleware');
const Video = require('../models/Video');

// router.post('/upload', protect, uploadVideoandDub);
router.post('/upload', protect, isAdmin, uploadVideo);
router.get('/', protect, getAllVideos);

// router.get('/', async (req, res) => {
//   try {
//     const videos = await Video.find().sort({ createdAt: -1 });
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch videos' });
//   }
// });

module.exports = router;
