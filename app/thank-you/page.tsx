"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CheckCircle, Package, ArrowRight } from "lucide-react"

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams?.get("orderId") || "Unknown"
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    // Try to get order details from localStorage
    try {
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const foundOrder = savedOrders.find((o: any) => o.id === orderId)
      if (foundOrder) {
        setOrder(foundOrder)
      }
    } catch (error) {
      console.error("Failed to load order:", error)
    }
  }, [orderId])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-green-50 border-b flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-500 mr-4" />
              <h1 className="text-2xl font-bold text-green-800">Order Confirmed!</h1>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
                <p className="text-gray-800 font-medium">Your order has been received and is being processed.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {order && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-600 ml-2">x{item.quantity}</span>
                        </div>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Shipping</span>
                      <span>₹{order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Tax</span>
                      <span>₹{order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-semibold">
                      <span>Total</span>
                      <span>₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center">
                <Link href="/products">
                  <button className="inline-flex items-center px-4 py-2 bg-maroon-800 text-white rounded-md hover:bg-maroon-900">
                    Continue Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
