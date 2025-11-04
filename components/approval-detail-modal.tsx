"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { JobApproval } from "@/lib/approval-types"
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  CheckCircle, 
  XCircle,
  Clock,
  Building
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ApprovalDetailModalProps {
  approval: JobApproval | null
  isOpen: boolean
  onClose: () => void
  onApprove?: (id: string, notes?: string) => void
  onReject?: (id: string, reason: string) => void
  onUpdate?: (approval: JobApproval) => void
  userRole: "hr_admin" | "hr_team" | "hiring_manager"
  isEditable?: boolean
}

export function ApprovalDetailModal({
  approval,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onUpdate,
  userRole,
  isEditable = false
}: ApprovalDetailModalProps) {
  const { toast } = useToast()
  const [showApprovalForm, setShowApprovalForm] = useState(false)
  const [showRejectionForm, setShowRejectionForm] = useState(false)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedJobDescription, setEditedJobDescription] = useState("")
  const [editedProfessionalSummary, setEditedProfessionalSummary] = useState("")
  const [editedLocation, setEditedLocation] = useState("")
  const [editedSalaryRange, setEditedSalaryRange] = useState("")
  const [editedExperienceLevel, setEditedExperienceLevel] = useState("")
  const [editedEmploymentType, setEditedEmploymentType] = useState("")
  const [editedHiringManagerName, setEditedHiringManagerName] = useState("")
  const [editedHiringManagerEmail, setEditedHiringManagerEmail] = useState("")

  if (!approval) return null

  // Initialize edit fields when modal opens
  if (isEditable && editedJobDescription === "" && editedProfessionalSummary === "") {
    setEditedJobDescription(approval.jobDescription)
    setEditedProfessionalSummary(approval.professionalSummary)
    setEditedLocation(approval.location)
    setEditedSalaryRange(approval.salaryRange)
    setEditedExperienceLevel(approval.experienceLevel)
    setEditedEmploymentType(approval.employmentType)
    setEditedHiringManagerName(approval.hiringManagerName)
    setEditedHiringManagerEmail(approval.hiringManagerEmail)
  }

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      onApprove?.(approval.id, notes)
      toast({
        title: "Approved",
        description: `Job description for ${approval.jobRole} has been approved`
      })
      setShowApprovalForm(false)
      setNotes("")
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!notes.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      onReject?.(approval.id, notes)
      toast({
        title: "Rejected",
        description: `Job description for ${approval.jobRole} has been rejected`
      })
      setShowRejectionForm(false)
      setNotes("")
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveEdit = async () => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const updatedApproval = {
        ...approval,
        jobDescription: editedJobDescription,
        professionalSummary: editedProfessionalSummary,
        location: editedLocation,
        salaryRange: editedSalaryRange,
        experienceLevel: editedExperienceLevel,
        employmentType: editedEmploymentType,
        hiringManagerName: editedHiringManagerName,
        hiringManagerEmail: editedHiringManagerEmail
      }
      onUpdate?.(updatedApproval)
      setIsEditing(false)
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Approved", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
      revision_requested: { label: "Revision Requested", className: "bg-orange-100 text-orange-800" }
    }
    const config = statusConfig[approval.status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{approval.jobRole}</DialogTitle>
              <p className="text-neutral-600 mt-1">{approval.department} Department</p>
            </div>
            {getStatusBadge()}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Building size={16} className="text-neutral-500" />
              <div className="flex-1">
                <p className="text-xs text-neutral-500">Hiring Manager</p>
                {isEditing ? (
                  <Select
                    value={editedHiringManagerName}
                    onValueChange={(value) => {
                      setEditedHiringManagerName(value)
                      const manager = hiringManagers.find(m => m.name === value)
                      if (manager) {
                        setEditedHiringManagerEmail(manager.email)
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="Select hiring manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {hiringManagers.map((manager) => (
                        <SelectItem key={manager.email} value={manager.name}>
                          {manager.name} - {manager.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium">{approval.hiringManagerName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-neutral-500" />
              <div className="flex-1">
                <p className="text-xs text-neutral-500">Date Created</p>
                <p className="font-medium text-neutral-400">{new Date(approval.dateCreated).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-neutral-500" />
              <div className="flex-1">
                <p className="text-xs text-neutral-500">Location</p>
                {isEditing ? (
                  <Input
                    value={editedLocation}
                    onChange={(e) => setEditedLocation(e.target.value)}
                    className="h-8 mt-1"
                    placeholder="Enter location..."
                  />
                ) : (
                  <p className="font-medium">{approval.location}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-neutral-500" />
              <div className="flex-1">
                <p className="text-xs text-neutral-500">Salary Range</p>
                {isEditing ? (
                  <Input
                    value={editedSalaryRange}
                    onChange={(e) => setEditedSalaryRange(e.target.value)}
                    className="h-8 mt-1"
                    placeholder="Enter salary range..."
                  />
                ) : (
                  <p className="font-medium">{approval.salaryRange}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-neutral-500" />
              <div className="flex-1">
                <p className="text-xs text-neutral-500">Experience</p>
                {isEditing ? (
                  <Input
                    value={editedExperienceLevel}
                    onChange={(e) => setEditedExperienceLevel(e.target.value)}
                    className="h-8 mt-1"
                    placeholder="e.g. 3-5 years"
                  />
                ) : (
                  <p className="font-medium">{approval.experienceLevel}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-neutral-500" />
              <div className="flex-1">
                <p className="text-xs text-neutral-500">Employment Type</p>
                {isEditing ? (
                  <Select
                    value={editedEmploymentType}
                    onValueChange={setEditedEmploymentType}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium">{approval.employmentType}</p>
                )}
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {approval.requiredSkills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Job Description</h3>
              {isEditable && !isEditing && !showApprovalForm && !showRejectionForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(true)
                    setEditedJobDescription(approval.jobDescription)
                    setEditedProfessionalSummary(approval.professionalSummary)
                    setEditedLocation(approval.location)
                    setEditedSalaryRange(approval.salaryRange)
                    setEditedExperienceLevel(approval.experienceLevel)
                    setEditedEmploymentType(approval.employmentType)
                    setEditedHiringManagerName(approval.hiringManagerName)
                    setEditedHiringManagerEmail(approval.hiringManagerEmail)
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
            {isEditing ? (
              <Textarea
                value={editedJobDescription}
                onChange={(e) => setEditedJobDescription(e.target.value)}
                className="min-h-48 font-mono text-sm"
                placeholder="Enter job description..."
              />
            ) : (
              <div className="p-4 bg-neutral-50 rounded-lg text-sm text-neutral-700 whitespace-pre-wrap">
                {approval.jobDescription}
              </div>
            )}
          </div>

          {/* Professional Summary */}
          <div>
            <h3 className="font-semibold mb-2">Professional Summary</h3>
            {isEditing ? (
              <Textarea
                value={editedProfessionalSummary}
                onChange={(e) => setEditedProfessionalSummary(e.target.value)}
                className="min-h-32 font-mono text-sm"
                placeholder="Enter professional summary..."
              />
            ) : (
              <div className="p-4 bg-blue-50 rounded-lg text-sm text-neutral-700 whitespace-pre-wrap border border-blue-200">
                {approval.professionalSummary}
              </div>
            )}
          </div>

          {/* Rejection Reason (if rejected) */}
          {approval.status === "rejected" && approval.rejectionReason && (
            <div>
              <h3 className="font-semibold mb-2 text-red-600">Rejection Reason</h3>
              <div className="p-4 bg-red-50 rounded-lg text-sm text-red-700">
                {approval.rejectionReason}
              </div>
            </div>
          )}

          {/* Action Forms */}
          {showApprovalForm && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Approval Notes (Optional)</h3>
              <Textarea
                placeholder="Add any notes or comments..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mb-3"
                rows={3}
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowApprovalForm(false)
                    setNotes("")
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle size={16} className="mr-2" />
                  {isSubmitting ? "Approving..." : "Confirm Approval"}
                </Button>
              </div>
            </div>
          )}

          {showRejectionForm && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Rejection Reason *</h3>
              <Textarea
                placeholder="Please provide a reason for rejection..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mb-3"
                rows={3}
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectionForm(false)
                    setNotes("")
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <XCircle size={16} className="mr-2" />
                  {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
                </Button>
              </div>
            </div>
          )}

          {/* Edit Mode Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setEditedJobDescription(approval.jobDescription)
                  setEditedProfessionalSummary(approval.professionalSummary)
                  setEditedLocation(approval.location)
                  setEditedSalaryRange(approval.salaryRange)
                  setEditedExperienceLevel(approval.experienceLevel)
                  setEditedEmploymentType(approval.employmentType)
                  setEditedHiringManagerName(approval.hiringManagerName)
                  setEditedHiringManagerEmail(approval.hiringManagerEmail)
                }}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          {!showApprovalForm && !showRejectionForm && !isEditing && approval.status === "pending" && (
            <div className="flex gap-3 pt-4 border-t">
              {userRole === "hiring_manager" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectionForm(true)}
                    className="flex-1"
                  >
                    <XCircle size={16} className="mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => setShowApprovalForm(true)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Approve
                  </Button>
                </>
              )}
              {(userRole === "hr_admin" || userRole === "hr_team") && (
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Close
                </Button>
              )}
            </div>
          )}

          {approval.status !== "pending" && !isEditing && (
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
