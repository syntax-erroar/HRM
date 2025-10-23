"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Briefcase, Users, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password || !selectedRole) {
      setError("Please fill in all fields and select a role")
      return
    }

    try {
      await login(email, password, selectedRole)
      router.push("/")
    } catch (err) {
      setError("Login failed. Please try again.")
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Role Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Select Your Role</h2>

            <button
              onClick={() => setSelectedRole("hr")}
              className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                selectedRole === "hr"
                  ? "border-emerald-500 bg-emerald-50 shadow-lg"
                  : "border-neutral-200 bg-white hover:border-emerald-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg ${selectedRole === "hr" ? "bg-emerald-100" : "bg-neutral-100"}`}>
                  <Users className={`w-6 h-6 ${selectedRole === "hr" ? "text-emerald-600" : "text-neutral-600"}`} />
                </div>
                {selectedRole === "hr" && <ArrowRight className="w-5 h-5 text-emerald-600" />}
              </div>
              <div className="font-semibold text-neutral-900">HR Manager</div>
              <div className="text-sm text-neutral-600 mt-1">Full access to all features</div>
            </button>

            <button
              onClick={() => setSelectedRole("hiring_manager")}
              className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                selectedRole === "hiring_manager"
                  ? "border-emerald-500 bg-emerald-50 shadow-lg"
                  : "border-neutral-200 bg-white hover:border-emerald-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`p-3 rounded-lg ${selectedRole === "hiring_manager" ? "bg-emerald-100" : "bg-neutral-100"}`}
                >
                  <Briefcase
                    className={`w-6 h-6 ${selectedRole === "hiring_manager" ? "text-emerald-600" : "text-neutral-600"}`}
                  />
                </div>
                {selectedRole === "hiring_manager" && <ArrowRight className="w-5 h-5 text-emerald-600" />}
              </div>
              <div className="font-semibold text-neutral-900">Hiring Manager</div>
              <div className="text-sm text-neutral-600 mt-1">Manage your requisitions</div>
            </button>
          </div>

          {/* Login Form */}
          <div>
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
                      <p className="font-medium">HR Manager:</p>
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
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-neutral-600">
          <p>© 2025 Tristone Partners. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
