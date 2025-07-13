const mongoose = require('mongoose');

const routineLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activity: { type: String, required: true },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RoutineLog', routineLogSchema);
