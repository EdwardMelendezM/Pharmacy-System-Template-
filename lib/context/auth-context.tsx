/**
 * Authentication Context
 *
 * This context provides authentication state and functions throughout the application.
 */

"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { UserService } from "@/lib/services/user-services"
import type { User } from "@/lib/models/user"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would check with the server
        // For now, we'll check local storage
        const storedUser = localStorage.getItem("user")
        console.log("Current user", storedUser)
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)

          // Fetch fresh user data to ensure permissions are up to date
          const userData = await UserService.getUserById(parsedUser.id)
          if (userData) {
            setUser(userData)
          } else {
            // User no longer exists or is invalid
            localStorage.removeItem("user")
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll use the mock data
      const users = await UserService.getUsers()
      const foundUser = users.find((u) => u.username === username && u.status === "active")

      if (foundUser) {
        // In a real app, we would verify the password here
        // For demo purposes, we'll just accept any password

        // Get full user data with role information
        const userData = await UserService.getUserById(foundUser.id)
        if (userData) {
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
