const Streak = require('../models/Streak');

exports.getStreak = async (req, res) => {
  const streak = await Streak.findOne({ user: req.user._id });

  res.json({
    currentStreak: streak?.currentStreak || 0,
    longestStreak: streak?.longestStreak || 0,
    dates: streak?.dates || [],
  });
};

const RoutineLog = require('../models/RoutineLog');

exports.updateStreak = async (req, res) => {
  const userId = req.user._id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const logs = await RoutineLog.find({ user: userId, date: today });

    if (logs.length < 4) {
      return res.status(200).json({ message: 'Not enough completed routines' });
    }

    let streak = await Streak.findOne({ user: userId });

    if (!streak) {
      streak = new Streak({
        user: userId,
        currentStreak: 1,
        longestStreak: 1,
        lastDate: today,
        dates: [today],
      });
    } else {
      const last = new Date(streak.lastDate);
      const current = new Date(today);
      const diffInDays = Math.floor((current - last) / (1000 * 60 * 60 * 24));

      if (diffInDays === 1) {
        streak.currentStreak += 1;
      } else if (diffInDays > 1) {
        streak.currentStreak = 1;
      }

      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }

      if (!streak.dates.includes(today)) {
        streak.dates.push(today);
      }

      streak.lastDate = today;
    }

    await streak.save();

    res.json({
      message: 'Streak updated',
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating streak' });
  }
};
