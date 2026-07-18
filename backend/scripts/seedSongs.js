// Usage: node scripts/seedSongs.js
require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('../models/Song');
const User = require('../models/User');

const SAMPLE_SONGS = [
  {
    title: 'Midnight Drive',
    genre: 'Hip-Hop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
  },
  {
    title: 'Golden Hour',
    genre: 'R&B',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
  },
  {
    title: 'City Lights',
    genre: 'Pop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
  },
  {
    title: 'Neon Skyline',
    genre: 'Electronic',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
  },
  {
    title: 'Slow Burn',
    genre: 'Soul',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.log('No admin user found — create one first with scripts/createAdmin.js');
    process.exit(1);
  }

  const docs = SAMPLE_SONGS.map(s => ({
    ...s,
    artist: admin._id,
    artistName: admin.name,
    status: 'published',
    isPublic: true,
    subscriberOnly: false,
  }));
  const created = await Song.insertMany(docs);

  console.log(`✅ Seeded ${created.length} published songs.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
