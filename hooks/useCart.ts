"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "react-hot-toast"

export interface CartItem {
  color: any
  size: any
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: Address
  paymentMethod: string
  createdAt: string
}

export interface Address {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
  phone?: string
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useRef(true)
  const { user } = useAuth()
  const userId = user?.id || "guest"
  const initialLoadRef = useRef(false)
  const cartUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load cart from localStorage on component mount
  useEffect(() => {
    console.log("useCart hook initialized")
    isMounted.current = true
    setIsLoading(true)

    const loadCart = async () => {
      if (user && user.id !== "guest") {
        // If user is logged in, try to load cart from database
        await loadCartFromDatabase()
      } else {
        // Otherwise, load from localStorage
        try {
          const savedCart = localStorage.getItem(`cart_${userId}`)
          if (savedCart && isMounted.current) {
            const parsedCart = JSON.parse(savedCart)
            console.log("Loaded cart from localStorage:", parsedCart)
            setCart(parsedCart)
          }
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error)
          toast.error("Error loading your cart")
        }
      }

      setIsLoading(false)
      initialLoadRef.current = true
    }

    loadCart()

    return () => {
      isMounted.current = false
      if (cartUpdateTimeoutRef.current) {
        clearTimeout(cartUpdateTimeoutRef.current)
      }
    }
  }, [userId, user])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isMounted.current && initialLoadRef.current) {
      console.log("Saving cart to localStorage:", cart)
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart))

      // Sync with database if user is logged in
      if (user && user.id !== "guest") {
        if (cartUpdateTimeoutRef.current) {
          clearTimeout(cartUpdateTimeoutRef.current)
        }

        cartUpdateTimeoutRef.current = setTimeout(() => {
          syncCartWithDatabase()
        }, 500)
      }
    }
  }, [cart, userId, user])

  const addToCart = useCallback((product: CartItem) => {
    if (!isMounted.current) return

    console.log("Adding to cart:", product)

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        // If the item already exists in the cart, update its quantity
        console.log("Item exists, updating quantity")
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item,
        )
      } else {
        // Otherwise, add the new item to the cart
        console.log("Adding new item to cart")
        return [...prevCart, product]
      }
    })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (!isMounted.current) return

    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }, [])

  const removeFromCart = useCallback((id: string) => {
    if (!isMounted.current) return

    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    if (!isMounted.current) return

    setCart([])
  }, [])

  const saveOrder = async (order: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      ...order,
      id: `order_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    try {
      // Save to database if user is logged in
      if (user && user.id !== "guest") {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrder),
        })

        if (!response.ok) {
          throw new Error("Failed to save order")
        }

        const data = await response.json()
        return data
      } else {
        // Save to localStorage for guest users
        const ordersJson = localStorage.getItem(`orders_${userId}`) || "[]"
        const orders = JSON.parse(ordersJson)
        orders.push(newOrder)
        localStorage.setItem(`orders_${userId}`, JSON.stringify(orders))
        return newOrder
      }
    } catch (error) {
      console.error("Error saving order:", error)
      toast.error("Error saving your order")
      throw error
    }
  }

  const getOrders = async (): Promise<Order[]> => {
    try {
      // Get from database if user is logged in
      if (user && user.id !== "guest") {
        const response = await fetch(`/api/orders?userId=${user.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        return await response.json()
      } else {
        // Get from localStorage for guest users
        const ordersJson = localStorage.getItem(`orders_${userId}`) || "[]"
        return JSON.parse(ordersJson)
      }
    } catch (error) {
      console.error("Error getting orders:", error)
      toast.error("Error loading your orders")
      return []
    }
  }

  const getOrder = async (orderId: string): Promise<Order | undefined> => {
    try {
      // Get from database if user is logged in
      if (user && user.id !== "guest") {
        const response = await fetch(`/api/orders/${orderId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }
        return await response.json()
      } else {
        // Get from localStorage for guest users
        const orders = await getOrders()
        return orders.find((order) => order.id === orderId)
      }
    } catch (error) {
      console.error("Error getting order:", error)
      toast.error("Error loading order details")
      return undefined
    }
  }

  const syncCartWithDatabase = async () => {
    if (!user || user.id === "guest") return

    try {
      // Make an API call to update the user's cart in the database
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          items: cart,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to sync cart with database")
      }

      console.log("Cart synced with database successfully")
    } catch (error) {
      console.error("Error syncing cart with database:", error)
    }
  }

  const loadCartFromDatabase = async () => {
    if (!user || user.id === "guest") return

    try {
      const response = await fetch(`/api/cart?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.items && Array.isArray(data.items)) {
          console.log("Loaded cart from database:", data.items)
          setCart(data.items)
        }
      } else {
        throw new Error("Failed to load cart from database")
      }
    } catch (error) {
      console.error("Error loading cart from database:", error)
    }
  }

  return {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    saveOrder,
    getOrders,
    getOrder,
    syncCartWithDatabase,
    loadCartFromDatabase,
  }
}
