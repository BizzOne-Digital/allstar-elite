// =============================================
// ALLSTAR ELITE — Express Server
// =============================================

const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ── Middleware ──
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Static uploads folder (fallback) ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ──
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/songs',     require('./routes/songs'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/videos',    require('./routes/videos'));
app.use('/api/subscribe', require('./routes/subscriptions'));
app.use('/api/contact',   require('./routes/contact'));
app.use('/api/admin',     require('./routes/admin'));
app.use('/api/blog',      require('./routes/blog'));
app.use('/api/brand-inquiries', require('./routes/brandInquiries'));
app.use('/api/youtube',   require('./routes/youtube'));
app.use('/api/upload',    require('./routes/upload'));

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', service: 'AllStar Elite API' });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── Local dev server (Vercel imports `app` as a serverless function instead) ──
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🎵 AllStar Elite API running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
  });
}

module.exports = app;
