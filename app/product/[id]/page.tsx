"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ArrowLeft, Star, Truck, ShieldCheck, Clock, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { toast } from "react-hot-toast"
import ProductReviews from "@/components/ProductReviews"
import AddToCartButton from "@/components/AddToCartButton"

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
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const { cart, addToCart } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch product
        const productResponse = await fetch(`/api/products/${params.id}`)
        if (!productResponse.ok) {
          if (productResponse.status === 404) {
            throw new Error("Product not found")
          }
          throw new Error("Failed to fetch product")
        }
        const productData = await productResponse.json()
        setProduct(productData)

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories")
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories")
        }
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0 && product && value <= product.stock) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    }

    addToCart(cartItem)
    toast.success(`${product.name} added to cart!`)
  }

  const handleBuyNow = () => {
    if (!product) return

    handleAddToCart()
    router.push("/cart")
  }

  // Get category name from category ID
  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return null
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : categoryId
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error || "Product not found"}</p>
            <p className="mt-2">The product may have been removed or is no longer available.</p>
          </div>
          <Link href="/products">
            <button className="bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const categoryName = getCategoryName(product.category)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-800">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-blue-800">
              Products
            </Link>
            {categoryName && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/products?category=${product.category}`} className="hover:text-blue-800">
                  {categoryName}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-gray-700">{product.name}</span>
          </div>

          {/* Cart Button */}
          <div className="flex justify-end mb-4">
            <Link href="/cart">
              <button className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors">
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>Cart ({cart.length})</span>
              </button>
            </Link>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src={product.image || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                className="w-full h-auto object-contain"
                style={{ maxHeight: "500px" }}
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(4.8) · 24 Reviews</span>
              </div>

              <div className="text-3xl font-bold text-blue-800 mb-6">₹{product.price.toLocaleString("en-IN")}</div>

              <div className="border-t border-b py-4 mb-6">
                <p className="text-gray-700 mb-4">{product.description}</p>

                <div className="flex items-center text-gray-600 mb-2">
                  <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
                  <span>1 Year Warranty</span>
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <Truck className="h-5 w-5 mr-2 text-blue-600" />
                  <span>Free Shipping</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  <span>Delivery within 3-5 business days</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="text-gray-700 mr-4">Quantity:</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="bg-gray-200 px-3 py-1 rounded-l-md"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 text-center border-t border-b py-1"
                    />
                    <button
                      onClick={() => product.stock > quantity && setQuantity(quantity + 1)}
                      className="bg-gray-200 px-3 py-1 rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-4 text-gray-500">
                    {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      stock: product.stock,
                    }}
                  />
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className={`w-full px-6 py-3 rounded-lg transition-colors flex items-center justify-center ${
                      product.stock === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Product Details:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>ID: {product.id}</li>
                  {categoryName && <li>Category: {categoryName}</li>}
                  <li>In Stock: {product.stock} units</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Product Reviews */}
          <div className="mt-12">
            <ProductReviews productId={product.id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
