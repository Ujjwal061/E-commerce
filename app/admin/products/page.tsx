"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash, Eye, ArrowUpDown, Database, Trash2, AlertCircle, RefreshCw, Filter } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category?: string
  image?: string
}

interface Category {
  id: string
  name: string
  description?: string
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "failed">("checking")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Product>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const { user } = useAuth()

  useEffect(() => {
    checkDatabaseConnection()
  }, [])

  useEffect(() => {
    if (connectionStatus === "connected") {
      fetchCategories()
    }
  }, [connectionStatus])

  useEffect(() => {
    if (connectionStatus === "connected" && categories.length > 0 && selectedCategory === "all") {
      // Set the first category as active when categories are loaded
      const firstCategory = categories[0]
      if (firstCategory) {
        setSelectedCategory(firstCategory.id)
      }
    }
  }, [categories, connectionStatus])

  useEffect(() => {
    if (connectionStatus === "connected" && selectedCategory) {
      fetchProducts()
    }
  }, [selectedCategory, connectionStatus])

  const checkDatabaseConnection = async () => {
    try {
      console.log("Checking database connection...")
      const response = await fetch("/api/health")
      const result = await response.json()

      if (response.ok && result.status === "connected") {
        setConnectionStatus("connected")
        console.log("Database connection successful")
      } else {
        setConnectionStatus("failed")
        setError(`Database connection failed: ${result.error || "Unknown error"}`)
        console.error("Database connection failed:", result)
      }
    } catch (err) {
      setConnectionStatus("failed")
      setError(`Connection test failed: ${err instanceof Error ? err.message : "Unknown error"}`)
      console.error("Connection test failed:", err)
    }
  }

  const fetchCategories = async () => {
    setIsCategoriesLoading(true)
    try {
      console.log("Fetching categories...")
      const response = await fetch("/api/categories")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to fetch categories")
      }

      const data = await response.json()
      console.log("Categories fetched successfully:", data.length, "categories")
      setCategories(data)
      
      // Set first category as selected if no category is selected
      if (data.length > 0 && selectedCategory === "all") {
        setSelectedCategory(data[0].id)
      }
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch categories")
    } finally {
      setIsCategoriesLoading(false)
    }
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Fetching products for category:", selectedCategory)
      let url = "/api/products"
      
      // Add category filter if a specific category is selected
      if (selectedCategory && selectedCategory !== "all") {
        url += `?category=${encodeURIComponent(selectedCategory)}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to fetch products")
      }

      const data = await response.json()
      console.log("Products fetched successfully:", data.length, "products")
      setProducts(data)
      setConnectionStatus("connected")
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setConnectionStatus("failed")
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to delete product")
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
      alert("Product deleted successfully from MongoDB")
    } catch (err) {
      console.error("Error deleting product:", err)
      alert(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  const handleClearDatabase = async () => {
    if (!window.confirm("Are you sure you want to clear ALL data from the database? This action cannot be undone!")) {
      return
    }

    try {
      const response = await fetch("/api/clear-database", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to clear database")
      }

      const result = await response.json()
      alert("Database cleared successfully! All data has been removed.")
      setProducts([])
      setCategories([])
      setSelectedCategory("all")
      fetchCategories()
    } catch (err) {
      console.error("Error clearing database:", err)
      alert(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  const handleSeedDatabase = async () => {
    try {
      const response = await fetch("/api/seed-database", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to seed database")
      }

      const result = await response.json()
      alert(
        `Database seeded successfully! Added ${result.products?.inserted || 0} products and ${result.categories?.inserted || 0} categories.`,
      )
      fetchCategories()
    } catch (err) {
      console.error("Error seeding database:", err)
      alert(err instanceof Error ? err.message : "Error seeding database")
    }
  }

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === "asc" ? -1 : 1
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === "asc" ? 1 : -1
    }
    return 0
  })

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || "All Categories"

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Products Management</h1>
          <div className="flex items-center mt-2">
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
            {selectedCategory !== "all" && (
              <span className="ml-4 text-sm text-blue-600 font-medium">
                Category: {selectedCategoryName}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={checkDatabaseConnection}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Test Connection
          </button>
          <Link href="/admin/products/new">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </button>
          </Link>
          <button
            onClick={handleSeedDatabase}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Database className="h-4 w-4 mr-2" />
            Seed Database
          </button>
          <button
            onClick={handleClearDatabase}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Database
          </button>
        </div>
      </div>

      {connectionStatus === "failed" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <div>
              <p className="font-semibold">MongoDB Connection Failed</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-sm mt-2">
                Please check:
                <br />• MongoDB URI is correct in .env.local
                <br />• MongoDB cluster is running and accessible
                <br />• Network connection is stable
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4 items-center">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            {/* Category Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isCategoriesLoading}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <span className="text-sm text-gray-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found in MongoDB
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-600">Loading products from MongoDB...</p>
          </div>
        ) : connectionStatus === "failed" ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Cannot connect to MongoDB</p>
              <p className="text-gray-500 mb-4">Unable to load products from the database.</p>
              <button
                onClick={checkDatabaseConnection}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Retry Connection
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Product Name
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center">
                      Price
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("stock")}
                  >
                    <div className="flex items-center">
                      Stock
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      <div className="py-8">
                        <Database className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          {selectedCategory === "all" 
                            ? "No products found in MongoDB" 
                            : `No products found in category "${selectedCategoryName}"`
                          }
                        </p>
                        <p className="text-gray-500 mb-4">
                          Start by adding products or seeding the database with sample data.
                        </p>
                        <div className="space-x-2">
                          <Link href="/admin/products/new">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                              Add Product
                            </button>
                          </Link>
                          <button
                            onClick={handleSeedDatabase}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                          >
                            Seed Sample Data
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedProducts.map((product) => {
                    const productCategory = categories.find(cat => cat.id === product.category)
                    return (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={product.image || "/placeholder.svg?height=40&width=40"}
                                alt={product.name}
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40"
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {productCategory?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{product.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.stock > 10
                                ? "bg-green-100 text-green-800"
                                : product.stock > 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/product/${product.id}`}>
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Edit className="h-4 w-4" />
                            </button>
                          </Link>
                          <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                            <Trash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}