"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Heart, Star, Clock, Tag } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/hooks/useCart"
import { toast } from "react-hot-toast"

interface OfferProduct {
  _id: string
  id?: string
  name: string
  description: string
  originalPrice: number
  offerPrice: number
  discount: number
  image: string
  badge: string
  stock: number
  active: boolean
}

export default function OfferSection() {
  const [offers, setOffers] = useState<OfferProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/offers")

      if (response.ok) {
        const data = await response.json()
        if (data.success && Array.isArray(data.offers)) {
          // Filter only active offers
          const activeOffers = data.offers.filter((offer: OfferProduct) => offer.active)
          setOffers(activeOffers.slice(0, 6)) // Show max 6 offers
        }
      }
    } catch (error) {
      console.error("Error fetching offers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (offer: OfferProduct) => {
    if (!user) {
      toast.error("Please sign in to add items to cart")
      router.push("/login")
      return
    }

    addToCart({
      id: offer._id || offer.id || "",
      name: offer.name,
      price: offer.offerPrice,
      image: offer.image,
      quantity: 1,
      color: undefined,
      size: undefined
    })

    toast.success(`${offer.name} added to cart!`)
  }

  const handleBuyNow = (offer: OfferProduct) => {
    if (!user) {
      toast.error("Please sign in to continue")
      router.push("/login")
      return
    }

    const params = new URLSearchParams({
      productId: offer._id || offer.id || "",
      name: offer.name,
      price: offer.offerPrice.toString(),
      image: offer.image,
    })

    router.push(`/checkout?${params.toString()}`)
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (offers.length === 0) {
    return null // Don't show section if no offers
  }

  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4"> Special Offers</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Limited time deals with incredible savings. Don't miss out on these amazing offers!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer._id || offer.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={offer.image || "/placeholder.svg?height=300&width=400"}
                  alt={offer.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    {offer.badge}
                  </span>
                </div>

                {/* Discount Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {offer.discount}% OFF
                  </span>
                </div>

                {/* Quick Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(offer)}
                      className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                    <button
                      className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      title="Add to Wishlist"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{offer.name}</h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{offer.description}</p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm ml-2">(4.8)</span>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-[#003087]">
                      ₹{offer.offerPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{offer.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Save ₹{(offer.originalPrice - offer.offerPrice).toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center mb-4">
                  <Clock className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-gray-600">
                    {offer.stock > 0 ? `${offer.stock} left in stock` : "Out of stock"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBuyNow(offer)}
                    disabled={offer.stock === 0}
                    className="flex-1 bg-[#003087] text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleAddToCart(offer)}
                    disabled={offer.stock === 0}
                    className="flex-1 border border-[#003087] text-[#003087] py-2 px-4 rounded-lg hover:bg-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Offers Button */}
        <div className="text-center mt-12">
          <Link href="/offers">
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
              View All Offers
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
