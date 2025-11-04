import { TeamAnalytics } from "./analytics-types"

export const mockAnalyticsData: TeamAnalytics = {
  hrTeamStats: [
    {
      id: "hr-001",
      name: "Priya Sharma",
      email: "hr@tristone.com",
      role: "HR Team",
      positionsCreated: 12,
      candidatesScreened: 145,
      interviewsScheduled: 67,
      offersExtended: 8,
      conversionRate: 5.5,
      avgTimeToHire: 28
    },
    {
      id: "hr-002",
      name: "Amit Kumar",
      email: "hradmin@tristone.com",
      role: "HR Admin",
      positionsCreated: 18,
      candidatesScreened: 203,
      interviewsScheduled: 89,
      offersExtended: 12,
      conversionRate: 5.9,
      avgTimeToHire: 25
    },
    {
      id: "hr-003",
      name: "Sneha Reddy",
      email: "sneha.reddy@tristone.com",
      role: "HR Team",
      positionsCreated: 9,
      candidatesScreened: 98,
      interviewsScheduled: 43,
      offersExtended: 5,
      conversionRate: 5.1,
      avgTimeToHire: 32
    }
  ],
  hiringManagerStats: [
    {
      id: "hm-001",
      name: "Rajesh Verma",
      email: "manager@tristone.com",
      department: "Engineering",
      interviewsRequested: 45,
      interviewsAccepted: 38,
      interviewsRejected: 7,
      acceptanceRate: 84.4,
      avgResponseTime: 4.2,
      openPositions: 3,
      closedPositions: 5
    },
    {
      id: "hm-002",
      name: "Kavita Desai",
      email: "kavita.desai@tristone.com",
      department: "Product",
      interviewsRequested: 32,
      interviewsAccepted: 28,
      interviewsRejected: 4,
      acceptanceRate: 87.5,
      avgResponseTime: 3.8,
      openPositions: 2,
      closedPositions: 4
    },
    {
      id: "hm-003",
      name: "Arjun Patel",
      email: "arjun.patel@tristone.com",
      department: "Design",
      interviewsRequested: 28,
      interviewsAccepted: 22,
      interviewsRejected: 6,
      acceptanceRate: 78.6,
      avgResponseTime: 5.1,
      openPositions: 1,
      closedPositions: 3
    }
  ],
  overallMetrics: {
    totalPositions: 39,
    totalCandidates: 446,
    totalInterviews: 199,
    avgConversionRate: 5.5,
    avgTimeToHire: 28.3
  }
}
