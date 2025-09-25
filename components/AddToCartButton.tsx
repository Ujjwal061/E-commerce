"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Check } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "react-hot-toast"

interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: number
  color?: string
  size?: string
  category?: string
  description?: string
}

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  showQuantitySelector?: boolean
  className?: string
  selectedColor?: string
  selectedSize?: string
}

export default function AddToCartButton({
  product,
  quantity = 1,
  showQuantitySelector = false,
  className = "",
  selectedColor = "",
  selectedSize = "",
}: AddToCartButtonProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(quantity)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart, cart, updateQuantity } = useCart()
  const { user, isAuthenticated } = useAuth()

  // Check if product is already in cart (considering color and size variations)
  const cartItem = cart.find((item) => 
    item.id === product.id && 
    (item.color || "") === selectedColor && 
    (item.size || "") === selectedSize
  )
  const isInCart = !!cartItem

  const handleAddToCart = async () => {
    // Validate product data
    if (!product.id || !product.name || !product.price) {
      toast.error("Invalid product data")
      return
    }

    // Check stock availability
    if (product.stock === 0) {
      toast.error("Product is out of stock")
      return
    }

    // Check if requested quantity exceeds available stock
    const currentCartQuantity = cartItem?.quantity || 0
    const totalQuantity = currentCartQuantity + selectedQuantity
    
    if (totalQuantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`)
      return
    }

    setIsAdding(true)

    try {
      // Prepare cart item with all necessary details
      const newCartItem = {
        id: product.id,
        name: product.name,
        price: Number(product.price), // Ensure price is a number
        image: product.image || "/placeholder.svg", // Fallback image
        quantity: selectedQuantity,
        stock: product.stock,
        color: selectedColor || product.color || "",
        size: selectedSize || product.size || "",
        category: product.category || "",
        description: product.description || ""
      }

      // If item already exists in cart with same variations, update quantity
      if (isInCart && cartItem) {
        const newQuantity = cartItem.quantity + selectedQuantity
        updateQuantity(product.id, newQuantity)
        toast.success(`${product.name} quantity updated in cart!`)
      } else {
        // Add new item to cart
        addToCart(newCartItem)
        toast.success(`${product.name} added to cart!`)
      }

      // Reset quantity selector if shown
      if (showQuantitySelector) {
        setSelectedQuantity(1)
      }

    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add item to cart. Please try again.")
    } finally {
      setIsAdding(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setSelectedQuantity(newQuantity)
    }
  }

  // Handle authentication check
  const handleAuthCheck = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to your cart")
      // You can add redirect logic here if needed
      return false
    }
    return true
  }

  const handleButtonClick = () => {
    if (!handleAuthCheck()) {
      return
    }
    handleAddToCart()
  }

  if (product.stock === 0) {
    return (
      <button
        disabled
        className={`w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed ${className}`}
      >
        Out of Stock
      </button>
    )
  }

  return (
    <div className="space-y-2">
      {showQuantitySelector && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handleQuantityChange(selectedQuantity - 1)}
            disabled={selectedQuantity <= 1}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-3 py-1 border border-gray-300 rounded-md min-w-[3rem] text-center">
            {selectedQuantity}
          </span>
          <button
            onClick={() => handleQuantityChange(selectedQuantity + 1)}
            disabled={selectedQuantity >= product.stock}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      <button
        onClick={handleButtonClick}
        disabled={isAdding || product.stock === 0}
        className={`w-full px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${className}`}
        aria-label={isInCart ? "Add more to cart" : "Add to cart"}
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Adding...
          </>
        ) : isInCart ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Add More ({cartItem?.quantity || 0} in cart)
          </>
        ) : !isAuthenticated ? (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
             Add to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </>
        )}
      </button>

      {/* Stock indicator */}
      {product.stock <= 5 && product.stock > 0 && (
        <p className="text-sm text-orange-600 text-center">
          Only {product.stock} left in stock!
        </p>
      )}
    </div>
  )
}