const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const axios   = require('axios');
const { google } = require('googleapis');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');
const { getOAuthClient, YOUTUBE_SCOPES } = require('../config/googleAuth');

// GET /api/youtube/connect — returns the Google consent URL for the logged-in artist
router.get('/connect', protect, (req, res) => {
  const oauth2Client = getOAuthClient();
  // short-lived state token identifies which user is connecting when Google redirects back
  const state = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // ensures a refresh_token is returned every time
    scope: YOUTUBE_SCOPES,
    state,
  });

  res.json({ success: true, url });
});

// GET /api/youtube/callback — Google redirects here after the artist approves access
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const decoded = jwt.verify(state, process.env.JWT_SECRET);

    const oauth2Client = getOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const channelRes = await youtube.channels.list({ part: 'snippet', mine: true });
    const channel = channelRes.data.items?.[0];

    await User.findByIdAndUpdate(decoded.id, {
      youtube: {
        connected: true,
        channelId: channel?.id || '',
        channelTitle: channel?.snippet?.title || 'YouTube Channel',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      },
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard?youtube=connected`);
  } catch (err) {
    console.error('YouTube OAuth error:', err.message);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?youtube=error`);
  }
});

// GET /api/youtube/status — is this artist connected?
router.get('/status', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('youtube');
  res.json({
    success: true,
    connected: !!user.youtube?.connected,
    channelTitle: user.youtube?.channelTitle || null,
  });
});

// DELETE /api/youtube/disconnect
router.delete('/disconnect', protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    youtube: { connected: false, channelId: '', channelTitle: '', accessToken: '', refreshToken: '', tokenExpiry: null },
  });
  res.json({ success: true, message: 'YouTube disconnected.' });
});

// Helper: build an authorized youtube client for a user, refreshing the token if needed
async function getYoutubeClientForUser(user) {
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({
    access_token: user.youtube.accessToken,
    refresh_token: user.youtube.refreshToken,
    expiry_date: user.youtube.tokenExpiry ? new Date(user.youtube.tokenExpiry).getTime() : undefined,
  });

  oauth2Client.on('tokens', async (tokens) => {
    const update = {};
    if (tokens.access_token) update['youtube.accessToken'] = tokens.access_token;
    if (tokens.expiry_date) update['youtube.tokenExpiry'] = new Date(tokens.expiry_date);
    if (Object.keys(update).length) await User.findByIdAndUpdate(user._id, update);
  });

  return google.youtube({ version: 'v3', auth: oauth2Client });
}

// POST /api/youtube/upload-from-url — sync a video already hosted (e.g. on Cloudinary) to the artist's YouTube channel
// body: { videoUrl, title, description }
router.post('/upload-from-url', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('youtube');
    if (!user.youtube?.connected) {
      return res.status(400).json({ success: false, message: 'YouTube is not connected for this account.' });
    }

    const { videoUrl, title, description } = req.body;
    if (!videoUrl || !title) {
      return res.status(400).json({ success: false, message: 'videoUrl and title are required.' });
    }

    const youtube = await getYoutubeClientForUser(user);
    const videoStream = await axios.get(videoUrl, { responseType: 'stream' });

    const upload = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: { title, description: description || '' },
        status: { privacyStatus: 'public' },
      },
      media: { body: videoStream.data },
    });

    res.json({ success: true, youtubeVideoId: upload.data.id, youtubeUrl: `https://youtube.com/watch?v=${upload.data.id}` });
  } catch (err) {
    console.error('YouTube upload error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to upload to YouTube. Please reconnect your channel and try again.' });
  }
});

module.exports = router;
