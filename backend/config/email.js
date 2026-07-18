const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_APP_PASSWORD, // Gmail App Password
  },
});

// ── Verify connection on startup ──
transporter.verify((error) => {
  if (error) console.error('❌ SMTP error:', error.message);
  else console.log('✅ SMTP ready');
});

// ── Send Email Helper ──
const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'AllStar Elite <noreply@allstarelite.com>',
    to,
    subject,
    html,
    text,
  };
  return transporter.sendMail(mailOptions);
};

// ── Email Templates ──
const templates = {
  welcome: (name) => ({
    subject: 'Welcome to AllStar Elite!',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E5E7EB;">
        <div style="background:linear-gradient(135deg,#F5A623,#D94F1E);padding:40px 32px;text-align:center;">
          <h1 style="color:#fff;font-size:28px;margin:0;letter-spacing:2px;">ALLSTAR ELITE</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:13px;letter-spacing:1px;">AIN'T NOBODY ELSE LIKE ME</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#111;margin-top:0;">Welcome, ${name}! 🎵</h2>
          <p style="color:#4B5563;line-height:1.7;">Your AllStar Elite account is ready. You can now distribute music, manage merchandise, and connect with your fans.</p>
          <a href="${process.env.FRONTEND_URL}/pages/dashboard.html" style="display:inline-block;background:linear-gradient(135deg,#F5A623,#D94F1E);color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;margin-top:16px;">Go to Dashboard</a>
        </div>
        <div style="padding:20px 32px;border-top:1px solid #E5E7EB;text-align:center;color:#9CA3AF;font-size:12px;">
          © 2026 AllStar Elite. All rights reserved.
        </div>
      </div>
    `,
  }),

  resetPassword: (name, token) => ({
    subject: 'Reset Your AllStar Elite Password',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E5E7EB;">
        <div style="background:linear-gradient(135deg,#F5A623,#D94F1E);padding:40px 32px;text-align:center;">
          <h1 style="color:#fff;font-size:28px;margin:0;">ALLSTAR ELITE</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#111;margin-top:0;">Password Reset Request</h2>
          <p style="color:#4B5563;line-height:1.7;">Hi ${name}, we received a request to reset your password. Click the button below. This link expires in 1 hour.</p>
          <a href="${process.env.FRONTEND_URL}/pages/reset-password.html?token=${token}" style="display:inline-block;background:linear-gradient(135deg,#F5A623,#D94F1E);color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;margin-top:16px;">Reset Password</a>
          <p style="color:#9CA3AF;font-size:12px;margin-top:20px;">If you did not request this, ignore this email.</p>
        </div>
      </div>
    `,
  }),

  orderConfirm: (name, orderId, items, total) => ({
    subject: `Order Confirmed — #${orderId}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E5E7EB;">
        <div style="background:linear-gradient(135deg,#F5A623,#D94F1E);padding:40px 32px;text-align:center;">
          <h1 style="color:#fff;font-size:28px;margin:0;">Order Confirmed!</h1>
        </div>
        <div style="padding:32px;">
          <p style="color:#4B5563;">Hi ${name}, your order <strong>#${orderId}</strong> has been confirmed.</p>
          <div style="background:#F9FAFB;border-radius:12px;padding:20px;margin:16px 0;">
            ${items.map(i => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #E5E7EB;"><span>${i.name} x${i.qty}</span><span>$${i.price}</span></div>`).join('')}
            <div style="display:flex;justify-content:space-between;padding:12px 0 0;font-weight:700;"><span>Total</span><span>$${total}</span></div>
          </div>
        </div>
      </div>
    `,
  }),
};

module.exports = { sendEmail, templates };
