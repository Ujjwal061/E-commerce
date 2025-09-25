"use client"

import { useState, useEffect } from "react"
import type React from "react"
import AdminSidebar from "@/components/AdminSidebar"
import { AdminHeader } from "@/components/AdminHeader"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)

      // Close sidebar automatically when switching to mobile
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false)
      }
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [isSidebarOpen])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 overflow-auto">
          <main className="p-4">{children}</main>
        </div>
      </div>
    </div>
  )
}
