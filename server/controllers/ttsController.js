const axios = require('axios');
const User = require('../models/User');
const AudioCache = require('../models/AudioCache');
const RoutineLog = require('../models/RoutineLog');
const { detectMoodFromText } = require('../utils/moodDetector');
const { detectLangCode } = require('../utils/langDetector');

const voiceMap = {
  anxious: {
    en: { voice_id: 'en-US-evander', style: 'friendly' },
    hi: { voice_id: 'hi-IN-shweta', style: 'calm' },
    bn: { voice_id: 'bn-IN-abhik', style: 'Conversational' },
    ta: { voice_id: 'ta-IN-mani	', style: 'Conversational' },
  },
  tired: {
    en: { voice_id: 'en-US-julia', style: 'Storytelling' },
    hi: { voice_id: 'hi-IN-charles', style: 'Inspirational' },
    bn: { voice_id: 'bn-IN-ishani', style: 'Conversational' },
    ta: { voice_id: 'ta-IN-mani	', style: 'Conversational' },
  },
  happy: {
    en: { voice_id: 'en-US-natalie', style: 'Narration' },
    hi: { voice_id: 'hi-IN-carter', style: 'Narration' },
    bn: { voice_id: 'bn-IN-anwesha', style: 'Conversational' },
    ta: { voice_id: 'ta-IN-mani	', style: 'Conversational' },
  },
  lonely: {
    en: { voice_id: 'en-IN-priya', style: 'Conversational' },
    hi: { voice_id: 'hi-IN-ayushi', style: 'Conversational' },
    bn: { voice_id: 'bn-IN-ishani', style: 'Conversational' },
    ta: { voice_id: 'ta-IN-iniya', style: 'Conversational' },
  },
  angry: {
    en: { voice_id: 'en-US-alicia', style: 'calm' },
    hi: { voice_id: 'hi-IN-shaan', style: 'calm' },
    bn: { voice_id: 'bn-IN-anwesha', style: 'Conversational' },
    ta: { voice_id: 'ta-IN-iniya', style: 'Conversational' },
  },
};

const generateSpeech = async (req, res) => {
  const { text } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const mood = user.preferredMood || 'happy';
    const language = user.preferredLanguage || 'en';

    const cached = await AudioCache.findOne({
      userId: user._id,
      text,
      mood,
      language,
    });

    if (cached) {
      await RoutineLog.create({
        user: user._id,
        activity: 'voice_journaling',
        date: new Date().toISOString().slice(0, 10),
      });

      return res.json({ audioUrl: cached.audioUrl, cached: true });
    }

    const selected = voiceMap[mood]?.[language] || voiceMap['happy']['en'];
    const { voice_id, style } = selected;

    const response = await axios.post(
      'https://api.murf.ai/v1/speech/generate',
      { text, voice_id, style, language },
      {
        headers: {
          Authorization: `Bearer ${process.env.MURF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const audioUrl = response.data.audioFile;

    await AudioCache.create({
      userId: user._id,
      text,
      mood,
      language,
      audioUrl,
    });

    console.log('Creating RoutineLog with:', {
      user: user._id,
      activity: 'healing_response',
      date: new Date().toISOString().slice(0, 10),
    });

    await RoutineLog.create({
      user: user._id,
      activity: 'healing_response',
      date: new Date().toISOString().slice(0, 10),
    });

    res.json({ audioUrl, cached: false });
  } catch (error) {
    console.error('Murf API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate Voice' });
  }
};

const analyzeAndRespond = async (req, res) => {
  const { text } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const language = await detectLangCode(text);
    const mood = await detectMoodFromText(text);

    const prompt = `User is feeling ${mood}. This is what the user said ${text} Write a 200-word uplifting, emotionally supportive message for someone in this mood. Use a warm, caring tone. Include 1–2 relevant inspirational quotes. Avoid sounding robotic.`;

    const ollamaResponse = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'mistral',
        prompt,
        stream: false,
      }
    );

    const healingText = ollamaResponse.data.response;
    if (!healingText) throw new Error('No message returned from Ollama model');

    console.log(healingText);

    const cleanedHealingText = healingText
      .replace(/"/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const selected = voiceMap[mood]?.[language] || voiceMap['happy']['en'];
    const { voice_id, style } = selected;

    const ttsResponse = await axios.post(
      'https://api.murf.ai/v1/speech/generate',
      { text: cleanedHealingText, voice_id, style, language },
      {
        headers: {
          'api-key': process.env.MURF_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const audioUrl = ttsResponse.data.audioFile;

    console.log('Creating RoutineLog with:', {
      user: user._id,
      activity: 'healing_response',
      date: new Date().toISOString().slice(0, 10),
    });

    await RoutineLog.create({
      user: user._id,
      activity: healingText,
      date: new Date().toISOString().slice(0, 10),
    });

    res.json({ audioUrl, mood, language });
  } catch (error) {
    console.error(
      'Error in analyzeAndRespond:',
      error.response?.data || error.message
    );
    res.status(500).json({ error: 'Failed to analyze & respond' });
  }
};

const getAudioHistory = async (req, res) => {
  try {
    const entries = await AudioCache.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audio history' });
  }
};

module.exports = {
  generateSpeech,
  analyzeAndRespond,
  getAudioHistory,
};
