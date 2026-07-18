const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../config/cloudinary');

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const allowed = ['name', 'artistName', 'bio', 'genre', 'social', 'notifEnabled'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
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

// GET /api/users/artists — list all artists
router.get('/artists', async (req, res) => {
  try {
    const artists = await User.find({ role: 'artist' })
      .select('name artistName avatar bio genre followers')
      .sort('-createdAt').limit(20);
    res.json({ success: true, artists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
