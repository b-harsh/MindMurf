const axios = require('axios');

exports.detectMoodFromText = async (text) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const top = response.data?.[0]?.[0];
    const mood = top?.label?.toLowerCase?.();

    console.log('Detected mood:', mood);

    if (['joy', 'love', 'gratitude', 'amusement'].includes(mood))
      return 'happy';
    if (['boredom', 'tired'].includes(mood)) return 'tired';
    if (['fear', 'nervousness', 'anxiety', 'sadness'].includes(mood))
      return 'anxious';
    if (['sadness'].includes(mood)) return 'sad';
    if (['loneliness'].includes(mood)) return 'lonely';
    if (['anger', 'annoyance'].includes(mood)) return 'angry';

    return 'happy';
  } catch (error) {
    console.error('HuggingFace Mood Detection Error:', error.message);
    return 'happy';
  }
};
