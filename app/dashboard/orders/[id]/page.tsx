"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, MapPin, CreditCard, Phone, Mail } from "lucide-react"
import Link from "next/link"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  category?: string
}

interface Order {
  id: string
  userId: string
  createdAt: string
  status: string
  total: number
  subtotal?: number
  tax?: number
  shipping?: number
  items: OrderItem[]
  customer: {
    name: string
    email: string
    phone?: string
    address?: string
  }
  paymentMethod?: string
  paymentDetails?: any
}

export default function OrderDetailsPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !params.id) return

      try {
        const response = await fetch(`/api/orders/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }
        const data = await response.json()

        // Verify this order belongs to the current user
        if (data.userId !== user.id) {
          router.push("/dashboard/orders")
          return
        }

        setOrder(data)
      } catch (error) {
        console.error("Error fetching order:", error)
        router.push("/dashboard/orders")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [user, params.id, router])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-600" />
      case "processing":
        return <Package className="h-5 w-5 text-yellow-600" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTotalItems = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-4">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link href="/dashboard/orders">
          <button className="px-4 py-2 bg-maroon-800 text-white rounded-md hover:bg-maroon-900 transition-colors">
            Back to Orders
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link href="/dashboard/orders">
              <button className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Order #{order.id}</h1>
              <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className={`flex items-center px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-2 font-medium">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{getTotalItems(order.items)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold">₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Delivery Address
            </h3>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{order.customer.name}</p>
              {order.customer.address && <p>{order.customer.address}</p>}
              {order.customer.phone && (
                <p className="flex items-center mt-1">
                  <Phone className="h-3 w-3 mr-1" />
                  {order.customer.phone}
                </p>
              )}
              <p className="flex items-center mt-1">
                <Mail className="h-3 w-3 mr-1" />
                {order.customer.email}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <CreditCard className="h-4 w-4 mr-1" />
              Payment Method
            </h3>
            <p className="text-sm text-gray-600">{order.paymentMethod || "Cash on Delivery"}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Purchased Items</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image || "/placeholder.svg?height=80&width=80&query=product"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  {item.category && <p className="text-sm text-gray-500 mb-1">Category: {item.category}</p>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">Price: ₹{item.price.toLocaleString("en-IN")}</span>
                      <span className="text-gray-600">Quantity: {item.quantity}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-maroon-800">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total Breakdown */}
          <div className="mt-6 pt-6 border-t">
            <div className="max-w-md ml-auto">
              <div className="space-y-2">
                {order.subtotal && (
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {order.tax && order.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{order.tax.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {order.shipping && order.shipping > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{order.shipping.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold mb-4">Need Help?</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Track Order
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Contact Support
          </button>
          {order.status.toLowerCase() === "delivered" && (
            <button className="px-4 py-2 bg-maroon-800 text-white rounded-md hover:bg-maroon-900 transition-colors">
              Leave Review
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
