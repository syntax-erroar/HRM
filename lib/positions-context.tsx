"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { Position, PositionStatus } from "./position-types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-context"

interface PositionsContextType {
  positions: Position[]
  addPosition: (position: Position) => void
  updatePosition: (id: string, updates: Partial<Position>) => void
  submitForApproval: (id: string) => void
  approvePosition: (id: string, notes?: string) => void
  rejectPosition: (id: string, reason: string) => void
  openPosition: (id: string) => void
  cancelPosition: (id: string, reason: string) => void
}

const PositionsContext = createContext<PositionsContextType | undefined>(undefined)

export function PositionsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const { user } = useAuth()

  // Mock initial data
  const [positions, setPositions] = useState<Position[]>([
    {
      id: "pos_1",
      title: "Senior Developer",
      department: "Engineering",
      description: "Looking for an experienced developer with 5+ years of experience",
      jobDescription: "We are seeking a Senior Developer to join our engineering team. You will be responsible for designing, developing, and maintaining high-quality software solutions. The ideal candidate will have 5+ years of experience in full-stack development, strong problem-solving skills, and experience with modern web technologies.",
      professionalSummary: "Join Tristone Partners as a Senior Developer and help shape the future of financial technology. Work with cutting-edge technologies in a collaborative environment where innovation and excellence are valued. We offer competitive compensation, flexible work arrangements, and opportunities for professional growth.",
      requiredSkills: ["JavaScript", "React", "Node.js", "TypeScript", "SQL"],
      experienceLevel: "Senior Level (5+ years)",
      location: "Bangalore, India",
      employmentType: "Full-time",
      salaryRange: "₹18-25 LPA",
      status: "open",
      submittedBy: "HR Admin",
      submittedByRole: "hr_admin",
      submittedDate: "2024-01-15",
      hiringManager: "Rajesh Verma",
      hiringManagerEmail: "manager@tristone.com",
      approvalStatus: "approved",
      approvalDate: "2024-01-18",
      platforms: ["linkedin", "indeed", "glassdoor"],
      standardMessage: "🚀 Exciting Opportunity: Senior Developer\n\nWe're looking for a talented Senior Developer to join our Engineering team!",
      publishedDate: "2024-01-20",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T14:00:00Z"
    },
    {
      id: "pos_2",
      title: "Product Manager",
      department: "Product",
      description: "Need a PM to lead our new product initiative",
      jobDescription: "We are looking for a Product Manager to lead our new product initiative. You will be responsible for defining product strategy, working with cross-functional teams, and driving product development from conception to launch.",
      professionalSummary: "Lead innovative products at Tristone Partners. Join a dynamic team where your ideas shape the future of fintech solutions.",
      requiredSkills: ["Product Strategy", "Agile", "Data Analysis", "User Research"],
      experienceLevel: "Mid Level (3-5 years)",
      location: "Mumbai, India",
      employmentType: "Full-time",
      salaryRange: "₹15-22 LPA",
      status: "pending_approval",
      submittedBy: "HR Admin",
      submittedByRole: "hr_admin",
      submittedDate: "2024-01-20",
      hiringManager: "Kavita Desai",
      hiringManagerEmail: "kavita.desai@tristone.com",
      approvalStatus: "pending",
      platforms: ["linkedin", "indeed"],
      createdAt: "2024-01-20T10:00:00Z",
      updatedAt: "2024-01-20T10:00:00Z"
    },
    {
      id: "pos_3",
      title: "UX Designer",
      department: "Design",
      description: "Designer for mobile app redesign project",
      jobDescription: "We are seeking a UX Designer to lead our mobile app redesign project. You will be responsible for creating user-centered designs, conducting user research, and collaborating with development teams to implement design solutions.",
      professionalSummary: "Create beautiful, intuitive experiences at Tristone Partners. Join our design team and make a lasting impact.",
      requiredSkills: ["Figma", "User Research", "Prototyping", "UI/UX Design"],
      experienceLevel: "Mid Level (3-5 years)",
      location: "Bangalore, India",
      employmentType: "Full-time",
      salaryRange: "₹12-18 LPA",
      status: "closed",
      submittedBy: "HR Admin",
      submittedByRole: "hr_admin",
      submittedDate: "2024-01-10",
      hiringManager: "Arjun Patel",
      hiringManagerEmail: "arjun.patel@tristone.com",
      approvalStatus: "approved",
      approvalDate: "2024-01-12",
      platforms: ["linkedin", "dice"],
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-01-25T10:00:00Z"
    }
  ])

  const addPosition = (position: Position) => {
    setPositions(prev => [position, ...prev])
  }

  const updatePosition = (id: string, updates: Partial<Position>) => {
    setPositions(prev => prev.map(pos => 
      pos.id === id 
        ? { ...pos, ...updates, updatedAt: new Date().toISOString() }
        : pos
    ))
  }

  const submitForApproval = (id: string) => {
    const position = positions.find(p => p.id === id)
    if (!position) return

    updatePosition(id, {
      status: "pending_approval",
      approvalStatus: "pending"
    })

    // TODO: Send email notification to hiring manager
    toast({
      title: "Sent for Approval",
      description: `JD sent to ${position.hiringManager} for approval`,
    })
  }

  const approvePosition = (id: string, notes?: string) => {
    const position = positions.find(p => p.id === id)
    if (!position) return

    updatePosition(id, {
      status: "approved",
      approvalStatus: "approved",
      approvalDate: new Date().toISOString().split('T')[0],
      approvalNotes: notes
    })

    // TODO: Send email notification to HR Admin
    toast({
      title: "Position Approved",
      description: `${position.title} has been approved`,
    })
  }

  const rejectPosition = (id: string, reason: string) => {
    const position = positions.find(p => p.id === id)
    if (!position) return

    updatePosition(id, {
      status: "rejected",
      approvalStatus: "rejected",
      approvalDate: new Date().toISOString().split('T')[0],
      rejectionReason: reason
    })

    // TODO: Send email notification to HR Admin
    toast({
      title: "Position Rejected",
      description: `${position.title} has been rejected`,
      variant: "destructive"
    })
  }

  const openPosition = (id: string) => {
    updatePosition(id, {
      status: "open"
    })

    toast({
      title: "Position Opened",
      description: "Position is now active and accepting candidates",
    })
  }

  const cancelPosition = (id: string, reason: string) => {
    updatePosition(id, {
      status: "cancelled",
      cancelledDate: new Date().toISOString().split('T')[0],
      cancelledBy: user?.name || "Unknown",
      cancellationReason: reason
    })

    toast({
      title: "Position Cancelled",
      description: "Position has been cancelled",
    })
  }

  return (
    <PositionsContext.Provider value={{
      positions,
      addPosition,
      updatePosition,
      submitForApproval,
      approvePosition,
      rejectPosition,
      openPosition,
      cancelPosition
    }}>
      {children}
    </PositionsContext.Provider>
  )
}

export function usePositions() {
  const context = useContext(PositionsContext)
  if (context === undefined) {
    throw new Error("usePositions must be used within a PositionsProvider")
  }
  return context
}
