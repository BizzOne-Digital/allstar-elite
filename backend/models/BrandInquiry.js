const mongoose = require('mongoose');

const BrandInquirySchema = new mongoose.Schema({
  brandName:   { type: String, required: true, trim: true },
  contactName: { type: String, required: true, trim: true },
  email:       { type: String, required: true, trim: true, lowercase: true },
  phone:       { type: String },
  budget:      { type: String },
  artist:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional — artist they're interested in
  message:     { type: String, required: true },
  status:      { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  createdAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('BrandInquiry', BrandInquirySchema);
