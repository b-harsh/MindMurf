import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StreakDisplay() {
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await axios.get('/api/streaks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setStreak(res.data);
      } catch (err) {
        console.error('Streak fetch error:', err);
      }
    };

    fetchStreak();
  }, []);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded shadow mb-4">
      <p className="text-md font-semibold text-yellow-800">
        🔥 Current Streak: {streak.current} day{streak.current !== 1 ? 's' : ''}
      </p>
      <p className="text-sm text-yellow-700">
        🏆 Longest Streak: {streak.longest} day{streak.longest !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
