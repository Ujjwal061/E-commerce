"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Default slides if none are found in the database
const defaultSlides = [
  {
    id: "slide1",
    title: "Shop the Latest Trends",
    subtitle:
      "Discover amazing products at unbeatable prices. From electronics to fashion, we've got everything you need.",
    image: "https://placehold.co/800x600/003087/FFFFFF?text=Premium+Electronics",
    cta: "Shop Now",
    link: "/products",
  },
  {
    id: "slide2",
    title: "Summer Collection 2023",
    subtitle: "Beat the heat with our coolest summer essentials. Limited time offers available now!",
    image: "https://placehold.co/800x600/003087/FFFFFF?text=Summer+Collection",
    cta: "View Collection",
    link: "/products?category=clothing",
  },
  {
    id: "slide3",
    title: "Smart Home Devices",
    subtitle: "Transform your living space with cutting-edge smart home technology.",
    image: "https://placehold.co/800x600/003087/FFFFFF?text=Smart+Home",
    cta: "Explore",
    link: "/products?category=electronics",
  },
]

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [slides, setSlides] = useState(defaultSlides)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        console.log("Fetching hero slides from API...")
        const response = await fetch("/api/hero-slides")

        if (!response.ok) {
          throw new Error(`Failed to fetch hero slides: ${response.status}`)
        }

        const data = await response.json()
        console.log("Hero slides fetched:", data)

        if (Array.isArray(data) && data.length > 0) {
          setSlides(data)
          // Store in localStorage as backup
          localStorage.setItem("heroSlides", JSON.stringify(data))
        } else {
          console.log("No hero slides found in API response, using default slides")
          // Try localStorage fallback
          const storedSlides = localStorage.getItem("heroSlides")
          if (storedSlides) {
            setSlides(JSON.parse(storedSlides))
          }
        }
      } catch (err) {
        console.error("Error fetching hero slides:", err)

        // Try localStorage fallback
        try {
          const storedSlides = localStorage.getItem("heroSlides")
          if (storedSlides) {
            setSlides(JSON.parse(storedSlides))
          }
        } catch (localErr) {
          console.error("Error loading from localStorage:", localErr)
        }
      } finally {
        setIsLoaded(true)
      }
    }

    fetchHeroSlides()

    // Auto-rotate slides
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-blue-900 opacity-30 z-0"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600 rounded-full opacity-20 animate-float-slow"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-500 rounded-full opacity-10 animate-float-medium"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-400 rounded-full opacity-10 animate-float-fast"></div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-700 ${
                  activeSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 absolute"
                }`}
                style={{ display: activeSlide === index ? "block" : "none" }}
              >
                <h1
                  className={`text-4xl md:text-5xl font-bold mb-4 transition-transform duration-700 ${
                    isLoaded && activeSlide === index ? "translate-x-0" : "-translate-x-10"
                  }`}
                >
                  {slide.title}
                </h1>
                <p
                  className={`text-xl mb-8 text-blue-100 transition-transform duration-700 delay-100 ${
                    isLoaded && activeSlide === index ? "translate-x-0" : "-translate-x-10"
                  }`}
                >
                  {slide.subtitle}
                </p>
                <div
                  className={`flex flex-col sm:flex-row gap-4 transition-transform duration-700 delay-200 ${
                    isLoaded && activeSlide === index ? "translate-y-0" : "translate-y-10"
                  }`}
                >
                  <Link href={slide.link}>
                    <button className="group bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center">
                      {slide.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href="/about">
                    <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            ))}

            {/* Slide indicators */}
            <div className="flex space-x-2 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeSlide === index ? "bg-white w-6" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="md:w-1/2 relative">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-700 ${
                  activeSlide === index
                    ? "opacity-100 translate-x-0 scale-100"
                    : "opacity-0 translate-x-20 scale-95 absolute"
                }`}
                style={{ display: activeSlide === index ? "block" : "none" }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-transparent rounded-lg"></div>
                  <img
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    className="rounded-lg shadow-2xl transform transition-transform hover:scale-[1.02] duration-500 w-full h-auto"
                  />

                  {/* Floating elements for visual interest */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-lg opacity-80 rotate-12 animate-float-slow"></div>
                  <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-300 rounded-full opacity-80 animate-float-medium"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
