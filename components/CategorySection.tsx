"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

interface Category {
  id: string
  name: string
  image: string
  count?: number
  description: string
}

export default function CategorySection() {
  const [isVisible, setIsVisible] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const itemsPerPage = 4 // Number of categories to show at once

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        console.log("Fetching categories from API...")
        const response = await fetch("/api/categories")

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("API error response:", errorData)
          throw new Error(errorData.message || "Failed to fetch categories")
        }

        const data = await response.json()
        console.log("Categories fetched successfully:", data)

        if (Array.isArray(data) && data.length > 0) {
          setCategories(data)
        } else {
          console.warn("No categories found or invalid data format:", data)
          setError("No categories found")
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Function to count products per category
  const getProductCount = (categoryId: string) => {
    // This would ideally be fetched from the API
    // For now, we'll return a random number between 10 and 50
    return Math.floor(Math.random() * 40) + 10
  }

  // Navigation functions
  const nextSlide = () => {
    if (categories.length <= itemsPerPage) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (categories.length - itemsPerPage + 1))
  }

  const prevSlide = () => {
    if (categories.length <= itemsPerPage) return
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? categories.length - itemsPerPage : prevIndex - 1))
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // Auto-slide functionality
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!isPaused && categories.length > itemsPerPage) {
      intervalRef.current = setInterval(() => {
        nextSlide()
      }, 5000) // Change slide every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPaused, categories.length, currentIndex])

  return (
    <section ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-6">
            <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
            <p className="text-blue-100 max-w-2xl">
              Browse our wide selection of products across different categories to find exactly what you need.
            </p>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
                <p className="mt-2">Please try refreshing the page or contact support if the problem persists.</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No categories found.</p>
              </div>
            ) : (
              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                  >
                    {categories.map((category, index) => (
                      <Link
                        href={`/category/${category.id}`}
                        key={category.id}
                        className="min-w-[25%] px-3 flex-shrink-0"
                      >
                        <div
                          className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                          }`}
                          style={{ transitionDelay: `${index * 150}ms` }}
                        >
                          <div className="relative h-64 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
                            <img
                              src={category.image || "/placeholder.svg?height=400&width=400"}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end p-6 z-20 text-white">
                              <h3 className="text-2xl font-bold mb-1 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                                {category.name}
                              </h3>
                              <p className="text-sm text-white/80 mb-3 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-4">
                                {category.description}
                              </p>
                              <div className="flex justify-between items-center transform transition-transform duration-300 group-hover:translate-y-0 translate-y-6">
                                <span className="text-sm font-medium">
                                  {category.count || getProductCount(category.id)} Products
                                </span>
                                <span className="bg-white/20 p-2 rounded-full group-hover:bg-blue-600 transition-colors">
                                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Navigation controls */}
                {categories.length > itemsPerPage && (
                  <div className="flex justify-center items-center mt-8 space-x-4">
                    <button
                      onClick={prevSlide}
                      className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-900 transition-colors"
                      aria-label="Previous category"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                      onClick={togglePause}
                      className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-900 transition-colors"
                      aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                    >
                      {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                    </button>

                    <button
                      onClick={nextSlide}
                      className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-900 transition-colors"
                      aria-label="Next category"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                )}

                {/* Slide indicators */}
                {categories.length > itemsPerPage && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: categories.length - itemsPerPage + 1 }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          currentIndex === index ? "bg-blue-800 w-6" : "bg-gray-300"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
