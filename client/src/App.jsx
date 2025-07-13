import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from './utils/auth';

import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TTSPage from './pages/TTSPage';
import RoutinePresets from './pages/RoutinePresets';
import Journal from './pages/Journal';
import DetectMood from './pages/DetectMood';
import VideoLibrary from './pages/VideoLibrary';
import VoiceJournal from './pages/VoiceJournal';
import HomePage from './pages/HomePage';
import JournalingPage from './pages/JournalingPage';
import Library from './pages/Library';
import AdminUpload from './pages/AdminUpload';
import YourActivities from './pages/YourActivities';

const PrivateRoute = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
};

const NotFound = () => (
  <div className="flex items-center justify-center h-screen text-xl text-gray-600">
    404 - Page Not Found
  </div>
);

function App() {
  useEffect(() => {
    fetch('http://localhost:5000/')
      .then((res) => res.text())
      .then(console.log)
      .catch((err) => console.error('Backend ping failed', err));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/tts"
          element={
            <PrivateRoute>
              <TTSPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/presets"
          element={
            <PrivateRoute>
              <RoutinePresets />
            </PrivateRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <PrivateRoute>
              <Journal />
            </PrivateRoute>
          }
        />
        <Route
          path="/detect"
          element={
            <PrivateRoute>
              <DetectMood />
            </PrivateRoute>
          }
        />

        <Route
          path="/journaling"
          element={
            <PrivateRoute>
              <JournalingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/activities"
          element={
            <PrivateRoute>
              <YourActivities />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/upload"
          element={
            <PrivateRoute>
              <AdminUpload />
            </PrivateRoute>
          }
        />

        <Route
          path="/library"
          element={
            <PrivateRoute>
              <Library />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
