"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="text-center">
        <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Access Denied</h1>
        <p className="text-neutral-600 mb-6">You don't have permission to access this page.</p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary-dark text-white">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
