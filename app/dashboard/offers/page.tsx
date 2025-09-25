"use client"

import { useOffers } from "@/hooks/useOffers"
import Link from "next/link"
import { Tag, Calendar, Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function OffersPage() {
  const { offers, isLoading } = useOffers()
  const [copiedCodes, setCopiedCodes] = useState<Set<string>>(new Set())

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCodes((prev) => new Set([...prev, code]))
    toast.success("Coupon code copied to clipboard")

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedCodes((prev) => {
        const newSet = new Set(prev)
        newSet.delete(code)
        return newSet
      })
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-gray-50 border-b">
        <h2 className="text-xl font-semibold">Special Offers</h2>
      </div>

      <div className="p-6">
        {offers.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Tag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No offers available</h3>
            <p className="text-gray-600 mb-6">Check back later for special discounts and promotions.</p>
            <Link href="/products">
              <button className="px-6 py-2 bg-maroon-800 text-white rounded-md hover:bg-maroon-900 transition-colors">
                Shop Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-maroon-50 border-b">
                  <h3 className="font-semibold text-lg text-maroon-800">{offer.title}</h3>
                </div>

                <div className="p-4">
                  <p className="text-gray-600 mb-4">{offer.description}</p>

                  <div className="flex items-center mb-3">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      Valid until {new Date(offer.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="font-medium mb-1">Discount:</div>
                    <div className="text-lg font-semibold">
                      {offer.discountType === "percentage" && `${offer.discountValue}% off`}
                      {offer.discountType === "fixed" && `₹${offer.discountValue.toLocaleString("en-IN")} off`}
                      {offer.discountType === "buyOneGetOne" && "Buy One Get One Free"}
                    </div>
                    {offer.minPurchase && (
                      <div className="text-sm text-gray-600 mt-1">
                        Minimum purchase: ₹{offer.minPurchase.toLocaleString("en-IN")}
                      </div>
                    )}
                    {offer.maxDiscount && (
                      <div className="text-sm text-gray-600 mt-1">
                        Maximum discount: ₹{offer.maxDiscount.toLocaleString("en-IN")}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex-1 mr-4">
                      <div className="font-medium mb-1">Coupon Code:</div>
                      <div className="flex items-center">
                        <div className="bg-gray-100 px-3 py-2 rounded border font-mono text-gray-800 flex-1">
                          {offer.code}
                        </div>
                        <button
                          onClick={() => handleCopyCode(offer.code)}
                          className="ml-2 p-2 bg-maroon-100 rounded hover:bg-maroon-200 transition-colors"
                          aria-label="Copy code"
                        >
                          {copiedCodes.has(offer.code) ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <Copy className="h-5 w-5 text-maroon-800" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Link href="/products">
                      <button className="px-4 py-2 bg-maroon-800 text-white rounded-md hover:bg-maroon-900 transition-colors flex items-center">
                        <span>Shop Now</span>
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </button>
                    </Link>
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
