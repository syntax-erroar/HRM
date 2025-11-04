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
      status: "published",
      submittedBy: "John Smith",
      submittedDate: "Oct 15, 2025",
      approvalDate: "Oct 18, 2025",
      publishedDate: "Oct 20, 2025",
      description: "Looking for an experienced developer with 5+ years of experience",
      jobDescription: "We are seeking a Senior Developer to join our engineering team. You will be responsible for designing, developing, and maintaining high-quality software solutions. The ideal candidate will have 5+ years of experience in full-stack development, strong problem-solving skills, and experience with modern web technologies.",
      standardMessage: "🚀 Exciting Opportunity: Senior Developer\n\nWe're looking for a talented Senior Developer to join our Engineering team!\n\n📍 Location: San Francisco, CA\n💰 Salary: $120k - $160k\n📋 Type: Full-time\n\nKey Requirements:\n• 5+ years of relevant experience\n• Strong technical skills and problem-solving abilities\n• Excellent communication and collaboration skills\n\nReady to make an impact? Apply now! 🎯",
      platforms: ["linkedin", "indeed", "glassdoor"],
      salaryRange: "$120k - $160k",
      location: "San Francisco, CA",
      employmentType: "Full-time",
      experienceLevel: "Senior Level (5+ years)",
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
      jobDescription: "We are looking for a Product Manager to lead our new product initiative. You will be responsible for defining product strategy, working with cross-functional teams, and driving product development from conception to launch.",
      standardMessage: "🚀 Exciting Opportunity: Product Manager\n\nWe're looking for a talented Product Manager to join our Product team!\n\n📍 Location: Remote\n💰 Salary: $100k - $140k\n📋 Type: Full-time\n\nKey Requirements:\n• 3+ years of product management experience\n• Strong analytical and communication skills\n• Experience with agile methodologies\n\nReady to make an impact? Apply now! 🎯",
      platforms: ["linkedin", "indeed"],
      salaryRange: "$100k - $140k",
      location: "Remote",
      employmentType: "Full-time",
      experienceLevel: "Mid Level (3-5 years)",
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
      jobDescription: "We are seeking a UX Designer to lead our mobile app redesign project. You will be responsible for creating user-centered designs, conducting user research, and collaborating with development teams to implement design solutions.",
      standardMessage: "🚀 Exciting Opportunity: UX Designer\n\nWe're looking for a talented UX Designer to join our Design team!\n\n📍 Location: New York, NY\n💰 Salary: $80k - $120k\n📋 Type: Full-time\n\nKey Requirements:\n• 3+ years of UX design experience\n• Strong portfolio of mobile app designs\n• Experience with design tools and prototyping\n\nReady to make an impact? Apply now! 🎯",
      platforms: ["linkedin", "dice"],
      salaryRange: "$80k - $120k",
      location: "New York, NY",
      employmentType: "Full-time",
      experienceLevel: "Mid Level (3-5 years)",
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
      publishedDate: null,
    }
    setJobRequests([newRequest, ...jobRequests])
    setShowForm(false)
    
    toast({
      title: "Job Request Submitted",
      description: "Your job request has been submitted for HR approval.",
    })
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
        case 'publish':
          // Simulate publishing to platforms
          await new Promise(resolve => setTimeout(resolve, 2000))
          result = { success: true }
          // Update the request status to published
          setJobRequests(prev => prev.map(req => 
            req.id === request.id 
              ? { ...req, status: "published", publishedDate: new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short", 
                  day: "numeric",
                })}
              : req
          ))
          break
        case 'view':
          // Open published job links
          if (request.platforms) {
            const platformUrls = {
              linkedin: `https://linkedin.com/jobs/view/${request.id}`,
              indeed: `https://indeed.com/viewjob?jk=${request.id}`,
              glassdoor: `https://glassdoor.com/job-listing/${request.id}`,
              angel: `https://angel.co/company/jobs/${request.id}`,
              dice: `https://dice.com/jobs/detail/${request.id}`,
              ziprecruiter: `https://ziprecruiter.com/jobs/${request.id}`
            }
            
            request.platforms.forEach(platform => {
              if (platformUrls[platform as keyof typeof platformUrls]) {
                window.open(platformUrls[platform as keyof typeof platformUrls], '_blank')
              }
            })
          }
          return
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
