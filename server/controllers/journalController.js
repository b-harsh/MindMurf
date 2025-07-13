const Journal = require('../models/journalSchema');

exports.createEntry = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const entry = await Journal.create({ user: req.user._id, text });
    res.status(201).json(entry);
  } catch (err) {
    console.error('Create journal Error: ', err);
    res.status(500).json({ error: 'Failed to create entry' });
  }
};

exports.getEntries = async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(entries);
  } catch (err) {
    console.error('Fetch Journal Error:', err);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
};
