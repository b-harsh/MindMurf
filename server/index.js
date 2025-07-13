const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const ttsRoutes = require('./routes/ttsRoutes');
const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');
const streakRoutes = require('./routes/streakRoutes');
const routineRoutes = require('./routes/routineRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MindMurf API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/journals', require('./routes/journalRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/routine' , routineRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
