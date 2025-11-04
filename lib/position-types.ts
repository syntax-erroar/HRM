export type PositionStatus = 
  | "draft"              // Initial creation by HR Admin
  | "pending_approval"   // Sent to Hiring Manager for approval
  | "approved"           // HM approved the JD
  | "rejected"           // HM rejected the JD
  | "open"               // Position is active and accepting candidates
  | "onhold"             // Position paused
  | "closed"             // Position filled or closed
  | "cancelled"          // Position cancelled

export interface Position {
  id: string
  title: string
  department: string
  description: string
  
  // Job Details
  jobDescription: string
  professionalSummary: string
  requiredSkills: string[]
  experienceLevel: string
  location: string
  employmentType: string
  salaryRange: string
  
  // Status & Workflow
  status: PositionStatus
  submittedBy: string
  submittedByRole: "hr_admin" | "hr_team"
  submittedDate: string
  
  // Hiring Manager
  hiringManager: string
  hiringManagerEmail: string
  
  // Approval Flow
  approvalStatus?: "pending" | "approved" | "rejected"
  approvalDate?: string
  approvalNotes?: string
  rejectionReason?: string
  
  // Publishing
  platforms?: string[]
  standardMessage?: string
  publishedDate?: string
  
  // Cancellation
  cancelledDate?: string
  cancelledBy?: string
  cancellationReason?: string
  
  // Metadata
  createdAt: string
  updatedAt: string
}

export interface PositionFormData {
  title: string
  department: string
  description: string
  jobDescription: string
  professionalSummary: string
  standardMessage: string
  platforms: string[]
  salaryRange: string
  location: string
  employmentType: string
  experienceLevel: string
  hiringManager: string
  hiringManagerEmail: string
}
