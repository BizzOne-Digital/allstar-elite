const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const { sendEmail, templates } = require('../config/email');

// POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentId } = req.body;
    if (!items?.length) return res.status(400).json({ success: false, message: 'No items in order' });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive)
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      if (product.stock < item.qty)
        return res.status(400).json({ success: false, message: `Insufficient stock: ${product.name}` });

      subtotal += product.price * item.qty;
      orderItems.push({
        product:  product._id,
        name:     product.name,
        price:    product.price,
        qty:      item.qty,
        size:     item.size,
        color:    item.color,
        imageUrl: product.images[0]?.url || '',
      });

      // Decrement stock
      product.stock -= item.qty;
      product.sold  += item.qty;
      await product.save();
    }

    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax      = parseFloat((subtotal * 0.08).toFixed(2));
    const total    = parseFloat((subtotal + shipping + tax).toFixed(2));

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentId,
      isPaid:   !!paymentId,
      paidAt:   paymentId ? new Date() : undefined,
      subtotal, shipping, tax, total,
      status: paymentId ? 'confirmed' : 'pending',
    });

    // Send confirmation email
    const tmpl = templates.orderConfirm(req.user.name, order._id, orderItems, total);
    sendEmail({ to: req.user.email, ...tmpl }).catch(console.error);

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/my
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders — admin all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Order.countDocuments(query);
    res.json({ success: true, orders, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/status — admin update
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
      trackingNumber: req.body.trackingNumber,
    }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
