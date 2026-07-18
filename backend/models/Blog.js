const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  excerpt:    { type: String, required: true },
  content:    { type: String, required: true },
  category:   { type: String, default: 'Tips & Strategy' },
  coverImage: { url: String, cloudinaryId: String },
  readTime:   { type: String, default: '5 min read' },
  author:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: { type: Boolean, default: true },
  createdAt:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', BlogSchema);
