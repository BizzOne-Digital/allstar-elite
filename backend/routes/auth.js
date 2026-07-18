const express = require('express');
const router  = express.Router();
const crypto  = require('crypto');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendEmail, templates } = require('../config/email');

// Helper: send token response
const sendToken = (user, status, res) => {
  const token = user.getSignedToken();
  res.status(status).json({
    success: true,
    token,
    user: {
      id:               user._id,
      name:             user.name,
      email:            user.email,
      role:             user.role,
      avatar:           user.avatar,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
    },
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, adminCode } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Please fill all fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    // Admin role requires code
    if (role === 'admin' && adminCode !== process.env.ADMIN_REGISTRATION_CODE)
      return res.status(403).json({ success: false, message: 'Invalid admin code' });

    const user = await User.create({ name, email, password, role: role === 'admin' ? 'admin' : 'user' });

    // Send welcome email (non-blocking)
    const tmpl = templates.welcome(name);
    sendEmail({ to: email, ...tmpl }).catch(console.error);

    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'No account with that email' });

    const rawToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const tmpl = templates.resetPassword(user.name, rawToken);
    await sendEmail({ to: user.email, ...tmpl });

    res.json({ success: true, message: 'Reset email sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/reset-password/:token
router.put('/reset-password/:token', async (req, res) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken:  hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password            = req.body.password;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/update-password
router.put('/update-password', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    const match = await user.matchPassword(req.body.currentPassword);
    if (!match) return res.status(401).json({ success: false, message: 'Current password incorrect' });

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
