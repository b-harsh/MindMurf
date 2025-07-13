import { useEffect, useState } from 'react';

const AdminUpload = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('mindmate_token');

  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    transcript: '',
    originalVideoUrl: '',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data && data.isAdmin) {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Admin check failed:', err);
      }
    };
    checkAdmin();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Uploading...');

    try {
      const res = await fetch(`${API_URL}/api/videos/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setStatus('✅ Uploaded successfully!');
      setForm({
        title: '',
        description: '',
        transcript: '',
        originalVideoUrl: '',
      });
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('❌ Failed to upload');
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6 text-red-500 text-center">
        Access denied. Admins only.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">📤 Upload Video</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 shadow rounded"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Video Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Video Description"
          className="w-full p-2 border rounded"
        />
        <input
          name="originalVideoUrl"
          value={form.originalVideoUrl}
          onChange={handleChange}
          placeholder="Original Video URL"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="transcript"
          value={form.transcript}
          onChange={handleChange}
          placeholder="Transcript (optional)"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>

      {status && <p className="mt-3 text-sm text-gray-600">{status}</p>}
    </div>
  );
};

export default AdminUpload;
