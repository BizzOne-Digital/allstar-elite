const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Image Storage ──
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'allstar-elite/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
  }),
});

// ── Audio Storage ──
const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'allstar-elite/audio',
    resource_type: 'video', // Cloudinary uses 'video' for audio too
    allowed_formats: ['mp3', 'wav', 'flac', 'aac'],
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
  }),
});

// ── Video Storage ──
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'allstar-elite/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'webm'],
    transformation: [{ quality: 'auto' }],
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
  }),
});

const uploadImage = multer({ storage: imageStorage, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadAudio = multer({ storage: audioStorage, limits: { fileSize: 100 * 1024 * 1024 } });
const uploadVideo = multer({ storage: videoStorage, limits: { fileSize: 500 * 1024 * 1024 } });

module.exports = { cloudinary, uploadImage, uploadAudio, uploadVideo };
