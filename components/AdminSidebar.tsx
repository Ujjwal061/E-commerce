"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  LogOut,
  Home,
  Database,
  LayoutGrid,
  FolderTree,
  Layers,
  ChevronLeft,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const [isMobile, setIsMobile] = useState(false)
  const [isLaptopCollapsed, setIsLaptopCollapsed] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <FolderTree className="h-5 w-5" />,
    },
    {
      name: "Advertisements",
      path: "/admin/advertisements",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      name: "Product Advertisements",
      path: "/admin/product-advertisements",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      name: "Content",
      path: "/admin/content",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      name: "Homepage",
      path: "/admin/home",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: "Database Migration",
      path: "/admin/migrate",
      icon: <Database className="h-5 w-5" />,
    },
  ]

  const handleLogout = () => {
    logout()
    // Redirect will happen automatically via the auth context
  }

  const handleLinkClick = () => {
    // Close sidebar on link click in mobile view
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const toggleLaptopSidebar = () => {
    setIsLaptopCollapsed(!isLaptopCollapsed)
  }

  // Determine sidebar width and visibility
  // On mobile: controlled by isOpen prop
  // On laptop: controlled by isLaptopCollapsed state
  const sidebarWidth = isMobile ? (isOpen ? "w-64" : "w-0") : isLaptopCollapsed ? "w-16" : "w-64"

  const sidebarTransform = isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"

  // Determine if text should be shown
  const showText = (isMobile && isOpen) || (!isMobile && !isLaptopCollapsed)

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed lg:sticky top-0 bg-gray-800 text-white h-screen z-30 transition-all duration-300 ${sidebarWidth} ${sidebarTransform} overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center h-16">
          <Link href="/admin/dashboard" className="flex items-center">
            <LayoutGrid className="h-8 w-8 mr-2 text-maroon-400 flex-shrink-0" />
            {showText && <h1 className="text-xl font-bold truncate">Admin Panel</h1>}
          </Link>
          {!isMobile && (
            <button
              onClick={toggleLaptopSidebar}
              className="text-white p-1 rounded-full hover:bg-gray-700 focus:outline-none"
              aria-label={isLaptopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={`h-5 w-5 transition-transform ${isLaptopCollapsed ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path} onClick={handleLinkClick}>
                  <div
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path) ? "bg-maroon-700 text-white" : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {showText && <span className="ml-3 truncate">{item.name}</span>}
                    {!showText && <span className="sr-only">{item.name}</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="flex items-center text-gray-300 hover:text-white w-full">
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {showText && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </>
  )
}
