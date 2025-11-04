"use client"

import { TimelineEvent } from "@/lib/candidate-types"
import { CheckCircle2, Circle, Clock, FileText, Phone, Users, Briefcase, Trophy, Gift } from "lucide-react"
import { Card } from "@/components/ui/card"

interface CandidateTimelineProps {
  timeline: TimelineEvent[]
}

const timelineIcons = {
  jd_raised: FileText,
  jd_approved: CheckCircle2,
  resume_received: FileText,
  call_screening: Phone,
  hr_round: Users,
  hm_round: Briefcase,
  ceo_round: Trophy,
  offer_extended: Gift,
  offer_accepted: CheckCircle2
}

const statusColors = {
  completed: {
    bg: "bg-green-100",
    border: "border-green-500",
    text: "text-green-700",
    icon: "text-green-600"
  },
  scheduled: {
    bg: "bg-blue-100",
    border: "border-blue-500",
    text: "text-blue-700",
    icon: "text-blue-600"
  },
  pending: {
    bg: "bg-neutral-100",
    border: "border-neutral-300",
    text: "text-neutral-500",
    icon: "text-neutral-400"
  }
}

export function CandidateTimeline({ timeline }: CandidateTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-neutral-200" />
        
        {timeline.map((event, index) => {
          const Icon = timelineIcons[event.type] || Circle
          const colors = statusColors[event.status]
          const isLast = index === timeline.length - 1
          
          return (
            <div key={event.id} className="relative pb-8 last:pb-0">
              {/* Icon */}
              <div className={`absolute left-0 flex items-center justify-center w-12 h-12 rounded-full border-2 ${colors.border} ${colors.bg}`}>
                <Icon size={20} className={colors.icon} />
              </div>
              
              {/* Content */}
              <div className="ml-16">
                <Card className={`p-4 border-2 ${colors.border} ${colors.bg}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`font-semibold ${colors.text}`}>
                        {event.title}
                      </h4>
                      {event.date && (
                        <p className="text-sm text-neutral-600 mt-1">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {event.status === "completed" && <CheckCircle2 size={18} className="text-green-600" />}
                      {event.status === "scheduled" && <Clock size={18} className="text-blue-600" />}
                      {event.status === "pending" && <Circle size={18} className="text-neutral-400" />}
                      <span className={`text-xs font-medium uppercase ${colors.text}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  
                  {event.notes && (
                    <p className="text-sm text-neutral-600 mt-2 pl-4 border-l-2 border-neutral-300">
                      {event.notes}
                    </p>
                  )}
                </Card>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
