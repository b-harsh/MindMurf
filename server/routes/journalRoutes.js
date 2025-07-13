const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getEntries, createEntry } = require('../controllers/journalController');
const router = express.Router();

router.get('/', protect, getEntries);
router.post('/', protect, createEntry);

module.exports = router;
