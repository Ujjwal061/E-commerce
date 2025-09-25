// "use client"

// import { useState, useEffect } from "react"
// import { useSearchParams, useRouter } from "next/navigation"
// import Link from "next/link"
// import Header from "@/components/Header"
// import Footer from "@/components/Footer"
// import { CheckCircle, Package, Star, ShoppingBag, CreditCard } from "lucide-react"
// import { useAuth } from "@/contexts/AuthContext"
// import { useCart } from "@/hooks/useCart"
// import { toast } from "react-hot-toast"

// export default function BuyNowPage() {
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const { user } = useAuth()
//   const { saveOrder, clearCart } = useCart()

//   const [isProcessing, setIsProcessing] = useState(false)
//   const [orderComplete, setOrderComplete] = useState(false)
//   const [orderId, setOrderId] = useState("")
//   const [product, setProduct] = useState<any>(null)

//   useEffect(() => {
//     if (!user) {
//       router.push("/login")
//       return
//     }

//     // Get product details from URL params
//     const productData = {
//       id: searchParams?.get("productId") || "",
//       name: searchParams?.get("name") || "",
//       price: Number(searchParams?.get("price")) || 0,
//       image: searchParams?.get("image") || "",
//     }

//     if (!productData.id || !productData.name) {
//       router.push("/products")
//       return
//     }

//     setProduct(productData)
//   }, [user, searchParams, router])

//   const handlePurchase = async () => {
//     if (!product || !user) return

//     setIsProcessing(true)

//     try {
//       // Simulate payment processing
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       // Create order
//       const orderData = {
//         items: [
//           {
//             id: product.id,
//             name: product.name,
//             price: product.price,
//             image: product.image,
//             quantity: 1,
//           },
//         ],
//         customer: {
//           firstName: user.name?.split(" ")[0] || "Customer",
//           lastName: user.name?.split(" ").slice(1).join(" ") || "",
//           email: user.email,
//           address: "Default Address", // You can enhance this with actual address
//           city: "Default City",
//           state: "Default State",
//           zipCode: "000000",
//           country: "India",
//         },
//         userId: user.id, // Add userId from user object
//         shippingAddress: {
//           address: "Default Address",
//           city: "Default City",
//           state: "Default State",
//           zipCode: "000000",
//           country: "India",
//         },
//         paymentMethod: "buy-now",
//         subtotal: product.price,
//         tax: product.price * 0.18,
//         shipping: 0, // Free shipping for buy now
//         total: product.price + product.price * 0.18,
//         status: "confirmed",
//       }

//       const savedOrder = saveOrder(orderData)
//       setOrderId(savedOrder.id)
//       setOrderComplete(true)

//       toast.success("Purchase completed successfully!")
//     } catch (error) {
//       console.error("Purchase error:", error)
//       toast.error("Purchase failed. Please try again.")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   if (!product) {
//     return (
//       <div className="flex flex-col min-h-screen">
//         <Header />
//         <main className="flex-grow flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maroon-800"></div>
//         </main>
//         <Footer />
//       </div>
//     )
//   }

//   if (orderComplete) {
//     return (
//       <div className="flex flex-col min-h-screen">
//         <Header />
//         <main className="flex-grow bg-gray-50">
//           <div className="container mx-auto px-4 py-12">
//             <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="p-6 bg-green-50 border-b flex items-center justify-center">
//                 <CheckCircle className="h-12 w-12 text-green-500 mr-4" />
//                 <h1 className="text-2xl font-bold text-green-800">Purchase Successful!</h1>
//               </div>

//               <div className="p-6">
//                 <div className="text-center mb-6">
//                   <p className="text-gray-600 mb-2">Thank you for your purchase!</p>
//                   <p className="text-gray-800 font-medium">Your order has been confirmed and is being processed.</p>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                   <div className="flex justify-between mb-2">
//                     <span className="text-gray-600">Order Number:</span>
//                     <span className="font-medium">{orderId}</span>
//                   </div>
//                   <div className="flex justify-between mb-2">
//                     <span className="text-gray-600">Order Date:</span>
//                     <span className="font-medium">{new Date().toLocaleDateString()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Status:</span>
//                     <span className="font-medium text-green-600">Confirmed</span>
//                   </div>
//                 </div>

//                 <div className="border-t border-gray-200 pt-6 mb-6">
//                   <h2 className="text-lg font-semibold mb-4 flex items-center">
//                     <Package className="h-5 w-5 mr-2" />
//                     Product Details
//                   </h2>

