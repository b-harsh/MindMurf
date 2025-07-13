const mongoose = require('mongoose');

const audioCacheSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  mood: String,
  language: String,
  audioUrl: String,
  createdAt: { type: Date, default: Date.now },
});

audioCacheSchema.index(
  { userId: 1, text: 1, mood: 1, language: 1 },
  { unique: true }
);

module.exports = mongoose.model('AudioCache', audioCacheSchema);
