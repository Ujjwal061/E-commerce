"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "react-hot-toast"

export interface WishlistItem {
  id: string
  name: string
  price: number
  image?: string
  description?: string
  category?: string
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/wishlist?userId=${user.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
      }
      const data = await response.json()
      setWishlist(data.items || [])
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      toast.error("Failed to load wishlist")
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please login to add items to your wishlist")
      return false
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, productId }),
      })

      if (!response.ok) {
        throw new Error("Failed to add to wishlist")
      }

      const data = await response.json()

      if (data.added) {
        toast.success("Added to wishlist")
        fetchWishlist() // Refresh wishlist
        return true
      } else {
        toast.info("Item already in wishlist")
        return false
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast.error("Failed to add to wishlist")
      return false
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user) return false

    try {
      const response = await fetch(`/api/wishlist?userId=${user.id}&productId=${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist")
      }

      toast.success("Removed from wishlist")
      fetchWishlist() // Refresh wishlist
      return true
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove from wishlist")
      return false
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId)
  }

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist,
  }
}
