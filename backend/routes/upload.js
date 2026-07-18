const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { uploadImage, uploadAudio, uploadVideo, cloudinary } = require('../config/cloudinary');

// POST /api/upload/image
router.post('/image', protect, uploadImage.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, url: req.file.path, publicId: req.file.filename });
});

// POST /api/upload/audio
router.post('/audio', protect, uploadAudio.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, url: req.file.path, publicId: req.file.filename });
});

// POST /api/upload/video
router.post('/video', protect, uploadVideo.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, url: req.file.path, publicId: req.file.filename });
});

// DELETE /api/upload/:publicId — admin delete from Cloudinary
router.delete('/:publicId', protect, adminOnly, async (req, res) => {
  try {
    const { resourceType = 'image' } = req.query;
    await cloudinary.uploader.destroy(req.params.publicId, { resource_type: resourceType });
    res.json({ success: true, message: 'File deleted from Cloudinary' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
