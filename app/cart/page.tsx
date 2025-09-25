"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/contexts/AuthContext"
import {
  Trash2,
  ArrowLeft,
  Plus,
  Minus,
  CreditCard,
  ShoppingCart,
  ChevronRight,
  Heart,
  AlertCircle,
} from "lucide-react"
import { toast } from "react-hot-toast"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Calculate totals whenever cart changes
  useEffect(() => {
    console.log("Cart page loaded, current cart:", cart)
    const newSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const newTax = newSubtotal * 0.18 // 18% tax
    const newShipping = newSubtotal > 0 ? (newSubtotal > 1000 ? 0 : 99) : 0 // Free shipping over ₹1000
    const newTotal = newSubtotal + newTax + newShipping

    setSubtotal(newSubtotal)
    setTax(newTax)
    setShipping(newShipping)
    setTotal(newTotal)
    setIsLoading(false)
  }, [cart])

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
    toast.success("Cart updated")
  }

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id)
    toast.success(`${name} removed from cart`)
  }

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart()
      toast.success("Cart cleared")
    }
  }

  const handleBuyNow = () => {
    // Check if cart is empty first
    // if (cart.length === 0) {
    //   toast.error("Your cart is empty");
    //   return;
    // }

    // Prepare cart data for buy-now page
    const cartData = {
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || "/placeholder.svg",
        quantity: item.quantity,
        color: item.color || "",
        size: item.size || ""
      })),
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: total
    }

    // Create URL parameters
    const params = new URLSearchParams({
      source: "cart",
      cartData: JSON.stringify(cartData)
    })

    // Redirect to buy-now page
    router.push(`/checkout?${params.toString()}`)
  }

  const handleSaveForLater = (item: any) => {
    // This would typically save to a wishlist
    toast.success(`${item.name} saved for later`)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center text-sm text-gray-500">
              <Link href="/" className="hover:text-maroon-800">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="font-medium text-gray-900">Shopping Cart</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Your Shopping Cart</h1>
          <p className="text-gray-600 mb-8">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>

          {cart.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet. Browse our catalog to find products you'll
                love.
              </p>
              <Link href="/products">
                <button className="bg-maroon-800 text-white px-8 py-3 rounded-lg hover:bg-maroon-900 transition-colors">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cart Actions */}
                <div className="flex justify-between items-center">
                  <Link href="/products">
                    <button className="flex items-center text-maroon-800 hover:text-maroon-900">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </button>
                  </Link>
                  <button onClick={handleClearCart} className="text-red-600 hover:text-red-800 flex items-center">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear Cart
                  </button>
                </div>

                {/* Cart Items */}
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
                  >
                    <div className="p-6 flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <div className="sm:w-32 sm:h-32 mb-4 sm:mb-0 flex-shrink-0">
                        <Link href={`/product/${item.id}`}>
                          <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={item.image || "/placeholder.svg?height=128&width=128"}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="sm:ml-6 flex-grow flex flex-col">
                        <div className="flex justify-between mb-2">
                          <Link href={`/product/${item.id}`}>
                            <h3 className="text-lg font-semibold hover:text-maroon-800">{item.name}</h3>
                          </Link>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveForLater(item)}
                              className="text-gray-500 hover:text-maroon-800"
                              aria-label="Save for later"
                            >
                              <Heart className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id, item.name)}
                              className="text-gray-500 hover:text-red-600"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        {/* Product Attributes */}
                        <div className="text-sm text-gray-600 mb-2">
                          <p>SKU: {item.id.substring(0, 8)}</p>
                          {item.color && <p>Color: {item.color}</p>}
                          {item.size && <p>Size: {item.size}</p>}
                        </div>

                        {/* Price and Quantity */}
                        <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center mb-4 sm:mb-0">
                            <span className="text-gray-700 mr-4">Quantity:</span>
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="px-3 py-1 border-r hover:bg-gray-100"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                                className="w-12 text-center py-1 focus:outline-none"
                                aria-label="Quantity"
                              />
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="px-3 py-1 border-l hover:bg-gray-100"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col items-end">
                            <div className="text-gray-500 text-sm">
                              <span>
                                ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                              </span>
                            </div>
                            <div className="font-semibold text-lg">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="bg-gray-50 px-6 py-3 border-t flex justify-between items-center text-sm">
                      <div className="text-gray-600">
                        <span className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1 text-green-600" />
                          {subtotal > 1000 ? "Eligible for FREE Delivery" : "Free delivery on orders above ₹1,000"}
                        </span>
                      </div>
                      <div className="text-gray-600">Estimated delivery: 3-5 business days</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 border border-gray-200">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Subtotal ({cart.length} {cart.length === 1 ? "item" : "items"})
                      </span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (18% GST)</span>
                      <span>₹{tax.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                        {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
                      </span>
                    </div>

                    {shipping > 0 && (
                      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                        Add ₹{(1000 - subtotal).toLocaleString("en-IN")} more to qualify for FREE shipping
                      </div>
                    )}

                    <div className="border-t pt-4 mt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{total.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">Including all taxes and shipping</p>
                    </div>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    disabled={cart.length === 0}
                    className="w-full bg-maroon-800 text-white py-3 rounded-lg hover:bg-maroon-900 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Buy Now
                  </button>

                  {!user && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                      <Link href="/login?redirect=/cart" className="text-maroon-800 hover:underline">
                        Sign in
                      </Link>{" "}
                      to use your saved payment methods and addresses
                    </div>
                  )}

                  <div className="mt-6 border-t pt-6">
                    <h3 className="font-medium mb-2">We Accept</h3>
                    <div className="flex space-x-2">
                      <div className="w-12 h-8 bg-gray-200 rounded"></div>
                      <div className="w-12 h-8 bg-gray-200 rounded"></div>
                      <div className="w-12 h-8 bg-gray-200 rounded"></div>
                      <div className="w-12 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Recently Viewed */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6 border border-gray-200">
                  <h3 className="font-medium mb-4">Need Help?</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/faq" className="text-maroon-800 hover:underline">
                        Shipping Information
                      </Link>
                    </li>
                    <li>
                      <Link href="/returns" className="text-maroon-800 hover:underline">
                        Returns & Exchanges
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-maroon-800 hover:underline">
                        Contact Customer Service
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}