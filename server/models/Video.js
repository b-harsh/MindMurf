const mongoose = require('mongoose');

const DubbedAudioSchema = new mongoose.Schema({
  language: String,
  audioUrl: String,
  voiceId: String,
});

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  originalVideoUrl: { type: String, required: true },
  transcript: String,
  dubbedAudios: [DubbedAudioSchema],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', VideoSchema);
