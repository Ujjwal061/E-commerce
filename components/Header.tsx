"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useCart } from "@/hooks/useCart"
import { ShoppingCart, Menu, X, ChevronDown, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

// Mock categories - in a real app, you would fetch these from your API
const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Home & Kitchen" },
  { id: 4, name: "Books" },
  { id: 5, name: "Beauty" },
  { id: 6, name: "Toys & Games" },
  { id: 7, name: "Sports" },
  { id: 8, name: "Automotive" },
  { id: 9, name: "Health" },
  { id: 10, name: "Grocery" },
]

export default function Header() {
  const { cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const router = useRouter()
  const { user, logout, isAdmin } = useAuth()
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const cartItemsCount = cart?.reduce((total, item) => total + (item.quantity || 0), 0) || 0

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/cart")
  }

  const handleAccountClick = () => {
    if (user) {
      setIsAccountMenuOpen(!isAccountMenuOpen)
    } else {
      router.push("/login")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/products?category=${categoryId}`)
    setIsCategoryDropdownOpen(false)
  }

  const getDashboardLink = () => {
    if (!user) return "/login"
    return isAdmin ? "/admin" : "/dashboard"
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-800">
            ShopEase
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-800 font-medium">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-800 font-medium">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-800 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-800 font-medium">
              Contact
            </Link>
            {/* <Link href="/policies" className="text-gray-700 hover:text-blue-800 font-medium">
              Policies
            </Link> */}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCartClick}
              className="relative text-gray-700 hover:text-maroon-800 cursor-pointer"
              aria-label="View shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-maroon-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Account Menu */}
            <div className="relative">
              {user ? (
                <button
                  onClick={handleAccountClick}
                  className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-blue-800 font-medium"
                >
                  <span>{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/login">
                    <button className="text-gray-700 hover:text-blue-800 font-medium px-3 py-1 rounded border border-gray-300 hover:border-blue-800 transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="bg-blue-800 text-white hover:bg-blue-900 font-medium px-3 py-1 rounded transition-colors">
                      Register
                    </button>
                  </Link>
                </div>
              )}

              {isAccountMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    Signed in as <span className="font-medium">{user.email}</span>
                    {isAdmin && <span className="block text-xs text-blue-600 font-medium">Administrator</span>}
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    {isAdmin ? "Admin Dashboard" : "Dashboard"}
                  </Link>
                  <Link
                    href="/account/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {!isAdmin && (
                    <Link
                      href="/dashboard/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout()
                      setIsAccountMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Search and Category Section - Below Logo */}
        <div className="mt-4 flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-800 focus:border-blue-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-800 text-white px-4 py-2 rounded-r-md hover:bg-blue-900 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Category Dropdown */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="flex items-center justify-between w-full md:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
            >
              <span>Browse by Category</span>
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute z-50 mt-1 w-full md:w-64 bg-white rounded-md shadow-lg py-1 max-h-80 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-800 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-blue-800 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-800 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-800 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/policies"
                className="text-gray-700 hover:text-blue-800 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Policies
              </Link>

              {user ? (
                <>
                  <div className="font-medium text-blue-800 py-1 border-t border-b">
                    {user.name} {isAdmin && "(Admin)"}
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="text-gray-700 hover:text-blue-800 font-medium pl-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {isAdmin ? "Admin Dashboard" : "Dashboard"}
                  </Link>
                  <Link
                    href="/account/profile"
                    className="text-gray-700 hover:text-blue-800 font-medium pl-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/account/orders"
                    className="text-gray-700 hover:text-blue-800 font-medium pl-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {!isAdmin && (
                    <Link
                      href="/dashboard/wishlist"
                      className="text-gray-700 hover:text-blue-800 font-medium pl-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="text-left text-gray-700 hover:text-blue-800 font-medium pl-2"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 border-t pt-4">
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-blue-800 font-medium text-center py-2 border border-gray-300 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-800 text-white hover:bg-blue-900 font-medium text-center py-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}

              <Link
                href="/cart"
                className="text-gray-700 hover:text-maroon-800 font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
