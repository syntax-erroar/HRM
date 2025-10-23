"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Mail, Send } from "lucide-react"
import { JobRequestForm } from "@/components/job-request-form"
import { JobRequestList } from "@/components/job-request-list"
import { EnhancedEmailModal } from "@/components/enhanced-email-modal"
import { emailService } from "@/lib/email-service"
import { useToast } from "@/hooks/use-toast"

export default function JobRequestsPage() {
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailTarget, setEmailTarget] = useState<any>(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [jobRequests, setJobRequests] = useState([
    {
      id: 1,
      title: "Senior Developer",
      department: "Engineering",
      status: "approved",
      submittedBy: "John Smith",
      submittedDate: "Oct 15, 2025",
      approvalDate: "Oct 18, 2025",
      description: "Looking for an experienced developer with 5+ years of experience",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      status: "pending",
      submittedBy: "Sarah Johnson",
      submittedDate: "Oct 20, 2025",
      approvalDate: null,
      description: "Need a PM to lead our new product initiative",
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      status: "rejected",
      submittedBy: "Mike Chen",
      submittedDate: "Oct 10, 2025",
      approvalDate: "Oct 12, 2025",
      description: "Designer for mobile app redesign project",
    },
  ])

  const handleSubmitRequest = (formData: any) => {
    const newRequest = {
      id: jobRequests.length + 1,
      ...formData,
      status: "pending",
      submittedDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      approvalDate: null,
    }
    setJobRequests([newRequest, ...jobRequests])
    setShowForm(false)
  }

  const handleSendNotification = async (request: any, type: string) => {
    setIsSendingEmail(true)
    try {
      let result
      const recipientEmail = `${request.submittedBy.toLowerCase().replace(' ', '.')}@company.com`
      
      switch (type) {
        case 'approval':
          result = await emailService.sendCustomEmail(
            recipientEmail,
            `Job Request Approved - ${request.title}`,
            `Dear ${request.submittedBy},\n\nYour job request for "${request.title}" has been approved.\n\nDepartment: ${request.department}\nSubmitted: ${request.submittedDate}\nApproved: ${new Date().toLocaleDateString()}\n\nYou can now proceed with the hiring process.\n\nBest regards,\nHR Team`
          )
          break
        case 'rejection':
          result = await emailService.sendCustomEmail(
            recipientEmail,
            `Job Request Update - ${request.title}`,
            `Dear ${request.submittedBy},\n\nAfter careful consideration, your job request for "${request.title}" has been declined.\n\nDepartment: ${request.department}\nSubmitted: ${request.submittedDate}\n\nPlease review the requirements and consider resubmitting with additional justification.\n\nBest regards,\nHR Team`
          )
          break
        case 'reminder':
          result = await emailService.sendCustomEmail(
            recipientEmail,
            `Job Request Reminder - ${request.title}`,
            `Dear ${request.submittedBy},\n\nThis is a reminder that your job request for "${request.title}" is still pending approval.\n\nDepartment: ${request.department}\nSubmitted: ${request.submittedDate}\nStatus: Pending\n\nPlease ensure all required documentation is complete.\n\nBest regards,\nHR Team`
          )
          break
        default:
          setEmailTarget(request)
          setShowEmailModal(true)
          return
      }

      if (result.success) {
        toast({
          title: "Email Sent",
          description: `Notification sent to ${request.submittedBy}`,
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

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Job Requests</h1>
              <p className="text-neutral-500 mt-1">Manage and track job requisitions</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus size={20} />
              New Job Request
            </Button>
          </div>

          {showForm && (
            <Card className="p-6 mb-8 border border-neutral-200">
              <JobRequestForm onSubmit={handleSubmitRequest} onCancel={() => setShowForm(false)} />
            </Card>
          )}

          <JobRequestList 
            requests={jobRequests} 
            onSendNotification={handleSendNotification}
            isSendingEmail={isSendingEmail}
          />
        </div>
      </main>
      
      {/* Enhanced Email Modal */}
      <EnhancedEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        candidateEmail={emailTarget ? `${emailTarget.submittedBy.toLowerCase().replace(' ', '.')}@company.com` : ""}
        candidateName={emailTarget?.submittedBy || ""}
        position={emailTarget?.title || ""}
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
