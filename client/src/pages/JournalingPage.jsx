import { useState, useEffect } from 'react';
import { getToken } from '../utils/auth';

const JournalingPage = () => {
  const [text, setText] = useState('');
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState('idle');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchEntries = async () => {
    try {
      const res = await fetch(`${API_URL}/api/journals`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        throw new Error('Unexpected response from backend');
      }

      setEntries(data);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
      setEntries([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setStatus('saving');
      const res = await fetch(`${API_URL}/api/journals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error('Failed to save entry');

      setText('');
      setStatus('saved');
      fetchEntries();
    } catch (err) {
      console.error('Journal save failed:', err);
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 1500);
    }
  };

  const startRecording = () => {
    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = (e) => {
        setText(e.results[0][0].transcript);
      };
      recognition.start();
    } catch {
      alert('Speech recognition not supported in this browser.');
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Journal Your Thoughts
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Speak or write your thoughts..."
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex gap-4 items-center">
          <button
            type="submit"
            disabled={status === 'saving'}
            className={`px-4 py-2 rounded text-white ${
              status === 'saving'
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {status === 'saving' ? 'Saving...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={startRecording}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            🎤 Speak
          </button>
          {status === 'saved' && (
            <span className="text-green-500 text-sm">✔ Entry saved</span>
          )}
          {status === 'error' && (
            <span className="text-red-500 text-sm">✖ Save failed</span>
          )}
        </div>
      </form>

      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Previous Entries:</h3>
        {Array.isArray(entries) && entries.length > 0 ? (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li
                key={entry._id}
                className="bg-white p-3 rounded shadow text-sm text-gray-800"
              >
                <div>{entry.text}</div>
                <div className="text-xs text-gray-500">
                  {new Date(entry.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No journal entries yet.</p>
        )}
      </div>
    </div>
  );
};

export default JournalingPage;
