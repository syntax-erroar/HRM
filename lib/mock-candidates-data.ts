import { Candidate } from "./candidate-types"

// Mock candidates database with comprehensive data
export const mockCandidates: Candidate[] = [
  {
    id: 1,
    fullName: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    position: "Senior Developer",
    experience: "6 years",
    education: "B.Tech in Computer Science",
    cgpa: "8.5",
    university: "IIT Delhi",
    graduationYear: "2017",
    appliedDate: "2025-10-20",
    source: "LinkedIn",
    resumeUrl: "/resumes/rajesh-kumar.pdf",
    resumeScreeningStatus: "pending",
    callScreeningStatus: "pending",
    resumeText: "Experienced full-stack developer with 6 years in MERN stack, cloud architecture...",
    resumeInsights: {
      relevanceScore: 92,
      keySkills: ["React", "Node.js", "AWS", "MongoDB", "TypeScript", "Docker"],
      experienceHighlights: [
        "Led team of 5 developers at TCS",
        "Built scalable microservices architecture serving 1M+ users",
        "Implemented CI/CD pipeline reducing deployment time by 60%"
      ],
      educationMatch: true,
      strengthsMatch: ["Strong technical skills", "Leadership experience", "Cloud expertise"],
      weaknesses: ["Limited financial domain experience"],
      aiSummary: "Excellent candidate with strong technical background. Experience aligns well with requirements. Recommended for interview.",
      recommendedAction: "approve"
    },
    notes: [],
    ratings: [],
    timeline: [
      {
        id: "t1",
        type: "jd_raised",
        title: "Job Description Raised",
        date: "2025-10-15",
        status: "completed"
      },
      {
        id: "t2",
        type: "jd_approved",
        title: "JD Approved by Management",
        date: "2025-10-18",
        status: "completed"
      },
      {
        id: "t3",
        type: "resume_received",
        title: "Resume Received",
        date: "2025-10-20",
        status: "completed"
      },
      {
        id: "t4",
        type: "call_screening",
        title: "Call Screening",
        date: "",
        status: "pending"
      },
      {
        id: "t5",
        type: "hr_round",
        title: "HR Round",
        date: "",
        status: "pending"
      },
      {
        id: "t6",
        type: "hm_round",
        title: "Hiring Manager Round",
        date: "",
        status: "pending"
      }
    ],
    createdAt: "2025-10-20T10:30:00Z",
    updatedAt: "2025-10-20T10:30:00Z"
  },
  {
    id: 2,
    fullName: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 87654 32109",
    position: "Product Manager",
    experience: "4 years",
    education: "MBA from IIM Bangalore",
    cgpa: "3.8",
    university: "IIM Bangalore",
    graduationYear: "2020",
    appliedDate: "2025-10-22",
    source: "Naukri.com",
    resumeUrl: "/resumes/priya-sharma.pdf",
    resumeScreeningStatus: "reviewing",
    callScreeningStatus: "pending",
    resumeInsights: {
      relevanceScore: 85,
      keySkills: ["Product Strategy", "Agile", "User Research", "SQL", "Jira"],
      experienceHighlights: [
        "Managed product roadmap for fintech startup",
        "Launched 3 major features with 40% user adoption",
        "Led cross-functional team of 12 members"
      ],
      educationMatch: true,
      strengthsMatch: ["Product management experience", "Financial domain knowledge", "Leadership"],
      weaknesses: ["Limited technical background", "Relatively junior"],
      aiSummary: "Good candidate with relevant PM experience in fintech. Strong business acumen but limited technical depth.",
      recommendedAction: "review"
    },
    notes: [
      {
        id: "n1",
        author: "HR Team Member",
        authorRole: "hr_team",
        date: "2025-10-23",
        content: "Resume looks promising. Product management experience in fintech is a plus. Should proceed to call screening.",
        stage: "resume"
      }
    ],
    ratings: [
      {
        id: "r1",
        author: "HR Team Member",
        authorRole: "hr_team",
        date: "2025-10-23",
        rating: 4,
        stage: "resume",
        comments: "Strong profile for PM role"
      }
    ],
    timeline: [
      {
        id: "t1",
        type: "jd_raised",
        title: "Job Description Raised",
        date: "2025-10-15",
        status: "completed"
      },
      {
        id: "t2",
        type: "jd_approved",
        title: "JD Approved",
        date: "2025-10-18",
        status: "completed"
      },
      {
        id: "t3",
        type: "resume_received",
        title: "Resume Received",
        date: "2025-10-22",
        status: "completed"
      },
      {
        id: "t4",
        type: "call_screening",
        title: "Call Screening",
        date: "",
        status: "pending"
      }
    ],
    createdAt: "2025-10-22T14:20:00Z",
    updatedAt: "2025-10-23T09:15:00Z"
  },
  {
    id: 3,
    fullName: "Amit Patel",
    email: "amit.patel@email.com",
    phone: "+91 98888 77766",
    position: "UX Designer",
    experience: "5 years",
    education: "B.Des from NID Ahmedabad",
    cgpa: "7.8",
    university: "NID Ahmedabad",
    graduationYear: "2018",
    appliedDate: "2025-10-19",
    source: "Campus",
    resumeUrl: "/resumes/amit-patel.pdf",
    resumeScreeningStatus: "approved",
    callScreeningStatus: "reviewing",
    resumeInsights: {
      relevanceScore: 88,
      keySkills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"],
      experienceHighlights: [
        "Redesigned enterprise dashboard used by 50K+ users",
        "Created design system adopted across 10+ products",
        "Led UX research for mobile banking app"
      ],
      educationMatch: true,
      strengthsMatch: ["Strong design portfolio", "Financial product experience", "User-centric approach"],
      weaknesses: ["No experience with investment platforms"],
      aiSummary: "Excellent UX designer with proven track record. Strong portfolio and relevant experience.",
      recommendedAction: "approve"
    },
    callScreening: {
      conductedBy: "Admin User",
      conductedDate: "2025-10-25",
      communicationRating: 5,
      technicalUnderstanding: 4,
      cultureFit: 5,
      overallImpression: "Very impressive candidate. Clear communication, strong portfolio, and genuine passion for design.",
      keyObservations: [
        "Excellent communication skills",
        "Strong understanding of user-centered design",
        "Collaborative approach to problem-solving",
        "Eager to learn financial domain"
      ],
      recommendation: "proceed"
    },
    notes: [
      {
        id: "n1",
        author: "HR Team Member",
        authorRole: "hr_team",
        date: "2025-10-21",
        content: "Excellent portfolio. Design work is impressive. Approved for call screening.",
        stage: "resume"
      },
      {
        id: "n2",
        author: "Admin User",
        authorRole: "hr_admin",
        date: "2025-10-25",
        content: "Call screening went very well. Candidate is articulate and shows strong design thinking. Recommended for HR round.",
        stage: "call"
      }
    ],
    ratings: [
      {
        id: "r1",
        author: "HR Team Member",
        authorRole: "hr_team",
        date: "2025-10-21",
        rating: 5,
        stage: "resume",
        comments: "Outstanding portfolio"
      },
      {
        id: "r2",
        author: "Admin User",
        authorRole: "hr_admin",
        date: "2025-10-25",
        rating: 5,
        stage: "call",
        comments: "Excellent call screening performance"
      }
    ],
    timeline: [
      {
        id: "t1",
        type: "jd_raised",
        title: "Job Description Raised",
        date: "2025-10-15",
        status: "completed"
      },
      {
        id: "t2",
        type: "jd_approved",
        title: "JD Approved",
        date: "2025-10-18",
        status: "completed"
      },
      {
        id: "t3",
        type: "resume_received",
        title: "Resume Received",
        date: "2025-10-19",
        status: "completed"
      },
      {
        id: "t4",
        type: "call_screening",
        title: "Call Screening Completed",
        date: "2025-10-25",
        status: "completed",
        notes: "Strong performance. Recommended for HR round."
      },
      {
        id: "t5",
        type: "hr_round",
        title: "HR Round Scheduled",
        date: "2025-10-28",
        status: "scheduled"
      }
    ],
    createdAt: "2025-10-19T11:00:00Z",
    updatedAt: "2025-10-25T16:30:00Z"
  },
  {
    id: 4,
    fullName: "Sneha Reddy",
    email: "sneha.reddy@email.com",
    phone: "+91 99999 88877",
    position: "Financial Analyst",
    experience: "3 years",
    education: "B.Com + CFA Level 2",
    cgpa: "8.9",
    university: "Delhi University",
    graduationYear: "2020",
    appliedDate: "2025-10-18",
    source: "Referral",
    resumeUrl: "/resumes/sneha-reddy.pdf",
    resumeScreeningStatus: "rejected",
    callScreeningStatus: "pending",
    resumeInsights: {
      relevanceScore: 65,
      keySkills: ["Financial Modeling", "Excel", "Bloomberg Terminal", "Equity Research"],
      experienceHighlights: [
        "2 years at ICICI Securities",
        "CFA Level 2 candidate",
        "Published 15+ equity research reports"
      ],
      educationMatch: true,
      strengthsMatch: ["CFA progress", "Financial modeling skills"],
      weaknesses: ["Limited experience", "No technology sector exposure", "Weak programming skills"],
      aiSummary: "Decent candidate but lacks required experience level. Position requires 5+ years. May consider for junior role.",
      recommendedAction: "reject"
    },
    notes: [
      {
        id: "n1",
        author: "Admin User",
        authorRole: "hr_admin",
        date: "2025-10-21",
        content: "Candidate has good fundamentals but experience is below our requirements. Position requires 5+ years, candidate has only 3. Rejecting for this role but keeping profile for future junior positions.",
        stage: "resume"
      }
    ],
    ratings: [
      {
        id: "r1",
        author: "Admin User",
        authorRole: "hr_admin",
        date: "2025-10-21",
        rating: 3,
        stage: "resume",
        comments: "Good potential but underqualified for this role"
      }
    ],
    timeline: [
      {
        id: "t1",
        type: "jd_raised",
        title: "Job Description Raised",
        date: "2025-10-15",
        status: "completed"
      },
      {
        id: "t2",
        type: "jd_approved",
        title: "JD Approved",
        date: "2025-10-18",
        status: "completed"
      },
      {
        id: "t3",
        type: "resume_received",
        title: "Resume Received",
        date: "2025-10-18",
        status: "completed"
      }
    ],
    createdAt: "2025-10-18T09:00:00Z",
    updatedAt: "2025-10-21T14:45:00Z"
  },
  {
    id: 5,
    fullName: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "+91 98765 11122",
    position: "Data Scientist",
    experience: "7 years",
    education: "M.Tech in AI/ML from IISc",
    cgpa: "9.2",
    university: "IISc Bangalore",
    graduationYear: "2016",
    appliedDate: "2025-10-21",
    source: "LinkedIn",
    resumeUrl: "/resumes/vikram-singh.pdf",
    resumeScreeningStatus: "approved",
    callScreeningStatus: "approved",
    resumeInsights: {
      relevanceScore: 95,
      keySkills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Data Visualization", "Financial Modeling"],
      experienceHighlights: [
        "7 years experience in fintech and banking",
        "Built ML models for credit risk assessment",
        "Published 5 research papers on financial ML",
        "Led data science team at Goldman Sachs"
      ],
      educationMatch: true,
      strengthsMatch: ["Exceptional technical skills", "Financial domain expertise", "Research background", "Leadership"],
      weaknesses: [],
      aiSummary: "Outstanding candidate. Perfect match for the role with exceptional qualifications and directly relevant experience.",
      recommendedAction: "approve"
    },
    callScreening: {
      conductedBy: "Admin User",
      conductedDate: "2025-10-24",
      communicationRating: 5,
      technicalUnderstanding: 5,
      cultureFit: 5,
      overallImpression: "Exceptional candidate. Very strong technical knowledge combined with excellent communication. Would be a great addition to the team.",
      keyObservations: [
        "Deep understanding of ML in financial context",
        "Excellent problem-solving approach",
        "Strong cultural fit",
        "Collaborative mindset"
      ],
      recommendation: "proceed"
    },
    notes: [
      {
        id: "n1",
        author: "HR Team Member",
        authorRole: "hr_team",
        date: "2025-10-22",
        content: "Exceptional profile. IISc + Goldman Sachs background. Strong approve.",
        stage: "resume"
      },
      {
        id: "n2",
        author: "Admin User",
        authorRole: "hr_admin",
        date: "2025-10-24",
        content: "Outstanding call screening. Technical depth is impressive. Fast-track to final rounds.",
        stage: "call"
      }
    ],
    ratings: [
      {
        id: "r1",
        author: "HR Team Member",
        authorRole: "hr_team",
        date: "2025-10-22",
        rating: 5,
        stage: "resume"
      },
      {
        id: "r2",
        author: "Admin User",
        authorRole: "hr_admin",
        date: "2025-10-24",
        rating: 5,
        stage: "call"
      }
    ],
    timeline: [
      {
        id: "t1",
        type: "jd_raised",
        title: "Job Description Raised",
        date: "2025-10-15",
        status: "completed"
      },
      {
        id: "t2",
        type: "jd_approved",
        title: "JD Approved",
        date: "2025-10-18",
        status: "completed"
      },
      {
        id: "t3",
        type: "resume_received",
        title: "Resume Received",
        date: "2025-10-21",
        status: "completed"
      },
      {
        id: "t4",
        type: "call_screening",
        title: "Call Screening Completed",
        date: "2025-10-24",
        status: "completed"
      },
      {
        id: "t5",
        type: "hr_round",
        title: "HR Round Scheduled",
        date: "2025-10-27",
        status: "scheduled"
      },
      {
        id: "t6",
        type: "hm_round",
        title: "HM Round",
        date: "2025-10-29",
        status: "scheduled"
      }
    ],
    createdAt: "2025-10-21T13:30:00Z",
    updatedAt: "2025-10-24T18:00:00Z"
  }
]

// Helper functions
export function getCandidatesByScreeningType(screeningType: "resume" | "call", status: string) {
  return mockCandidates.filter(c => {
    const statusField = screeningType === "resume" ? c.resumeScreeningStatus : c.callScreeningStatus
    return status === "all" ? true : statusField === status
  })
}

export function getCandidateById(id: number) {
  return mockCandidates.find(c => c.id === id)
}
