"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Save, Send, Eye, X, TestTube, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { emailService, EmailVariables } from "@/lib/email-service"

interface EmailTemplate {
  id: number
  name: string
  subject: string
  body: string
  trigger: "rejection" | "shortlist" | "interview" | "offer" | "manual"
  isActive: boolean
  createdDate: string
}

interface EnhancedEmailModalProps {
  isOpen: boolean
  onClose: () => void
  template?: EmailTemplate | null
  candidateEmail?: string
  candidateName?: string
  position?: string
  onEmailSent?: (success: boolean) => void
}

const availableVariables = [
  { name: "candidateName", description: "Candidate's full name" },
  { name: "position", description: "Job position" },
  { name: "appliedDate", description: "Application date" },
  { name: "applicationId", description: "Application ID" },
  { name: "interviewDate", description: "Interview date" },
  { name: "interviewTime", description: "Interview time" },
  { name: "location", description: "Interview location" },
  { name: "interviewer", description: "Interviewer name" },
  { name: "interviewType", description: "Interview type (Video/Phone/In-person)" },
  { name: "salary", description: "Offered salary" },
  { name: "startDate", description: "Start date" },
  { name: "benefits", description: "Benefits package" },
]

const predefinedTemplates = [
  { type: "applicationReceived", name: "Application Received", trigger: "application" },
  { type: "applicationRejected", name: "Application Rejected", trigger: "rejection" },
  { type: "shortlistNotification", name: "Shortlist Notification", trigger: "shortlist" },
  { type: "interviewInvitation", name: "Interview Invitation", trigger: "interview" },
  { type: "interviewReminder", name: "Interview Reminder", trigger: "interview" },
  { type: "jobOffer", name: "Job Offer", trigger: "offer" },
  { type: "onboardingWelcome", name: "Onboarding Welcome", trigger: "onboarding" },
]

