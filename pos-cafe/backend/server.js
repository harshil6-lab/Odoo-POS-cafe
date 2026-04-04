import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SZY3Km6Ugac72h',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '71thJRBEQjLKJSoBOmkSV6Ne',
});

app.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert rupees to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    });

    res.json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('Razorpay order creation failed:', err);
    res.status(500).json({ error: err.message || 'Order creation failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
