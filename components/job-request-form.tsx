"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, MessageSquare, Globe, Eye, Edit3 } from "lucide-react"

interface JobRequestFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function JobRequestForm({ onSubmit, onCancel }: JobRequestFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    description: "",
    submittedBy: "",
    jobDescription: "",
    standardMessage: "",
    platforms: [] as string[],
    salaryRange: "",
    location: "",
    employmentType: "",
    experienceLevel: "",
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [previewMode, setPreviewMode] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ 
      title: "", 
      department: "", 
      description: "", 
      submittedBy: "",
      jobDescription: "",
      standardMessage: "",
      platforms: [],
      salaryRange: "",
      location: "",
      employmentType: "",
      experienceLevel: "",
    })
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FileText size={16} />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="description" className="flex items-center gap-2">
            <Edit3 size={16} />
            Job Description
          </TabsTrigger>
          <TabsTrigger value="message" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Message Template
          </TabsTrigger>
          <TabsTrigger value="platforms" className="flex items-center gap-2">
            <Globe size={16} />
            Platforms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-neutral-700 font-medium">
                Job Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Senior Developer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="border-neutral-200"
              />
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
        </TabsContent>

        <TabsContent value="description" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="jobDescription" className="text-neutral-700 font-medium">
              Detailed Job Description *
            </Label>
            <Textarea
              id="jobDescription"
              placeholder="Provide a comprehensive job description including responsibilities, requirements, qualifications, and company information..."
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              required
              className="border-neutral-200 min-h-64"
            />
            <p className="text-sm text-neutral-500">
              This will be the main job description posted on job platforms. Be detailed and specific about requirements.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="message" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="standardMessage" className="text-neutral-700 font-medium">
                Standard Social Media Message
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({ ...formData, standardMessage: defaultStandardMessage })}
                className="text-xs"
              >
                Use Template
              </Button>
            </div>
            <Textarea
              id="standardMessage"
              placeholder="This message will be shared across social media platforms and job boards..."
              value={formData.standardMessage}
              onChange={(e) => setFormData({ ...formData, standardMessage: e.target.value })}
              className="border-neutral-200 min-h-48"
            />
            <p className="text-sm text-neutral-500">
              This message will be used for social media posts and job board announcements. Keep it engaging and professional.
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
          disabled={!formData.title || !formData.department || !formData.jobDescription || formData.platforms.length === 0}
        >
          Submit for HR Approval
        </Button>
      </div>
    </div>
  )
}
