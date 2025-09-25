"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/AdminHeader"
import { Trash2, Edit, Plus, RefreshCw, AlertCircle, Save, X } from "lucide-react"

interface Category {
  id: string
  name: string
  image: string
  description: string
  count?: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "failed">("checking")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  })

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch("/api/health")
      const result = await response.json()

      if (response.ok && result.status === "connected") {
        setConnectionStatus("connected")
        fetchCategories()
      } else {
        setConnectionStatus("failed")
        setError(`Database connection failed: ${result.error || "Unknown error"}`)
      }
    } catch (err) {
      setConnectionStatus("failed")
      setError(`Connection test failed: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  const fetchCategories = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/categories")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to fetch categories")
      }
      const data = await response.json()
      setCategories(data)
      setConnectionStatus("connected")
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setConnectionStatus("failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert("Category name is required")
      return
    }

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories"
      const method = editingCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to save category")
      }

      const result = await response.json()
      alert(result.message || "Category saved successfully")

      // Reset form
      setFormData({ name: "", description: "", image: "" })
      setShowAddForm(false)
      setEditingCategory(null)

      // Refresh categories
      fetchCategories()
    } catch (err) {
      console.error("Error saving category:", err)
      alert(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to delete category")
      }

      alert("Category deleted successfully")
      fetchCategories()
    } catch (err) {
      console.error("Error deleting category:", err)
      alert(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", image: "" })
    setShowAddForm(false)
    setEditingCategory(null)
  }

  return (
    <div className="p-6">
      <AdminHeader title="Categories" />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Categories</h1>
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
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={checkConnection}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <RefreshCw size={16} />
            Test Connection
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Category
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
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Category Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingCategory ? "Edit Category" : "Add New Category"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter image URL (optional)"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Save size={16} />
                {editingCategory ? "Update Category" : "Create Category"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading categories from MongoDB...</p>
        </div>
      ) : connectionStatus === "failed" ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Cannot connect to MongoDB</p>
            <p className="text-gray-500 mb-4">Unable to load categories from the database.</p>
            <button onClick={checkConnection} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Retry Connection
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    <div className="py-8">
                      <Plus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">No categories found</p>
                      <p className="text-gray-500 mb-4">Start by adding your first category.</p>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Add First Category
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={category.image || "/placeholder.svg?height=50&width=50&query=category"}
                        alt={category.name}
                        className="h-12 w-12 rounded-lg object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=50&width=50"
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {category.description || "No description"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-900">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
