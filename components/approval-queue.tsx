"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, FileText, AlertCircle } from "lucide-react"
import { useState } from "react"

interface ApprovalItem {
  id: number
  title: string
  department: string
  submittedBy: string
  submittedDate: string
  priority: "high" | "medium" | "low"
  type: "job_posting" | "offer" | "budget"
}

interface ApprovalQueueProps {
  approvals: ApprovalItem[]
  onViewDetails: (item: ApprovalItem) => void
  onQuickApprove: (item: ApprovalItem) => void
  onQuickReject: (item: ApprovalItem) => void
}

export function ApprovalQueue({ 
  approvals, 
  onViewDetails, 
  onQuickApprove, 
  onQuickReject 
}: ApprovalQueueProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "job_posting":
        return "📋"
      case "offer":
        return "🎯"
      case "budget":
        return "💰"
      default:
        return "📌"
    }
  }

  const urgentApprovals = approvals.filter(item => item.priority === "high")
  const recentApprovals = approvals.slice(0, 5)

  return (
    <Card className="p-6 border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="text-amber-600" size={24} />
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Approval Queue</h3>
            <p className="text-sm text-neutral-600">
              {approvals.length} pending approvals
              {urgentApprovals.length > 0 && (
                <span className="ml-2 text-red-600 font-medium">
                  ({urgentApprovals.length} urgent)
                </span>
              )}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="border-neutral-200">
          View All
        </Button>
      </div>

      {approvals.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto mb-3 text-green-600" size={32} />
          <p className="text-neutral-600">No pending approvals</p>
          <p className="text-sm text-neutral-500 mt-1">All caught up! 🎉</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentApprovals.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg transition-colors ${
                expandedId === item.id 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{getTypeIcon(item.type)}</span>
                    <div>
                      <h4 className="font-semibold text-neutral-900">{item.title}</h4>
                      <p className="text-sm text-neutral-600">
                        {item.department} • {item.submittedBy}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                    </Badge>
                    <span className="text-xs text-neutral-500">{item.submittedDate}</span>
                  </div>

                  {expandedId === item.id && (
                    <div className="mt-3 pt-3 border-t border-neutral-200">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => onQuickApprove(item)}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => onQuickReject(item)}
                        >
                          <XCircle size={14} className="mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-neutral-200"
                          onClick={() => onViewDetails(item)}
                        >
                          <FileText size={14} className="mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {item.priority === "high" && (
                    <AlertCircle className="text-red-500" size={16} />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    {expandedId === item.id ? "Less" : "More"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {approvals.length > 5 && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <Button 
            variant="outline" 
            className="w-full border-neutral-200"
            onClick={() => {/* Navigate to full approvals page */}}
          >
            View {approvals.length - 5} more approvals
          </Button>
        </div>
      )}
    </Card>
  )
}
