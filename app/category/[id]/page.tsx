"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Search, ShoppingCart, ArrowLeft } from "lucide-react"
import ProductReviews from "@/components/ProductReviews"
import AdvertisementCarousel from "@/components/AdvertisementCarousel"
import AddToCartButton from "@/components/AddToCartButton"
import { useCart } from "@/hooks/useCart"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
  category?: string
}

interface Category {
  id: string
  name: string
  description: string
  image: string
}

export default function CategoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const { cart } = useCart()
  const categoryId = params.id as string

  useEffect(() => {
    if (categoryId) {
      fetchCategoryData()
    }
  }, [categoryId])

  const fetchCategoryData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch category details
      const categoryResponse = await fetch(`/api/categories/${categoryId}`)
      if (!categoryResponse.ok) {
        throw new Error("Category not found")
      }
      const categoryData = await categoryResponse.json()
      setCategory(categoryData)

      // Fetch all products
      const productsResponse = await fetch("/api/products")
      if (!productsResponse.ok) {
        throw new Error("Failed to fetch products")
      }
      const productsData = await productsResponse.json()

      // Filter products by category
      const categoryProducts = productsData.filter((product: Product) => product.category === categoryId)
      setProducts(categoryProducts)
    } catch (err) {
      console.error("Error fetching category data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Navigate to product details
  const navigateToProduct = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The requested category could not be found."}</p>
            <Link href="/products">
              <button className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors">
                Browse All Products
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
        {/* Hero Banner with Category Info */}
        <div className="bg-blue-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4">
              <button
                onClick={() => router.back()}
                className="flex items-center text-blue-100 hover:text-white mr-4 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
            </div>
            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
            <p className="text-blue-100 max-w-2xl text-lg">
              {category.description || `Explore our ${category.name.toLowerCase()} collection.`}
            </p>
            <div className="mt-4 text-blue-200">
              <span className="text-sm">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
              </span>
            </div>
          </div>
        </div>

        {/* Category Image Banner */}
        {category.image && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
        )}

        {/* Advertisement Carousel */}
        <div className="container mx-auto px-4 py-8">
          <AdvertisementCarousel />
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Navigation */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search in ${category.name}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Link href="/products">
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                  All Products
                </button>
              </Link>
              <Link href="/cart">
                <button className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <span>Cart ({cart.length})</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex mb-8 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href="/products" className="text-blue-600 hover:text-blue-800">
              Products
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">{category.name}</span>
          </nav>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image and Info - Clickable */}
                  <div className="cursor-pointer" onClick={() => navigateToProduct(product.id)}>
                    <img
                      src={product.image || "/placeholder.svg?height=300&width=300"}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold text-blue-800">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-blue-800 hover:underline">View Details</span>
                      </div>
                      <div className="mb-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button - Separate from clickable area */}
                  <div className="px-4 pb-4" onClick={(e) => e.stopPropagation()}>
                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        stock: product.stock,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm ? "No products found" : "No products in this category"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `No products match "${searchTerm}" in ${category.name}.`
                  : `There are currently no products in the ${category.name} category.`}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors mr-4"
                >
                  Clear Search
                </button>
              ) : null}
              <Link href="/products">
                <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Browse All Products
                </button>
              </Link>
            </div>
          )}

          {/* Customer Reviews Section */}
          {filteredProducts.length > 0 && (
            <div className="mt-16 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Read reviews from our satisfied customers about their shopping experience with us.
                </p>
              </div>
              <ProductReviews />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
