"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Briefcase } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      await login(email, password)
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">Tristone Partners</h1>
          <p className="text-neutral-600 text-lg">Global Outsourcing Advisory Firm</p>
          <p className="text-neutral-500 text-sm mt-1">Investment Research • Due Diligence • Financial Modeling • Accounting Support</p>
        </div>

        {/* Login Form - Centered */}
        <div className="max-w-md mx-auto">
          <Card className="border-neutral-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-white">
              <CardTitle className="text-emerald-900">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access the platform</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="border-neutral-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="border-neutral-300"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-xs font-semibold text-emerald-900 mb-3">Demo Credentials:</p>
                <div className="space-y-2 text-xs text-emerald-800">
                  <div>
                    <p className="font-medium">HR Admin:</p>
                    <p className="text-emerald-700">hradmin@tristone.com / password</p>
                  </div>
                  <div>
                    <p className="font-medium">HR Team:</p>
                    <p className="text-emerald-700">hr@tristone.com / password</p>
                  </div>
                  <div>
                    <p className="font-medium">Hiring Manager:</p>
                    <p className="text-emerald-700">manager@tristone.com / password</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-neutral-600">
          <p>© 2025 Tristone Partners. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
