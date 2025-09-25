import type { ReactNode } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import DashboardSidebar from "@/components/DashboardSidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex flex-col md:flex-row pt-16 md:pt-0">
        <DashboardSidebar />
        <main className="flex-grow p-4 md:p-8 bg-gray-50 w-full md:ml-0 mt-8 md:mt-0">
          <div className="container mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
