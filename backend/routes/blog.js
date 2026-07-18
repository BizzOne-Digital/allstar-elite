const express = require('express');
const router  = express.Router();
const Blog    = require('../models/Blog');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadImage } = require('../config/cloudinary');

// GET /api/blog — published posts
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const query = { isPublished: true };
    if (category && category !== 'All') query.category = category;

    const posts = await Blog.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Blog.countDocuments(query);
    res.json({ success: true, posts, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).populate('author', 'name artistName avatar');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/blog — admin creates post
router.post('/', protect, adminOnly, uploadImage.single('image'), async (req, res) => {
  try {
    const post = await Blog.create({
      ...req.body,
      coverImage: req.file ? { url: req.file.path, cloudinaryId: req.file.filename } : undefined,
      author: req.user.id,
    });
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/blog/:id
router.put('/:id', protect, adminOnly, uploadImage.single('image'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.coverImage = { url: req.file.path, cloudinaryId: req.file.filename };
    const post = await Blog.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/blog/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    await post.deleteOne();
    res.json({ success: true, message: 'Post removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
