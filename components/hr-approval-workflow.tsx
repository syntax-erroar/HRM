"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Eye, Globe, FileText, MessageSquare, Clock, AlertCircle } from "lucide-react"
import { platformService, type JobPostingData } from "@/lib/platform-service"

interface JobRequest {
  id: number
  title: string
  department: string
  status: "approved" | "pending" | "rejected" | "published"
  submittedBy: string
  submittedDate: string
  approvalDate: string | null
  description: string
  jobDescription?: string
  standardMessage?: string
  platforms?: string[]
  salaryRange?: string
  location?: string
  employmentType?: string
  experienceLevel?: string
  publishedDate?: string | null
}

interface HRApprovalWorkflowProps {
  request: JobRequest
  onApprove: (request: JobRequest, comments: string) => void
  onReject: (request: JobRequest, comments: string) => void
  onPublish: (request: JobRequest) => void
  isProcessing?: boolean
}

export function HRApprovalWorkflow({ 
  request, 
  onApprove, 
  onReject, 
  onPublish, 
  isProcessing = false 
}: HRApprovalWorkflowProps) {
  const [comments, setComments] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const handleApprove = () => {
    onApprove(request, comments)
    setComments("")
  }

  const handleReject = () => {
    onReject(request, comments)
    setComments("")
  }

  const handlePublish = async () => {
    if (!request.platforms || request.platforms.length === 0) {
      return
    }

    const jobData: JobPostingData = {
      id: request.id.toString(),
      title: request.title,
      description: request.jobDescription || request.description,
      company: "Your Company", // This should come from company settings
      location: request.location || "Remote",
      salaryRange: request.salaryRange,
      employmentType: request.employmentType || "Full-time",
      experienceLevel: request.experienceLevel || "Mid Level",
      department: request.department,
      platforms: request.platforms,
      socialMessage: request.standardMessage
    }

    // Validate job data
    const validation = platformService.validateJobData(jobData)
    if (!validation.isValid) {
      console.error("Job data validation failed:", validation.errors)
      return
    }

    // Publish to platforms
    const result = await platformService.publishJob(jobData)
    
    if (result.success) {
      onPublish(request)
    } else {
      console.error("Failed to publish job:", result.errors)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "published":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-neutral-100 text-neutral-800"
    }
  }

  const availablePlatforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'indeed', name: 'Indeed', icon: '🔍' },
    { id: 'glassdoor', name: 'Glassdoor', icon: '🏢' },
    { id: 'angel', name: 'AngelList', icon: '👼' },
    { id: 'dice', name: 'Dice', icon: '🎲' },
    { id: 'ziprecruiter', name: 'ZipRecruiter', icon: '📦' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{request.title}</h2>
          <div className="flex items-center gap-4 mt-2">
            <Badge className={getStatusColor(request.status)}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
            <span className="text-sm text-neutral-600">
              Submitted by {request.submittedBy} on {request.submittedDate}
            </span>
          </div>
        </div>
        {request.status === "pending" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              disabled={isProcessing}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <XCircle size={16} className="mr-2" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle size={16} className="mr-2" />
              Approve
            </Button>
          </div>
        )}
        {request.status === "approved" && (
          <Button
            onClick={handlePublish}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Globe size={16} className="mr-2" />
            Publish to Platforms
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="description" className="flex items-center gap-2">
            <FileText size={16} />
            Job Description
          </TabsTrigger>
          <TabsTrigger value="message" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Social Message
          </TabsTrigger>
          <TabsTrigger value="platforms" className="flex items-center gap-2">
            <Globe size={16} />
            Platforms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Job Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Department:</span>
                  <span className="text-sm font-medium text-neutral-900">{request.department}</span>
                </div>
                {request.salaryRange && (
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Salary Range:</span>
                    <span className="text-sm font-medium text-neutral-900">{request.salaryRange}</span>
                  </div>
                )}
                {request.location && (
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Location:</span>
                    <span className="text-sm font-medium text-neutral-900">{request.location}</span>
                  </div>
                )}
                {request.employmentType && (
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Employment Type:</span>
                    <span className="text-sm font-medium text-neutral-900">{request.employmentType}</span>
                  </div>
                )}
                {request.experienceLevel && (
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Experience Level:</span>
                    <span className="text-sm font-medium text-neutral-900">{request.experienceLevel}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 border border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Submitted</p>
                    <p className="text-xs text-neutral-600">{request.submittedDate}</p>
                  </div>
                </div>
                {request.approvalDate && (
                  <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {request.status === "approved" ? "Approved" : "Reviewed"}
                      </p>
                      <p className="text-xs text-neutral-600">{request.approvalDate}</p>
                    </div>
                  </div>
                )}
                {request.publishedDate && (
                  <div className="flex items-center gap-3">
                    <Globe size={16} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Published</p>
                      <p className="text-xs text-neutral-600">{request.publishedDate}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Comments Section */}
          {request.status === "pending" && (
            <Card className="p-6 border border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Review Comments</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="comments" className="text-sm font-medium text-neutral-700">
                    Add comments for the hiring manager (optional)
                  </Label>
                  <Textarea
                    id="comments"
                    placeholder="Add any feedback or requirements for this job posting..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="mt-2 border-neutral-200 min-h-24"
                  />
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="description" className="space-y-6">
          <Card className="p-6 border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Job Description</h3>
            {request.jobDescription ? (
              <div className="bg-neutral-50 p-4 rounded border border-neutral-200">
                <p className="text-sm text-neutral-700 whitespace-pre-wrap">{request.jobDescription}</p>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <FileText size={32} className="mx-auto mb-2" />
                <p>No job description provided</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="message" className="space-y-6">
          <Card className="p-6 border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Social Media Message</h3>
            {request.standardMessage ? (
              <div className="bg-neutral-50 p-4 rounded border border-neutral-200">
                <p className="text-sm text-neutral-700 whitespace-pre-wrap">{request.standardMessage}</p>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <MessageSquare size={32} className="mx-auto mb-2" />
                <p>No social media message provided</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <Card className="p-6 border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Target Platforms</h3>
            {request.platforms && request.platforms.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {request.platforms.map((platformId) => {
                  const platform = availablePlatforms.find(p => p.id === platformId)
                  return platform ? (
                    <div key={platformId} className="flex items-center gap-3 p-3 border border-neutral-200 rounded">
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="font-medium text-neutral-900">{platform.name}</span>
                    </div>
                  ) : null
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <Globe size={32} className="mx-auto mb-2" />
                <p>No platforms selected</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
