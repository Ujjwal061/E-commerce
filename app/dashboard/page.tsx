"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { User, Package, ShoppingBag, Heart } from "lucide-react"
import { toast } from "react-hot-toast"
import Link from "next/link"

interface RecentOrder {
  id: string
  total: number
  status: string
  createdAt: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
  }[]
}

export default function DashboardPage() {
  const { user, updateProfile, isLoading } = useAuth()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [country, setCountry] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  })

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Initialize form with user data
        setName(user.name || "")
        setPhone(user.phone || "")
        setStreet(user.address?.street || "")
        setCity(user.address?.city || "")
        setState(user.address?.state || "")
        setZip(user.address?.zip || "")
        setCountry(user.address?.country || "")

        // Fetch user's recent orders
        fetchRecentOrders()
      }
      setIsPageLoading(false)
    }
  }, [user, isLoading])

  const fetchRecentOrders = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/orders?userId=${user.id}&limit=5`)
      if (response.ok) {
        const orders = await response.json()
        setRecentOrders(orders)

        // Calculate order statistics
        const stats = {
          totalOrders: orders.length,
          totalSpent: orders.reduce((sum: number, order: RecentOrder) => sum + order.total, 0),
          pendingOrders: orders.filter((order: RecentOrder) => order.status === "pending").length,
          deliveredOrders: orders.filter((order: RecentOrder) => order.status === "delivered").length,
        }
        setOrderStats(stats)
      }
    } catch (error) {
      console.error("Error fetching recent orders:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const success = await updateProfile({
        name,
        phone,
        address: JSON.stringify({
          street,
          city,
          state,
          zip,
          country,
        }),
      })

      if (success) {
        toast.success("Profile updated successfully")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maroon-800"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Dashboard Overview</h2>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{orderStats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-green-600">₹{orderStats.totalSpent.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-yellow-600">{orderStats.pendingOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-purple-600">{orderStats.deliveredOrders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Purchases</h3>
              <Link href="/dashboard/orders" className="text-maroon-800 hover:text-maroon-900 text-sm font-medium">
                View All Orders →
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{order.total.toLocaleString("en-IN")}</p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={item.image || "/placeholder.svg?height=48&width=48"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-gray-600 text-xs">
                              ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center text-gray-500 text-sm">
                          +{order.items.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No purchases yet</p>
                <Link href="/products" className="text-maroon-800 hover:text-maroon-900 text-sm font-medium">
                  Start Shopping →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">My Profile</h2>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="w-full lg:w-1/3">
              <div className="flex flex-col items-center p-4 md:p-6 bg-gray-50 rounded-lg">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-maroon-100 rounded-full flex items-center justify-center mb-4">
                  <User className="h-10 w-10 md:h-12 md:w-12 text-maroon-800" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-center">{user.name}</h3>
                <p className="text-gray-600 text-center text-sm md:text-base">{user.email}</p>
                <p className="text-gray-600 mt-2 text-center text-sm md:text-base">
                  Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="w-full lg:w-2/3">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                    />
                  </div>

                  <div className="col-span-2 mt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Address Information</h3>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      id="zip"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-maroon-800 text-white rounded-md hover:bg-maroon-900 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
