"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, XCircle, Clock, AlertCircle, Bell } from "lucide-react"

interface ApprovalRequest {
  id: number
  type: "job_posting" | "offer" | "budget" | "candidate_hire"
  title: string
  description: string
  requestedBy: string
  requestedDate: string
  status: "pending" | "approved" | "rejected"
  priority: "low" | "medium" | "high"
  details: Record<string, string>
}

interface Notification {
  id: number
  type: "approval" | "interview" | "application" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

const approvalRequests: ApprovalRequest[] = [
  {
    id: 1,
    type: "job_posting",
    title: "New Job Posting - Senior Developer",
    description: "Approval needed for new Senior Developer position in Engineering",
    requestedBy: "John Smith",
    requestedDate: "Oct 22, 2025",
    status: "pending",
    priority: "high",
    details: {
      department: "Engineering",
      salary: "$150k - $200k",
      location: "San Francisco, CA",
    },
  },
  {
    id: 2,
    type: "offer",
    title: "Job Offer - Alice Johnson",
    description: "Approval needed for job offer to Alice Johnson for Senior Developer position",
    requestedBy: "Sarah Johnson",
    requestedDate: "Oct 21, 2025",
    status: "pending",
    priority: "high",
    details: {
      candidate: "Alice Johnson",
      position: "Senior Developer",
      salary: "$180k",
    },
  },
  {
    id: 3,
    type: "budget",
    title: "Budget Approval - Q4 Hiring",
    description: "Approval needed for Q4 hiring budget allocation",
    requestedBy: "Mike Chen",
    requestedDate: "Oct 20, 2025",
    status: "pending",
    priority: "medium",
    details: {
      amount: "$500,000",
      department: "Engineering",
      period: "Q4 2025",
    },
  },
  {
    id: 4,
    type: "job_posting",
    title: "New Job Posting - UX Designer",
    description: "Approval needed for new UX Designer position in Design",
    requestedBy: "Lisa Anderson",
    requestedDate: "Oct 19, 2025",
    status: "approved",
    priority: "medium",
    details: {
      department: "Design",
      salary: "$100k - $140k",
      location: "Remote",
    },
  },
]

const notifications: Notification[] = [
  {
    id: 1,
    type: "approval",
    title: "New Approval Request",
    message: "Senior Developer job posting requires your approval",
    timestamp: "2 hours ago",
    read: false,
    actionUrl: "/approvals",
  },
  {
    id: 2,
    type: "interview",
    title: "Interview Scheduled",
    message: "Interview scheduled with Alice Johnson for Senior Developer position",
    timestamp: "4 hours ago",
    read: false,
    actionUrl: "/interviews",
  },
  {
    id: 3,
    type: "application",
    title: "New Application",
    message: "Carol Davis applied for UX Designer position",
    timestamp: "1 day ago",
    read: true,
    actionUrl: "/candidates",
  },
  {
    id: 4,
    type: "system",
    title: "System Update",
    message: "HR System maintenance completed successfully",
    timestamp: "2 days ago",
    read: true,
  },
]

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null)

  const filteredRequests = approvalRequests.filter(
    (request) =>
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pendingRequests = filteredRequests.filter((r) => r.status === "pending")
  const approvedRequests = filteredRequests.filter((r) => r.status === "approved")
  const rejectedRequests = filteredRequests.filter((r) => r.status === "rejected")

  const unreadNotifications = notifications.filter((n) => !n.read)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "job_posting":
        return "📋"
      case "offer":
        return "🎯"
      case "budget":
        return "💰"
      case "candidate_hire":
        return "👤"
      default:
        return "📌"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-neutral-100 text-neutral-800"
    }
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">Approvals & Notifications</h1>
            <p className="text-neutral-500 mt-1">Manage approval requests and stay updated</p>
          </div>

          <Tabs defaultValue="approvals" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="approvals" className="flex items-center gap-2">
                <CheckCircle size={16} />
                Approvals
                {pendingRequests.length > 0 && (
                  <Badge className="ml-2 bg-red-100 text-red-800">{pendingRequests.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell size={16} />
                Notifications
                {unreadNotifications.length > 0 && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">{unreadNotifications.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="approvals" className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
                  <Input
                    placeholder="Search approval requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-neutral-200"
                  />
                </div>
              </div>

              <div className="space-y-6">
                {/* Pending Approvals */}
                {pendingRequests.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                      <Clock size={20} className="text-amber-600" />
                      Pending Approvals ({pendingRequests.length})
                    </h3>
                    <div className="space-y-4">
                      {pendingRequests.map((request) => (
                        <Card
                          key={request.id}
                          className="p-6 border border-neutral-200 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{getTypeIcon(request.type)}</span>
                                <div>
                                  <h4 className="text-lg font-bold text-neutral-900">{request.title}</h4>
                                  <p className="text-sm text-neutral-600">{request.description}</p>
                                </div>
                              </div>
                            </div>
                            <Badge className={getPriorityColor(request.priority)}>
                              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-neutral-50 rounded">
                            {Object.entries(request.details).map(([key, value]) => (
                              <div key={key}>
                                <p className="text-xs text-neutral-600 mb-1 capitalize">{key.replace(/_/g, " ")}</p>
                                <p className="text-sm font-semibold text-neutral-900">{value}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                            <span>Requested by {request.requestedBy}</span>
                            <span>{request.requestedDate}</span>
                          </div>

                          <div className="flex gap-3">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2">
                              <CheckCircle size={16} />
                              Approve
                            </Button>
                            <Button variant="outline" className="flex-1 border-neutral-200 bg-transparent gap-2">
                              <XCircle size={16} />
                              Reject
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approved Requests */}
                {approvedRequests.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                      <CheckCircle size={20} className="text-green-600" />
                      Approved ({approvedRequests.length})
                    </h3>
                    <div className="space-y-4">
                      {approvedRequests.map((request) => (
                        <Card key={request.id} className="p-6 border border-green-200 bg-green-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{getTypeIcon(request.type)}</span>
                                <div>
                                  <h4 className="text-lg font-bold text-neutral-900">{request.title}</h4>
                                  <p className="text-sm text-neutral-600">{request.description}</p>
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Approved</Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {filteredRequests.length === 0 && (
                  <Card className="p-8 text-center border border-neutral-200">
                    <AlertCircle size={32} className="mx-auto mb-3 text-neutral-400" />
                    <p className="text-neutral-600">No approval requests found</p>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <Card className="p-8 text-center border border-neutral-200">
                    <Bell size={32} className="mx-auto mb-3 text-neutral-400" />
                    <p className="text-neutral-600">No notifications</p>
                  </Card>
                ) : (
                  notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`p-6 border transition-colors ${
                        notification.read ? "border-neutral-200 bg-neutral-50" : "border-blue-200 bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {notification.type === "approval" && <CheckCircle size={20} className="text-blue-600" />}
                            {notification.type === "interview" && <Clock size={20} className="text-purple-600" />}
                            {notification.type === "application" && (
                              <AlertCircle size={20} className="text-green-600" />
                            )}
                            {notification.type === "system" && <Bell size={20} className="text-neutral-600" />}
                            <h4 className="font-bold text-neutral-900">{notification.title}</h4>
                            {!notification.read && <Badge className="bg-blue-100 text-blue-800 ml-auto">New</Badge>}
                          </div>
                          <p className="text-sm text-neutral-700 mb-2">{notification.message}</p>
                          <p className="text-xs text-neutral-500">{notification.timestamp}</p>
                        </div>
                        {notification.actionUrl && (
                          <Button variant="outline" className="border-neutral-200 bg-transparent ml-4" size="sm">
                            View
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
