const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadImage } = require('../config/cloudinary');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (featured) query.isFeatured = true;

    const products = await Product.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Product.countDocuments(query);
    res.json({ success: true, products, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('artist', 'name artistName');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products — admin creates product
router.post('/',
  protect, adminOnly,
  uploadImage.array('images', 5),
  async (req, res) => {
    try {
      const images = req.files?.map(f => ({ url: f.path, cloudinaryId: f.filename })) || [];
      const product = await Product.create({
        ...req.body,
        images,
        artist: req.user.id,
      });
      res.status(201).json({ success: true, product });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PUT /api/products/:id
router.put('/:id', protect, adminOnly, uploadImage.array('images', 5), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.files?.length) {
      update.images = req.files.map(f => ({ url: f.path, cloudinaryId: f.filename }));
    }
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products/:id/review
router.post('/:id/review', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const already = product.ratings.find(r => r.user.toString() === req.user.id);
    if (already) return res.status(400).json({ success: false, message: 'Already reviewed' });

    product.ratings.push({ user: req.user.id, rating: req.body.rating, review: req.body.review });
    product.avgRating = product.ratings.reduce((a, r) => a + r.rating, 0) / product.ratings.length;
    await product.save();
    res.json({ success: true, avgRating: product.avgRating });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
