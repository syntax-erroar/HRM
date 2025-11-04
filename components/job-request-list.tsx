"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, CheckCircle, Clock, XCircle, Mail, Send, Globe, Eye, FileText, Pause, Ban } from "lucide-react"
import { useState } from "react"

interface JobRequest {
  id: number
  title: string
  department: string
  status: "open" | "onhold" | "closed" | "cancelled"
  submittedBy: string
  submittedDate: string
  approvalDate: string | null
  description: string
  jobDescription?: string
  professionalSummary?: string
  standardMessage?: string
  platforms?: string[]
  salaryRange?: string
  location?: string
  employmentType?: string
  experienceLevel?: string
  publishedDate?: string | null
  cancelledDate?: string | null
  cancelledBy?: string
  cancellationReason?: string
  hiringManager?: string
  hiringManagerEmail?: string
}

interface JobRequestListProps {
  requests: JobRequest[]
  onSendNotification?: (request: JobRequest, type: string) => void
  onCancelRequest?: (request: JobRequest) => void
  isSendingEmail?: boolean
}

const statusConfig = {
  open: {
    icon: CheckCircle,
    color: "bg-blue-50 text-blue-700",
    badge: "bg-blue-100 text-blue-800",
  },
  onhold: {
    icon: Pause,
    color: "bg-yellow-50 text-yellow-700",
    badge: "bg-yellow-100 text-yellow-800",
  },
  closed: {
    icon: CheckCircle,
    color: "bg-green-50 text-green-700",
    badge: "bg-green-100 text-green-800",
  },
  cancelled: {
    icon: Ban,
    color: "bg-red-50 text-red-700",
    badge: "bg-red-100 text-red-800",
  },
}

export function JobRequestList({ requests, onSendNotification, onCancelRequest, isSendingEmail = false }: JobRequestListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <Card className="p-8 text-center border border-neutral-200">
          <p className="text-neutral-500">No job requests yet. Create one to get started.</p>
        </Card>
      ) : (
        requests.map((request) => {
          const config = statusConfig[request.status]
          const StatusIcon = config.icon
          const isExpanded = expandedId === request.id

          return (
            <Card key={request.id} className="border border-neutral-200 overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : request.id)}
                className="w-full p-6 hover:bg-neutral-50 transition-colors text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-neutral-900">{request.title}</h3>
                      <Badge className={config.badge}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <span>{request.department}</span>
                      <span>•</span>
                      <span>Submitted by {request.submittedBy}</span>
                      <span>•</span>
                      <span>{request.submittedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon size={20} className={config.color} />
                    <ChevronDown
                      size={20}
                      className={`text-neutral-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-neutral-200 p-6 bg-neutral-50">
                  <div className="space-y-6">
                    {/* Job Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-700 mb-2">Job Details</h4>
                        <div className="space-y-2">
                          {request.salaryRange && (
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">Salary:</span>
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
                              <span className="text-sm text-neutral-600">Type:</span>
                              <span className="text-sm font-medium text-neutral-900">{request.employmentType}</span>
                            </div>
                          )}
                          {request.experienceLevel && (
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">Experience:</span>
                              <span className="text-sm font-medium text-neutral-900">{request.experienceLevel}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-neutral-700 mb-2">Timeline</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Submitted:</span>
                            <span className="text-sm font-medium text-neutral-900">{request.submittedDate}</span>
                          </div>
                          {request.approvalDate && (
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">Approved:</span>
                              <span className="text-sm font-medium text-neutral-900">{request.approvalDate}</span>
                            </div>
                          )}
                          {request.publishedDate && (
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">Published:</span>
                              <span className="text-sm font-medium text-neutral-900">{request.publishedDate}</span>
                            </div>
                          )}
                          {request.cancelledDate && (
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">Cancelled:</span>
                              <span className="text-sm font-medium text-neutral-900">{request.cancelledDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Job Description */}
                    {request.jobDescription && (
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-700 mb-2">Job Description</h4>
                        <div className="bg-white p-4 rounded border border-neutral-200 max-h-40 overflow-y-auto">
                          <p className="text-sm text-neutral-700 whitespace-pre-wrap">{request.jobDescription}</p>
                        </div>
                      </div>
                    )}

                    {/* Professional Summary */}
                    {request.professionalSummary && (
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-700 mb-2">Professional Summary</h4>
                        <div className="bg-blue-50 p-4 rounded border border-blue-200 max-h-40 overflow-y-auto">
                          <p className="text-sm text-blue-900 whitespace-pre-wrap">{request.professionalSummary}</p>
                        </div>
                      </div>
                    )}

                    {/* Standard Message */}
                    {request.standardMessage && (
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-700 mb-2">Social Media Message</h4>
                        <div className="bg-white p-4 rounded border border-neutral-200 max-h-32 overflow-y-auto">
                          <p className="text-sm text-neutral-700 whitespace-pre-wrap">{request.standardMessage}</p>
                        </div>
                      </div>
                    )}

                    {/* Platforms */}
                    {request.platforms && request.platforms.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-700 mb-2">Target Platforms</h4>
                        <div className="flex flex-wrap gap-2">
                          {request.platforms.map((platform) => (
                            <Badge key={platform} variant="secondary" className="gap-1">
                              <Globe size={12} />
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cancellation Info */}
                    {request.status === "cancelled" && (
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-700 mb-2">Cancellation Details</h4>
                        <div className="bg-red-50 p-4 rounded border border-red-200">
                          {request.cancelledBy && (
                            <p className="text-sm text-neutral-700 mb-1">
                              <span className="font-medium">Cancelled by:</span> {request.cancelledBy}
                            </p>
                          )}
                          {request.cancellationReason && (
                            <p className="text-sm text-neutral-700">
                              <span className="font-medium">Reason:</span> {request.cancellationReason}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {request.status === "cancelled" ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-neutral-600">This position request has been cancelled</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-3">
                            {(request.status === "open" || request.status === "onhold") && onCancelRequest && (
                              <Button 
                                variant="outline" 
                                className="flex-1 border-red-200 bg-red-50 text-red-700"
                                onClick={() => onCancelRequest(request)}
                                disabled={isSendingEmail}
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Cancel Request
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              className="flex-1 border-blue-200 bg-blue-50 text-blue-700"
                              onClick={() => onSendNotification?.(request, 'custom')}
                              disabled={isSendingEmail}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })
      )}
    </div>
  )
}
