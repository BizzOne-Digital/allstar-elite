const express = require('express');
const router  = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/settings — public (footer, contact page, legal pages)
router.get('/', async (req, res) => {
  try {
    const settings = await SiteSettings.getSingleton();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings — admin only, updates only the fields that are sent
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const updates = {};
    ['contactEmail', 'contactPhone', 'address'].forEach(k => {
      if (typeof req.body[k] === 'string') updates[k] = req.body[k].trim();
    });
    ['twitter', 'instagram', 'youtube', 'facebook'].forEach(k => {
      if (typeof req.body.social?.[k] === 'string') updates[`social.${k}`] = req.body.social[k].trim();
    });

    if (updates.contactEmail !== undefined && !/^\S+@\S+\.\S+$/.test(updates.contactEmail))
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });

    const current = await SiteSettings.getSingleton();
    const settings = await SiteSettings.findByIdAndUpdate(current._id, { $set: updates }, { new: true, runValidators: true });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
