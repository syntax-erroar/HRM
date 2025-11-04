export type UserRole = "hr_admin" | "hr_team" | "hiring_manager"

export interface TeamMember {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  joinedDate: string
  status: "active" | "inactive"
  lastLogin?: string
}
