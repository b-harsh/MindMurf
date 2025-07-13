
const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastDate: { type: String }, // Format: 'YYYY-MM-DD'
  dates: [String], // All valid streak dates
});

module.exports = mongoose.model('Streak', streakSchema);
