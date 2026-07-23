const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:    { type: String, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role:     { type: String, enum: ['user', 'artist', 'admin'], default: 'user' },
  avatar:   { type: String, default: '' },

  // Subscription
  subscriptionTier:   { type: String, enum: ['free', 'monthly', 'yearly'], default: 'free' },
  subscriptionStatus: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'inactive' },
  subscriptionExpiry: { type: Date },
  stripeCustomerId:   { type: String },
  stripeSubId:        { type: String },

  // Profile
  artistName: { type: String },
  bio:        { type: String },
  genre:      { type: String },
  social:     {
    instagram: String,
    twitter:   String,
    youtube:   String,
    spotify:   String,
  },

  // Notifications
  followers:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notifEnabled: { type: Boolean, default: true },

  // Password reset
  resetPasswordToken:  String,
  resetPasswordExpire: Date,

  isEmailVerified: { type: Boolean, default: false },
  emailVerifyToken: String,

  createdAt: { type: Date, default: Date.now },
});

// ── Hash password before save ──
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Compare password ──
UserSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// ── Generate JWT ──
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// ── Generate reset token ──
UserSchema.methods.getResetPasswordToken = function () {
  const raw = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken  = crypto.createHash('sha256').update(raw).digest('hex');
  this.resetPasswordExpire = Date.now() + 3600000; // 1 hr
  return raw;
};

module.exports = mongoose.model('User', UserSchema);
