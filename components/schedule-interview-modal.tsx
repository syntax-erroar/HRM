"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Video } from "lucide-react"
import { Interview, InterviewType } from "@/lib/interview-types"
import { useToast } from "@/hooks/use-toast"

interface ScheduleInterviewModalProps {
  interview: Interview | null
  isOpen: boolean
  onClose: () => void
  onSchedule: (interview: Interview) => void
}

export function ScheduleInterviewModal({ 
  interview, 
  isOpen, 
  onClose, 
  onSchedule 
}: ScheduleInterviewModalProps) {
  const { toast } = useToast()
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [interviewType, setInterviewType] = useState<InterviewType>("video")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!interview) return null

  const handleSchedule = async () => {
    if (!date || !time || !location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const scheduledInterview: Interview = {
        ...interview,
        scheduledDate: date,
        scheduledTime: time,
        location: location,
        interviewType: interviewType,
        status: "upcoming",
        updatedAt: new Date().toISOString()
      }

      onSchedule(scheduledInterview)
      
      toast({
        title: "Interview Scheduled",
        description: `Interview scheduled with ${interview.candidateName} for ${new Date(date).toLocaleDateString()}`
      })

      // Reset form
      setDate("")
      setTime("")
      setLocation("")
      setInterviewType("video")
      onClose()

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule interview",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <p className="text-neutral-600">
            {interview.candidateName} - {interview.position}
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                <Calendar size={16} />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="time" className="flex items-center gap-2 mb-2">
                <Clock size={16} />
                Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="interview-type" className="flex items-center gap-2 mb-2">
              <Video size={16} />
              Interview Type *
            </Label>
            <Select value={interviewType} onValueChange={(v) => setInterviewType(v as InterviewType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video Call</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location" className="flex items-center gap-2 mb-2">
              <MapPin size={16} />
              Location *
            </Label>
            <Input
              id="location"
              placeholder={
                interviewType === "video" ? "Zoom Meeting Link" :
                interviewType === "phone" ? "Phone Number" :
                "Office Address / Conference Room"
              }
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
