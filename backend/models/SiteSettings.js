const mongoose = require('mongoose');

// Single-document collection holding the public contact info shown across the site.
// Defaults match the values that were previously hardcoded in the frontend.
const SiteSettingsSchema = new mongoose.Schema({
  contactEmail: { type: String, trim: true, lowercase: true, default: 'info@allstarelite.com' },
  contactPhone: { type: String, trim: true, default: '+1 (555) 123-4567' },
  address:      { type: String, trim: true, default: 'Los Angeles, CA' },
  social: {
    twitter:   { type: String, trim: true, default: 'https://twitter.com' },
    instagram: { type: String, trim: true, default: 'https://instagram.com' },
    youtube:   { type: String, trim: true, default: 'https://youtube.com' },
    facebook:  { type: String, trim: true, default: 'https://facebook.com' },
  },
}, { timestamps: true });

// Returns the settings document, creating it with defaults on first use.
// Never overwrites an existing document.
SiteSettingsSchema.statics.getSingleton = async function () {
  const existing = await this.findOne();
  return existing || this.create({});
};

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
