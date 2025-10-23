"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"

interface Interview {
  id: number
  candidateName: string
  position: string
  date: string
  time: string
  location: string
  interviewer: string
  type: "phone" | "video" | "in-person"
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
}

interface InterviewScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  interview?: Interview | null
}

const interviewers = ["John Smith", "Sarah Johnson", "Mike Chen", "Lisa Anderson", "David Lee"]

export function InterviewScheduleModal({ isOpen, onClose, interview }: InterviewScheduleModalProps) {
  const [formData, setFormData] = useState({
    candidateName: "",
    position: "",
    date: "",
    time: "",
    location: "",
    interviewer: "",
    type: "in-person" as const,
    notes: "",
  })

  useEffect(() => {
    if (interview) {
      setFormData({
        candidateName: interview.candidateName,
        position: interview.position,
        date: interview.date,
        time: interview.time,
        location: interview.location,
        interviewer: interview.interviewer,
        type: interview.type,
        notes: interview.notes || "",
      })
    } else {
      setFormData({
        candidateName: "",
        position: "",
        date: "",
        time: "",
        location: "",
        interviewer: "",
        type: "in-person",
        notes: "",
      })
    }
  }, [interview, isOpen])

  const handleSave = () => {
    console.log("Scheduling interview:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{interview ? "Reschedule Interview" : "Schedule New Interview"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidateName" className="text-sm font-semibold text-neutral-700">
                Candidate Name
              </Label>
              <Input
                id="candidateName"
                placeholder="e.g., Alice Johnson"
                value={formData.candidateName}
                onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                className="border-neutral-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-semibold text-neutral-700">
                Position
              </Label>
              <Input
                id="position"
                placeholder="e.g., Senior Developer"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="border-neutral-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold text-neutral-700">
                Interview Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border-neutral-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-semibold text-neutral-700">
                Interview Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="border-neutral-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold text-neutral-700">
                Interview Type
              </Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="border-neutral-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold text-neutral-700">
                Location / Meeting Link
              </Label>
              <Input
                id="location"
                placeholder={formData.type === "in-person" ? "e.g., Conference Room A" : "e.g., https://zoom.us/..."}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="border-neutral-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewer" className="text-sm font-semibold text-neutral-700">
              Interviewer
            </Label>
            <Select
              value={formData.interviewer}
              onValueChange={(value) => setFormData({ ...formData, interviewer: value })}
            >
              <SelectTrigger className="border-neutral-200">
                <SelectValue placeholder="Select interviewer" />
              </SelectTrigger>
              <SelectContent>
                {interviewers.map((interviewer) => (
                  <SelectItem key={interviewer} value={interviewer}>
                    {interviewer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-semibold text-neutral-700">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or instructions for the interview..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="border-neutral-200 min-h-24"
            />
          </div>

          <Card className="p-4 bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Tip:</span> An email invitation will be automatically sent to the
              candidate with the interview details.
            </p>
          </Card>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" className="border-neutral-200 bg-transparent" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>
              {interview ? "Update Interview" : "Schedule Interview"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
