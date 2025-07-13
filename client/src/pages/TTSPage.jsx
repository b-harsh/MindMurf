import { useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { Layout, Loader2 } from 'lucide-react';

export default function TTSPage() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCached, setIsCached] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const playVoice = async () => {
    if (!text.trim()) return alert('Please enter some text.');

    setLoading(true);
    setAudioUrl(null);
    setIsCached(false);

    try {
      const res = await axios.post(
        `${API_URL}/api/tts/speak`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.data.audioUrl) {
        throw new Error('Audio URL not received from server');
      }

      setAudioUrl(res.data.audioUrl);
      setIsCached(res.data.cached);
    } catch (err) {
      console.error(err);
      alert('Failed to generate voice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 bg-white shadow rounded-lg border">
    <div className="flex items-center gap-4">
    <img
          src="/avatar.png"
          alt="Voice Assistant"
          className="w-12 h-12 rounded-full border"
        />
        <h2 className="text-2xl font-semibold text-blue-600">MindMate</h2>
      </div>

      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        rows="4"
        placeholder="What would you like to hear today?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded flex items-center gap-2"
        onClick={playVoice}
        disabled={loading || !text.trim()}
        >
        {loading && <Loader2 className="animate-spin h-5 w-5" />}
        {loading ? 'Generating...' : 'Play Voice'}
        </button>

      {loading && (
        <div className="h-2 w-full bg-gray-200 rounded">
          <div
            className="h-2 bg-blue-500 animate-pulse rounded"
            style={{ width: '80%' }}
          ></div>
        </div>
      )}
      
      {audioUrl && (
        <div className="mt-4">
        <audio controls className="w-full">
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
            </audio>
            {isCached && (
              <p className="text-sm text-gray-500 mt-1">✅ Played from cache</p>
              )}
              </div>
              )}
              </div>
            );
          }
          