const RoutineLog = require('../models/RoutineLog');

exports.getUserLogs = async (req, res) => {
  try {
    const logs = await RoutineLog.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(logs);
  } catch (err) {
    console.error('Log fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};
