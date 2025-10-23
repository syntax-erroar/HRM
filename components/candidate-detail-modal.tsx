"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Mail, Phone, FileText, MessageSquare, X, Send } from "lucide-react"
import { EnhancedEmailModal } from "./enhanced-email-modal"
import { emailService } from "@/lib/email-service"
import { useToast } from "@/hooks/use-toast"

interface Candidate {
  id: number
  fullName: string
  email: string
  phone: string
  position: string
  experience: string
  status: "new" | "reviewing" | "shortlisted" | "rejected"
  appliedDate: string
  resume: string
}

interface CandidateDetailModalProps {
  candidate: Candidate | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (candidateId: number, newStatus: string) => void
}

const statusConfig = {
  new: { color: "bg-blue-100 text-blue-800", label: "New" },
  reviewing: { color: "bg-amber-100 text-amber-800", label: "Reviewing" },
  shortlisted: { color: "bg-green-100 text-green-800", label: "Shortlisted" },
  rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
}

export function CandidateDetailModal({ candidate, isOpen, onClose, onStatusChange }: CandidateDetailModalProps) {
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [notes, setNotes] = useState("")
  const [hoverRating, setHoverRating] = useState(0)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  if (!candidate) return null

  const config = statusConfig[candidate.status]

  const handleSendQuickEmail = async (templateType: string) => {
    setIsSendingEmail(true)
    try {
      let result
      switch (templateType) {
        case 'applicationReceived':
          result = await emailService.sendApplicationReceived(
            candidate.email,
            candidate.fullName,
            candidate.position
          )
          break
        case 'rejection':
          result = await emailService.sendRejection(
            candidate.email,
            candidate.fullName,
            candidate.position
          )
          break
        case 'shortlist':
          result = await emailService.sendShortlistNotification(
            candidate.email,
            candidate.fullName,
            candidate.position
          )
          break
        case 'interview':
          result = await emailService.sendInterviewInvitation(
            candidate.email,
            candidate.fullName,
            candidate.position,
            "November 1, 2025",
            "2:00 PM",
            "Office - Conference Room A",
            "Sarah Johnson",
            "Video Call"
          )
          break
        default:
          setShowEmailModal(true)
          return
      }

      if (result.success) {
        toast({
          title: "Email Sent",
          description: `Email sent successfully to ${candidate.fullName}`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send email",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleStatusChangeWithEmail = async (newStatus: string) => {
    onStatusChange(candidate.id, newStatus)
    
    // Send appropriate email based on status change
    switch (newStatus) {
      case 'reviewing':
        await handleSendQuickEmail('applicationReceived')
        break
      case 'shortlisted':
        await handleSendQuickEmail('shortlist')
        break
      case 'rejected':
        await handleSendQuickEmail('rejection')
        break
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{candidate.fullName}</DialogTitle>
              <p className="text-sm text-neutral-600 mt-1">{candidate.position}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="notes">Notes & Rating</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700">Email</label>
                <a
                  href={`mailto:${candidate.email}`}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mt-1"
                >
                  <Mail size={16} />
                  {candidate.email}
                </a>
              </div>
              <div>
                <label className="text-sm font-semibold text-neutral-700">Phone</label>
                <a
                  href={`tel:${candidate.phone}`}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mt-1"
                >
                  <Phone size={16} />
                  {candidate.phone}
                </a>
              </div>
              <div>
                <label className="text-sm font-semibold text-neutral-700">Experience</label>
                <p className="text-neutral-700 mt-1">{candidate.experience} years</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-neutral-700">Applied Date</label>
                <p className="text-neutral-700 mt-1">{candidate.appliedDate}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-700 mb-2 block">Current Status</label>
              <Badge className={config.color}>{config.label}</Badge>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-neutral-900">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                {candidate.status === "new" && (
                  <>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleStatusChangeWithEmail("reviewing")}
                      disabled={isSendingEmail}
                    >
                      Start Review & Send Email
                    </Button>
                    <Button
                      variant="outline"
                      className="border-neutral-200 bg-transparent"
                      onClick={() => handleStatusChangeWithEmail("rejected")}
                      disabled={isSendingEmail}
                    >
                      Reject & Send Email
                    </Button>
                  </>
                )}
                {candidate.status === "reviewing" && (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleStatusChangeWithEmail("shortlisted")}
                      disabled={isSendingEmail}
                    >
                      Shortlist & Send Email
                    </Button>
                    <Button
                      variant="outline"
                      className="border-neutral-200 bg-transparent"
                      onClick={() => handleStatusChangeWithEmail("rejected")}
                      disabled={isSendingEmail}
                    >
                      Reject & Send Email
                    </Button>
                  </>
                )}
                {candidate.status === "shortlisted" && (
                  <Button 
                    className="col-span-2 bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => handleSendQuickEmail('interview')}
                    disabled={isSendingEmail}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Schedule Interview & Send Email
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resume" className="space-y-4">
            <Card className="p-6 bg-neutral-50 border border-neutral-200">
              <div className="flex items-start gap-3 mb-4">
                <FileText size={20} className="text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-neutral-900">Resume Content</h4>
                  <p className="text-sm text-neutral-600">Full resume text provided by candidate</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded border border-neutral-200 text-sm text-neutral-700 whitespace-pre-wrap font-mono">
                {candidate.resume}
              </div>
            </Card>

            <div className="space-y-3">
              <h4 className="font-semibold text-neutral-900">Resume Analysis</h4>
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 border border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-1">Experience Match</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-neutral-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                    <span className="text-sm font-semibold">85%</span>
                  </div>
                </Card>
                <Card className="p-4 border border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-1">Skills Match</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-neutral-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                    </div>
                    <span className="text-sm font-semibold">72%</span>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-neutral-700 mb-3 block">Rating</label>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={`${
                        star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-neutral-600">
                {rating > 0 ? `${rating} out of 5 stars` : "Click to rate this candidate"}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                <MessageSquare size={16} />
                Screening Notes
              </label>
              <Textarea
                placeholder="Add your notes about this candidate's qualifications, strengths, concerns, etc..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border-neutral-200 min-h-32"
              />
              <p className="text-xs text-neutral-500 mt-2">{notes.length} characters</p>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Save Notes & Rating</Button>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-900">Email Communication</h3>
              <p className="text-sm text-neutral-600">Send automated emails to this candidate based on their status.</p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                  onClick={() => handleSendQuickEmail('applicationReceived')}
                  disabled={isSendingEmail}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Application Received
                </Button>
                
                <Button
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-700"
                  onClick={() => handleSendQuickEmail('shortlist')}
                  disabled={isSendingEmail}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Shortlist Notification
                </Button>
                
                <Button
                  variant="outline"
                  className="border-purple-200 bg-purple-50 text-purple-700"
                  onClick={() => handleSendQuickEmail('interview')}
                  disabled={isSendingEmail}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Interview Invitation
                </Button>
                
                <Button
                  variant="outline"
                  className="border-red-200 bg-red-50 text-red-700"
                  onClick={() => handleSendQuickEmail('rejection')}
                  disabled={isSendingEmail}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Rejection Notice
                </Button>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => setShowEmailModal(true)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Custom Email
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Enhanced Email Modal */}
      <EnhancedEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        candidateEmail={candidate.email}
        candidateName={candidate.fullName}
        position={candidate.position}
        onEmailSent={(success) => {
          if (success) {
            setShowEmailModal(false)
          }
        }}
      />
    </Dialog>
  )
}
