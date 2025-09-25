"use client"

import { useState } from "react"
import { useWishlist } from "@/hooks/useWishlist"
import { useCart } from "@/hooks/useCart"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2, ExternalLink } from "lucide-react"
import { toast } from "react-hot-toast"

export default function WishlistPage() {
  const { wishlist, isLoading, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

  const handleRemoveFromWishlist = async (id: string) => {
    setRemovingIds((prev) => new Set(prev).add(id))
    try {
      await removeFromWishlist(id)
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    toast.success(`${product.name} added to cart`)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-gray-50 border-b">
        <h2 className="text-xl font-semibold">My Wishlist</h2>
      </div>

      <div className="p-6">
        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save items you like to your wishlist and they'll appear here.</p>
            <Link href="/products">
              <button className="px-6 py-2 bg-maroon-800 text-white rounded-md hover:bg-maroon-900 transition-colors">
                Explore Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden group">
                <div className="relative">
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg?height=300&width=300"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    disabled={removingIds.has(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    {removingIds.has(product.id) ? (
                      <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="h-5 w-5 text-red-500" />
                    )}
                  </button>
                </div>

                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-medium text-lg mb-1 hover:text-maroon-800 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-2 line-clamp-2">{product.description || "No description available"}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-semibold text-lg">₹{product.price.toLocaleString("en-IN")}</span>
                    <div className="flex space-x-2">
                      <Link href={`/product/${product.id}`}>
                        <button
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                          aria-label="View product details"
                        >
                          <ExternalLink className="h-5 w-5 text-gray-600" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2 bg-maroon-800 rounded-full hover:bg-maroon-900 transition-colors"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
