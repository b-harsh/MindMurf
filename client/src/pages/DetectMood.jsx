import { useState } from 'react';
import Layout from '../components/Layout';
import { getToken } from '../utils/auth';

const token = getToken();

const DetectMood = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState(null);
  const [status, setStatus] = useState('Idle');
  const [error, setError] = useState('');
  const [mood, setMood] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Analyzing...');
    setError('');
    setAudio(null);
    setMood('');

    try {
      const res = await fetch(`${API_URL}/api/tts/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error('Failed to analyze');
      }

      const data = await res.json();
      setAudio(data.audioUrl);
      setMood(data.mood);
      setStatus('Complete');
    } catch (err) {
      console.error('Analysis failed:', err);
      setStatus('Error');
      setError('Failed to detect mood or generate speech');
    }
  };

  const startRecording = () => {
    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'auto';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = (e) => {
        console.error('Speech error:', e);
        setError('Mic error occurred');
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
      };

      recognition.start();
    } catch {
      setError('Speech Recognition not supported in this browser.');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          How are you feeling?
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or speak how you're feeling..."
            className="w-full p-2 border rounded"
            required
          />

          <div className="flex gap-4 items-center">
            <button
              type="submit"
              disabled={status === 'Analyzing...'}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
                status === 'Analyzing...' && 'opacity-50 cursor-not-allowed'
              }`}
            >
              {status === 'Analyzing...' ? 'Analyzing...' : 'Analyze & Speak'}
            </button>

            <button
              type="button"
              onClick={startRecording}
              className={`px-4 py-2 rounded ${
                isRecording ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              🎤 {isRecording ? 'Listening...' : 'Mic Input'}
            </button>
          </div>
        </form>

        {status !== 'Idle' && (
          <p className="mt-3 text-sm text-gray-600">Status: {status}</p>
        )}

        {mood && (
          <p className="mt-3 text-md font-semibold text-green-600">
            😊 You're feeling <span className="capitalize">{mood}</span>
          </p>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {audio && (
          <audio className="mt-4 w-full" controls src={audio}>
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </Layout>
  );
};

export default DetectMood;
