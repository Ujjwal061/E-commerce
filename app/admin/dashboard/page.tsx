"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { BarChart, Users, ShoppingBag, DollarSign, AlertCircle, RefreshCw } from "lucide-react"

export default function AdminDashboardPage() {
  const { user, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  })
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "failed">("checking")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading) {
      if (!isAdmin) {
        router.push("/login")
        return
      }
      checkDatabaseAndFetchData()
    }
  }, [user, isAdmin, router, isLoading])

  const checkDatabaseAndFetchData = async () => {
    try {
      // Check database connection first
      const healthResponse = await fetch("/api/health")
      const healthResult = await healthResponse.json()

      if (!healthResponse.ok || healthResult.status !== "connected") {
        setConnectionStatus("failed")
        setError(healthResult.error || "Database connection failed")
        setIsPageLoading(false)
        return
      }

      setConnectionStatus("connected")

      // Fetch dashboard data
      const [productsResponse] = await Promise.all([fetch("/api/products")])

      let productCount = 0
      if (productsResponse.ok) {
        const products = await productsResponse.json()
        productCount = products.length
      }

      setStats({
        totalSales: 15680,
        totalOrders: 156,
        totalCustomers: 89,
        totalProducts: productCount,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setConnectionStatus("failed")
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsPageLoading(false)
    }
  }

  const retryConnection = () => {
    setIsPageLoading(true)
    setConnectionStatus("checking")
    setError(null)
    checkDatabaseAndFetchData()
  }

  if (isLoading || isPageLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maroon-800"></div>
          <p className="ml-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || "Admin"}!</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : connectionStatus === "failed"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                MongoDB:{" "}
                {connectionStatus === "connected"
                  ? "Connected"
                  : connectionStatus === "failed"
                    ? "Disconnected"
                    : "Checking..."}
              </span>
            </div>
            <button
              onClick={retryConnection}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {connectionStatus === "failed" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <div>
              <p className="font-semibold">MongoDB Connection Failed</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="p-4 md:p-6">
          <div className="flex items-center">
            <div className="bg-maroon-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
              <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-maroon-800" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total Sales</p>
              <h3 className="text-lg md:text-2xl font-bold">${stats.totalSales.toLocaleString()}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-blue-800" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total Orders</p>
              <h3 className="text-lg md:text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-green-800" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total Customers</p>
              <h3 className="text-lg md:text-2xl font-bold">{stats.totalCustomers}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
              <BarChart className="h-5 w-5 md:h-6 md:w-6 text-purple-800" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total Products</p>
              <h3 className="text-lg md:text-2xl font-bold">{stats.totalProducts}</h3>
              <p className="text-xs text-gray-400">From MongoDB</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3, 4, 5].map((order) => (
              <div key={order} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-sm md:text-base">Order #{order + 1000}</p>
                  <p className="text-xs md:text-sm text-gray-500">Customer: John Doe</p>
                </div>
                <div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Top Products</h2>
          <div className="space-y-3 md:space-y-4">
            {["Smartphone", "Laptop", "Headphones", "Smart Watch", "Tablet"].map((product, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-sm md:text-base">{product}</p>
                  <p className="text-xs md:text-sm text-gray-500">{20 - index * 2} units sold</p>
                </div>
                <div>
                  <span className="text-maroon-800 font-semibold">${(100 - index * 10).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
