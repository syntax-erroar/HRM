// Comprehensive type definitions for the enhanced candidates system

export type ScreeningType = "resume" | "call"
export type CandidateStatus = "pending" | "reviewing" | "approved" | "rejected"
export type CandidateSource = "Campus" | "LinkedIn" | "Naukri.com" | "Referral"

// Timeline event types
export type TimelineEventType = 
  | "jd_raised" 
  | "jd_approved" 
  | "resume_received" 
  | "call_screening" 
  | "hr_round" 
  | "hm_round" 
  | "ceo_round"
  | "offer_extended"
  | "offer_accepted"

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  date: string
  status: "completed" | "scheduled" | "pending"
  notes?: string
}

// Note and Rating structures
export interface CandidateNote {
  id: string
  author: string
  authorRole: string
  date: string
  content: string
  stage: ScreeningType // Which stage the note was added
}

export interface CandidateRating {
  id: string
  author: string
  authorRole: string
  date: string
  rating: number // 1-5 stars
  stage: ScreeningType
  comments?: string
}

// Resume AI Insights
export interface ResumeInsights {
  relevanceScore: number // 0-100
  keySkills: string[]
  experienceHighlights: string[]
  educationMatch: boolean
  strengthsMatch: string[]
  weaknesses: string[]
  aiSummary: string
  recommendedAction: "approve" | "review" | "reject"
}

// Call Screening Data
export interface CallScreeningData {
  conductedBy?: string
  conductedDate?: string
  communicationRating?: number // 1-5
  technicalUnderstanding?: number // 1-5
  cultureFit?: number // 1-5
  overallImpression?: string
  keyObservations?: string[]
  recommendation?: "proceed" | "hold" | "reject"
}

// Main Candidate Interface
export interface Candidate {
  id: number
  
  // Basic Info
  fullName: string
  email: string
  phone: string
  position: string
  
  // Professional Details
  experience: string // e.g., "5 years" or "2-5 years"
  education: string
  cgpa?: string
  university?: string
  graduationYear?: string
  
  // Application Details
  appliedDate: string
  source: CandidateSource
  resumeUrl?: string
  
  // Status
  resumeScreeningStatus: CandidateStatus
  callScreeningStatus: CandidateStatus
  
  // Resume Screening Data
  resumeText?: string
  resumeInsights?: ResumeInsights
  
  // Call Screening Data
  callScreening?: CallScreeningData
  
  // Notes and Ratings
  notes: CandidateNote[]
  ratings: CandidateRating[]
  
  // Timeline
  timeline: TimelineEvent[]
  
  // Meta
  createdAt: string
  updatedAt: string
}

// Filter State
export interface CandidateFilters {
  screeningType: ScreeningType
  status: CandidateStatus | "all"
  relevanceScoreMin: number
  relevanceScoreMax: number
  source: CandidateSource | "all"
  searchTerm: string
}
