"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { User, Package, Heart, MapPin, CreditCard, Settings, LogOut } from "lucide-react"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maroon-800"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navItems = [
    { href: "/account", icon: <User className="h-5 w-5" />, label: "My Account" },
    { href: "/account/orders", icon: <Package className="h-5 w-5" />, label: "Orders" },
    { href: "/account/wishlist", icon: <Heart className="h-5 w-5" />, label: "Wishlist" },
    { href: "/account/addresses", icon: <MapPin className="h-5 w-5" />, label: "Addresses" },
    { href: "/account/payment-methods", icon: <CreditCard className="h-5 w-5" />, label: "Payment Methods" },
    { href: "/account/settings", icon: <Settings className="h-5 w-5" />, label: "Account Settings" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="bg-maroon-800 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">My Account</h1>
            <p className="text-maroon-100">Welcome back, {user?.name}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="md:w-1/4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-maroon-800 text-white flex items-center justify-center">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <nav className="p-4">
                  <ul className="space-y-1">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href}>
                          <div
                            className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 ${
                              item.href === router.pathname ? "bg-gray-100 text-maroon-800" : ""
                            }`}
                          >
                            {item.icon}
                            <span className="ml-3">{item.label}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-red-600"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="ml-3">Logout</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:w-3/4">
              <div className="bg-white rounded-lg shadow-md p-6">{children}</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
