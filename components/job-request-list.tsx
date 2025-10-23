"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, CheckCircle, Clock, XCircle, Mail, Send } from "lucide-react"
import { useState } from "react"

interface JobRequest {
  id: number
  title: string
  department: string
  status: "approved" | "pending" | "rejected"
  submittedBy: string
  submittedDate: string
  approvalDate: string | null
  description: string
}

interface JobRequestListProps {
  requests: JobRequest[]
  onSendNotification?: (request: JobRequest, type: string) => void
  isSendingEmail?: boolean
}

const statusConfig = {
  approved: {
    icon: CheckCircle,
    color: "bg-green-50 text-green-700",
    badge: "bg-green-100 text-green-800",
  },
  pending: {
    icon: Clock,
    color: "bg-amber-50 text-amber-700",
    badge: "bg-amber-100 text-amber-800",
  },
  rejected: {
    icon: XCircle,
    color: "bg-red-50 text-red-700",
    badge: "bg-red-100 text-red-800",
  },
}

export function JobRequestList({ requests, onSendNotification, isSendingEmail = false }: JobRequestListProps) {
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
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">Description</h4>
                      <p className="text-sm text-neutral-600">{request.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wide">Submitted Date</p>
                        <p className="text-sm font-medium text-neutral-900">{request.submittedDate}</p>
                      </div>
                      {request.approvalDate && (
                        <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-wide">
                            {request.status === "approved" ? "Approved" : "Reviewed"} Date
                          </p>
                          <p className="text-sm font-medium text-neutral-900">{request.approvalDate}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-3">
                        {request.status === "pending" && (
                          <>
                            <Button 
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => onSendNotification?.(request, 'approval')}
                              disabled={isSendingEmail}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve & Notify
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 border-red-200 bg-red-50 text-red-700"
                              onClick={() => onSendNotification?.(request, 'rejection')}
                              disabled={isSendingEmail}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject & Notify
                            </Button>
                          </>
                        )}
                        {request.status === "approved" && (
                          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                            Publish Job Posting
                          </Button>
                        )}
                        {request.status === "rejected" && (
                          <Button 
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={() => onSendNotification?.(request, 'reminder')}
                            disabled={isSendingEmail}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Reminder
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-blue-200 bg-blue-50 text-blue-700"
                          onClick={() => onSendNotification?.(request, 'custom')}
                          disabled={isSendingEmail}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Custom Email
                        </Button>
                        {request.status === "pending" && (
                          <Button 
                            variant="outline" 
                            className="flex-1 border-amber-200 bg-amber-50 text-amber-700"
                            onClick={() => onSendNotification?.(request, 'reminder')}
                            disabled={isSendingEmail}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Reminder
                          </Button>
                        )}
                      </div>
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
