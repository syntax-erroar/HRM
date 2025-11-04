"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Plus, Calendar, Clock, MapPin, User, Mail, Send } from "lucide-react"
import { InterviewScheduleModal } from "@/components/interview-schedule-modal"
import { InterviewCalendar } from "@/components/interview-calendar"
import { emailService } from "@/lib/email-service"
import { useToast } from "@/hooks/use-toast"
import { EnhancedEmailModal } from "@/components/enhanced-email-modal"

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
  candidateEmail?: string
}

const interviews: Interview[] = [
  {
    id: 1,
    candidateName: "Alice Johnson",
    position: "Senior Developer",
    date: "Oct 25, 2025",
    time: "10:00 AM",
    location: "Conference Room A",
    interviewer: "John Smith",
    type: "in-person",
    status: "scheduled",
    candidateEmail: "alice.johnson@example.com",
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
    status: "scheduled",
    candidateEmail: "carol.davis@example.com",
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
    status: "scheduled",
    candidateEmail: "emma.wilson@example.com",
  },
  {
    id: 4,
    candidateName: "Frank Brown",
    position: "Data Analyst",
    date: "Oct 23, 2025",
    time: "3:00 PM",
    location: "Zoom",
    interviewer: "Lisa Anderson",
    type: "video",
    status: "completed",
    notes: "Strong technical skills, good communication",
    candidateEmail: "frank.brown@example.com",
  },
]

export default function InterviewsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailTarget, setEmailTarget] = useState<Interview | null>(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const filteredInterviews = interviews.filter(
    (interview) =>
      interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const upcomingInterviews = filteredInterviews.filter((i) => i.status === "scheduled")
  const completedInterviews = filteredInterviews.filter((i) => i.status === "completed")

  const handleScheduleInterview = (interview: Interview) => {
    setSelectedInterview(interview)
    setIsScheduleModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsScheduleModalOpen(false)
    setSelectedInterview(null)
  }

  const handleSendReminder = async (interview: Interview) => {
    if (!interview.candidateEmail) {
      toast({
        title: "Error",
        description: "No email address available for this candidate",
        variant: "destructive",
      })
      return
    }

    setIsSendingEmail(true)
    try {
      const result = await emailService.sendInterviewReminder(
        interview.candidateEmail,
        interview.candidateName,
        interview.position,
        interview.date,
        interview.time,
        interview.location,
        interview.interviewer
      )

      if (result.success) {
        toast({
          title: "Reminder Sent",
          description: `Interview reminder sent to ${interview.candidateName}`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send reminder",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleSendInterviewInvitation = async (interview: Interview) => {
    if (!interview.candidateEmail) {
      toast({
        title: "Error",
        description: "No email address available for this candidate",
        variant: "destructive",
      })
      return
    }

    setIsSendingEmail(true)
    try {
      const result = await emailService.sendInterviewInvitation(
        interview.candidateEmail,
        interview.candidateName,
        interview.position,
        interview.date,
        interview.time,
        interview.location,
        interview.interviewer,
        interview.type === "video" ? "Video Call" : interview.type === "in-person" ? "In-Person" : "Phone Call"
      )

      if (result.success) {
        toast({
          title: "Invitation Sent",
          description: `Interview invitation sent to ${interview.candidateName}`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send invitation",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleOpenEmailModal = (interview: Interview) => {
    setEmailTarget(interview)
    setShowEmailModal(true)
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">Tristone Hire - Interview Management</h1>
            <p className="text-neutral-500 mt-1">Manage and schedule candidate interviews for our global advisory services team</p>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
                  <Input
                    placeholder="Search interviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-neutral-200"
                  />
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  onClick={() => setIsScheduleModalOpen(true)}
                >
                  <Plus size={16} />
                  Schedule Interview
                </Button>
              </div>

              <div className="space-y-4">
                {upcomingInterviews.length === 0 ? (
                  <Card className="p-8 text-center border border-neutral-200">
                    <Calendar size={32} className="mx-auto mb-3 text-neutral-400" />
                    <p className="text-neutral-600">No upcoming interviews scheduled</p>
                  </Card>
                ) : (
                  upcomingInterviews.map((interview) => (
                    <Card
                      key={interview.id}
                      className="p-6 border border-neutral-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-neutral-900 mb-1">{interview.candidateName}</h3>
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
                          {interview.type === "in-person"
                            ? "In-Person"
                            : interview.type === "video"
                              ? "Video"
                              : "Phone"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <Calendar size={16} className="text-neutral-400" />
                          <span>{interview.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <Clock size={16} className="text-neutral-400" />
                          <span>{interview.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <MapPin size={16} className="text-neutral-400" />
                          <span>{interview.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <User size={16} className="text-neutral-400" />
                          <span>{interview.interviewer}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleSendReminder(interview)}
                          disabled={isSendingEmail}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Reminder
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-purple-200 bg-purple-50 text-purple-700"
                          onClick={() => handleSendInterviewInvitation(interview)}
                          disabled={isSendingEmail}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Invitation
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-neutral-200 bg-transparent"
                          onClick={() => handleOpenEmailModal(interview)}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Custom Email
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
                  <Input
                    placeholder="Search completed interviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-neutral-200"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {completedInterviews.length === 0 ? (
                  <Card className="p-8 text-center border border-neutral-200">
                    <Calendar size={32} className="mx-auto mb-3 text-neutral-400" />
                    <p className="text-neutral-600">No completed interviews</p>
                  </Card>
                ) : (
                  completedInterviews.map((interview) => (
                    <Card key={interview.id} className="p-6 border border-neutral-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-neutral-900 mb-1">{interview.candidateName}</h3>
                          <p className="text-sm text-neutral-600">{interview.position}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <Calendar size={16} className="text-neutral-400" />
                          <span>{interview.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <Clock size={16} className="text-neutral-400" />
                          <span>{interview.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <MapPin size={16} className="text-neutral-400" />
                          <span>{interview.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <User size={16} className="text-neutral-400" />
                          <span>{interview.interviewer}</span>
                        </div>
                      </div>

                      {interview.notes && (
                        <div className="mb-4 p-3 bg-neutral-50 rounded border border-neutral-200">
                          <p className="text-xs font-semibold text-neutral-700 mb-1">Interview Notes</p>
                          <p className="text-sm text-neutral-700">{interview.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 border-neutral-200 bg-transparent">
                          View Feedback
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-blue-200 bg-blue-50 text-blue-700"
                          onClick={() => handleOpenEmailModal(interview)}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <InterviewCalendar interviews={interviews} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <InterviewScheduleModal isOpen={isScheduleModalOpen} onClose={handleCloseModal} interview={selectedInterview} />
      
      {/* Enhanced Email Modal */}
      <EnhancedEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        candidateEmail={emailTarget?.candidateEmail || ""}
        candidateName={emailTarget?.candidateName || ""}
        position={emailTarget?.position || ""}
        onEmailSent={(success) => {
          if (success) {
            setShowEmailModal(false)
            setEmailTarget(null)
          }
        }}
      />
    </div>
  )
}
