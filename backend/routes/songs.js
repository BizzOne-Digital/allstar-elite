const express = require('express');
const router  = express.Router();
const Song    = require('../models/Song');
const { protect, adminOnly, subscriberOnly } = require('../middleware/auth');
const { uploadAudio, uploadImage } = require('../config/cloudinary');
const multer = require('multer');

// GET /api/songs — public songs
router.get('/', async (req, res) => {
  try {
    const { artist, genre, page = 1, limit = 20 } = req.query;
    const query = { status: 'published', isPublic: true, subscriberOnly: false };
    if (artist) query.artist = artist;
    if (genre)  query.genre  = genre;

    const songs = await Song.find(query)
      .populate('artist', 'name artistName avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Song.countDocuments(query);
    res.json({ success: true, songs, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/songs/admin/all — every song, any status (admin only)
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const songs = await Song.find({}).populate('artist', 'name artistName avatar').sort('-createdAt');
    res.json({ success: true, songs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/songs/mine — the logged-in artist's own tracks (any status)
router.get('/mine', protect, async (req, res) => {
  try {
    const songs = await Song.find({ artist: req.user.id }).sort('-createdAt');
    res.json({ success: true, songs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/songs/exclusive — subscriber only
router.get('/exclusive', protect, subscriberOnly, async (req, res) => {
  try {
    const songs = await Song.find({ status: 'published', subscriberOnly: true })
      .populate('artist', 'name artistName avatar')
      .sort('-createdAt');
    res.json({ success: true, songs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/songs/:id
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('artist', 'name artistName avatar');
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    // Increment play count
    song.plays++;
    await song.save();
    res.json({ success: true, song });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/songs — upload a new song (artist/admin)
router.post('/',
  protect,
  uploadAudio.single('audio'),
  async (req, res) => {
    try {
      const { title, genre, subscriberOnly, isPublic } = req.body;
      if (!req.file) return res.status(400).json({ success: false, message: 'Audio file required' });

      const song = await Song.create({
        title,
        genre,
        artist:          req.user.id,
        artistName:      req.user.name,
        audioUrl:        req.file.path,
        cloudinaryId:    req.file.filename,
        subscriberOnly:  subscriberOnly === 'true',
        isPublic:        isPublic !== 'false',
        status:          'draft',
      });

      res.status(201).json({ success: true, song });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PUT /api/songs/:id — update song
router.put('/:id', protect, async (req, res) => {
  try {
    let song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    if (song.artist.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, song });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/songs/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    if (song.artist.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await song.deleteOne();
    res.json({ success: true, message: 'Song removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/songs/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    const idx = song.likes.indexOf(req.user.id);
    if (idx > -1) song.likes.splice(idx, 1);
    else song.likes.push(req.user.id);
    await song.save();
    res.json({ success: true, likes: song.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
