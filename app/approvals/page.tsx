"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, Calendar, Building, Mail, Edit, Eye, CheckCircle, XCircle, MapPin, DollarSign, FileText } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { usePositions } from "@/lib/positions-context"
import { Position } from "@/lib/position-types"
import { useToast } from "@/hooks/use-toast"


export default function ApprovalsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { positions, approvePosition, rejectPosition, updatePosition } = usePositions()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Get positions that need approval or have been approved/rejected
  const approvalPositions = useMemo(() => {
    return positions.filter(p => 
      p.status === "pending_approval" || 
      p.status === "approved" || 
      p.status === "rejected"
    )
  }, [positions])

  // Filter based on role - HM only sees pending approvals
  const roleFilteredPositions = user?.role === "hiring_manager" 
    ? approvalPositions.filter(p => 
        p.status === "pending_approval" && 
        p.hiringManagerEmail === user?.email
      )
    : approvalPositions

  // Map approval status for filtering
  const getApprovalStatus = (position: Position): "pending" | "approved" | "rejected" => {
    if (position.approvalStatus === "pending" || position.status === "pending_approval") return "pending"
    if (position.approvalStatus === "approved" || position.status === "approved") return "approved"
    return "rejected"
  }

  // Filter by status
  const statusFilteredPositions = statusFilter === "all" 
    ? roleFilteredPositions
    : roleFilteredPositions.filter(p => getApprovalStatus(p) === statusFilter)

  const filteredPositions = statusFilteredPositions.filter(
    (position) =>
      position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.hiringManager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingApprovals = filteredPositions.filter((p) => getApprovalStatus(p) === "pending")
  const approvedApprovals = filteredPositions.filter((p) => getApprovalStatus(p) === "approved")
  const rejectedApprovals = filteredPositions.filter((p) => getApprovalStatus(p) === "rejected")

  const handleApprove = (id: string, notes?: string) => {
    approvePosition(id, notes)
  }

  const handleReject = (id: string, reason: string) => {
    rejectPosition(id, reason)
  }

  const handleSendReminder = (position: Position) => {
    // TODO: Implement actual email sending
    toast({
      title: "Reminder Sent",
      description: `Reminder email sent to ${position.hiringManager}`
    })
  }

  const handleEdit = (position: Position) => {
    setSelectedPosition(position)
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const handleUpdate = (updates: Partial<Position>) => {
    if (selectedPosition) {
      updatePosition(selectedPosition.id, updates)
      toast({
        title: "Updated",
        description: "Position details updated successfully"
      })
    }
  }

  const handleView = (position: Position) => {
    setSelectedPosition(position)
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  const getStatusBadge = (position: Position) => {
    const status = getApprovalStatus(position)
    const config = {
      pending: { label: "Pending Approval", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Approved", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-800" }
    }
    const statusConfig = config[status]
    return <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
  }

  const isHRRole = user?.role === "hr_admin" || user?.role === "hr_team"
  const isHiringManager = user?.role === "hiring_manager"
  const canEdit = user?.role === "hr_admin" || user?.role === "hiring_manager"

  const getCountByStatus = (status: "pending" | "approved" | "rejected") => {
    return roleFilteredPositions.filter(p => getApprovalStatus(p) === status).length
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">Approvals</h1>
                <p className="text-neutral-500 mt-1">
                  {isHRRole ? "View and manage pending JD approvals" : "Review and approve job descriptions"}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
              <Input
                placeholder="Search by job role, hiring manager, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-neutral-200"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} className="space-y-6">
            <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-neutral-100 p-1 text-neutral-600 w-auto">
              <TabsTrigger 
                value="all" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm gap-2"
              >
                <FileText size={16} />
                All ({roleFilteredPositions.length})
              </TabsTrigger>
              <TabsTrigger 
                value="pending"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm gap-2"
              >
                <Clock size={16} />
                Pending ({getCountByStatus("pending")})
              </TabsTrigger>
              <TabsTrigger 
                value="approved"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm gap-2"
              >
                <CheckCircle size={16} />
                Approved ({getCountByStatus("approved")})
              </TabsTrigger>
              <TabsTrigger 
                value="rejected"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm gap-2"
              >
                <XCircle size={16} />
                Rejected ({getCountByStatus("rejected")})
              </TabsTrigger>
            </TabsList>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingApprovals.length}</p>
                  <p className="text-sm text-neutral-600">Pending</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedApprovals.length}</p>
                  <p className="text-sm text-neutral-600">Approved</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{rejectedApprovals.length}</p>
                  <p className="text-sm text-neutral-600">Rejected</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Approvals List */}
          <TabsContent value={statusFilter} className="mt-6">
            <div className="space-y-4">
            {filteredPositions.length === 0 ? (
              <Card className="p-12 text-center border border-neutral-200">
                <Building size={48} className="mx-auto mb-4 text-neutral-400" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Approvals Found</h3>
                <p className="text-neutral-600">There are no approval requests matching your search.</p>
              </Card>
            ) : (
              filteredPositions.map((position) => (
                <Card key={position.id} className="p-6 border border-neutral-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-neutral-900">{position.title}</h3>
                        {getStatusBadge(position)}
                      </div>
                      <p className="text-neutral-600">{position.department} Department</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-neutral-500" />
                      <div>
                        <p className="text-xs text-neutral-500">Hiring Manager</p>
                        <p className="text-sm font-medium">{position.hiringManager}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-neutral-500" />
                      <div>
                        <p className="text-xs text-neutral-500">Date Created</p>
                        <p className="text-sm font-medium">{new Date(position.submittedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-neutral-500" />
                      <div>
                        <p className="text-xs text-neutral-500">Location</p>
                        <p className="text-sm font-medium">{position.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-neutral-500" />
                      <div>
                        <p className="text-xs text-neutral-500">Salary Range</p>
                        <p className="text-sm font-medium">{position.salaryRange}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - HR View */}
                  {isHRRole && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleView(position)}
                        className="flex-1"
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </Button>
                      {getApprovalStatus(position) === "pending" && (
                        <>
                          {user?.role === "hr_admin" && (
                            <Button
                              variant="outline"
                              onClick={() => handleEdit(position)}
                              className="flex-1"
                            >
                              <Edit size={16} className="mr-2" />
                              Edit
                            </Button>
                          )}
                          <Button
                            onClick={() => handleSendReminder(position)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            <Mail size={16} className="mr-2" />
                            Send Reminder
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Action Buttons - HM View */}
                  {isHiringManager && getApprovalStatus(position) === "pending" && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleView(position)}
                        className="flex-1"
                      >
                        <Eye size={16} className="mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(position)}
                        className="flex-1"
                      >
                        <Edit size={16} className="mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleView(position)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                      </Button>
                    </div>
                  )}

                  {isHiringManager && getApprovalStatus(position) !== "pending" && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleView(position)}
                        className="flex-1"
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            )}
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedPosition && (
        <ApprovalDetailModal
          position={selectedPosition}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedPosition(null)
            setIsEditMode(false)
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          onUpdate={handleUpdate}
          userRole={user?.role || "hr_team"}
          isEditable={isEditMode && canEdit}
        />
      )}
    </div>
  )
}
