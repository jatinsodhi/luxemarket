const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
// Note: In production, put these in .env
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// Mock Email Service (Same as auth)
const sendOrderConfirmation = async (email, orderId, amount) => {
    console.log(`------------------------------------`);
    console.log(`[EMAIL SENT] To: ${email}`);
    console.log(`Subject: Order Confirmation #${orderId}`);
    console.log(`Body: Thank you for your purchase of $${amount}. Your order is being processed.`);
    console.log(`------------------------------------`);
};

// @route POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: Math.round(amount * 100), // Razorpay accepts amount in smallest currency unit (paise for INR, cents for USD)
            currency: "USD", 
            receipt: "order_rcptid_" + Date.now()
        };

        const order = await razorpay.orders.create(options);
        
        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong with payment init" });
    }
});

// @route POST /api/payment/verify
router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        
        // Use test secret if env not found for demo
        const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';

        const expectedSign = crypto
            .createHmac("sha256", secret)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Signature valid, payment successful
            
            // Send Notification
            if (orderDetails && orderDetails.email) {
                await sendOrderConfirmation(orderDetails.email, razorpay_order_id, 0); // Pass real amount
            }

            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;