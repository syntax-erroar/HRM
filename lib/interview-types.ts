// Interview type definitions

export type InterviewStatus = "pending" | "upcoming" | "completed"
export type CompletedStatus = "reviewing" | "accepted" | "rejected"
export type InterviewType = "phone" | "video" | "in-person"

export interface InterviewerNote {
  id: string
  interviewer: string
  interviewerRole: string
  date: string
  rating?: number // 1-5
  technicalSkills?: number // 1-5
  communication?: number // 1-5
  cultureFit?: number // 1-5
  notes: string
  recommendation?: "strong_yes" | "yes" | "maybe" | "no" | "strong_no"
}

export interface Interview {
  id: number
  candidateName: string
  candidateEmail: string
  position: string
  
  // Scheduling
  scheduledDate?: string
  scheduledTime?: string
  location?: string
  interviewType?: InterviewType
  
  // Interviewer
  interviewer: string
  interviewerEmail?: string
  
  // Status
  status: InterviewStatus
  completedStatus?: CompletedStatus // Only for completed interviews
  
  // Notes and feedback
  interviewerNotes: InterviewerNote[]
  hrNotes?: string
  
  // Timestamps
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface ScheduleInterviewData {
  candidateName: string
  candidateEmail: string
  position: string
  date: string
  time: string
  location: string
  interviewType: InterviewType
  interviewer: string
  interviewerEmail?: string
}
