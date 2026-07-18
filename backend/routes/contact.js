const express = require('express');
const router  = express.Router();
const { sendEmail } = require('../config/email');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });

    await sendEmail({
      to: process.env.SMTP_USER,
      subject: `[AllStar Elite Contact] ${subject || 'New Message'}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px;border:1px solid #E5E7EB;border-radius:12px;">
          <h2 style="color:#E8732A;margin-top:0;">New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:600;width:100px;">Name:</td><td>${name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;">Email:</td><td>${email}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;">Subject:</td><td>${subject || 'N/A'}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#F9FAFB;border-radius:8px;">
            <p style="margin:0;line-height:1.7;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    });

    // Auto-reply to sender
    await sendEmail({
      to: email,
      subject: 'We received your message — AllStar Elite',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#F5A623,#D94F1E);padding:32px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:24px;">ALLSTAR ELITE</h1>
          </div>
          <div style="padding:32px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px;">
            <p>Hi ${name},</p>
            <p>Thanks for reaching out! We received your message and will get back to you within 24-48 hours.</p>
            <p style="color:#9CA3AF;font-size:12px;margin-top:24px;">© 2026 AllStar Elite</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
