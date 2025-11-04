"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "hr_admin" | "hr_team" | "hiring_manager"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Mock user database - In production, this would be a real database
const mockUserDatabase: Record<string, { id: string; name: string; email: string; role: UserRole; password: string; department?: string }> = {
  "hradmin@tristone.com": {
    id: "user_001",
    name: "Admin User",
    email: "hradmin@tristone.com",
    role: "hr_admin",
    password: "password",
    department: "Human Resources"
  },
  "hr@tristone.com": {
    id: "user_002",
    name: "HR Team Member",
    email: "hr@tristone.com",
    role: "hr_team",
    password: "password",
    department: "Human Resources"
  },
  "manager@tristone.com": {
    id: "user_003",
    name: "Hiring Manager",
    email: "manager@tristone.com",
    role: "hiring_manager",
    password: "password",
    department: "Engineering"
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call - in production, this would validate against a backend
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Look up user in mock database
      const userRecord = mockUserDatabase[email.toLowerCase()]
      
      if (!userRecord) {
        throw new Error("User not found")
      }

      if (userRecord.password !== password) {
        throw new Error("Invalid password")
      }

      // Create user object without password
      const newUser: User = {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        role: userRecord.role,
        department: userRecord.department,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
