"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  User, Mail, Phone, Calendar, Clock, MapPin, 
  Video, Building2, Star, CheckCircle, XCircle, 
  MessageSquare, Send, Eye, FileText
} from "lucide-react"
import { Interview, InterviewerNote } from "@/lib/interview-types"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface InterviewDetailModalProps {
  interview: Interview
  isOpen: boolean
  onClose: () => void
  onUpdate: (interview: Interview) => void
}

export function InterviewDetailModal({ 
  interview, 
  isOpen, 
  onClose, 
  onUpdate 
}: InterviewDetailModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  const [decision, setDecision] = useState<"accept" | "reject" | null>(null)
  const [decisionNotes, setDecisionNotes] = useState("")
  const [sendEmail, setSendEmail] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isHiringManager = user?.role === "hiring_manager"
  const isHR = user?.role === "hr_admin" || user?.role === "hr_team"
  const showAcceptReject = isHiringManager && interview.status === "completed" && interview.completedStatus === "reviewing"

  const interviewTypeIcons = {
    phone: Phone,
    video: Video,
    "in-person": Building2
  }

  const recommendationConfig = {
    strong_yes: { label: "Strong Yes", color: "text-green-700", bg: "bg-green-100" },
    yes: { label: "Yes", color: "text-green-600", bg: "bg-green-50" },
    maybe: { label: "Maybe", color: "text-amber-600", bg: "bg-amber-50" },
    no: { label: "No", color: "text-red-600", bg: "bg-red-50" },
    strong_no: { label: "Strong No", color: "text-red-700", bg: "bg-red-100" }
  }

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

      const newStatus = decision === "accept" ? "accepted" : "rejected"
      const updatedInterview: Interview = {
        ...interview,
        completedStatus: newStatus,
        interviewerNotes: [
          ...interview.interviewerNotes,
          {
            id: `note_${Date.now()}`,
            interviewer: user?.name || "Hiring Manager",
            interviewerRole: user?.role || "hiring_manager",
            date: new Date().toISOString().split('T')[0],
            notes: `Final Decision: ${decision === "accept" ? "ACCEPTED" : "REJECTED"}\n\n${decisionNotes}`,
            recommendation: decision === "accept" ? "strong_yes" : "no"
          }
        ],
        hrNotes: decision === "accept" 
          ? "Candidate accepted by hiring manager. Preparing offer letter."
          : "Candidate rejected by hiring manager. Sending rejection email."
      }

      onUpdate(updatedInterview)

      if (sendEmail) {
        toast({
          title: "Email Sent",
          description: `Notification email sent to ${interview.candidateName}`,
        })
      }

      toast({
        title: decision === "accept" ? "Candidate Accepted" : "Candidate Rejected",
        description: `${interview.candidateName} has been ${decision === "accept" ? "accepted" : "rejected"} for the ${interview.position} position.`,
      })

      setShowDecisionModal(false)
      setDecisionNotes("")
      setDecision(null)
      onClose()

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

  const TypeIcon = interviewTypeIcons[interview.interviewType || "video"]

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">{interview.candidateName}</DialogTitle>
                <p className="text-neutral-600 mt-1">{interview.position}</p>
              </div>
              <div className="flex gap-2">
                <Badge className={
                  interview.status === "pending" ? "bg-amber-100 text-amber-800" :
                  interview.status === "upcoming" ? "bg-blue-100 text-blue-800" :
                  interview.completedStatus === "reviewing" ? "bg-purple-100 text-purple-800" :
                  interview.completedStatus === "accepted" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }>
                  {interview.status === "completed" 
                    ? interview.completedStatus?.charAt(0).toUpperCase() + interview.completedStatus?.slice(1)
                    : interview.status.charAt(0).toUpperCase() + interview.status.slice(1)
                  }
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Interview Details */}
            <Card className="p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Interview Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <User size={18} className="text-neutral-500" />
                  <div>
                    <p className="text-neutral-600">Candidate</p>
                    <p className="font-medium text-neutral-900">{interview.candidateName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Mail size={18} className="text-neutral-500" />
                  <div>
                    <p className="text-neutral-600">Email</p>
                    <p className="font-medium text-neutral-900">{interview.candidateEmail}</p>
                  </div>
                </div>

                {interview.scheduledDate && (
                  <>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={18} className="text-neutral-500" />
                      <div>
                        <p className="text-neutral-600">Date</p>
                        <p className="font-medium text-neutral-900">
                          {new Date(interview.scheduledDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Clock size={18} className="text-neutral-500" />
                      <div>
                        <p className="text-neutral-600">Time</p>
                        <p className="font-medium text-neutral-900">{interview.scheduledTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <MapPin size={18} className="text-neutral-500" />
                      <div>
                        <p className="text-neutral-600">Location</p>
                        <p className="font-medium text-neutral-900">{interview.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <TypeIcon size={18} className="text-neutral-500" />
                      <div>
                        <p className="text-neutral-600">Interview Type</p>
                        <p className="font-medium text-neutral-900 capitalize">{interview.interviewType}</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-3 text-sm col-span-2">
                  <User size={18} className="text-neutral-500" />
                  <div>
                    <p className="text-neutral-600">Interviewer</p>
                    <p className="font-medium text-neutral-900">{interview.interviewer}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Interviewer Notes Section */}
            {interview.interviewerNotes && interview.interviewerNotes.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-neutral-900">Interviewer Feedback</h3>
                  <Badge variant="outline">{interview.interviewerNotes.length} Note{interview.interviewerNotes.length > 1 ? 's' : ''}</Badge>
                </div>

                {interview.interviewerNotes.map((note: InterviewerNote) => (
                  <Card key={note.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-neutral-900">{note.interviewer}</p>
                        <p className="text-sm text-neutral-600 capitalize">{note.interviewerRole.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-600">{new Date(note.date).toLocaleDateString()}</p>
                        {note.recommendation && (
                          <Badge 
                            className={`mt-1 ${recommendationConfig[note.recommendation].bg} ${recommendationConfig[note.recommendation].color}`}
                          >
                            {recommendationConfig[note.recommendation].label}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Rating Scores */}
                    {(note.rating || note.technicalSkills || note.communication || note.cultureFit) && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-neutral-50 rounded">
                        {note.rating && (
                          <div>
                            <p className="text-xs text-neutral-600 mb-1">Overall</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={16} 
                                  className={i < note.rating! ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {note.technicalSkills && (
                          <div>
                            <p className="text-xs text-neutral-600 mb-1">Technical</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={16} 
                                  className={i < note.technicalSkills! ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {note.communication && (
                          <div>
                            <p className="text-xs text-neutral-600 mb-1">Communication</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={16} 
                                  className={i < note.communication! ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {note.cultureFit && (
                          <div>
                            <p className="text-xs text-neutral-600 mb-1">Culture Fit</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={16} 
                                  className={i < note.cultureFit! ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Feedback Notes */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-neutral-700">Feedback:</h4>
                      <p className="text-sm text-neutral-700 whitespace-pre-wrap">{note.notes}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <MessageSquare size={48} className="mx-auto text-neutral-300 mb-4" />
                <p className="text-neutral-500">No interviewer feedback yet</p>
                <p className="text-sm text-neutral-400 mt-1">Feedback will appear here after the interview is completed</p>
              </Card>
            )}

            {/* HR Notes */}
            {interview.hrNotes && isHR && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FileText size={18} />
                  HR Notes
                </h4>
                <p className="text-sm text-blue-800">{interview.hrNotes}</p>
              </Card>
            )}

            {/* Status Display for HR */}
            {isHR && interview.status === "completed" && (
              <Card className="p-6">
                <h4 className="font-semibold text-neutral-900 mb-3">Interview Status</h4>
                <div className="flex items-center gap-3">
                  <Badge className={
                    interview.completedStatus === "reviewing" ? "bg-purple-100 text-purple-800 text-base px-4 py-2" :
                    interview.completedStatus === "accepted" ? "bg-green-100 text-green-800 text-base px-4 py-2" :
                    "bg-red-100 text-red-800 text-base px-4 py-2"
                  }>
                    {interview.completedStatus === "reviewing" && "⏳ Awaiting HM Decision"}
                    {interview.completedStatus === "accepted" && "✅ Accepted by Hiring Manager"}
                    {interview.completedStatus === "rejected" && "❌ Rejected by Hiring Manager"}
                  </Badge>
                </div>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t">
            {/* HR can only view and send email */}
            {isHR && (
              <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700">
                <Mail size={18} />
                Send Email to Candidate
              </Button>
            )}

            {/* Hiring Manager can Accept/Reject if reviewing */}
            {showAcceptReject && (
              <>
                <Button
                  onClick={() => handleDecision("accept")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="mr-2" size={18} />
                  Accept Candidate
                </Button>
                <Button
                  onClick={() => handleDecision("reject")}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                >
                  <XCircle className="mr-2" size={18} />
                  Reject Candidate
                </Button>
              </>
            )}

            {/* If HM but not in reviewing status */}
            {isHiringManager && !showAcceptReject && interview.status === "completed" && (
              <div className="flex-1 text-center p-4 bg-neutral-100 rounded">
                <p className="text-sm text-neutral-600">
                  {interview.completedStatus === "accepted" && "You have accepted this candidate"}
                  {interview.completedStatus === "rejected" && "You have rejected this candidate"}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Decision Modal for Hiring Manager */}
      <Dialog open={showDecisionModal} onOpenChange={setShowDecisionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {decision === "accept" ? "Accept" : "Reject"} Candidate - {interview.candidateName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div>
              <Label htmlFor="decision-notes" className="text-neutral-900 font-medium mb-2 block">
                Add Your Notes * (Required)
              </Label>
              <Textarea
                id="decision-notes"
                placeholder={`Add your reasoning for ${decision === "accept" ? "accepting" : "rejecting"} this candidate...\n\nInclude details about:\n- Technical performance\n- Cultural fit\n- Strengths and concerns\n- Recommendation for HR team`}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                className="min-h-40"
              />
              <p className="text-sm text-neutral-600 mt-2">
                These notes will be added to the interview record and shared with the HR team.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="send-email-decision" 
                checked={sendEmail}
                onCheckedChange={(checked) => setSendEmail(checked as boolean)}
              />
              <Label htmlFor="send-email-decision" className="text-sm font-normal cursor-pointer">
                Send notification email to candidate about the decision
              </Label>
            </div>

            {sendEmail && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-900 flex items-center gap-2">
                  <Send size={16} />
                  An email will be sent to <strong>{interview.candidateEmail}</strong>
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
