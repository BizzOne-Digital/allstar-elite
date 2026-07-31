const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

// Lazily create the Stripe client so a missing/placeholder key only breaks
// subscription routes, not the whole server, if it isn't configured yet.
let stripeClient = null;
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripeClient) stripeClient = require('stripe')(process.env.STRIPE_SECRET_KEY);
  return stripeClient;
};

// POST /api/subscribe/checkout — create Stripe session
router.post('/checkout', protect, async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) return res.status(503).json({ success: false, message: 'Payments are not configured yet.' });

    const { plan } = req.body; // 'monthly' | 'yearly'
    const priceMap = {
      monthly: { amount: 1500, interval: 'month', label: 'Pro Monthly' },
      yearly:  { amount: 6000, interval: 'year',  label: 'Pro Yearly'  },
    };
    const selected = priceMap[plan];
    if (!selected) return res.status(400).json({ success: false, message: 'Invalid plan' });

    // Get or create Stripe customer
    let customerId = req.user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name:  req.user.name,
        metadata: { userId: req.user.id },
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(req.user.id, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency:    'usd',
          product_data: { name: `AllStar Elite — ${selected.label}` },
          unit_amount:  selected.amount,
          recurring: { interval: selected.interval },
        },
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?subscribed=true`,
      cancel_url:  `${process.env.FRONTEND_URL}/pricing`,
      metadata:    { userId: req.user.id, plan },
    });

    res.json({ success: true, sessionUrl: session.url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/subscribe/webhook — Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = getStripe();
  if (!stripe) return res.status(503).json({ success: false, message: 'Payments are not configured yet.' });

  const sig  = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  const session = event.data.object;

  if (event.type === 'checkout.session.completed') {
    const { userId, plan } = session.metadata;
    const expiry = plan === 'yearly'
      ? new Date(Date.now() + 365 * 24 * 3600000)
      : new Date(Date.now() + 30 * 24 * 3600000);

    await User.findByIdAndUpdate(userId, {
      subscriptionTier:   plan,
      subscriptionStatus: 'active',
      subscriptionExpiry: expiry,
      stripeSubId: session.subscription,
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    const user = await User.findOne({ stripeSubId: session.id });
    if (user) {
      user.subscriptionTier   = 'free';
      user.subscriptionStatus = 'cancelled';
      await user.save();
    }
  }

  res.json({ received: true });
});

// GET /api/subscribe/status
router.get('/status', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('subscriptionTier subscriptionStatus subscriptionExpiry');
  res.json({ success: true, subscription: user });
});

module.exports = router;
