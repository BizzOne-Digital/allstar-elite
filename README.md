# AllStar Elite — Music Distribution Platform

> "Ain't Nobody Else Like Me"

Full-stack MERN application for independent music distribution, fan monetization, and merchandise.

---

## Project Structure

```
allstar-elite/
├── backend/          Node.js + Express + MongoDB API
│   ├── models/       User, Song, Product, Order, Video
│   ├── routes/       auth, users, songs, products, orders, videos, contact, admin, upload
│   ├── middleware/   auth.js (JWT), error handling
│   └── config/       db.js, cloudinary.js, email.js
│
├── client/           React (Vite) Frontend
│   └── src/
│       ├── components/layout/   Navbar, Footer, Layout
│       ├── components/ui/       Icons, ProtectedRoute
│       ├── context/             AuthContext, CartContext
│       ├── pages/               All pages
│       ├── pages/admin/         AdminPanel
│       └── utils/api.js         Axios with JWT interceptor
│
└── package.json      Root with concurrent dev scripts
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/allstar-elite
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_USER=your_gmail@gmail.com
SMTP_APP_PASSWORD=your_gmail_app_password
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
ADMIN_REGISTRATION_CODE=ALLSTAR2025
NODE_ENV=development
```

### 2. Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PK=pk_live_xxxxxxxxxxxxxxxxxx
```

### 3. Run Both Together

From the project root:
```bash
npm install
npm run dev
```

Or separately:
```bash
# Terminal 1
npm run dev:backend    # runs on port 5000

# Terminal 2
npm run dev:frontend   # runs on port 3000
```

---

## Features

### Artist Features
- Free artist profile with music player
- Upload and manage tracks
- Fan notification system
- Dashboard with streams & earnings
- Settings to update profile

### Subscription Features (Monthly $15/song/month or Yearly $60/song/year)
- Full music distribution to 150+ platforms
- 85% revenue share (15% platform fee)
- Exclusive subscriber video content
- Merchandise shop access
- Priority support

### Merch Shop
- Product grid with search and category filter
- Cart with localStorage persistence
- Add to cart / wishlist
- Order management in dashboard

### Admin Panel (/admin)
- Stats overview (users, songs, orders, revenue)
- Songs management with delete
- Products management with Cloudinary upload
- Orders with status management
- Users list with role and plan info
- Video management

---

## Tech Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Frontend   | React 18, Vite, React Router v6       |
| Styling    | Pure CSS (no Tailwind), CSS variables |
| State      | Context API (Auth + Cart)             |
| HTTP       | Axios with JWT interceptor            |
| Backend    | Node.js, Express.js                   |
| Database   | MongoDB + Mongoose                    |
| Auth       | JWT (jsonwebtoken)                    |
| Storage    | Cloudinary (images + audio)           |
| Email      | Nodemailer + Gmail App Password       |
| Payments   | Stripe (subscriptions + checkout)     |
| Fonts      | Bebas Neue, Rajdhani, Inter           |

---

## Environment Notes

- Never commit `.env` files
- Use Gmail App Password (not your login password) for SMTP
- Cloudinary free tier is sufficient for development
- Admin account: register normally then set `role: 'admin'` in MongoDB, or use the ADMIN_REGISTRATION_CODE if implemented
- Stripe test mode: use `sk_test_` and `pk_test_` keys for development

---

## Deployment

### Backend (Railway / Render / VPS)
1. Set all ENV variables in deployment platform
2. `npm start` runs `node server.js`

### Frontend (Vercel / Netlify)
1. Build: `npm run build` in `/client`
2. Set `VITE_API_URL` to your deployed backend URL
3. For React Router, configure `_redirects` (Netlify) or `vercel.json`

### vercel.json for frontend (if needed)
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

---

Built by BizzOne Digital for AllStar Elite.
