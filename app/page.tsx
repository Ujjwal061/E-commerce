"use client"

import { useState, useEffect } from "react"
import { products as mockProducts } from "@/lib/mock-data"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FeaturedProducts from "@/components/FeaturedProducts"
import HeroSection from "@/components/HeroSection"
import CategorySection from "@/components/CategorySection"
import TestimonialSection from "@/components/TestimonialSection"
import OfferSection from "@/components/OfferSection"
import FeaturedBrands from "@/components/FeaturedBrands"
import PopularProductsSection from "@/components/PopularProductsSection"
import FeatureCards from "@/components/FeatureCards"
import Banner from "@/components/Banner"
import AnimatedBanner from "@/components/AnimatedBanner"
import ProductAdvertisements from "@/components/ProductAdvertisements"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [products, setProducts] = useState(mockProducts)

  useEffect(() => {
    // Load products from localStorage if available
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts))
      } catch (error) {
        console.error("Error parsing stored products:", error)
      }
    }

    setIsLoaded(true)
  }, [])

  return (
    <div
      className={`flex flex-col min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"} relative overflow-hidden`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Large circle */}
        <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-blue-500/5 animate-float-slow"></div>

        {/* Medium circles */}
        <div className="absolute top-[20%] -left-[200px] w-[400px] h-[400px] rounded-full bg-blue-600/5 animate-float-medium"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] rounded-full bg-blue-400/5 animate-float-fast"></div>

        {/* Small circles */}
        <div className="absolute top-[40%] left-[10%] w-[150px] h-[150px] rounded-full bg-blue-300/10 animate-pulse"></div>
        <div className="absolute top-[70%] left-[30%] w-[100px] h-[100px] rounded-full bg-blue-700/5 animate-float-medium"></div>
        <div className="absolute top-[30%] right-[20%] w-[200px] h-[200px] rounded-full bg-blue-200/10 animate-float-slow"></div>

        {/* Diagonal lines */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-0 left-[20%] w-[1px] h-[100vh] bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0 animate-float-slow"></div>
          <div className="absolute top-0 left-[40%] w-[1px] h-[100vh] bg-gradient-to-b from-blue-500/0 via-blue-500/30 to-blue-500/0 animate-float-medium"></div>
          <div className="absolute top-0 left-[60%] w-[1px] h-[100vh] bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 animate-float-fast"></div>
          <div className="absolute top-0 left-[80%] w-[1px] h-[100vh] bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 animate-float-medium"></div>
        </div>

        {/* Floating dots */}
        <div className="absolute top-[15%] left-[25%] w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
        <div className="absolute top-[45%] left-[65%] w-3 h-3 rounded-full bg-blue-300 animate-pulse"></div>
        <div className="absolute top-[75%] left-[15%] w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        <div className="absolute top-[25%] left-[85%] w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
        <div className="absolute top-[85%] left-[45%] w-3 h-3 rounded-full bg-blue-200 animate-pulse"></div>
      </div>

      {/* Header */}
      <Header />

      <main className="flex-grow relative z-10">
        <HeroSection />

        {/* Banner section (previously SplitCards) */}
        <Banner isLoading={!isLoaded} />

        {/* Animated Banner */}
        

        {/* Product Advertisements - NEW SECTION */}
        <ProductAdvertisements />

        <div className="px-4 md:px-8 lg:px-12">
          <OfferSection />
          <FeaturedBrands />
          <PopularProductsSection />
          <FeaturedProducts products={products.slice(0, 3)} />
          <CategorySection />
          <FeatureCards />
          <TestimonialSection />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
