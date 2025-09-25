"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/contexts/AuthContext"
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import { toast } from "react-hot-toast"

interface CheckoutStep {
  id: number
  title: string
  description: string
}

const steps: CheckoutStep[] = [
  { id: 1, title: "Customer Details", description: "Enter your personal information" },
  { id: 2, title: "Payment", description: "Choose your payment method" },
  { id: 3, title: "Confirmation", description: "Review and confirm your order" },
]

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")

  // Form data
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  })

  const [paymentMethod, setPaymentMethod] = useState("cod")

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.18
  const shipping = subtotal > 1000 ? 0 : 99
  const total = subtotal + tax + shipping

  useEffect(() => {
    // Check if user is authenticated
    // if (!user) {
    //   toast.error("Please sign in to continue")
    //   router.push("/login?redirect=/checkout")
    //   return
    // }

    // Check if cart is empty
    // if (cart.length === 0) {
    //   toast.error("Your cart is empty")
    //   router.push("/cart")
    //   return
    // }

    // Pre-fill user data if available
    if (user) {
      setCustomerData((prev) => ({
        ...prev,
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.zip || "",
      }))
    }
  }, [user, cart, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateStep1 = () => {
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state", "pincode"]
    for (const field of required) {
      if (!customerData[field as keyof typeof customerData]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`)
        return false
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerData.email)) {
      toast.error("Please enter a valid email address")
      return false
    }

    // Validate phone
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(customerData.phone)) {
      toast.error("Please enter a valid 10-digit phone number")
      return false
    }

    // Validate pincode
    const pincodeRegex = /^[0-9]{6}$/
    if (!pincodeRegex.test(customerData.pincode)) {
      toast.error("Please enter a valid 6-digit pincode")
      return false
    }

    return true
  }

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Create order
      const orderData = {
        userId: user?.id,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customer: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone,
          address: `${customerData.address}, ${customerData.city}, ${customerData.state} ${customerData.pincode}`,
          city: customerData.city,
          state: customerData.state,
          zipCode: customerData.pincode,
          country: customerData.country,
        },
        paymentMethod,
        subtotal,
        tax,
        shipping,
        total,
        status: "confirmed",
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        const newOrderId = result.orderId || `ORD${Date.now()}`
        setOrderId(newOrderId)
        setOrderPlaced(true)
        clearCart() // Clear cart after successful order
        toast.success("Order placed successfully!")
      } else {
        throw new Error(result.error || "Failed to place order")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been successfully placed and is being processed.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <span className="font-semibold">Order ID:</span>
                    <p className="text-blue-600 font-mono">{orderId}</p>
                  </div>
                  <div className="text-left">
                    <span className="font-semibold">Total Amount:</span>
                    <p className="text-xl font-bold text-green-600">₹{total.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-left">
                    <span className="font-semibold">Payment Method:</span>
                    <p>{paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
                  </div>
                  <div className="text-left">
                    <span className="font-semibold">Delivery Address:</span>
                    <p>
                      {customerData.address}, {customerData.city}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <Package className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-sm">Order Processing</h3>
                  <p className="text-xs text-gray-600 text-center">Your order is being prepared</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
                  <Truck className="h-8 w-8 text-yellow-600 mb-2" />
                  <h3 className="font-semibold text-sm">Shipping</h3>
                  <p className="text-xs text-gray-600 text-center">Expected delivery in 3-5 days</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                  <Shield className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-semibold text-sm">Secure Payment</h3>
                  <p className="text-xs text-gray-600 text-center">Your payment is protected</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/dashboard/orders")}
                  className="w-full bg-maroon-800 text-white py-3 rounded-lg hover:bg-maroon-900 transition-colors"
                >
                  Track Your Order
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button onClick={() => router.back()} className="mr-4 p-2 hover:bg-gray-200 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.id
                        ? "bg-maroon-800 border-maroon-800 text-white"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? <CheckCircle className="h-6 w-6" /> : step.id}
                  </div>
                  <div className="ml-3 mr-8">
                    <p className={`font-medium ${currentStep >= step.id ? "text-maroon-800" : "text-gray-500"}`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mr-8 ${currentStep > step.id ? "bg-maroon-800" : "bg-gray-300"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Customer Details */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Customer Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={customerData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={customerData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Delivery Address
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address *
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={customerData.address}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="House no, Building, Street, Area"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={customerData.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={customerData.state}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            id="pincode"
                            name="pincode"
                            value={customerData.pincode}
                            onChange={handleInputChange}
                            placeholder="6-digit pincode"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-gray-600">Pay when your order is delivered</div>
                        </div>
                        <div className="text-2xl">💵</div>
                      </label>
                    </div>

                    <div className="border rounded-lg p-4 opacity-50">
                      <label className="flex items-center cursor-not-allowed">
                        <input type="radio" name="paymentMethod" value="online" disabled className="mr-3" />
                        <div className="flex-1">
                          <div className="font-medium">Online Payment</div>
                          <div className="text-sm text-gray-600">Pay securely using UPI, Cards, or Net Banking</div>
                          <div className="text-xs text-orange-600 mt-1">Coming Soon</div>
                        </div>
                        <div className="text-2xl">💳</div>
                      </label>
                    </div>
                  </div>

                  {/* Payment Gateway Integration (Commented Out) */}
                  {/*
                  {paymentMethod === "online" && (
                    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                      <h3 className="font-medium mb-4">Complete Payment</h3>
                      <PaymentGateway
                        amount={total}
                        onSuccess={(paymentId) => {
                          console.log("Payment successful:", paymentId);
                          handlePlaceOrder();
                        }}
                        onError={(error) => {
                          console.error("Payment failed:", error);
                          toast.error("Payment failed. Please try again.");
                        }}
                      />
                    </div>
                  )}
                  */}
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">Order Confirmation</h2>

                  {/* Customer Details Summary */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Customer Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>
                        <strong>Name:</strong> {customerData.firstName} {customerData.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {customerData.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {customerData.phone}
                      </p>
                      <p>
                        <strong>Address:</strong> {customerData.address}, {customerData.city}, {customerData.state}{" "}
                        {customerData.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method Summary */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Payment Method</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image || "/placeholder.svg?height=60&width=60"}
                            alt={item.name}
                            className="w-15 h-15 object-cover rounded mr-4"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                            </p>
                          </div>
                          <div className="font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-maroon-800 text-white py-3 rounded-lg hover:bg-maroon-900 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <Package className="h-5 w-5 mr-2" />
                        Place Order - ₹{total.toLocaleString("en-IN")}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Navigation Buttons */}
              {!orderPlaced && (
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </button>

                  {currentStep < 3 && (
                    <button
                      onClick={handleNextStep}
                      className="flex items-center px-6 py-2 bg-maroon-800 text-white rounded-lg hover:bg-maroon-900"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <img
                        src={item.image || "/placeholder.svg?height=40&width=40"}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      Secure
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      Fast Delivery
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
