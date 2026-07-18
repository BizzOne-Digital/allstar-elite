const express = require('express');
const router  = express.Router();
const Video   = require('../models/Video');
const { protect, adminOnly, subscriberOnly } = require('../middleware/auth');
const { uploadVideo, uploadImage } = require('../config/cloudinary');

// GET /api/videos — public previews
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find({ status: 'published', isExclusive: false })
      .populate('artist', 'name artistName avatar')
      .sort('-createdAt').limit(20);
    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/videos/exclusive — subscriber only
router.get('/exclusive', protect, subscriberOnly, async (req, res) => {
  try {
    const videos = await Video.find({ status: 'published', isExclusive: true })
      .populate('artist', 'name artistName avatar')
      .sort('-createdAt');
    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/videos — upload (admin/artist)
router.post('/',
  protect,
  uploadVideo.single('video'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'Video file required' });
      const video = await Video.create({
        ...req.body,
        artist:       req.user.id,
        videoUrl:     req.file.path,
        cloudinaryId: req.file.filename,
        isExclusive:  req.body.isExclusive !== 'false',
      });
      res.status(201).json({ success: true, video });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// DELETE /api/videos/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Not found' });
    await video.deleteOne();
    res.json({ success: true, message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
