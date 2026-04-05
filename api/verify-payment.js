import crypto from "crypto";

export default async function handler(req, res) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;
  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      razorpay_order_id + "|" + razorpay_payment_id
    )
    .digest("hex");
  if (generatedSignature === razorpay_signature) {
    return res.status(200).json({
      status: "Payment verified successfully",
    });
  }
  return res.status(400).json({
    status: "Payment verification failed",
  });
}
