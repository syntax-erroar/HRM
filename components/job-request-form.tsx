"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ title: "", department: "", description: "", submittedBy: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-neutral-900">Create New Job Request</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-neutral-700 font-medium">
            Job Title
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
            Department
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="submittedBy" className="text-neutral-700 font-medium">
          Submitted By
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
        <Label htmlFor="description" className="text-neutral-700 font-medium">
          Job Description
        </Label>
        <Textarea
          id="description"
          placeholder="Describe the role, responsibilities, and requirements..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="border-neutral-200 min-h-32"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="border-neutral-200 bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Submit Request
        </Button>
      </div>
    </form>
  )
}