export function EnhancedEmailModal({ 
  isOpen, 
  onClose, 
  template, 
  candidateEmail = "", 
  candidateName = "", 
  position = "",
  onEmailSent 
}: EnhancedEmailModalProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("compose")
  const [isLoading, setIsLoading] = useState(false)
  const [isTestMode, setIsTestMode] = useState(false)
  const [previewData, setPreviewData] = useState<{ subject: string; message: string } | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    trigger: "manual" as const,
    isActive: true,
    templateType: "custom",
    recipientEmail: candidateEmail,
  })

  const [testVariables, setTestVariables] = useState<EmailVariables>({
    candidateName: candidateName || "John Doe",
    position: position || "Software Developer",
    appliedDate: new Date().toLocaleDateString(),
    applicationId: `APP-${Date.now()}`,
    interviewDate: "November 1, 2025",
    interviewTime: "2:00 PM",
    location: "Office - Conference Room A",
    interviewer: "Sarah Johnson",
    interviewType: "Video Call",
    salary: "$80,000 - $100,000",
    startDate: "December 1, 2025",
    benefits: "Health insurance, 401k, PTO",
  })

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        body: template.body,
        trigger: template.trigger,
        isActive: template.isActive,
        templateType: "custom",
        recipientEmail: candidateEmail,
      })
    } else {
      setFormData({
        name: "",
        subject: "",
        body: "",
        trigger: "manual",
        isActive: true,
        templateType: "custom",
        recipientEmail: candidateEmail,
      })
    }
  }, [template, isOpen, candidateEmail])

  const handleInsertVariable = (variable: string) => {
    const textarea = document.getElementById("emailBody") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newBody = formData.body.substring(0, start) + `{${variable}}` + formData.body.substring(end)
      setFormData({ ...formData, body: newBody })
    }
  }

  const handleTemplateChange = async (templateType: string) => {
    if (templateType === "custom") {
      setFormData({ ...formData, templateType: "custom" })
      return
    }

    setIsLoading(true)
    try {
      const preview = await emailService.previewTemplate(templateType, testVariables)
      if (preview.success) {
        setFormData({
          ...formData,
          templateType,
          subject: preview.subject,
          body: preview.message,
        })
        setPreviewData({ subject: preview.subject, message: preview.message })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load template",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = async () => {
    if (formData.templateType === "custom") {
      setPreviewData({ subject: formData.subject, message: formData.body })
      return
    }

    setIsLoading(true)
    try {
      const preview = await emailService.previewTemplate(formData.templateType, testVariables)
      if (preview.success) {
        setPreviewData({ subject: preview.subject, message: preview.message })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to preview template",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!formData.recipientEmail) {
      toast({
        title: "Error",
        description: "Please enter recipient email",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      let result
      if (formData.templateType === "custom") {
        result = await emailService.sendCustomEmail(
          formData.recipientEmail,
          formData.subject,
          formData.body
        )
      } else {
        result = await emailService.sendEmail({
          to: formData.recipientEmail,
          templateType: formData.templateType,
          variables: testVariables,
        })
      }

      if (result.success) {
        toast({
          title: "Success",
          description: "Email sent successfully!",
        })
        onEmailSent?.(true)
        onClose()
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
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    console.log("Saving template:", formData)
    toast({
      title: "Template Saved",
      description: "Email template has been saved successfully",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {template ? "Edit Email Template" : "Send Email"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="test">Test Variables</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientEmail" className="text-sm font-semibold text-neutral-700">
                  Recipient Email
                </Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="candidate@example.com"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                  className="border-neutral-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateType" className="text-sm font-semibold text-neutral-700">
                  Template Type
                </Label>
                <Select
                  value={formData.templateType}
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger className="border-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Email</SelectItem>
                    {predefinedTemplates.map((template) => (
                      <SelectItem key={template.type} value={template.type}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateName" className="text-sm font-semibold text-neutral-700">
                Template Name
              </Label>
              <Input
                id="templateName"
                placeholder="e.g., Interview Invitation"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-neutral-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-semibold text-neutral-700">
                Email Subject
              </Label>
              <Input
                id="subject"
                placeholder="e.g., Interview Invitation - Software Developer"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="border-neutral-200"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailBody" className="text-sm font-semibold text-neutral-700">
                  Email Body
                </Label>
                <span className="text-xs text-neutral-500">Use variables like {"{candidateName}"}</span>
              </div>
              <Textarea
                id="emailBody"
                placeholder="Write your email content here..."
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="border-neutral-200 min-h-48 font-mono text-sm"
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-neutral-700">Available Variables</h4>
              <div className="grid grid-cols-3 gap-2">
                {availableVariables.map((variable) => (
                  <Button
                    key={variable.name}
                    variant="outline"
                    className="border-neutral-200 bg-neutral-50 text-left justify-start text-xs h-auto py-2"
                    onClick={() => handleInsertVariable(variable.name)}
                  >
                    <div>
                      <div className="font-mono text-blue-600">{`{${variable.name}}`}</div>
                      <div className="text-neutral-600">{variable.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" className="border-neutral-200 bg-transparent" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-200 bg-blue-50 text-blue-700" 
                onClick={handlePreview}
                disabled={isLoading}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={handleSendEmail}
                disabled={isLoading}
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {predefinedTemplates.map((template) => (
                <Card key={template.type} className="p-4 border border-neutral-200">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-neutral-900">{template.name}</h3>
                    <p className="text-sm text-neutral-600">Trigger: {template.trigger}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setFormData({ ...formData, templateType: template.type })
                        setActiveTab("compose")
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card className="p-6 bg-neutral-50 border border-neutral-200">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-600 mb-1">From</p>
                  <p className="font-semibold text-neutral-900">HR Team &lt;nishit.wadhwani@tristone-partners.com&gt;</p>
                </div>

                <div>
                  <p className="text-xs text-neutral-600 mb-1">To</p>
                  <p className="font-semibold text-neutral-900">{formData.recipientEmail || "No recipient"}</p>
                </div>

                <div>
                  <p className="text-xs text-neutral-600 mb-1">Subject</p>
                  <p className="font-semibold text-neutral-900">{previewData?.subject || formData.subject || "(No subject)"}</p>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <p className="text-xs text-neutral-600 mb-2">Body</p>
                  <div className="bg-white p-4 rounded border border-neutral-200 text-sm text-neutral-700 whitespace-pre-wrap">
                    {previewData?.message || formData.body || "(Empty body)"}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-blue-50 border border-blue-200 flex gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Preview Note</p>
                <p>Variables like {"{candidateName}"} will be replaced with actual values when the email is sent.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-900">Test Variables</h3>
              <p className="text-sm text-neutral-600">Set test values for variables to preview how your email will look.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(testVariables).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-sm font-semibold text-neutral-700">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <Input
                      id={key}
                      value={value}
                      onChange={(e) => setTestVariables({ ...testVariables, [key]: e.target.value })}
                      className="border-neutral-200"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="border-blue-200 bg-blue-50 text-blue-700" 
                  onClick={handlePreview}
                  disabled={isLoading}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview with Test Data
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white" 
                  onClick={handleSendEmail}
                  disabled={isLoading}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Send Test Email
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
