const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Protect Route (must be logged in) ──
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized — no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// ── Admin Only ──
exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// ── Subscriber Only (for exclusive content) ──
exports.subscriberOnly = (req, res, next) => {
  if (!['subscriber', 'admin'].includes(req.user?.subscriptionTier)) {
    return res.status(403).json({ success: false, message: 'Active subscription required' });
  }
  next();
};
