export interface HRTeamMemberStats {
  id: string
  name: string
  email: string
  role: string
  positionsCreated: number
  candidatesScreened: number
  interviewsScheduled: number
  offersExtended: number
  conversionRate: number // percentage
  avgTimeToHire: number // in days
}

export interface HiringManagerStats {
  id: string
  name: string
  email: string
  department: string
  interviewsRequested: number
  interviewsAccepted: number
  interviewsRejected: number
  acceptanceRate: number // percentage
  avgResponseTime: number // in hours
  openPositions: number
  closedPositions: number
}

export interface TeamAnalytics {
  hrTeamStats: HRTeamMemberStats[]
  hiringManagerStats: HiringManagerStats[]
  overallMetrics: {
    totalPositions: number
    totalCandidates: number
    totalInterviews: number
    avgConversionRate: number
    avgTimeToHire: number
  }
}
