"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  Shield,
  UserCog
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { mockTeamMembers } from "@/lib/mock-team-members"
import { TeamMember } from "@/lib/user-management-types"
import { AddUserModal } from "@/components/add-user-modal"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Redirect if not HR Admin
  useEffect(() => {
    if (user && user.role !== "hr_admin") {
      router.push("/")
    }
  }, [user, router])

  // Don't render if not authorized
  if (!user || user.role !== "hr_admin") {
    return null
  }

  const hrTeam = teamMembers.filter(m => m.role === "hr_admin" || m.role === "hr_team")
  const hiringManagers = teamMembers.filter(m => m.role === "hiring_manager")

  const filteredHRTeam = hrTeam.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredHMs = hiringManagers.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.department?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = (userData: {
    name: string
    email: string
    role: "hr_admin" | "hr_team" | "hiring_manager"
    department?: string
  }) => {
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      joinedDate: new Date().toISOString().split('T')[0],
      status: "active"
    }

    setTeamMembers([...teamMembers, newMember])
  }

  const handleDeleteUser = (memberId: string, memberName: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${memberName}?`)
    
    if (confirmDelete) {
      setTeamMembers(teamMembers.filter(m => m.id !== memberId))
      toast({
        title: "User Deleted",
        description: `${memberName} has been removed from the system`
      })
    }
  }

  const handleUpdateRole = (memberId: string, memberName: string) => {
    toast({
      title: "Edit User",
      description: "Edit functionality will be implemented"
    })
  }

  const getRoleBadge = (role: TeamMember["role"]) => {
    const config = {
      hr_admin: { label: "HR Admin", className: "bg-blue-100 text-blue-800" },
      hr_team: { label: "HR Team", className: "bg-green-100 text-green-800" },
      hiring_manager: { label: "Hiring Manager", className: "bg-purple-100 text-purple-800" }
    }
    return <Badge className={config[role].className}>{config[role].label}</Badge>
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
                <p className="text-neutral-500 mt-1">Manage team members and configurations</p>
              </div>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Plus size={20} />
                Add Team Member
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{hrTeam.length}</p>
                  <p className="text-sm text-neutral-600">HR Team Members</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UserCog size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{hiringManagers.length}</p>
                  <p className="text-sm text-neutral-600">Hiring Managers</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{teamMembers.length}</p>
                  <p className="text-sm text-neutral-600">Total Users</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
              <Input
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-neutral-200"
              />
            </div>
          </div>

          <Tabs defaultValue="hr-team" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="hr-team" className="flex items-center gap-2">
                <Shield size={16} />
                HR Team ({hrTeam.length})
              </TabsTrigger>
              <TabsTrigger value="hiring-managers" className="flex items-center gap-2">
                <UserCog size={16} />
                Hiring Managers ({hiringManagers.length})
              </TabsTrigger>
            </TabsList>

            {/* HR Team Tab */}
            <TabsContent value="hr-team">
              <Card className="border border-neutral-200">
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Role</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Joined Date</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Last Login</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHRTeam.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-neutral-500">
                              No HR team members found
                            </td>
                          </tr>
                        ) : (
                          filteredHRTeam.map((member, index) => (
                            <tr key={member.id} className={index !== filteredHRTeam.length - 1 ? "border-b border-neutral-100" : ""}>
                              <td className="py-4 px-4 font-medium text-neutral-900">{member.name}</td>
                              <td className="py-4 px-4 text-neutral-600">{member.email}</td>
                              <td className="py-4 px-4">{getRoleBadge(member.role)}</td>
                              <td className="py-4 px-4 text-neutral-600">
                                {new Date(member.joinedDate).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4 text-neutral-600">
                                {member.lastLogin ? new Date(member.lastLogin).toLocaleDateString() : "Never"}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateRole(member.id, member.name)}
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteUser(member.id, member.name)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Hiring Managers Tab */}
            <TabsContent value="hiring-managers">
              <Card className="border border-neutral-200">
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Department</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Joined Date</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Last Login</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHMs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-neutral-500">
                              No hiring managers found
                            </td>
                          </tr>
                        ) : (
                          filteredHMs.map((member, index) => (
                            <tr key={member.id} className={index !== filteredHMs.length - 1 ? "border-b border-neutral-100" : ""}>
                              <td className="py-4 px-4 font-medium text-neutral-900">{member.name}</td>
                              <td className="py-4 px-4 text-neutral-600">{member.email}</td>
                              <td className="py-4 px-4">
                                <Badge variant="secondary">{member.department}</Badge>
                              </td>
                              <td className="py-4 px-4 text-neutral-600">
                                {new Date(member.joinedDate).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4 text-neutral-600">
                                {member.lastLogin ? new Date(member.lastLogin).toLocaleDateString() : "Never"}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateRole(member.id, member.name)}
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteUser(member.id, member.name)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </div>
  )
}
