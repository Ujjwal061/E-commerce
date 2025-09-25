"use client"

import { useState } from "react"
import { Bell, Search, Menu, X } from "lucide-react"
import { useAdminAuth } from "@/hooks/useAdminAuth"

export function AdminHeader({ toggleSidebar, isSidebarOpen }) {
  const { user } = useAdminAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 md:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="ml-2 md:ml-0 text-lg font-semibold text-gray-800 md:text-xl">
            {isSearchOpen ? null : "Admin Dashboard"}
          </div>
        </div>

        <div className={`${isSearchOpen ? "flex-1 mx-2" : "hidden md:flex md:flex-1"} max-w-md ml-4`}>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-maroon-500 focus:border-maroon-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Search className="h-6 w-6" />
            </button>
          )}

          {isSearchOpen && (
            <button onClick={() => setIsSearchOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700">
              Cancel
            </button>
          )}

          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="flex items-center">
            <img
              className="h-8 w-8 rounded-full"
              src="https://placehold.co/32x32/222222/FFFFFF?text=A"
              alt="User avatar"
            />
            <span className="ml-2 text-gray-700 font-medium hidden md:block">{user?.name || "Admin User"}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
