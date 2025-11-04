"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MyRequisitionsPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to job-requests page
    // The job-requests page will filter by user if they're a hiring manager
    router.push("/job-requests")
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-neutral-600">Redirecting to your requisitions...</p>
      </div>
    </div>
  )
}
