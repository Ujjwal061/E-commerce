"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
}

interface Product {
  name: string
  description: string
  price: number
  image: string
  stock: number
  category?: string
}

export default function NewProduct() {
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    image: "",
    stock: 0,
    category: "",
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories")
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories")
        }
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")

        // Fallback to localStorage if API fails
        try {
          // Load categories from localStorage
          const storedCategories = localStorage.getItem("categories")
          if (storedCategories) {
            setCategories(JSON.parse(storedCategories))
          }
        } catch (localError) {
          console.error("Error loading from localStorage:", localError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!product.name || !product.description || product.price <= 0) {
      setError("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      // Create product via API
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      // Show success message
      setSuccessMessage("Product created successfully!")

      // Redirect to products page after successful creation
      setTimeout(() => {
        router.push("/admin/products")
      }, 1500)
    } catch (err) {
      console.error("Error creating product:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")

      // Fallback to localStorage if API fails
      try {
        // Get all products from localStorage
        const storedProducts = localStorage.getItem("products")
        const products = storedProducts ? JSON.parse(storedProducts) : []

        // Create a new product with a unique ID
        const newProduct = {
          id: `product-${Date.now()}`,
          ...product,
        }

        // Add to products array
        products.push(newProduct)

        // Save back to localStorage
        localStorage.setItem("products", JSON.stringify(products))

        // Show success message
        setSuccessMessage("Product created successfully (saved to localStorage as fallback)!")

        // Redirect to products page after successful creation
        setTimeout(() => {
          router.push("/admin/products")
        }, 1500)
      } catch (localError) {
        console.error("Error saving to localStorage:", localError)
        setError("Failed to create product. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Add New Product</h1>
        <Link href="/admin/products">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </button>
        </Link>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: Number.parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="stock"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: Number.parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={product.category || ""}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                id="image"
                value={product.image}
                onChange={(e) => setProduct({ ...product, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {product.image && (
                <div className="mt-2 border rounded p-2">
                  <img
                    src={product.image || "/placeholder.svg?height=200&width=200"}
                    alt={product.name}
                    className="h-40 object-contain mx-auto"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=200"
                    }}
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={5}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`${
                isSaving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white px-6 py-2 rounded-lg flex items-center transition-colors`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
