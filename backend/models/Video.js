const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  artist:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  videoUrl:    { type: String, required: true },
  thumbnailUrl:{ type: String },
  cloudinaryId:{ type: String },
  duration:    { type: Number },
  isExclusive: { type: Boolean, default: true }, // subscriber only
  views:       { type: Number, default: 0 },
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status:      { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  tags:        [String],
  createdAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', VideoSchema);
