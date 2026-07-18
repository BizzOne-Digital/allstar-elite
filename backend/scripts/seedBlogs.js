// Usage: node scripts/seedBlogs.js
require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');

const SAMPLE_POSTS = [
  {
    title: 'How to Maximize Your Spotify Streams in 2026',
    excerpt: 'Learn the proven strategies top independent artists use to grow their monthly listeners and get on editorial playlists.',
    content: `Getting more Spotify streams isn't about luck — it's about consistency and strategy.

1. Release consistently: Artists who release every 4-6 weeks keep the algorithm engaged with fresh content.
2. Pitch to editorial playlists early: Submit your track through Spotify for Artists at least 7 days before release.
3. Build your own playlists: Curate playlists with your music alongside similar artists to attract algorithmic placement.
4. Use pre-save campaigns: Build anticipation and get instant streams on release day.
5. Engage with your Canvas and Storyline features: Visual content keeps listeners on your track longer, which signals quality to the algorithm.

Consistency beats virality. Focus on steady growth over chasing a single viral moment.`,
    category: 'Tips & Strategy',
    readTime: '5 min read',
    coverImage: { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80' },
  },
  {
    title: 'Understanding Royalties: A Complete Guide for Indie Artists',
    excerpt: 'Mechanical royalties, performance royalties, sync licensing — we break it all down in plain English so you know exactly how you get paid.',
    content: `As an independent artist, understanding where your money comes from is essential.

Mechanical Royalties: Paid whenever your song is reproduced — streams, downloads, CDs.
Performance Royalties: Paid when your song is performed publicly — radio, TV, live venues, and streaming platforms.
Sync Licensing: Paid when your music is used in film, TV, ads, or video games.

To collect all of these, make sure you're registered with a Performance Rights Organization (PRO) and that your distributor reports accurately to all relevant collection societies.

The biggest mistake indie artists make is not registering their works properly, leaving royalties uncollected for years.`,
    category: 'Education',
    readTime: '8 min read',
    coverImage: { url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80' },
  },
  {
    title: 'The Power of Exclusive Content: How Superfans Drive Revenue',
    excerpt: 'Artists with exclusive subscriber content earn 3x more per fan. Here\'s how to build a superfan monetization strategy that works.',
    content: `Your top 1% of fans generate a disproportionate share of your revenue. Here's how to serve them better.

Offer exclusive tracks, behind-the-scenes videos, and early access to new releases for subscribers only. This creates a direct relationship that doesn't depend on algorithms.

Superfans want to feel closer to you. Give them access others don't have, and they'll pay for it — and stick around longer.`,
    category: 'Monetization',
    readTime: '6 min read',
    coverImage: { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80' },
  },
  {
    title: 'Merch Strategy for Independent Artists: Start Small, Scale Fast',
    excerpt: 'You don\'t need a warehouse or huge upfront costs. Here\'s a step-by-step guide to launching your first merch drop and making it profitable.',
    content: `Merch is one of the highest-margin revenue streams available to independent artists.

Start with a small, focused drop: one hoodie design and one tee. Validate demand before investing in a large inventory.

Use print-on-demand services initially to avoid upfront stock costs, then move to bulk manufacturing once you know what sells.

Announce drops to your email list and socials at least a week in advance to build anticipation.`,
    category: 'Merchandise',
    readTime: '7 min read',
    coverImage: { url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80' },
  },
  {
    title: 'Content ID Explained: Protect Your Music on YouTube',
    excerpt: 'Thousands of artists are losing money every day because their music is being used without credit. Here\'s how Content ID fixes that.',
    content: `Content ID is YouTube's system for identifying and managing copyrighted content automatically.

When your distributor registers your music with Content ID, any video using your track — even without permission — gets flagged, and you can choose to monetize, track, or block it.

This means creators using your music in their videos generate ad revenue for you, turning unauthorized use into a passive income stream instead of a loss.`,
    category: 'Rights',
    readTime: '4 min read',
    coverImage: { url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80' },
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await User.findOne({ role: 'admin' });
  const docs = SAMPLE_POSTS.map(p => ({ ...p, author: admin?._id }));
  const created = await Blog.insertMany(docs);

  console.log(`✅ Seeded ${created.length} blog posts.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
