"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { Package, ChevronRight, ExternalLink, Search, Filter } from "lucide-react"

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
  createdAt: string
  status: string
  total: number
  subtotal?: number
  tax?: number
  shipping?: number
  items: OrderItem[]
  customer?: {
    name: string
    email: string
    phone?: string
    address?: string
  }
  paymentMethod?: string
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/orders?userId=${user.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        const data = await response.json()
        setOrders(data)
        setFilteredOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  useEffect(() => {
    let filtered = [...orders]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "highest":
          return b.total - a.total
        case "lowest":
          return a.total - b.total
        default:
          return 0
      }
    })

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, sortBy])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
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
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-gray-50 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold">My Orders</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-maroon-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-maroon-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{orders.length === 0 ? "No orders yet" : "No orders found"}</h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0
                ? "You haven't placed any orders yet."
                : "Try adjusting your search or filter criteria."}
            </p>
            {orders.length === 0 && (
              <Link href="/products">
                <button className="px-6 py-2 bg-maroon-800 text-white rounded-md hover:bg-maroon-900 transition-colors">
                  Start Shopping
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">Order #{order.id}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{getTotalItems(order.items)} items</span>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-semibold text-lg">₹{order.total.toLocaleString("en-IN")}</span>
                        {order.subtotal && (
                          <div className="text-xs text-gray-500">
                            Subtotal: ₹{order.subtotal.toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <button className="flex items-center text-maroon-800 hover:text-maroon-900 px-3 py-1 border border-maroon-800 rounded-md hover:bg-maroon-50 transition-colors">
                          <span className="mr-1">Details</span>
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-medium mb-3">Purchased Items:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.id}`}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg?height=64&width=64&query=product"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-gray-600 text-sm">₹{item.price.toLocaleString("en-IN")}</p>
                            <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-maroon-800 font-medium text-sm">
                            Total: ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.customer && (
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium text-sm text-gray-700 mb-2">Delivery Information:</h5>
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Name:</strong> {order.customer.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {order.customer.email}
                        </p>
                        {order.customer.phone && (
                          <p>
                            <strong>Phone:</strong> {order.customer.phone}
                          </p>
                        )}
                        {order.customer.address && (
                          <p>
                            <strong>Address:</strong> {order.customer.address}
                          </p>
                        )}
                        {order.paymentMethod && (
                          <p>
                            <strong>Payment:</strong> {order.paymentMethod}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
