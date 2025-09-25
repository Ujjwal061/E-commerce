"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductHeroSlider from "@/components/ProductHeroSlider"
import { Filter, Search, ShoppingCart, ArrowRight } from "lucide-react"
import ProductReviews from "@/components/ProductReviews"
import CategorySection from "@/components/CategorySection"
import AdvertisementCarousel from "@/components/AdvertisementCarousel"
import AddToCartButton from "@/components/AddToCartButton"
import { useCart } from "@/hooks/useCart"
import FeaturedBrands from "@/components/FeaturedBrands"

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

const PRODUCTS_LIMIT = 10

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cart } = useCart()

  useEffect(() => {
    // Get category from URL params if present
    const categoryFromUrl = searchParams.get("category")
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
      setIsInitialLoad(false)
    }

    fetchData()
  }, [searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch products
      const productsResponse = await fetch("/api/products")
      if (!productsResponse.ok) {
        throw new Error("Failed to fetch products")
      }
      const productsData = await productsResponse.json()
      setProducts(productsData)

      // Fetch categories
      const categoriesResponse = await fetch("/api/categories")
      if (!categoriesResponse.ok) {
        throw new Error("Failed to fetch categories")
      }
      const categoriesData = await categoriesResponse.json()
      setCategories([{ id: "", name: "All Categories" }, ...categoriesData])

      // Auto-select first category if no category is selected and it's the initial load
      if (isInitialLoad && !searchParams.get("category") && categoriesData.length > 0) {
        const firstCategory = categoriesData[0]
        setSelectedCategory(firstCategory.id)
        // Update URL to reflect the auto-selected category
        router.replace(`/products?category=${firstCategory.id}`)
        setIsInitialLoad(false)
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter products based on search term and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "" || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Get limited products for display (first 10)
  const displayProducts = filteredProducts.slice(0, PRODUCTS_LIMIT)
  const hasMoreProducts = filteredProducts.length > PRODUCTS_LIMIT
  const remainingProductsCount = filteredProducts.length - PRODUCTS_LIMIT

  // Get category name from category ID
  const getCategoryName = (categoryId: string) => {
    if (!categoryId) return "All Categories"
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Unknown Category"
  }

  // Navigate to product details
  const navigateToProduct = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    // Update URL to reflect category selection
    if (categoryId) {
      router.push(`/products?category=${categoryId}`)
    } else {
      router.push("/products")
    }
  }

  // Navigate to category page to see all products
  const navigateToCategoryPage = (categoryId: string) => {
    router.push(`/category/${categoryId}`)
  }

  // Get current category name for display
  const currentCategoryName = getCategoryName(selectedCategory)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Product Hero Slider */}
        <ProductHeroSlider />

        {/* Category-specific Advertisement Carousel */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedCategory ? `${currentCategoryName} Deals` : "Featured Deals"}
            </h2>
            <p className="text-gray-600">
              {selectedCategory 
                ? `Discover amazing offers on ${currentCategoryName.toLowerCase()} products`
                : "Check out our latest offers and promotions"
              }
            </p>
          </div>
          <AdvertisementCarousel category={selectedCategory} />
        </div>

        {/* Featured Brands Section - Show category-specific brands if applicable */}
        <div className="py-8">
          <FeaturedBrands category={selectedCategory} />
        </div>

        {/* Category Section */}
        <div className="py-8">
          <CategorySection />
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Current Category Indicator */}
          {selectedCategory && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    Browsing: {currentCategoryName}
                  </h3>
                  <p className="text-blue-600 text-sm">
                    Showing {Math.min(filteredProducts.length, PRODUCTS_LIMIT)} of {filteredProducts.length} products in this category
                  </p>
                </div>
                <div className="flex gap-2">
                  {hasMoreProducts && (
                    <button
                      onClick={() => navigateToCategoryPage(selectedCategory)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                    >
                      View All {filteredProducts.length} Products
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleCategoryChange("")}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    View All Categories
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${selectedCategory ? currentCategoryName.toLowerCase() : 'products'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Link href="/cart">
                <button className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <span>Cart ({cart.length})</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => {
                const categoryProductCount = products.filter((p) => p.category === category.id).length;
                return (
                  <div key={category.id} className="relative">
                    <button
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {category.name}
                      {category.id && (
                        <span className="ml-2 text-xs">({categoryProductCount})</span>
                      )}
                    </button>
                    {/* Show "View All" indicator if category has more than 10 products */}
                    {category.id && categoryProductCount > PRODUCTS_LIMIT && selectedCategory !== category.id && (
                      <button
                        onClick={() => navigateToCategoryPage(category.id)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        title={`${categoryProductCount} products available - Click to view all`}
                      >
                        +
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
              <p className="mt-2">Please try refreshing the page or contact support if the problem persists.</p>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map((product) => (
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
                        {product.category && (
                          <div className="mb-2">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {getCategoryName(product.category)}
                            </span>
                          </div>
                        )}
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

              {/* Show "View More" button if there are more products */}
              {hasMoreProducts && (
                <div className="mt-8 text-center">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {remainingProductsCount} More Products Available
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {selectedCategory 
                        ? `Discover {remainingProductsCount} more products in ${currentCategoryName}`
                        : `Browse {remainingProductsCount} additional products in our collection`
                      }
                    </p>
                    <button
                      onClick={() => selectedCategory ? navigateToCategoryPage(selectedCategory) : router.push('/all-products')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                      View All {filteredProducts.length} Products
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {displayProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {selectedCategory
                      ? `No products found in ${getCategoryName(selectedCategory)} category.`
                      : "No products found matching your criteria."}
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      handleCategoryChange("")
                    }}
                    className="mt-4 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}

          {/* Category-specific Customer Reviews Section */}
          <div className="mt-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {selectedCategory 
                  ? `${currentCategoryName} Customer Reviews`
                  : "What Our Customers Say"
                }
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {selectedCategory
                  ? `Read reviews from customers who purchased ${currentCategoryName.toLowerCase()} products.`
                  : "Read reviews from our satisfied customers about their shopping experience with us."
                }
              </p>
            </div>
            <ProductReviews />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}