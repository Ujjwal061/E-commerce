"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CreditCard, AlertCircle, Check, ArrowLeft } from "lucide-react"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface PaymentGatewayProps {
  paymentMethod: string
  amount: number
  onSuccess: (paymentDetails: any) => void
  onCancel: () => void
  orderDetails?: any
}

export default function PaymentGateway({
  paymentMethod,
  amount,
  onSuccess,
  onCancel,
  orderDetails,
}: PaymentGatewayProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => setRazorpayLoaded(true)
    script.onerror = () => {
      console.error("Failed to load Razorpay script")
      setErrors({ form: "Failed to load payment gateway. Please try again." })
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      setErrors({ form: "Payment gateway is still loading. Please wait." })
      return
    }

    setIsProcessing(true)
    setErrors({})

    try {
      // Create order on backend
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
          receipt: `order_${Date.now()}`,
        }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order")
      }

      const orderData = await orderResponse.json()

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ShopEase",
        description: "Purchase from ShopEase",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed")
            }

            const verifyData = await verifyResponse.json()

            // Payment successful
            const paymentDetails = {
              method: "razorpay",
              paymentId: verifyData.paymentId,
              orderId: verifyData.orderId,
              transactionId: response.razorpay_payment_id,
              status: "completed",
            }

            onSuccess(paymentDetails)
          } catch (error) {
            console.error("Payment verification error:", error)
            setErrors({ form: "Payment verification failed. Please contact support." })
            setIsProcessing(false)
          }
        },
        prefill: {
          name: orderDetails?.customer?.firstName + " " + orderDetails?.customer?.lastName || "",
          email: orderDetails?.customer?.email || "",
          contact: orderDetails?.customer?.phone || "",
        },
        notes: {
          address: orderDetails?.customer?.address || "",
        },
        theme: {
          color: "#1e40af",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Payment error:", error)
      setErrors({ form: "Failed to initiate payment. Please try again." })
      setIsProcessing(false)
    }
  }

  const handleCashOnDelivery = async () => {
    setIsProcessing(true)

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const paymentDetails = {
        method: "cash-on-delivery",
        transactionId: `COD${Date.now()}`,
        status: "pending",
      }

      onSuccess(paymentDetails)
    } catch (error) {
      console.error("COD processing error:", error)
      setErrors({ form: "Failed to process cash on delivery order." })
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "cash-on-delivery") {
      await handleCashOnDelivery()
    } else {
      await handleRazorpayPayment()
    }
  }

  return (
    <div>
      {errors.form && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {paymentMethod === "cash-on-delivery" ? (
          <div className="p-4 bg-gray-50 rounded-md mb-4">
            <h3 className="font-medium mb-2">Cash on Delivery</h3>
            <p className="text-gray-600 mb-2">You will pay when your order is delivered.</p>
            <p className="text-gray-600">Please keep the exact amount ready to ensure a smooth delivery experience.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md mb-4 flex items-center">
              <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">Click "Pay Now" to proceed with secure online payment via Razorpay</span>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Secure Payment</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Credit/Debit Cards</li>
                <li>• Net Banking</li>
                <li>• UPI</li>
                <li>• Digital Wallets</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>

          <button
            type="submit"
            disabled={isProcessing || (paymentMethod !== "cash-on-delivery" && !razorpayLoaded)}
            className="px-6 py-2 bg-maroon-800 text-white rounded-md hover:bg-maroon-900 transition-colors disabled:opacity-50 flex items-center"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {paymentMethod === "cash-on-delivery"
                  ? `Place Order ₹${amount.toLocaleString("en-IN")}`
                  : `Pay Now ₹${amount.toLocaleString("en-IN")}`}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
