// Usage: node scripts/seedProducts.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const SAMPLE_PRODUCTS = [
  {
    name: 'AllStar Elite Hoodie',
    description: 'Premium heavyweight hoodie with embroidered AllStar Elite logo.',
    price: 49.99,
    category: 'apparel',
    images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80' }],
    stock: 15,
  },
  {
    name: 'Limited Edition Tee',
    description: 'Soft cotton tee from the Limited Drop collection.',
    price: 29.99,
    category: 'apparel',
    images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' }],
    stock: 8,
  },
  {
    name: 'Logo Cap',
    description: 'Adjustable snapback cap with embroidered logo.',
    price: 24.99,
    category: 'accessories',
    images: [{ url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80' }],
    stock: 20,
  },
  {
    name: 'Signed Album Bundle',
    description: 'Physical album copy signed by the artist, includes bonus poster.',
    price: 79.99,
    category: 'music',
    images: [{ url: 'https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0?w=600&q=80' }],
    stock: 5,
  },
  {
    name: 'Wristband Set',
    description: 'Pack of 3 silicone wristbands in brand colors.',
    price: 12.99,
    category: 'accessories',
    images: [{ url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80' }],
    stock: 50,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await User.findOne({ role: 'admin' });

  const docs = SAMPLE_PRODUCTS.map(p => ({ ...p, artist: admin?._id }));
  const created = await Product.insertMany(docs);

  console.log(`✅ Seeded ${created.length} products.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
