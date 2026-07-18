// Usage: node scripts/createAdmin.js <name> <email> <password>
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  const [, , name, email, password] = process.argv;

  if (!name || !email || !password) {
    console.log('Usage: node scripts/createAdmin.js "Admin Name" admin@example.com yourpassword');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    existing.password = password;
    await existing.save();
    console.log(`✅ Existing user "${email}" updated to admin with new password.`);
  } else {
    await User.create({ name, email, password, role: 'admin', isEmailVerified: true });
    console.log(`✅ Admin account created: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
