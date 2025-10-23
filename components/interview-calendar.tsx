"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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
}

interface InterviewCalendarProps {
  interviews: Interview[]
}

export function InterviewCalendar({ interviews }: InterviewCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 25))

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getInterviewsForDate = (day: number) => {
    const dateStr = `Oct ${day}, 2025`
    return interviews.filter((i) => i.date === dateStr && i.status === "scheduled")
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-neutral-900">{monthName}</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-neutral-200 bg-transparent" onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="sm" className="border-neutral-200 bg-transparent" onClick={handleNextMonth}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-neutral-700 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const dayInterviews = day ? getInterviewsForDate(day) : []
            return (
              <div
                key={idx}
                className={`min-h-24 p-2 rounded border ${
                  day
                    ? dayInterviews.length > 0
                      ? "bg-blue-50 border-blue-200"
                      : "bg-neutral-50 border-neutral-200"
                    : "bg-neutral-100 border-neutral-200"
                }`}
              >
                {day && (
                  <>
                    <p className="font-semibold text-neutral-900 text-sm mb-1">{day}</p>
                    <div className="space-y-1">
                      {dayInterviews.slice(0, 2).map((interview) => (
                        <div key={interview.id} className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate">
                          {interview.time}
                        </div>
                      ))}
                      {dayInterviews.length > 2 && (
                        <div className="text-xs text-neutral-600">+{dayInterviews.length - 2} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="font-bold text-neutral-900">Upcoming Interviews</h3>
        {interviews
          .filter((i) => i.status === "scheduled")
          .slice(0, 5)
          .map((interview) => (
            <Card key={interview.id} className="p-4 border border-neutral-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900">{interview.candidateName}</p>
                  <p className="text-sm text-neutral-600">{interview.position}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {interview.date} at {interview.time}
                  </p>
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
            </Card>
          ))}
      </div>
    </div>
  )
}
