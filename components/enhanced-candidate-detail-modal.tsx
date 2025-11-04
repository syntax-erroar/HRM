"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  User, Mail, Phone, GraduationCap, Calendar, MapPin, 
  FileText, Download, CheckCircle, XCircle, Star, 
  TrendingUp, TrendingDown, AlertCircle, MessageSquare,
  Send
} from "lucide-react"
import { Candidate, ScreeningType } from "@/lib/candidate-types"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Briefcase } from "lucide-react"

interface CandidateDetailModalProps {
  candidate: Candidate
  screeningType: ScreeningType
  isOpen: boolean
  onClose: () => void
  onUpdate: (candidate: Candidate) => void
}

export function CandidateDetailModal({ 
  candidate, 
  screeningType,
  isOpen, 
  onClose, 
  onUpdate 
}: CandidateDetailModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  const [decision, setDecision] = useState<"accept" | "reject" | null>(null)
  const [decisionNotes, setDecisionNotes] = useState("")
  const [sendEmail, setSendEmail] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentStatus = screeningType === "resume" 
    ? candidate.resumeScreeningStatus 
    : candidate.callScreeningStatus

  const canMakeDecision = user?.role === "hr_admin" || user?.role === "hr_team"

  const handleDecision = (action: "accept" | "reject") => {
    setDecision(action)
    setShowDecisionModal(true)
  }

  const submitDecision = async () => {
    if (!decisionNotes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please add notes before submitting your decision.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update candidate status
      const newStatus = decision === "accept" ? "approved" : "rejected"
      const updatedCandidate = {
        ...candidate,
        [screeningType === "resume" ? "resumeScreeningStatus" : "callScreeningStatus"]: newStatus,
        notes: [
          ...candidate.notes,
          {
            id: `note_${Date.now()}`,
            author: user?.name || "Current User",
            authorRole: user?.role || "hr_team",
            date: new Date().toISOString().split('T')[0],
            content: decisionNotes,
            stage: screeningType
          }
        ]
      }

      onUpdate(updatedCandidate)
      
      if (sendEmail) {
        toast({
          title: "Email Sent",
          description: `Notification email sent to ${candidate.fullName}`,
        })
      }

      toast({
        title: decision === "accept" ? "Candidate Approved" : "Candidate Rejected",
        description: `${candidate.fullName} has been ${decision === "accept" ? "approved" : "rejected"} for ${screeningType} screening.`,
      })

      setShowDecisionModal(false)
      setDecisionNotes("")
      setDecision(null)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit decision. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="!max-w-[95vw] !w-[95vw] !h-[95vh] !max-h-[95vh] overflow-hidden !p-0 sm:!max-w-[95vw]">
          {/* Enhanced Header with gradient background */}
          <DialogHeader className="pb-6 border-b border-neutral-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8 mb-0">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Avatar Circle */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {candidate.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <DialogTitle className="text-3xl font-bold text-neutral-900">{candidate.fullName}</DialogTitle>
                  <p className="text-lg text-neutral-700 mt-1 font-medium">{candidate.position}</p>
                  <div className="flex gap-2 mt-2">
                    <div className="flex items-center gap-1 text-sm text-neutral-600">
                      <Mail size={14} />
                      {candidate.email}
                    </div>
                    <span className="text-neutral-300">•</span>
                    <div className="flex items-center gap-1 text-sm text-neutral-600">
                      <Phone size={14} />
                      {candidate.phone}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge className={
                  currentStatus === "pending" ? "bg-amber-500 text-white" :
                  currentStatus === "reviewing" ? "bg-blue-500 text-white" :
                  currentStatus === "approved" ? "bg-green-500 text-white" :
                  "bg-red-500 text-white"
                }>
                  {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                </Badge>
                {candidate.resumeInsights && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg px-4 py-2">
                    {candidate.resumeInsights.relevanceScore}% Match
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto h-[calc(95vh-200px)] px-8 pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="inline-flex h-14 items-center justify-center rounded-lg bg-neutral-100 p-1 text-neutral-600 w-auto mb-8">
              <TabsTrigger 
                value="overview"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm gap-2"
              >
                <User size={16} />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="resume"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm gap-2"
              >
                <FileText size={16} />
                Resume Insights
              </TabsTrigger>
              <TabsTrigger 
                value="notes"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm gap-2"
              >
                <MessageSquare size={16} />
                Notes & Rating
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8 mt-0">
              <div className="grid grid-cols-3 gap-8">
                {/* Education Card */}
                <Card className="p-8 border-2 border-neutral-200 hover:border-blue-400 transition-colors hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-blue-100 rounded-xl">
                      <GraduationCap size={32} className="text-blue-600" />
                    </div>
                    <h3 className="font-bold text-neutral-900 text-xl">Education</h3>
                  </div>
                  <p className="text-lg font-semibold text-neutral-900 mb-2">{candidate.education}</p>
                  {candidate.university && (
                    <p className="text-base text-neutral-600 mb-4">{candidate.university}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-base text-neutral-700 mt-4">
                    {candidate.cgpa && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                        <span className="font-semibold">CGPA:</span> {candidate.cgpa}
                      </div>
                    )}
                    {candidate.graduationYear && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                        <Calendar size={16} />
                        {candidate.graduationYear}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Experience Card */}
                <Card className="p-8 border-2 border-neutral-200 hover:border-purple-400 transition-colors hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-purple-100 rounded-xl">
                      <Briefcase size={32} className="text-purple-600" />
                    </div>
                    <h3 className="font-bold text-neutral-900 text-xl">Experience</h3>
                  </div>
                  <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {candidate.experience}
                  </p>
                  <p className="text-base text-neutral-600 mt-3">Total Work Experience</p>
                </Card>

                {/* Application Details Card */}
                <Card className="p-8 border-2 border-neutral-200 hover:border-green-400 transition-colors hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-green-100 rounded-xl">
                      <FileText size={32} className="text-green-600" />
                    </div>
                    <h3 className="font-bold text-neutral-900 text-xl">Application</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                      <span className="text-base text-neutral-600">Applied Date</span>
                      <span className="font-semibold text-base">{new Date(candidate.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                      <span className="text-base text-neutral-600">Source</span>
                      <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">{candidate.source}</Badge>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-base text-neutral-600">Status</span>
                      <Badge className={
                        currentStatus === "pending" ? "bg-amber-100 text-amber-800" :
                        currentStatus === "reviewing" ? "bg-blue-100 text-blue-800" :
                        currentStatus === "approved" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }>
                        {currentStatus}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Call Screening Data (if available) */}
              {candidate.callScreening && screeningType === "call" && (
                <Card className="p-8 border-2 border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <Phone size={18} />
                    Call Screening Results
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-neutral-600">Communication</p>
                      <div className="flex items-center gap-2 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < (candidate.callScreening?.communicationRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Technical</p>
                      <div className="flex items-center gap-2 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < (candidate.callScreening?.technicalUnderstanding || 0) ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Culture Fit</p>
                      <div className="flex items-center gap-2 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < (candidate.callScreening?.cultureFit || 0) ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Overall Impression:</p>
                      <p className="text-sm text-neutral-600 mt-1">{candidate.callScreening.overallImpression}</p>
                    </div>
                    {candidate.callScreening.keyObservations && (
                      <div>
                        <p className="text-sm font-medium text-neutral-700 mb-2">Key Observations:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {candidate.callScreening.keyObservations.map((obs, i) => (
                            <li key={i} className="text-sm text-neutral-600">{obs}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Resume Insights Tab */}
            <TabsContent value="resume" className="space-y-6 mt-6">
              {candidate.resumeInsights ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">AI Resume Analysis</h3>
                      <p className="text-sm text-neutral-600">Powered by ML model</p>
                    </div>
                    <Button className="gap-2">
                      <Download size={16} />
                      Download Resume
                    </Button>
                  </div>

                  {/* Relevance Score */}
                  <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-neutral-700">Relevance Score</h4>
                        <p className="text-4xl font-bold text-blue-600 mt-2">
                          {candidate.resumeInsights.relevanceScore}%
                        </p>
                      </div>
                      <Badge className={
                        candidate.resumeInsights.relevanceScore >= 90 ? "bg-green-600" :
                        candidate.resumeInsights.relevanceScore >= 75 ? "bg-blue-600" :
                        candidate.resumeInsights.relevanceScore >= 60 ? "bg-amber-600" :
                        "bg-red-600"
                      }>
                        {candidate.resumeInsights.recommendedAction.toUpperCase()}
                      </Badge>
                    </div>
                  </Card>

                  {/* AI Summary */}
                  <Card className="p-6">
                    <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <AlertCircle size={18} />
                      AI Summary
                    </h4>
                    <p className="text-neutral-700">{candidate.resumeInsights.aiSummary}</p>
                  </Card>

                  {/* Key Skills */}
                  <Card className="p-6">
                    <h4 className="font-semibold text-neutral-900 mb-3">Key Skills Identified</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.resumeInsights.keySkills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>

                  {/* Strengths */}
                  <Card className="p-6">
                    <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2 text-green-700">
                      <TrendingUp size={18} />
                      Strengths Matching Requirements
                    </h4>
                    <ul className="space-y-2">
                      {candidate.resumeInsights.strengthsMatch.map((strength, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle size={16} className="text-green-600 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Weaknesses */}
                  {candidate.resumeInsights.weaknesses.length > 0 && (
                    <Card className="p-6">
                      <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2 text-red-700">
                        <TrendingDown size={18} />
                        Potential Gaps
                      </h4>
                      <ul className="space-y-2">
                        {candidate.resumeInsights.weaknesses.map((weakness, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <XCircle size={16} className="text-red-600 mt-0.5" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Experience Highlights */}
                  <Card className="p-6">
                    <h4 className="font-semibold text-neutral-900 mb-3">Experience Highlights</h4>
                    <ul className="space-y-2">
                      {candidate.resumeInsights.experienceHighlights.map((exp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-neutral-500">No resume insights available</p>
                </Card>
              )}
            </TabsContent>

            {/* Notes & Rating Tab */}
            <TabsContent value="notes" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-900">Historical Notes & Ratings</h3>
                <Badge variant="outline">{candidate.notes.length} Notes</Badge>
              </div>

              {candidate.notes.length === 0 && candidate.ratings.length === 0 ? (
                <Card className="p-12 text-center">
                  <MessageSquare size={48} className="mx-auto text-neutral-300 mb-4" />
                  <p className="text-neutral-500">No notes or ratings yet</p>
                  <p className="text-sm text-neutral-400 mt-1">Add your first note using the Accept/Reject buttons</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Combined notes and ratings, sorted by date */}
                  {[...candidate.notes, ...candidate.ratings.map(r => ({...r, type: 'rating'}))]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((item: any) => (
                      <Card key={item.id} className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-neutral-900">{item.author}</p>
                            <p className="text-sm text-neutral-600 capitalize">{item.authorRole.replace('_', ' ')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-neutral-600">{new Date(item.date).toLocaleDateString()}</p>
                            <Badge variant="outline" className="mt-1 capitalize">{item.stage} Stage</Badge>
                          </div>
                        </div>
                        
                        {item.type === 'rating' ? (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={18} 
                                  className={i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                                />
                              ))}
                              <span className="text-sm font-medium text-neutral-700">({item.rating}/5)</span>
                            </div>
                            {item.comments && (
                              <p className="text-sm text-neutral-700 mt-2">{item.comments}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-neutral-700">{item.content}</p>
                        )}
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>

          </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Decision Modal */}
      <Dialog open={showDecisionModal} onOpenChange={setShowDecisionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {decision === "accept" ? "Accept" : "Reject"} Candidate - {candidate.fullName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div>
              <Label htmlFor="notes" className="text-neutral-900 font-medium mb-2 block">
                Add Notes * (Required)
              </Label>
              <Textarea
                id="notes"
                placeholder={`Add your reasoning for ${decision === "accept" ? "accepting" : "rejecting"} this candidate...`}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                className="min-h-32"
              />
              <p className="text-sm text-neutral-600 mt-2">
                These notes will be added to the candidate's record and visible to the team.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="send-email" 
                checked={sendEmail}
                onCheckedChange={(checked) => setSendEmail(checked as boolean)}
              />
              <Label htmlFor="send-email" className="text-sm font-normal cursor-pointer">
                Send notification email to candidate
              </Label>
            </div>

            {sendEmail && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-900 flex items-center gap-2">
                  <Send size={16} />
                  An email will be sent to <strong>{candidate.email}</strong>
                </p>
              </Card>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDecisionModal(false)
                  setDecisionNotes("")
                  setDecision(null)
                }}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitDecision}
                disabled={isSubmitting || !decisionNotes.trim()}
                className={`flex-1 ${
                  decision === "accept" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isSubmitting ? "Submitting..." : `Confirm ${decision === "accept" ? "Accept" : "Reject"}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
