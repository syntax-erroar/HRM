"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { CheckCircle, ArrowLeft } from "lucide-react"

const jobPositions = [
  "Investment Analyst",
  "Financial Analyst", 
  "Manager - Accounts",
  "Due Diligence Specialist",
  "Financial Modeling Expert",
  "Senior Accountant",
  "Research Associate",
  "FP&A Analyst",
  "Corporate Development Associate",
  "Investment Research Manager"
]

export default function ApplyPage() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get("job")

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    jobPosition: "",
    experience: "",
    resume: "",
    coverLetter: "",
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (jobId) {
      const jobIndex = Number.parseInt(jobId) - 1
      if (jobIndex >= 0 && jobIndex < jobPositions.length) {
        setFormData((prev) => ({
          ...prev,
          jobPosition: jobPositions[jobIndex],
        }))
      }
    }
  }, [jobId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Application submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        jobPosition: "",
        experience: "",
        resume: "",
        coverLetter: "",
      })
      setSubmitted(false)
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border border-neutral-200">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Application Submitted!</h2>
          <p className="text-neutral-600 mb-6">
            Thank you for applying. We'll review your application and get back to you soon.
          </p>
          <Link href="/jobs">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View More Jobs</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/jobs" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={16} />
          Back to Jobs
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">Apply Now</h1>
          <p className="text-neutral-600">Join our team and grow your career with us</p>
        </div>

        <Card className="p-8 border border-neutral-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-neutral-700 font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="border-neutral-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-neutral-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-neutral-700 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="border-neutral-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobPosition" className="text-neutral-700 font-medium">
                  Position Applying For
                </Label>
                <Select
                  value={formData.jobPosition}
                  onValueChange={(value) => setFormData({ ...formData, jobPosition: value })}
                >
                  <SelectTrigger className="border-neutral-200">
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobPositions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-neutral-700 font-medium">
                Years of Experience
              </Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => setFormData({ ...formData, experience: value })}
              >
                <SelectTrigger className="border-neutral-200">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="2-5">2-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume" className="text-neutral-700 font-medium">
                Resume / CV
              </Label>
              <Textarea
                id="resume"
                placeholder="Paste your resume or CV here..."
                value={formData.resume}
                onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                required
                className="border-neutral-200 min-h-32 font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="text-neutral-700 font-medium">
                Cover Letter
              </Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell us why you're interested in this position..."
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                required
                className="border-neutral-200 min-h-32"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="reset" variant="outline" className="border-neutral-200 bg-transparent">
                Clear
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Submit Application
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
