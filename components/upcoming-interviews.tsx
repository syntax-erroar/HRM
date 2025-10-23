"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User } from "lucide-react"

interface Interview {
  id: number
  candidateName: string
  position: string
  date: string
  time: string
  location: string
  interviewer: string
  type: "phone" | "video" | "in-person"
}

const upcomingInterviews: Interview[] = [
  {
    id: 1,
    candidateName: "Alice Johnson",
    position: "Senior Developer",
    date: "Oct 25, 2025",
    time: "10:00 AM",
    location: "Conference Room A",
    interviewer: "John Smith",
    type: "in-person",
  },
  {
    id: 2,
    candidateName: "Carol Davis",
    position: "UX Designer",
    date: "Oct 25, 2025",
    time: "2:00 PM",
    location: "Zoom",
    interviewer: "Sarah Johnson",
    type: "video",
  },
  {
    id: 3,
    candidateName: "Emma Wilson",
    position: "Product Manager",
    date: "Oct 26, 2025",
    time: "11:00 AM",
    location: "Conference Room B",
    interviewer: "Mike Chen",
    type: "in-person",
  },
]

export function UpcomingInterviews() {
  return (
    <Card className="p-6 border border-neutral-200">
      <h3 className="text-lg font-bold text-neutral-900 mb-4">Upcoming Interviews</h3>
      <div className="space-y-4">
        {upcomingInterviews.map((interview) => (
          <div key={interview.id} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-neutral-900">{interview.candidateName}</p>
                <p className="text-sm text-neutral-600">{interview.position}</p>
              </div>
              <Badge
                className={
                  interview.type === "in-person"
                    ? "bg-blue-100 text-blue-800"
                    : interview.type === "video"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                }
              >
                {interview.type === "in-person" ? "In-Person" : interview.type === "video" ? "Video" : "Phone"}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-neutral-600 mb-3">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                {interview.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                {interview.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                {interview.location}
              </div>
              <div className="flex items-center gap-2">
                <User size={14} />
                {interview.interviewer}
              </div>
            </div>

            <Button variant="outline" className="w-full border-neutral-200 bg-transparent text-sm" size="sm">
              View Details
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
