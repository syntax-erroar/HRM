import { TeamMember } from "./user-management-types"

export const mockTeamMembers: TeamMember[] = [
  {
    id: "tm-001",
    name: "Amit Kumar",
    email: "hradmin@tristone.com",
    role: "hr_admin",
    joinedDate: "2023-01-15",
    status: "active",
    lastLogin: "2024-01-25"
  },
  {
    id: "tm-002",
    name: "Priya Sharma",
    email: "hr@tristone.com",
    role: "hr_team",
    joinedDate: "2023-03-20",
    status: "active",
    lastLogin: "2024-01-24"
  },
  {
    id: "tm-003",
    name: "Sneha Reddy",
    email: "sneha.reddy@tristone.com",
    role: "hr_team",
    joinedDate: "2023-06-10",
    status: "active",
    lastLogin: "2024-01-23"
  },
  {
    id: "tm-004",
    name: "Rajesh Verma",
    email: "manager@tristone.com",
    role: "hiring_manager",
    department: "Engineering",
    joinedDate: "2022-11-05",
    status: "active",
    lastLogin: "2024-01-25"
  },
  {
    id: "tm-005",
    name: "Kavita Desai",
    email: "kavita.desai@tristone.com",
    role: "hiring_manager",
    department: "Product",
    joinedDate: "2023-02-14",
    status: "active",
    lastLogin: "2024-01-24"
  },
  {
    id: "tm-006",
    name: "Arjun Patel",
    email: "arjun.patel@tristone.com",
    role: "hiring_manager",
    department: "Design",
    joinedDate: "2023-04-22",
    status: "active",
    lastLogin: "2024-01-22"
  }
]
