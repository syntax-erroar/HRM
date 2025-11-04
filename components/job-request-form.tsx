"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, MessageSquare, Globe, Eye, Edit3, RefreshCw } from "lucide-react"
import { getAvailableRoles, getJobTemplate } from "@/lib/job-templates-db"
import { useAuth } from "@/lib/auth-context"

interface JobRequestFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function JobRequestForm({ onSubmit, onCancel }: JobRequestFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    description: "",
    submittedBy: user?.name || "",
    jobDescription: "",
    professionalSummary: "",
    standardMessage: "",
    platforms: [] as string[],
    salaryRange: "",
    location: "",
    employmentType: "",
    experienceLevel: "",
    hiringManager: "",
    hiringManagerEmail: "",
  })

  // Mock hiring managers list - in production, fetch from API
  const hiringManagers = [
    { name: "Rajesh Verma", email: "manager@tristone.com", department: "Engineering" },
    { name: "Kavita Desai", email: "kavita.desai@tristone.com", department: "Product" },
    { name: "Arjun Patel", email: "arjun.patel@tristone.com", department: "Design" },
  ]

  const [activeTab, setActiveTab] = useState("basic")
  const [previewMode, setPreviewMode] = useState(false)
  const [loadedFromDb, setLoadedFromDb] = useState(false)
  const availableRoles = getAvailableRoles()

  // Auto-populate JD, Prof Summary, and Social Message when job title changes
  useEffect(() => {
    if (formData.title && availableRoles.includes(formData.title)) {
      const template = getJobTemplate(formData.title)
      if (template) {
        setFormData(prev => ({
          ...prev,
          jobDescription: template.jobDescription,
          professionalSummary: template.professionalSummary,
          standardMessage: replacePlaceholders(template.socialMessageTemplate, prev),
          department: template.category
        }))
        setLoadedFromDb(true)
      }
    }
  }, [formData.title])

  // Update social message when other fields change
  useEffect(() => {
    if (loadedFromDb && formData.title) {
      const template = getJobTemplate(formData.title)
      if (template) {
        setFormData(prev => ({
          ...prev,
          standardMessage: replacePlaceholders(template.socialMessageTemplate, prev)
        }))
      }
    }
  }, [formData.salaryRange, formData.location, formData.employmentType, formData.experienceLevel, formData.department])

  const replacePlaceholders = (template: string, data: any): string => {
    return template
      .replace(/{jobTitle}/g, data.title || '{jobTitle}')
      .replace(/{location}/g, data.location || '{location}')
      .replace(/{salaryRange}/g, data.salaryRange || '{salaryRange}')
      .replace(/{employmentType}/g, data.employmentType || '{employmentType}')
      .replace(/{experienceLevel}/g, data.experienceLevel || '{experienceLevel}')
      .replace(/{department}/g, data.department || '{department}')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ 
      title: "", 
      department: "", 
      description: "", 
      submittedBy: user?.name || "",
      jobDescription: "",
      professionalSummary: "",
      standardMessage: "",
      platforms: [],
      salaryRange: "",
      location: "",
      employmentType: "",
      experienceLevel: "",
      hiringManager: "",
      hiringManagerEmail: "",
    })
    setLoadedFromDb(false)
  }

  const handlePlatformChange = (platform: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, platforms: [...formData.platforms, platform] })
    } else {
      setFormData({ ...formData, platforms: formData.platforms.filter(p => p !== platform) })
    }
  }

  const defaultStandardMessage = `🚀 Exciting Opportunity: ${formData.title}

We're looking for a talented ${formData.title} to join our ${formData.department} team!

📍 Location: ${formData.location || 'Remote'}
💰 Salary: ${formData.salaryRange || 'Competitive'}
📋 Type: ${formData.employmentType || 'Full-time'}

Key Requirements:
• ${formData.experienceLevel || '3+ years'} of relevant experience
• Strong technical skills and problem-solving abilities
• Excellent communication and collaboration skills

Why join us?
• Competitive salary and benefits
• Flexible work arrangements
• Professional development opportunities
• Collaborative and innovative environment

Ready to make an impact? Apply now! 🎯

#Hiring #${formData.department} #${formData.title.replace(/\s+/g, '')} #RemoteWork`

  const availablePlatforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'indeed', name: 'Indeed', icon: '🔍' },
    { id: 'glassdoor', name: 'Glassdoor', icon: '🏢' },
    { id: 'angel', name: 'AngelList', icon: '👼' },
    { id: 'dice', name: 'Dice', icon: '🎲' },
    { id: 'ziprecruiter', name: 'ZipRecruiter', icon: '📦' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Create New Job Request</h2>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="gap-2"
          >
            {previewMode ? <Edit3 size={16} /> : <Eye size={16} />}
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FileText size={16} />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="description" className="flex items-center gap-2">
            <Edit3 size={16} />
            Job Description
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <FileText size={16} />
            Prof. Summary
          </TabsTrigger>
          <TabsTrigger value="message" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Social Message
          </TabsTrigger>
          <TabsTrigger value="platforms" className="flex items-center gap-2">
            <Globe size={16} />
            Platforms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          {loadedFromDb && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-sm text-green-800">
              <RefreshCw size={16} />
              Job Description, Professional Summary, and Social Message loaded from database. HR Admin can edit as needed.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-neutral-700 font-medium">
                Job Title * (Select from predefined roles)
              </Label>
              <Select
                value={formData.title}
                onValueChange={(value) => setFormData({ ...formData, title: value })}
              >
                <SelectTrigger className="border-neutral-200">
                  <SelectValue placeholder="Select job title" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-neutral-700 font-medium">
                Department *
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger className="border-neutral-200">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryRange" className="text-neutral-700 font-medium">
                Salary Range
              </Label>
              <Input
                id="salaryRange"
                placeholder="e.g., $80k - $120k"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                className="border-neutral-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-neutral-700 font-medium">
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="border-neutral-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType" className="text-neutral-700 font-medium">
                Employment Type
              </Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
              >
                <SelectTrigger className="border-neutral-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel" className="text-neutral-700 font-medium">
                Experience Level
              </Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
              >
                <SelectTrigger className="border-neutral-200">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry Level (0-2 years)">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="Mid Level (3-5 years)">Mid Level (3-5 years)</SelectItem>
                  <SelectItem value="Senior Level (5+ years)">Senior Level (5+ years)</SelectItem>
                  <SelectItem value="Lead/Principal (7+ years)">Lead/Principal (7+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="submittedBy" className="text-neutral-700 font-medium">
                Submitted By *
              </Label>
              <Input
                id="submittedBy"
                placeholder="Your name"
                value={formData.submittedBy}
                onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
                required
                className="border-neutral-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hiringManager" className="text-neutral-700 font-medium">
                Hiring Manager * (for JD Confirmation)
              </Label>
              <Select
                value={formData.hiringManager}
                onValueChange={(value) => {
                  const manager = hiringManagers.find(m => m.name === value)
                  setFormData({ 
                    ...formData, 
                    hiringManager: value,
                    hiringManagerEmail: manager?.email || ""
                  })
                }}
              >
                <SelectTrigger className="border-neutral-200">
                  <SelectValue placeholder="Select hiring manager" />
                </SelectTrigger>
                <SelectContent>
                  {hiringManagers.map(manager => (
                    <SelectItem key={manager.email} value={manager.name}>
                      {manager.name} - {manager.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-500">
                JD and Professional Summary will be sent for confirmation
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="description" className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="jobDescription" className="text-neutral-700 font-medium">
                Detailed Job Description * {loadedFromDb && "(From Database - Editable)"}
              </Label>
              {loadedFromDb && user?.role === "hr_admin" && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">HR Admin Can Edit</Badge>
              )}
            </div>
            <Textarea
              id="jobDescription"
              placeholder="Provide a comprehensive job description including responsibilities, requirements, qualifications, and company information..."
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              required
              readOnly={user?.role !== "hr_admin" && loadedFromDb}
              className={`border-neutral-200 min-h-64 ${user?.role !== "hr_admin" && loadedFromDb ? 'bg-neutral-50' : ''}`}
            />
            <p className="text-sm text-neutral-500">
              {user?.role === "hr_admin" 
                ? "HR Admin can edit the database template as needed before submitting."
                : "This job description is fetched from the database and will be posted on job platforms."}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="professionalSummary" className="text-neutral-700 font-medium">
                Professional Summary * {loadedFromDb && "(From Database - Editable)"}
              </Label>
              {loadedFromDb && user?.role === "hr_admin" && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">HR Admin Can Edit</Badge>
              )}
            </div>
            <Textarea
              id="professionalSummary"
              placeholder="Company overview and professional summary to be included with the job posting..."
              value={formData.professionalSummary}
              onChange={(e) => setFormData({ ...formData, professionalSummary: e.target.value })}
              required
              readOnly={user?.role !== "hr_admin" && loadedFromDb}
              className={`border-neutral-200 min-h-32 ${user?.role !== "hr_admin" && loadedFromDb ? 'bg-neutral-50' : ''}`}
            />
            <p className="text-sm text-neutral-500">
              {user?.role === "hr_admin"
                ? "HR Admin can edit the professional summary template as needed."
                : "This professional summary provides context about Tristone Partners for job postings."}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="message" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="standardMessage" className="text-neutral-700 font-medium">
                Social Media Message Template {loadedFromDb && "(Auto-generated with Placeholders)"}
              </Label>
              {loadedFromDb && (
                <Badge variant="outline" className="bg-green-50 text-green-700">Auto-populated</Badge>
              )}
            </div>
            <Textarea
              id="standardMessage"
              placeholder="This message will be shared across social media platforms and job boards..."
              value={formData.standardMessage}
              onChange={(e) => setFormData({ ...formData, standardMessage: e.target.value })}
              className="border-neutral-200 min-h-48"
            />
            <p className="text-sm text-neutral-500">
              Placeholders like {'{'}jobTitle{'}'}, {'{'}location{'}'}, {'{'}salaryRange{'}'} are automatically replaced with actual values. {user?.role === "hr_admin" && "You can customize this message as needed."}
            </p>
          </div>

          {previewMode && formData.standardMessage && (
            <Card className="p-4 border border-neutral-200 bg-neutral-50">
              <h4 className="font-semibold text-neutral-900 mb-2">Message Preview:</h4>
              <div className="whitespace-pre-wrap text-sm text-neutral-700">
                {formData.standardMessage}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="space-y-4">
            <Label className="text-neutral-700 font-medium">
              Select Job Platforms *
            </Label>
            <p className="text-sm text-neutral-500">
              Choose the platforms where this job will be posted after approval.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availablePlatforms.map((platform) => (
                <Card
                  key={platform.id}
                  className={`p-4 border-2 transition-colors cursor-pointer ${
                    formData.platforms.includes(platform.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => handlePlatformChange(platform.id, !formData.platforms.includes(platform.id))}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={formData.platforms.includes(platform.id)}
                      onChange={() => handlePlatformChange(platform.id, !formData.platforms.includes(platform.id))}
                    />
                    <span className="text-2xl">{platform.icon}</span>
                    <span className="font-medium text-neutral-900">{platform.name}</span>
                  </div>
                </Card>
              ))}
            </div>
            {formData.platforms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.platforms.map((platform) => (
                  <Badge key={platform} variant="secondary" className="gap-1">
                    {availablePlatforms.find(p => p.id === platform)?.icon}
                    {availablePlatforms.find(p => p.id === platform)?.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 justify-end pt-6 border-t border-neutral-200">
        <Button type="button" variant="outline" onClick={onCancel} className="border-neutral-200 bg-transparent">
          Cancel
        </Button>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!formData.title || !formData.department || !formData.jobDescription || !formData.professionalSummary || formData.platforms.length === 0}
        >
          Submit for JD Approval
        </Button>
      </div>
    </div>
  )
}
