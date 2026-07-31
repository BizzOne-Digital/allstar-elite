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
  isrc:          { type: String, trim: true }, // International Standard Recording Code (optional, artist-supplied or auto-assigned)
  iswc:          { type: String, trim: true }, // International Standard Musical Work Code (optional)

  // Pre-save campaign (for unreleased/upcoming songs)
  isPreSave:      { type: Boolean, default: false },
  previewSeconds: { type: Number, default: 46 }, // how much of the track fans can preview before release
  preSaves:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Stats
  plays:     { type: Number, default: 0 },
  likes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  listeners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // unique logged-in listeners

  // Visibility
  isPublic:          { type: Boolean, default: true },
  subscriberOnly:    { type: Boolean, default: false },
  status:            { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Song', SongSchema);
