import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VoiceJournal() {
  const [history, setHistory] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/tts/history`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setHistory(res.data.reverse()); 
      } catch (err) {
        console.error('Failed to load history:', err.message || err);
      }
    };
    fetch();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧠 Your Voice Journal</h2>

      {history.length === 0 ? (
        <p>No voice routines generated yet.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((entry) => (
            <li key={entry._id} className="bg-white shadow p-4 rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Mood:</span> {entry.mood} |{' '}
                <span className="font-medium">Language:</span> {entry.language}
              </p>

              <p className="text-gray-800 mt-1 mb-2">{entry.text}</p>

              <audio controls className="w-full">
                <source src={entry.audioUrl} type="audio/mp3" />
              </audio>

              <a
                href={entry.audioUrl}
                download
                className="inline-block mt-2 text-blue-600 underline"
              >
                ⬇️ Download MP3
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
