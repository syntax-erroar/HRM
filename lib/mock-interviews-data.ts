import { Interview } from "./interview-types"

export const mockInterviews: Interview[] = [
  // PENDING - Waiting to be scheduled
  {
    id: 1,
    candidateName: "Rajesh Kumar",
    candidateEmail: "rajesh.kumar@email.com",
    position: "Senior Developer",
    interviewer: "John Smith",
    interviewerEmail: "john.smith@tristone.com",
    status: "pending",
    interviewerNotes: [],
    createdAt: "2025-10-20T10:00:00Z",
    updatedAt: "2025-10-20T10:00:00Z"
  },
  {
    id: 2,
    candidateName: "Priya Sharma",
    candidateEmail: "priya.sharma@email.com",
    position: "Product Manager",
    interviewer: "Sarah Johnson",
    interviewerEmail: "sarah.j@tristone.com",
    status: "pending",
    interviewerNotes: [],
    createdAt: "2025-10-22T14:00:00Z",
    updatedAt: "2025-10-22T14:00:00Z"
  },
  
  // UPCOMING - Scheduled interviews
  {
    id: 3,
    candidateName: "Amit Patel",
    candidateEmail: "amit.patel@email.com",
    position: "UX Designer",
    scheduledDate: "2025-11-05",
    scheduledTime: "10:00 AM",
    location: "Conference Room A",
    interviewType: "in-person",
    interviewer: "Admin User",
    interviewerEmail: "admin@tristone.com",
    status: "upcoming",
    interviewerNotes: [],
    createdAt: "2025-10-19T11:00:00Z",
    updatedAt: "2025-10-26T09:00:00Z"
  },
  {
    id: 4,
    candidateName: "Vikram Singh",
    candidateEmail: "vikram.singh@email.com",
    position: "Data Scientist",
    scheduledDate: "2025-11-06",
    scheduledTime: "2:00 PM",
    location: "Zoom Meeting",
    interviewType: "video",
    interviewer: "Mike Chen",
    interviewerEmail: "mike.chen@tristone.com",
    status: "upcoming",
    interviewerNotes: [],
    createdAt: "2025-10-21T13:00:00Z",
    updatedAt: "2025-10-27T10:00:00Z"
  },
  {
    id: 5,
    candidateName: "Neha Gupta",
    candidateEmail: "neha.gupta@email.com",
    position: "Financial Analyst",
    scheduledDate: "2025-11-07",
    scheduledTime: "11:30 AM",
    location: "Phone Call",
    interviewType: "phone",
    interviewer: "Lisa Anderson",
    interviewerEmail: "lisa.a@tristone.com",
    status: "upcoming",
    interviewerNotes: [],
    createdAt: "2025-10-23T09:00:00Z",
    updatedAt: "2025-10-28T14:00:00Z"
  },
  
  // COMPLETED - Reviewing
  {
    id: 6,
    candidateName: "Arjun Mehta",
    candidateEmail: "arjun.mehta@email.com",
    position: "Senior Developer",
    scheduledDate: "2025-10-25",
    scheduledTime: "3:00 PM",
    location: "Conference Room B",
    interviewType: "in-person",
    interviewer: "John Smith",
    interviewerEmail: "john.smith@tristone.com",
    status: "completed",
    completedStatus: "reviewing",
    completedAt: "2025-10-25T16:30:00Z",
    interviewerNotes: [
      {
        id: "note_1",
        interviewer: "John Smith",
        interviewerRole: "hiring_manager",
        date: "2025-10-25",
        rating: 4,
        technicalSkills: 4,
        communication: 5,
        cultureFit: 4,
        notes: "Strong technical background. Good problem-solving skills demonstrated during coding challenge. Communication is excellent. Shows enthusiasm for the role and company.",
        recommendation: "yes"
      }
    ],
    hrNotes: "Awaiting final decision from hiring manager.",
    createdAt: "2025-10-18T10:00:00Z",
    updatedAt: "2025-10-25T16:30:00Z"
  },
  {
    id: 7,
    candidateName: "Sonia Kapoor",
    candidateEmail: "sonia.kapoor@email.com",
    position: "Product Manager",
    scheduledDate: "2025-10-24",
    scheduledTime: "11:00 AM",
    location: "Zoom Meeting",
    interviewType: "video",
    interviewer: "Sarah Johnson",
    interviewerEmail: "sarah.j@tristone.com",
    status: "completed",
    completedStatus: "reviewing",
    completedAt: "2025-10-24T12:15:00Z",
    interviewerNotes: [
      {
        id: "note_2",
        interviewer: "Sarah Johnson",
        interviewerRole: "hiring_manager",
        date: "2025-10-24",
        rating: 3,
        technicalSkills: 3,
        communication: 4,
        cultureFit: 3,
        notes: "Decent PM experience but lacks financial domain knowledge. Good communication skills. May need some training on our specific tools and processes.",
        recommendation: "maybe"
      }
    ],
    createdAt: "2025-10-20T09:00:00Z",
    updatedAt: "2025-10-24T12:15:00Z"
  },
  
  // COMPLETED - Accepted
  {
    id: 8,
    candidateName: "Karan Verma",
    candidateEmail: "karan.verma@email.com",
    position: "UX Designer",
    scheduledDate: "2025-10-22",
    scheduledTime: "10:00 AM",
    location: "Conference Room A",
    interviewType: "in-person",
    interviewer: "Admin User",
    interviewerEmail: "admin@tristone.com",
    status: "completed",
    completedStatus: "accepted",
    completedAt: "2025-10-22T11:30:00Z",
    interviewerNotes: [
      {
        id: "note_3",
        interviewer: "Admin User",
        interviewerRole: "hiring_manager",
        date: "2025-10-22",
        rating: 5,
        technicalSkills: 5,
        communication: 5,
        cultureFit: 5,
        notes: "Exceptional candidate! Portfolio is outstanding. Design thinking is very strong. Great cultural fit. Highly recommend moving forward with an offer.",
        recommendation: "strong_yes"
      }
    ],
    hrNotes: "Excellent candidate. Moving to offer stage.",
    createdAt: "2025-10-15T14:00:00Z",
    updatedAt: "2025-10-23T09:00:00Z"
  },
  {
    id: 9,
    candidateName: "Deepika Shah",
    candidateEmail: "deepika.shah@email.com",
    position: "Data Scientist",
    scheduledDate: "2025-10-21",
    scheduledTime: "2:30 PM",
    location: "Zoom Meeting",
    interviewType: "video",
    interviewer: "Mike Chen",
    interviewerEmail: "mike.chen@tristone.com",
    status: "completed",
    completedStatus: "accepted",
    completedAt: "2025-10-21T15:45:00Z",
    interviewerNotes: [
      {
        id: "note_4",
        interviewer: "Mike Chen",
        interviewerRole: "hiring_manager",
        date: "2025-10-21",
        rating: 5,
        technicalSkills: 5,
        communication: 4,
        cultureFit: 5,
        notes: "Very strong technical skills. ML knowledge is impressive. Previous experience in financial ML is a huge plus. Will be a great addition to the team.",
        recommendation: "strong_yes"
      }
    ],
    hrNotes: "Strong yes from hiring manager. Preparing offer letter.",
    createdAt: "2025-10-16T11:00:00Z",
    updatedAt: "2025-10-22T10:00:00Z"
  },
  
  // COMPLETED - Rejected
  {
    id: 10,
    candidateName: "Rahul Joshi",
    candidateEmail: "rahul.joshi@email.com",
    position: "Senior Developer",
    scheduledDate: "2025-10-20",
    scheduledTime: "4:00 PM",
    location: "Phone Call",
    interviewType: "phone",
    interviewer: "John Smith",
    interviewerEmail: "john.smith@tristone.com",
    status: "completed",
    completedStatus: "rejected",
    completedAt: "2025-10-20T16:45:00Z",
    interviewerNotes: [
      {
        id: "note_5",
        interviewer: "John Smith",
        interviewerRole: "hiring_manager",
        date: "2025-10-20",
        rating: 2,
        technicalSkills: 2,
        communication: 3,
        cultureFit: 2,
        notes: "Technical skills are below the level required for senior position. Struggled with system design questions. Communication was okay but not confident in responses.",
        recommendation: "no"
      }
    ],
    hrNotes: "Not a fit for senior role. Sending rejection email.",
    createdAt: "2025-10-12T10:00:00Z",
    updatedAt: "2025-10-21T09:00:00Z"
  },
  {
    id: 11,
    candidateName: "Anjali Reddy",
    candidateEmail: "anjali.reddy@email.com",
    position: "Financial Analyst",
    scheduledDate: "2025-10-19",
    scheduledTime: "9:00 AM",
    location: "Conference Room B",
    interviewType: "in-person",
    interviewer: "Lisa Anderson",
    interviewerEmail: "lisa.a@tristone.com",
    status: "completed",
    completedStatus: "rejected",
    completedAt: "2025-10-19T10:15:00Z",
    interviewerNotes: [
      {
        id: "note_6",
        interviewer: "Lisa Anderson",
        interviewerRole: "hiring_manager",
        date: "2025-10-19",
        rating: 2,
        technicalSkills: 3,
        communication: 2,
        cultureFit: 2,
        notes: "Experience level doesn't match our requirements. Lacks exposure to investment research. Communication needs improvement for client-facing role.",
        recommendation: "no"
      }
    ],
    hrNotes: "Does not meet position requirements. Rejection sent.",
    createdAt: "2025-10-10T14:00:00Z",
    updatedAt: "2025-10-20T11:00:00Z"
  }
]

// Helper functions
export function getInterviewsByStatus(status: "pending" | "upcoming" | "completed") {
  return mockInterviews.filter(i => i.status === status)
}

export function getCompletedInterviewsByStatus(completedStatus: "reviewing" | "accepted" | "rejected") {
  return mockInterviews.filter(i => i.status === "completed" && i.completedStatus === completedStatus)
}

export function getInterviewById(id: number) {
  return mockInterviews.find(i => i.id === id)
}