//                   <div className="flex items-center p-4 bg-gray-50 rounded-lg">
//                     <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden mr-4">
//                       <img
//                         src={product.image || "/placeholder.svg?height=80&width=80"}
//                         alt={product.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-semibold">{product.name}</h3>
//                       <div className="flex items-center mt-1">
//                         {[...Array(5)].map((_, i) => (
//                           <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
//                         ))}
//                         <span className="text-gray-600 text-sm ml-2">5.0</span>
//                       </div>
//                       <p className="text-sm text-gray-600 mt-1">Quantity: 1</p>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-lg font-bold text-maroon-800">₹{product.price.toLocaleString("en-IN")}</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border-t border-gray-200 pt-4 mb-6">
//                   <div className="flex justify-between py-2">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span>₹{product.price.toLocaleString("en-IN")}</span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-gray-600">Shipping</span>
//                     <span className="text-green-600 font-medium">FREE</span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-gray-600">Tax (18% GST)</span>
//                     <span>₹{(product.price * 0.18).toLocaleString("en-IN")}</span>
//                   </div>
//                   <div className="flex justify-between py-2 font-semibold border-t pt-2">
//                     <span>Total</span>
//                     <span>₹{(product.price + product.price * 0.18).toLocaleString("en-IN")}</span>
//                   </div>
//                 </div>

//                 <div className="bg-blue-50 p-4 rounded-lg mb-6">
//                   <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
//                   <ul className="text-sm text-blue-700 space-y-1">
//                     <li>• You'll receive an order confirmation email shortly</li>
//                     <li>• Your order will be processed within 1-2 business days</li>
//                     <li>• Estimated delivery: 3-5 business days</li>
//                     <li>• Track your order in your account dashboard</li>
//                   </ul>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-4">
//                   <Link href="/products" className="flex-1">
//                     <button className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">
//                       <ShoppingBag className="mr-2 h-4 w-4" />
//                       Continue Shopping
//                     </button>
//                   </Link>
//                   <Link href="/account/orders" className="flex-1">
//                     <button className="w-full inline-flex items-center justify-center px-4 py-2 bg-maroon-800 text-white rounded-md hover:bg-maroon-900 transition-colors">
//                       <Package className="mr-2 h-4 w-4" />
//                       View Orders
//                     </button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <main className="flex-grow bg-gray-50">
//         <div className="container mx-auto px-4 py-12">
//           <div className="max-w-4xl mx-auto">
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
//               <p className="text-gray-600">Review your order and confirm your purchase</p>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Product Details */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-semibold mb-4">Product Details</h2>

//                 <div className="flex items-start space-x-4 mb-6">
//                   <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
//                     <img
//                       src={product.image || "/placeholder.svg?height=128&width=128"}
//                       alt={product.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
//                     <div className="flex items-center mb-2">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
//                       ))}
//                       <span className="text-gray-600 text-sm ml-2">5.0 (24 reviews)</span>
//                     </div>
//                     <div className="text-2xl font-bold text-maroon-800">₹{product.price.toLocaleString("en-IN")}</div>
//                     <p className="text-sm text-gray-600 mt-2">Quantity: 1</p>
//                   </div>
//                 </div>

//                 <div className="border-t pt-4">
//                   <h4 className="font-semibold mb-2">Features:</h4>
//                   <ul className="text-sm text-gray-600 space-y-1">
//                     <li>• Premium quality materials</li>
//                     <li>• 1 year warranty included</li>
//                     <li>• Free shipping and returns</li>
//                     <li>• 24/7 customer support</li>
//                   </ul>
//                 </div>
//               </div>

//               {/* Order Summary */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

//                 <div className="space-y-3 mb-6">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span>₹{product.price.toLocaleString("en-IN")}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Shipping</span>
//                     <span className="text-green-600 font-medium">FREE</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tax (18% GST)</span>
//                     <span>₹{(product.price * 0.18).toLocaleString("en-IN")}</span>
//                   </div>
//                   <div className="border-t pt-3">
//                     <div className="flex justify-between font-semibold text-lg">
//                       <span>Total</span>
//                       <span>₹{(product.price + product.price * 0.18).toLocaleString("en-IN")}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <h4 className="font-semibold mb-2">Delivery Information:</h4>
//                   <div className="text-sm text-gray-600 space-y-1">
//                     <p>• Estimated delivery: 3-5 business days</p>
//                     <p>• Free shipping on this order</p>
//                     <p>• Order tracking will be provided</p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handlePurchase}
//                   disabled={isProcessing}
//                   className="w-full bg-maroon-800 text-white py-3 px-4 rounded-lg hover:bg-maroon-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   {isProcessing ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <CreditCard className="mr-2 h-5 w-5" />
//                       Complete Purchase
//                     </>
//                   )}
//                 </button>

//                 <div className="mt-4 text-center">
//                   <Link href="/products" className="text-maroon-800 hover:underline text-sm">
//                     ← Continue Shopping
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }
