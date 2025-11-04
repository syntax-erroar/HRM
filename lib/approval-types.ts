export type ApprovalStatus = "pending" | "approved" | "rejected" | "revision_requested"

export interface JobApproval {
  id: string
  jobRole: string
  hiringManagerName: string
  hiringManagerEmail: string
  department: string
  dateCreated: string
  status: ApprovalStatus
  jobDescription: string
  professionalSummary: string
  requiredSkills: string[]
  experienceLevel: string
  location: string
  employmentType: string
  salaryRange: string
  lastReminderSent?: string
  approvalDate?: string
  rejectionReason?: string
  revisionNotes?: string
  createdBy: string
  createdByRole: "hr_admin" | "hr_team"
}
