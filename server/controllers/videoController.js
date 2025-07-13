const Video = require('../models/Video'); 

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error('Error fetching videos:', err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, originalVideoUrl, transcript } = req.body;
    const video = new Video({
      title,
      description,
      originalVideoUrl,
      transcript,
      uploadedBy: req.user._id,
    });
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    console.error('Error uploading video:', err);
    res.status(500).json({ error: 'Video upload failed' });
  }
};
