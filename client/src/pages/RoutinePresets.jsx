import { useEffect, useRef, useState } from 'react';
import { getToken } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ROUTINES = [
  {
    key: 'breathing',
    label: '🧘 Breathing Exercise',
    audio: '/audios/breathing.mp3',
  },
  {
    key: 'meditation',
    label: '🧠 Meditation',
    audio: '/audios/meditation.mp3',
  },
  {
    key: 'gratitude',
    label: '🙏 Gratitude Practice',
    audio: '/audios/gratitude.mp3',
  },
  { key: 'sleep', label: '😴 Sleep Preparation', audio: '/audios/sleep.mp3' },
];

const RoutinePresets = () => {
  const [completed, setCompleted] = useState({});
  const [allDone, setAllDone] = useState(false);
  const token = getToken();
  const audioRefs = useRef({});

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/routine/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const today = new Date().toISOString().split('T')[0];
        const todayLogs = data.logs.filter((log) => log.date === today);
        const done = {};
        todayLogs.forEach((log) => (done[log.activity] = true));
        setCompleted(done);
        if (Object.keys(done).length === ROUTINES.length) {
          setAllDone(true);
          updateStreak();
        }
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      }
    };

    fetchCompleted();
  }, []);

  const markAsComplete = async (key) => {
    if (completed[key]) return;

    try {
      await fetch(`${BASE_URL}/api/routine/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activity: key }),
      });

      const updated = { ...completed, [key]: true };
      setCompleted(updated);

      if (Object.keys(updated).length === ROUTINES.length) {
        setAllDone(true);
        updateStreak();
      }
    } catch (err) {
      console.error('Error completing routine:', err);
    }
  };

  const updateStreak = async () => {
    try {
      await fetch(`${BASE_URL}/api/streaks/update`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Failed to update streak:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        🧩 Your Daily Routines
      </h2>

      {ROUTINES.map((routine) => (
        <div
          key={routine.key}
          className={`bg-white p-4 rounded-lg shadow flex items-center justify-between mb-4 ${
            completed[routine.key] ? 'bg-green-50 border border-green-400' : ''
          }`}
        >
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{routine.label}</span>
            <audio
              controls
              ref={(el) => (audioRefs.current[routine.key] = el)}
              src={routine.audio}
              onEnded={() => markAsComplete(routine.key)}
              className="mt-2"
            />
          </div>

          {completed[routine.key] && (
            <span className="text-green-600 font-bold text-xl ml-3">✔️</span>
          )}
        </div>
      ))}

      {allDone && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded text-green-800 font-semibold">
          🎉 All routines complete! Today's streak has been recorded.
        </div>
      )}
    </div>
  );
};

export default RoutinePresets;
