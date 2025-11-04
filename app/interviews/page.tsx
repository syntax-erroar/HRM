"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Search, Clock, MapPin, User, Video, Phone, Building2, Mail, FileText, Eye, CheckCircle, XCircle } from "lucide-react"
import { mockInterviews } from "@/lib/mock-interviews-data"
import { Interview, InterviewStatus, CompletedStatus } from "@/lib/interview-types"
import { InterviewCalendar } from "@/components/interview-calendar"
import { InterviewDetailModal } from "@/components/interview-detail-modal"
import { ScheduleInterviewModal } from "@/components/schedule-interview-modal"
import { useAuth } from "@/lib/auth-context"

export default function InterviewsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [interviews] = useState<Interview[]>(mockInterviews)
  const [mainTab, setMainTab] = useState<InterviewStatus>("pending")
  const [completedSubTab, setCompletedSubTab] = useState<CompletedStatus>("reviewing")

  // Filter interviews
  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = 
      interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (mainTab === "completed") {
      return matchesSearch && interview.status === "completed" && interview.completedStatus === completedSubTab
    }
    
    return matchesSearch && interview.status === mainTab
  })

  // Count functions
  const getCountByStatus = (status: InterviewStatus) => {
    return interviews.filter(i => i.status === status).length
  }

  const getCompletedCount = (completedStatus: CompletedStatus) => {
    return interviews.filter(i => i.status === "completed" && i.completedStatus === completedStatus).length
  }

  const handleViewDetails = (interview: Interview) => {
    setSelectedInterview(interview)
    setIsDetailModalOpen(true)
  }

  const handleScheduleInterview = (interview?: Interview) => {
    if (interview) {
      setSelectedInterview(interview)
    }
    setIsScheduleModalOpen(true)
  }

  const interviewTypeIcons = {
    phone: Phone,
    video: Video,
    "in-person": Building2
  }

  const statusConfig = {
    pending: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
    upcoming: { label: "Upcoming", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    reviewing: { label: "Reviewing", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
    accepted: { label: "Accepted", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
    rejected: { label: "Rejected", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Interviews</h1>
              <p className="text-neutral-500 mt-1">Schedule and manage candidate interviews</p>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setIsCalendarOpen(true)}
            >
              <CalendarIcon size={20} />
              View Calendar
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
              <Input
                placeholder="Search by candidate name, position, or interviewer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Main Tabs: Pending / Upcoming / Completed */}
          <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as InterviewStatus)}>
            <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-neutral-100 p-1 text-neutral-600 w-auto">
              <TabsTrigger 
                value="pending"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm"
              >
                Pending ({getCountByStatus("pending")})
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm"
              >
                Upcoming ({getCountByStatus("upcoming")})
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm"
              >
                Completed ({getCountByStatus("completed")})
              </TabsTrigger>
            </TabsList>

            {/* Pending Tab */}
            <TabsContent value="pending" className="mt-6 space-y-4">
              {filteredInterviews.length === 0 ? (
                <Card className="p-12 text-center">
                  <Clock size={48} className="mx-auto text-neutral-300 mb-4" />
                  <p className="text-neutral-500">No pending interviews</p>
                  <p className="text-sm text-neutral-400 mt-1">Interviews awaiting scheduling will appear here</p>
                </Card>
              ) : (
                filteredInterviews.map(interview => {
                  const config = statusConfig.pending
                  return (
                    <Card key={interview.id} className="p-6 hover:shadow-lg transition-all border-l-4 hover:border-l-amber-600">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-neutral-900">{interview.candidateName}</h3>
                            <Badge className={`${config.bg} ${config.color} border ${config.border}`}>
                              Pending Schedule
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
                            <span className="flex items-center gap-2">
                              <FileText size={16} />
                              {interview.position}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-2">
                              <User size={16} />
                              Interviewer: {interview.interviewer}
                            </span>
                          </div>
                          
                          <p className="text-sm text-neutral-600">{interview.candidateEmail}</p>
                        </div>
                        
                        <Button 
                          onClick={() => handleScheduleInterview(interview)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CalendarIcon className="mr-2" size={16} />
                          Schedule Interview
                        </Button>
                      </div>
                    </Card>
                  )
                })
              )}
            </TabsContent>

            {/* Upcoming Tab */}
            <TabsContent value="upcoming" className="mt-6 space-y-4">
              {filteredInterviews.length === 0 ? (
                <Card className="p-12 text-center">
                  <CalendarIcon size={48} className="mx-auto text-neutral-300 mb-4" />
                  <p className="text-neutral-500">No upcoming interviews</p>
                  <p className="text-sm text-neutral-400 mt-1">Scheduled interviews will appear here</p>
                </Card>
              ) : (
                filteredInterviews.map(interview => {
                  const config = statusConfig.upcoming
                  const TypeIcon = interviewTypeIcons[interview.interviewType || "video"]
                  
                  return (
                    <Card key={interview.id} className="p-6 hover:shadow-lg transition-all border-l-4 hover:border-l-blue-600">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-neutral-900">{interview.candidateName}</h3>
                            <Badge className={`${config.bg} ${config.color} border ${config.border}`}>
                              Scheduled
                            </Badge>
                          </div>
                          
                          <p className="text-sm font-medium text-neutral-700 mb-3">{interview.position}</p>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm text-neutral-600">
                            <div className="flex items-center gap-2">
                              <CalendarIcon size={16} />
                              {interview.scheduledDate && new Date(interview.scheduledDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} />
                              {interview.scheduledTime}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} />
                              {interview.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <TypeIcon size={16} />
                              {interview.interviewType && interview.interviewType.charAt(0).toUpperCase() + interview.interviewType.slice(1)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-neutral-600 mt-3">
                            <User size={16} />
                            <span>Interviewer: <strong>{interview.interviewer}</strong></span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            onClick={() => handleViewDetails(interview)}
                          >
                            <Eye className="mr-2" size={16} />
                            View Details
                          </Button>
                          <Button 
                            variant="outline"
                            className="gap-2"
                          >
                            <Mail size={16} />
                            Send Reminder
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })
              )}
            </TabsContent>

            {/* Completed Tab with Sub-tabs */}
            <TabsContent value="completed" className="mt-6">
              <Card className="border-2 border-neutral-200">
                <Tabs value={completedSubTab} onValueChange={(v) => setCompletedSubTab(v as CompletedStatus)}>
                  <TabsList className="w-full grid grid-cols-3 h-14 bg-neutral-50 rounded-t-lg rounded-b-none border-b border-neutral-200">
                    <TabsTrigger 
                      value="reviewing"
                      className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none"
                    >
                      Reviewing ({getCompletedCount("reviewing")})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="accepted"
                      className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none"
                    >
                      Accepted ({getCompletedCount("accepted")})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="rejected"
                      className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-red-600 data-[state=active]:text-red-600 rounded-none"
                    >
                      Rejected ({getCompletedCount("rejected")})
                    </TabsTrigger>
                  </TabsList>

                  {/* Content for each sub-tab */}
                  <div className="p-6 space-y-4 bg-white">
                  {filteredInterviews.length === 0 ? (
                    <div className="p-12 text-center">
                      <FileText size={48} className="mx-auto text-neutral-300 mb-4" />
                      <p className="text-neutral-500">No interviews in this category</p>
                    </div>
                  ) : (
                    filteredInterviews.map(interview => {
                      const config = statusConfig[interview.completedStatus || "reviewing"]
                      const hasNotes = interview.interviewerNotes && interview.interviewerNotes.length > 0
                      
                      return (
                        <Card key={interview.id} className="p-6 hover:shadow-lg transition-all border-l-4 hover:border-l-purple-600">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-neutral-900">{interview.candidateName}</h3>
                                <Badge className={`${config.bg} ${config.color} border ${config.border}`}>
                                  {config.label}
                                </Badge>
                                {hasNotes && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                    {interview.interviewerNotes.length} Note{interview.interviewerNotes.length > 1 ? 's' : ''}
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm font-medium text-neutral-700 mb-3">{interview.position}</p>
                              
                              <div className="grid grid-cols-2 gap-3 text-sm text-neutral-600 mb-3">
                                <div className="flex items-center gap-2">
                                  <CalendarIcon size={16} />
                                  Completed: {interview.completedAt && new Date(interview.completedAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <User size={16} />
                                  Interviewer: {interview.interviewer}
                                </div>
                              </div>
                              
                              {interview.hrNotes && (
                                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                                  <p className="text-sm text-blue-900">
                                    <strong>HR Notes:</strong> {interview.hrNotes}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="outline"
                                onClick={() => handleViewDetails(interview)}
                              >
                                <Eye className="mr-2" size={16} />
                                View Details
                              </Button>
                              <Button 
                                variant="outline"
                                className="gap-2"
                              >
                                <Mail size={16} />
                                Send Email
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )
                    })
                  )}
                  </div>
                </Tabs>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Calendar Dialog */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="max-w-4xl">
          <InterviewCalendar interviews={interviews.filter(i => i.status === "upcoming")} />
        </DialogContent>
      </Dialog>

      {/* Interview Detail Modal */}
      {selectedInterview && (
        <InterviewDetailModal
          interview={selectedInterview}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedInterview(null)
          }}
          onUpdate={(updatedInterview) => {
            setSelectedInterview(updatedInterview)
          }}
        />
      )}

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        interview={selectedInterview}
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false)
          setSelectedInterview(null)
        }}
        onSchedule={(scheduledInterview) => {
          // Update interview in list
          console.log("Interview scheduled:", scheduledInterview)
          setIsScheduleModalOpen(false)
          setSelectedInterview(null)
        }}
      />
    </div>
  )
}
