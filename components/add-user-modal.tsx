"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole } from "@/lib/user-management-types"
import { useToast } from "@/hooks/use-toast"

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onAddUser: (user: {
    name: string
    email: string
    role: UserRole
    department?: string
  }) => void
}

export function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>("hr_team")
  const [department, setDepartment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!name || !email || !role) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    if (role === "hiring_manager" && !department) {
      toast({
        title: "Department Required",
        description: "Please specify a department for hiring managers",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onAddUser({
        name,
        email,
        role,
        department: role === "hiring_manager" ? department : undefined
      })

      toast({
        title: "User Added",
        description: `${name} has been added successfully`
      })

      // Reset form
      setName("")
      setEmail("")
      setRole("hr_team")
      setDepartment("")
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@tristone.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="role">Role *</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hr_admin">HR Admin</SelectItem>
                <SelectItem value="hr_team">HR Team</SelectItem>
                <SelectItem value="hiring_manager">Hiring Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === "hiring_manager" && (
            <div>
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                placeholder="e.g., Engineering, Product, Design"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Adding..." : "Add User"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
