import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, clearToken } from '../utils/auth';
import StreakDisplay from '../components/StreakDisplay';
import Layout from '../components/Layout';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [streakStats, setStreakStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndStreak = async () => {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load user');
        setUser(data);

        const streakRes = await fetch(`${BASE_URL}/api/routine/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const streakData = await streakRes.json();
        if (streakRes.ok) {
          setStreakStats({
            currentStreak: streakData.currentStreak || 0,
            longestStreak: streakData.longestStreak || 0,
          });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStreak();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-700">
        ⏳ Loading your dashboard...
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Welcome, {user?.name || 'User'}!
          </h1>
          <button
            onClick={() => {
              clearToken();
              navigate('/login');
            }}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* 🔥 Streak Stats Summary */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow text-center">
            <h3 className="text-sm text-gray-500">🔥 Current Streak</h3>
            <p className="text-2xl font-semibold text-blue-600">
              {streakStats.currentStreak} days
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h3 className="text-sm text-gray-500">🏆 Longest Streak</h3>
            <p className="text-2xl font-semibold text-green-600">
              {streakStats.longestStreak} days
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureTile href="/journal" label="✍️ Your History" />
          <FeatureTile href="/library" label="🎬 Your Library" />
          <FeatureTile href="/detect" label="😃 Wanna Talk" />
          <FeatureTile href="/presets" label="📋 Routine Exercises" />
          <FeatureTile href="/tts" label="🗣️ Multilingual Text-to-Speech" />
          <FeatureTile href="/activities" label="🧠 Your Activities" />
          <FeatureTile href="/journaling" label="📋 Your Own Space" />

          {user?.isAdmin && (
            <FeatureTile href="/admin/upload" label="📤 Admin Video Upload" />
          )}
        </div>
      </div>
    </Layout>
  );
};

const FeatureTile = ({ href, label }) => (
  <a
    href={href}
    className="bg-white shadow p-6 rounded-lg hover:bg-blue-50 transition"
  >
    {label}
  </a>
);

export default Dashboard;
