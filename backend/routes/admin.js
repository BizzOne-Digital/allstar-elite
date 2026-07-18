const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Song    = require('../models/Song');
const Product = require('../models/Product');
const Order   = require('../models/Order');
const Video   = require('../models/Video');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/stats — dashboard overview
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalSongs, totalProducts, totalOrders, totalVideos] = await Promise.all([
      User.countDocuments(),
      Song.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Video.countDocuments(),
    ]);

    const subscribers = await User.countDocuments({ subscriptionStatus: 'active' });

    const revenueAgg = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const recentOrders = await Order.find().sort('-createdAt').limit(5).populate('user', 'name email');
    const recentUsers  = await User.find().sort('-createdAt').limit(5).select('name email role createdAt');

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 3600000);
    const monthlyRevenue = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
          _id:   { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          total: { $sum: '$total' },
          count: { $sum: 1 },
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalSongs, totalProducts, totalOrders, totalVideos, subscribers, totalRevenue },
      recentOrders,
      recentUsers,
      monthlyRevenue,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];
    const users = await User.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/users/:id — update user role, subscription etc.
router.put('/users/:id', async (req, res) => {
  try {
    const allowed = ['role', 'subscriptionTier', 'subscriptionStatus', 'subscriptionExpiry'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user._id.toString() === req.user.id)
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/songs/:id/publish
router.put('/songs/:id/publish', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, { status: 'published' }, { new: true });
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, song });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
