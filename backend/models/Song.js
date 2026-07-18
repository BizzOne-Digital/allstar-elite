const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  artist:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artistName:  { type: String },
  genre:       { type: String },
  duration:    { type: Number }, // seconds
  audioUrl:    { type: String, required: true },
  coverUrl:    { type: String },
  cloudinaryId: { type: String },

  // Distribution
  isDistributed: { type: Boolean, default: false },
  platforms:     [{ type: String }],
  releaseDate:   { type: Date, default: Date.now },
  price:         { type: Number, default: 15 }, // per song subscription

  // Stats
  plays:   { type: Number, default: 0 },
  likes:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Visibility
  isPublic:          { type: Boolean, default: true },
  subscriberOnly:    { type: Boolean, default: false },
  status:            { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Song', SongSchema);
