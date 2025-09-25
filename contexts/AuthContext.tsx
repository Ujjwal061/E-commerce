"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  avatar?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
  createdAt?: string
  emailVerified?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  checkAuthAndRedirect: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Failed to parse user from storage", error)
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const checkAuthAndRedirect = (): boolean => {
    if (!user) {
      // Store current page to redirect back after login
      const currentPath = window.location.pathname
      localStorage.setItem("redirectAfterLogin", currentPath)
      router.push("/login")
      return false
    }
    return true
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Login failed")
        return false
      }

      // Store user data in localStorage for client-side access
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)

      // Check for redirect path
      const redirectPath = localStorage.getItem("redirectAfterLogin")
      localStorage.removeItem("redirectAfterLogin")

      // Redirect based on user role or stored path
      if (data.user.role === "admin") {
        toast.success("Admin login successful!")
        router.push("/admin/dashboard")
      } else if (redirectPath && redirectPath !== "/login" && redirectPath !== "/register") {
        toast.success("Login successful!")
        router.push(redirectPath)
      } else {
        toast.success("Login successful!")
        router.push("/dashboard")
      }

      return true
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed. Please try again.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Signup failed")
        return false
      }

      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Check for redirect path
      const redirectPath = localStorage.getItem("redirectAfterLogin")
      localStorage.removeItem("redirectAfterLogin")

      toast.success("Account created successfully! Welcome email sent to your inbox.")

      if (redirectPath && redirectPath !== "/login" && redirectPath !== "/register") {
        router.push(redirectPath)
      } else {
        router.push("/dashboard")
      }

      return true
    } catch (error) {
      console.error("Signup error:", error)
      toast.error("Signup failed. Please try again.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      toast.success("Profile updated successfully!")
      return true
    } catch (error) {
      console.error("Profile update error:", error)
      toast.error("Profile update failed. Please try again.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("redirectAfterLogin")

    // Clear cookies by making a request to a logout endpoint
    fetch("/api/auth/logout", { method: "POST" }).catch((err) => console.error("Error during logout:", err))

    toast.success("Logged out successfully")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        updateProfile,
        checkAuthAndRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
