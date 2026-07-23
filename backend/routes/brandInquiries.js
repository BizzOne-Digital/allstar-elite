const express = require('express');
const router  = express.Router();
const BrandInquiry = require('../models/BrandInquiry');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/brand-inquiries — public submission
router.post('/', async (req, res) => {
  try {
    const { brandName, contactName, email, phone, budget, artist, message } = req.body;
    const inquiry = await BrandInquiry.create({ brandName, contactName, email, phone, budget, artist, message });
    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/brand-inquiries — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const inquiries = await BrandInquiry.find()
      .populate('artist', 'name artistName')
      .sort('-createdAt');
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/brand-inquiries/:id — admin updates status
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const inquiry = await BrandInquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/brand-inquiries/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const inquiry = await BrandInquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    await inquiry.deleteOne();
    res.json({ success: true, message: 'Inquiry removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
