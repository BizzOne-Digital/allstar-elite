const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     String,
    price:    Number,
    qty:      Number,
    size:     String,
    color:    String,
    imageUrl: String,
  }],
  shippingAddress: {
    name:    String,
    address: String,
    city:    String,
    state:   String,
    zip:     String,
    country: String,
    phone:   String,
  },
  paymentMethod: { type: String, default: 'stripe' },
  paymentId:     String,
  isPaid:        { type: Boolean, default: false },
  paidAt:        Date,
  subtotal:      Number,
  shipping:      { type: Number, default: 0 },
  tax:           { type: Number, default: 0 },
  total:         Number,
  status:        { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  trackingNumber: String,
  notes:         String,
  createdAt:     { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
