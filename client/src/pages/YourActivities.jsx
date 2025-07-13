import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { getToken } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const YourActivities = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = getToken();

      try {
        const res = await fetch(`${BASE_URL}/api/routine/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch logs');

        // Construct heatmap format
        const heatmap = data.streakDays.map((date) => ({
          date,
          count: 1,
        }));

        setHeatmapData(heatmap);
        setCurrentStreak(data.currentStreak || 0);
        setLongestStreak(data.longestStreak || 0);
      } catch (err) {
        console.error('Fetch streak logs error:', err);
      }
    };

    fetchLogs();
  }, []);

  const today = new Date();
  const yearAgo = new Date();
  yearAgo.setFullYear(today.getFullYear() - 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">🔥 Your Streaks</h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-lg text-gray-700 mb-2">
          ✅ <strong>Current Streak:</strong> {currentStreak} days
        </p>
        <p className="text-lg text-gray-700">
          🏆 <strong>Longest Streak:</strong> {longestStreak} days
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          📆 Your Daily Completion Heatmap
        </h3>
        <CalendarHeatmap
          startDate={yearAgo}
          endDate={today}
          values={heatmapData}
          classForValue={(value) => {
            if (!value || value.count === 0) return 'color-empty';
            return 'color-filled';
          }}
          showWeekdayLabels
        />
      </div>

      <style>{`
        .color-filled {
          fill: #34d399; /* green-400 */
        }
        .color-empty {
          fill: #e5e7eb; /* gray-200 */
        }
      `}</style>
    </div>
  );
};

export default YourActivities;
