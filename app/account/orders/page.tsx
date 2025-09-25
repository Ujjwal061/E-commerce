"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"
import { Package, ChevronRight } from "lucide-react"

// Mock order data
const mockOrders = [
  {
    id: "ORD12345",
    date: "2023-04-15",
    status: "Delivered",
    total: 2499,
    items: [
      { id: 1, name: "Leather Wallet", price: 999, quantity: 1, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Silk Scarf", price: 1500, quantity: 1, image: "/placeholder.svg?height=80&width=80" },
    ],
  },
  {
    id: "ORD12346",
    date: "2023-03-28",
    status: "Processing",
    total: 3999,
    items: [
      { id: 3, name: "Designer Handbag", price: 3999, quantity: 1, image: "/placeholder.svg?height=80&width=80" },
    ],
  },
  {
    id: "ORD12347",
    date: "2023-02-10",
    status: "Delivered",
    total: 5499,
    items: [
      { id: 4, name: "Cashmere Shawl", price: 2999, quantity: 1, image: "/placeholder.svg?height=80&width=80" },
      { id: 5, name: "Leather Belt", price: 1500, quantity: 1, image: "/placeholder.svg?height=80&width=80" },
      { id: 6, name: "Silk Tie", price: 1000, quantity: 1, image: "/placeholder.svg?height=80&width=80" },
    ],
  },
]

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState(mockOrders)

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/account/orders")
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Please log in to view your orders</h2>
            <Link href="/login?redirect=/account/orders">
              <button className="bg-maroon-800 text-white px-6 py-3 rounded-lg hover:bg-maroon-900 transition-colors">
                Login
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="bg-maroon-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4">My Orders</h1>
            <p className="text-maroon-100 max-w-2xl">Track and manage your orders</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center">
            <Link href="/account" className="text-maroon-800 hover:underline">
              Account
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Orders</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
              <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
              <Link href="/products">
                <button className="bg-maroon-800 text-white px-6 py-3 rounded-lg hover:bg-maroon-900 transition-colors">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-gray-50 border-b">
                <h2 className="text-xl font-semibold">Your Orders</h2>
              </div>

              <ul className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <li key={order.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                        <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-600">
                              ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <p className="font-semibold text-lg">Total: ₹{order.total.toLocaleString("en-IN")}</p>
                      <div className="mt-4 sm:mt-0">
                        <Link href={`/account/orders/${order.id}`}>
                          <button className="bg-maroon-800 text-white px-4 py-2 rounded hover:bg-maroon-900 transition-colors">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
