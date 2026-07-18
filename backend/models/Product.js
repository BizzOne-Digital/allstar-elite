const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String },
  price:       { type: Number, required: true },
  category:    { type: String, enum: ['apparel', 'accessories', 'music', 'other'], default: 'apparel' },
  images:      [{ url: String, cloudinaryId: String }],
  sizes:       [{ type: String }],
  colors:      [{ type: String }],
  stock:       { type: Number, default: 0 },
  sku:         { type: String },
  artist:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive:    { type: Boolean, default: true },
  isFeatured:  { type: Boolean, default: false },
  sold:        { type: Number, default: 0 },
  ratings:     [{
    user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
  }],
  avgRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
