const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Song    = require('../models/Song');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../config/cloudinary');

// GET /api/users/me — current logged-in user
router.get('/me', protect, async (req, res) => {
  const user = req.user.toObject();
  user.id = req.user._id; // keep the same shape as the login response
  res.json({ success: true, user });
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const allowed = ['name', 'artistName', 'bio', 'genre', 'social', 'notifEnabled', 'email', 'phone'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    if (updates.email) {
      const existing = await User.findOne({ email: updates.email.toLowerCase().trim(), _id: { $ne: req.user.id } });
      if (existing) return res.status(400).json({ success: false, message: 'That email is already in use.' });
    }

    const updated = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    const user = updated.toObject();
    user.id = updated._id;
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/users/avatar
router.post('/avatar', protect, uploadImage.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image required' });
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: req.file.path }, { new: true });
    res.json({ success: true, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/users/:id/follow
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, message: 'User not found' });

    const me = await User.findById(req.user.id);
    const isFollowing = me.following.includes(target._id);

    if (isFollowing) {
      me.following = me.following.filter(id => id.toString() !== target._id.toString());
      target.followers = target.followers.filter(id => id.toString() !== me._id.toString());
    } else {
      me.following.push(target._id);
      target.followers.push(me._id);
    }
    await me.save();
    await target.save();
    res.json({ success: true, following: !isFollowing, followerCount: target.followers.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/:id/profile — public artist profile: streams, listeners, top songs
router.get('/:id/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name artistName avatar bio genre social followers createdAt');
    if (!user) return res.status(404).json({ success: false, message: 'Artist not found' });

    const songs = await Song.find({ artist: req.params.id, status: 'published', isPublic: true })
      .select('title genre coverUrl plays listeners releaseDate');

    const totalStreams = songs.reduce((sum, s) => sum + (s.plays || 0), 0);

    const uniqueListeners = new Set();
    songs.forEach(s => s.listeners.forEach(id => uniqueListeners.add(id.toString())));

    const topSongs = [...songs]
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 5)
      .map(s => ({ _id: s._id, title: s.title, genre: s.genre, coverUrl: s.coverUrl, plays: s.plays }));

    res.json({
      success: true,
      artist: user,
      stats: {
        totalStreams,
        listenerCount: uniqueListeners.size,
        songCount: songs.length,
        followerCount: user.followers.length,
      },
      topSongs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/artists — every user who has at least one published song
router.get('/artists', async (req, res) => {
  try {
    const artistIds = await Song.distinct('artist', { status: 'published', isPublic: true });
    const artists = await User.find({ _id: { $in: artistIds } })
      .select('name artistName avatar bio genre followers')
      .sort('-createdAt');
    res.json({ success: true, artists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
