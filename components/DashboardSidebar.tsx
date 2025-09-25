"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, ShoppingCart, Package, Heart, Tag, Settings, ChevronRight, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setIsOpen(!mobile)
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  if (!user) return null

  const navItems = [
    {
      name: "Profile",
      href: "/dashboard",
      icon: User,
      exact: true,
    },
    {
      name: "My Cart",
      href: "/dashboard/cart",
      icon: ShoppingCart,
    },
    {
      name: "My Orders",
      href: "/dashboard/orders",
      icon: Package,
    },
    {
      name: "Wishlist",
      href: "/dashboard/wishlist",
      icon: Heart,
    },
    {
      name: "Offers",
      href: "/dashboard/offers",
      icon: Tag,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-16 left-4 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white rounded-md shadow-md text-gray-700 focus:outline-none"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={`
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
        fixed md:sticky top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] 
        w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 ease-in-out
      `}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">My Account</h2>
          <p className="text-sm text-gray-600">Welcome, {user.name}</p>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100%-5rem)]">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    isActive(item.href, item.exact) ? "bg-maroon-50 text-maroon-800" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                  {isActive(item.href, item.exact) && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
