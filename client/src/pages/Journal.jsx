import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import Layout from '../components/Layout';

export default function Journal() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/logs/my`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setLogs(res.data);
      } catch (err) {
        console.error('Log fetch error:', err);
        setError('Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold text-blue-600">📝 History </h2>

        {loading && <p className="text-gray-500">Loading logs...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && logs.length === 0 && !error && (
          <p className="text-gray-500">No history Found.</p>
        )}

        {logs.map((log, idx) => (
          <div
            key={idx}
            className="p-4 border rounded shadow-sm space-y-1 bg-white"
          >
            <p className="text-sm text-gray-600">
              {new Date(log.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-800 font-medium">
              Mood: {log.mood} | Language: {log.language}
            </p>
            <p className="text-sm text-gray-700 italic">“{log.text}”</p>
            <audio controls className="w-full mt-2">
              <source src={log.audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </Layout>
  );
}
