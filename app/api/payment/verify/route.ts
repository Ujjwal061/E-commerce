import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification data" }, { status: 400 })
    }

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      })
    } else {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
