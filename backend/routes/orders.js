
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @desc Create new order
// @route POST /api/orders
router.post('/', async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const order = new Order({
    orderItems,
    user,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
router.get('/myorders/:userId', async (req, res) => {
  const orders = await Order.find({ user: req.params.userId });
  res.json(orders);
});

module.exports = router;
