"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Plus, Mail, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { EmailTemplateModal } from "@/components/email-template-modal"

interface EmailTemplate {
  id: number
  name: string
  subject: string
  body: string
  trigger: "rejection" | "shortlist" | "interview" | "offer" | "manual"
  isActive: boolean
  createdDate: string
}

interface EmailLog {
  id: number
  recipient: string
  subject: string
  template: string
  status: "sent" | "failed" | "pending"
  sentDate: string
  candidateName: string
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: "Rejection Email",
    subject: "Application Status Update",
    body: "Dear {candidateName},\n\nThank you for your interest in the {position} role. After careful consideration, we have decided to move forward with other candidates.\n\nWe appreciate your time and wish you the best in your career.\n\nBest regards,\nHR Team",
    trigger: "rejection",
    isActive: true,
    createdDate: "Oct 15, 2025",
  },
  {
    id: 2,
    name: "Shortlist Notification",
    subject: "Great News - You've Been Shortlisted!",
    body: "Dear {candidateName},\n\nCongratulations! We are pleased to inform you that you have been shortlisted for the {position} role.\n\nWe would like to invite you for an interview. Please let us know your availability.\n\nBest regards,\nHR Team",
    trigger: "shortlist",
    isActive: true,
    createdDate: "Oct 15, 2025",
  },
  {
    id: 3,
    name: "Interview Invitation",
    subject: "Interview Invitation - {position}",
    body: "Dear {candidateName},\n\nWe are excited to invite you for an interview for the {position} position.\n\nInterview Details:\nDate: {interviewDate}\nTime: {interviewTime}\nLocation: {location}\n\nPlease confirm your attendance.\n\nBest regards,\nHR Team",
    trigger: "interview",
    isActive: true,
    createdDate: "Oct 15, 2025",
  },
  {
    id: 4,
    name: "Job Offer",
    subject: "Job Offer - {position}",
    body: "Dear {candidateName},\n\nWe are delighted to offer you the position of {position} at our company.\n\nPlease find the offer details attached. We look forward to welcoming you to our team.\n\nBest regards,\nHR Team",
    trigger: "offer",
    isActive: true,
    createdDate: "Oct 15, 2025",
  },
]

const emailLogs: EmailLog[] = [
  {
    id: 1,
    recipient: "alice@example.com",
    subject: "Great News - You've Been Shortlisted!",
    template: "Shortlist Notification",
    status: "sent",
    sentDate: "Oct 22, 2025 - 2:30 PM",
    candidateName: "Alice Johnson",
  },
  {
    id: 2,
    recipient: "bob@example.com",
    subject: "Application Status Update",
    template: "Rejection Email",
    status: "sent",
    sentDate: "Oct 21, 2025 - 10:15 AM",
    candidateName: "Bob Smith",
  },
  {
    id: 3,
    recipient: "carol@example.com",
    subject: "Interview Invitation - UX Designer",
    template: "Interview Invitation",
    status: "pending",
    sentDate: "Oct 20, 2025 - 3:45 PM",
    candidateName: "Carol Davis",
  },
  {
    id: 4,
    recipient: "david@example.com",
    subject: "Application Status Update",
    template: "Rejection Email",
    status: "failed",
    sentDate: "Oct 19, 2025 - 11:20 AM",
    candidateName: "David Wilson",
  },
]

export default function EmailsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)

  const filteredTemplates = emailTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredLogs = emailLogs.filter(
    (log) =>
      log.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setIsTemplateModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsTemplateModalOpen(false)
    setSelectedTemplate(null)
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">Email Automation</h1>
            <p className="text-neutral-500 mt-1">Manage email templates and automation rules</p>
          </div>

          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="templates">Email Templates</TabsTrigger>
              <TabsTrigger value="history">Email History</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-neutral-200"
                  />
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  onClick={() => setIsTemplateModalOpen(true)}
                >
                  <Plus size={16} />
                  New Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="p-6 border border-neutral-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-900 mb-1">{template.name}</h3>
                        <p className="text-sm text-neutral-600">{template.subject}</p>
                      </div>
                      <Badge
                        className={
                          template.isActive ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-800"
                        }
                      >
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="mb-4 p-3 bg-neutral-50 rounded border border-neutral-200 text-sm text-neutral-700 line-clamp-3">
                      {template.body}
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                      <span>Trigger: {template.trigger}</span>
                      <span>Created {template.createdDate}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-neutral-200 bg-transparent"
                        onClick={() => handleEditTemplate(template)}
                      >
                        Edit
                      </Button>
                      <Button variant="outline" className="flex-1 border-neutral-200 bg-transparent">
                        Preview
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
                  <Input
                    placeholder="Search email history..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-neutral-200"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <Card key={log.id} className="p-6 border border-neutral-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail size={18} className="text-blue-600" />
                          <h3 className="font-semibold text-neutral-900">{log.candidateName}</h3>
                          <Badge
                            className={
                              log.status === "sent"
                                ? "bg-green-100 text-green-800"
                                : log.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {log.status === "sent" && <CheckCircle size={12} className="mr-1" />}
                            {log.status === "pending" && <Clock size={12} className="mr-1" />}
                            {log.status === "failed" && <AlertCircle size={12} className="mr-1" />}
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">{log.subject}</p>
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                          <span>{log.recipient}</span>
                          <span>•</span>
                          <span>{log.template}</span>
                          <span>•</span>
                          <span>{log.sentDate}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="border-neutral-200 bg-transparent" size="sm">
                        View
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <EmailTemplateModal isOpen={isTemplateModalOpen} onClose={handleCloseModal} template={selectedTemplate} />
    </div>
  )
}
