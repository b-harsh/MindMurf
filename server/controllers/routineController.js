const RoutineLog = require('../models/RoutineLog');

exports.completeActivity = async (req, res) => {
  const { activity } = req.body;
  const userId = req.user._id;
  const today = new Date().toISOString().split('T')[0];

  if (!activity) {
    return res.status(400).json({ message: 'Activity is required' });
  }

  try {
    const existing = await RoutineLog.findOne({
      user: userId,
      activity,
      date: today,
    });
    if (existing) return res.status(200).json({ message: 'Already marked' });

    await RoutineLog.create({ user: userId, activity, date: today });
    res.status(201).json({ message: 'Activity marked complete' });
  } catch (err) {
    console.error('Routine log error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRoutineLogs = async (req, res) => {
  const userId = req.user._id;

  try {
    const logs = await RoutineLog.find({ user: userId }).lean();
    const streakMap = new Map();

    logs.forEach((log) => {
      const day = new Date(log.date).toISOString().split('T')[0];
      if (!streakMap.has(day)) streakMap.set(day, new Set());
      streakMap.get(day).add(log.activity);
    });

    const allDates = Array.from(streakMap.keys()).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate = null;

    allDates.forEach((dateStr) => {
      const completed = streakMap.get(dateStr);
      if (completed.size === 4) {
        const dateObj = new Date(dateStr);
        if (!lastDate || (dateObj - new Date(lastDate)) / 86400000 === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
        lastDate = dateStr;
        longestStreak = Math.max(longestStreak, currentStreak);
      }
    });

    res.json({
      logs,
      streakDays: Array.from(streakMap.entries())
        .filter(([_, set]) => set.size === 4)
        .map(([date]) => date),
      currentStreak,
      longestStreak,
    });
  } catch (err) {
    console.error('Fetch routine logs error:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

exports.getStreakStats = async (req, res) => {
  try {
    const logs = await RoutineLog.find({ user: req.user._id }).lean();
    const activityMap = new Map();

    logs.forEach((log) => {
      const dateStr = new Date(log.date).toISOString().split('T')[0];
      if (!activityMap.has(dateStr)) activityMap.set(dateStr, new Set());
      activityMap.get(dateStr).add(log.activity);
    });

    const streakDays = Array.from(activityMap.entries())
      .filter(([_, set]) => set.size === 4)
      .map(([date]) => date)
      .sort();

    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate = null;

    for (let dateStr of streakDays) {
      const dateObj = new Date(dateStr);
      if (!lastDate || (dateObj - new Date(lastDate)) / 86400000 === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      lastDate = dateStr;
      longestStreak = Math.max(longestStreak, currentStreak);
    }

    res.json({
      currentStreak,
      longestStreak,
      completionDates: streakDays,
    });
  } catch (err) {
    console.error('Get streak error:', err);
    res.status(500).json({ error: 'Failed to fetch streak data' });
  }
};
