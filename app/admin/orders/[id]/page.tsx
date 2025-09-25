"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Package, Truck, Check, X, Clock, User, Mail, MapPin, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface Customer {
  name: string
  email: string
  address?: string
  phone?: string
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  customer: Customer
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  paymentDetails?: any
  createdAt: string
  updatedAt: string
}

export default function OrderDetail({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/orders/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }
        const data = await response.json()
        setOrder(data)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")

        // Fallback to mock data
        setOrder({
          id: params.id,
          userId: "user123",
          items: [
            {
              productId: "product1",
              name: "Smartphone X",
              price: 15000,
              quantity: 1,
              image: "/placeholder.svg?height=80&width=80",
            },
            {
              productId: "product2",
              name: "Wireless Earbuds",
              price: 2500,
              quantity: 2,
              image: "/placeholder.svg?height=80&width=80",
            },
          ],
          customer: {
            name: "John Doe",
            email: "john@example.com",
            address: "123 Main St, Mumbai, India",
            phone: "+91 9876543210",
          },
          total: 20000,
          status: "processing",
          paymentMethod: "Credit Card",
          paymentDetails: {
            cardLast4: "4242",
          },
          createdAt: "2023-04-15T10:30:00Z",
          updatedAt: "2023-04-15T10:30:00Z",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  const handleStatusChange = async (newStatus: Order["status"]) => {
    if (!order) return

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      const updatedOrder = await response.json()
      setOrder(updatedOrder)
    } catch (err) {
      console.error("Error updating order status:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <Check className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/admin/orders">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </button>
        </Link>
        <h1 className="text-2xl font-semibold">Order Details</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      ) : order ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h2>
                <div className={`px-3 py-1 rounded-full border ${getStatusColor(order.status)} flex items-center`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-2 font-medium">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between mb-4 text-sm text-gray-500">
                <div className="flex items-center mb-2 md:mb-0">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Placed on: {formatDate(order.createdAt)}</span>
                </div>
                <div>
                  <span>Payment Method: {order.paymentMethod}</span>
                  {order.paymentDetails?.cardLast4 && <span> (Card ending in {order.paymentDetails.cardLast4})</span>}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.image || "/placeholder.svg?height=80&width=80"}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80"
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            ₹{item.price.toFixed(2)} × {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t mt-6 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusChange("pending")}
                  disabled={order.status === "pending" || isSaving}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      : "bg-gray-100 hover:bg-yellow-50 text-gray-800 hover:text-yellow-800"
                  }`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pending
                </button>
                <button
                  onClick={() => handleStatusChange("processing")}
                  disabled={order.status === "processing" || isSaving}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    order.status === "processing"
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-gray-100 hover:bg-blue-50 text-gray-800 hover:text-blue-800"
                  }`}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Processing
                </button>
                <button
                  onClick={() => handleStatusChange("shipped")}
                  disabled={order.status === "shipped" || isSaving}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    order.status === "shipped"
                      ? "bg-purple-100 text-purple-800 border border-purple-300"
                      : "bg-gray-100 hover:bg-purple-50 text-gray-800 hover:text-purple-800"
                  }`}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Shipped
                </button>
                <button
                  onClick={() => handleStatusChange("delivered")}
                  disabled={order.status === "delivered" || isSaving}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-gray-100 hover:bg-green-50 text-gray-800 hover:text-green-800"
                  }`}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Delivered
                </button>
                <button
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={order.status === "cancelled" || isSaving}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    order.status === "cancelled"
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : "bg-gray-100 hover:bg-red-50 text-gray-800 hover:text-red-800"
                  }`}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelled
                </button>
              </div>
              {isSaving && (
                <div className="mt-4 text-sm text-gray-500 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                  Updating order status...
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-900">{order.customer.name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{order.customer.email}</p>
                  </div>
                </div>

                {order.customer.phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900">{order.customer.phone}</p>
                    </div>
                  </div>
                )}

                {order.customer.address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Shipping Address</p>
                      <p className="text-gray-900">{order.customer.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <Link href={`/admin/customers/${order.userId}`}>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    View Customer Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Order not found.</p>
        </div>
      )}
    </div>
  )
}
