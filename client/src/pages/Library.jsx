import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';

const Library = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/videos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch videos');
        setVideos(data);
      } catch (err) {
        console.error('Video fetch error:', err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const isYouTubeUrl = (url) =>
    url.includes('youtube.com') || url.includes('youtu.be');

  const getYouTubeEmbedUrl = (url) => {
    try {
      if (url.includes('/embed/')) return url;
      if (url.includes('youtu.be/')) {
        return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`;
      }
      if (url.includes('watch?v=')) {
        return `https://www.youtube.com/embed/${
          url.split('watch?v=')[1].split('&')[0]
        }`;
      }
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-gray-600">Loading videos...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        🎬 Video Library
      </h1>

      {videos.length === 0 ? (
        <p className="text-gray-500">No videos available.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => {
            const isYouTube = isYouTubeUrl(video.originalVideoUrl);
            return (
              <div
                key={video._id}
                className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {video.title}
                  </h2>
                  {video.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {video.description}
                    </p>
                  )}

                  <div className="aspect-w-16 aspect-h-9 mb-3">
                    {isYouTube ? (
                      <iframe
                        src={getYouTubeEmbedUrl(video.originalVideoUrl)}
                        title={video.title}
                        className="w-full h-48 rounded"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={video.originalVideoUrl}
                        controls
                        className="w-full rounded"
                      />
                    )}
                  </div>

                  {video.transcript && (
                    <div className="bg-gray-50 border p-2 text-xs text-gray-700 mb-3 rounded">
                      <strong>📝 Transcript:</strong> <br />
                      {video.transcript}
                    </div>
                  )}
                </div>

                {/* Download button (disabled for YouTube) */}
                <div className="flex justify-end mt-2">
                  <button
                    disabled={isYouTube}
                    onClick={() => {
                      if (!isYouTube)
                        window.open(video.originalVideoUrl, '_blank');
                    }}
                    className={`px-4 py-1.5 rounded text-sm transition ${
                      isYouTube
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    title={
                      isYouTube
                        ? 'Download disabled for YouTube videos'
                        : 'Download video'
                    }
                  >
                    ⬇ Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Library;
