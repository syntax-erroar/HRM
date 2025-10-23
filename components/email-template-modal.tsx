"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { AlertCircle } from "lucide-react"

interface EmailTemplate {
  id: number
  name: string
  subject: string
  body: string
  trigger: "rejection" | "shortlist" | "interview" | "offer" | "manual"
  isActive: boolean
  createdDate: string
}

interface EmailTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template?: EmailTemplate | null
}

const availableVariables = [
  { name: "candidateName", description: "Candidate's full name" },
  { name: "position", description: "Job position" },
  { name: "interviewDate", description: "Interview date" },
  { name: "interviewTime", description: "Interview time" },
  { name: "location", description: "Interview location" },
  { name: "salary", description: "Offered salary" },
  { name: "startDate", description: "Start date" },
]

export function EmailTemplateModal({ isOpen, onClose, template }: EmailTemplateModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    trigger: "manual" as const,
    isActive: true,
  })

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        body: template.body,
        trigger: template.trigger,
        isActive: template.isActive,
      })
    } else {
      setFormData({
        name: "",
        subject: "",
        body: "",
        trigger: "manual",
        isActive: true,
      })
    }
  }, [template, isOpen])

  const handleInsertVariable = (variable: string) => {
    const textarea = document.getElementById("emailBody") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newBody = formData.body.substring(0, start) + `{${variable}}` + formData.body.substring(end)
      setFormData({ ...formData, body: newBody })
    }
  }

  const handleSave = () => {
    console.log("Saving template:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? "Edit Email Template" : "Create New Email Template"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="templateName" className="text-sm font-semibold text-neutral-700">
                Template Name
              </Label>
              <Input
                id="templateName"
                placeholder="e.g., Rejection Email"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-neutral-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trigger" className="text-sm font-semibold text-neutral-700">
                  Trigger Event
                </Label>
                <Select
                  value={formData.trigger}
                  onValueChange={(value: any) => setFormData({ ...formData, trigger: value })}
                >
                  <SelectTrigger className="border-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rejection">Rejection</SelectItem>
                    <SelectItem value="shortlist">Shortlist</SelectItem>
                    <SelectItem value="interview">Interview Invitation</SelectItem>
                    <SelectItem value="offer">Job Offer</SelectItem>
                    <SelectItem value="manual">Manual Send</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="isActive" className="text-sm font-semibold text-neutral-700">
                    Status
                  </Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <span className="text-sm text-neutral-600">{formData.isActive ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-semibold text-neutral-700">
                Email Subject
              </Label>
              <Input
                id="subject"
                placeholder="e.g., Application Status Update"
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
                placeholder="Write your email template here..."
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="border-neutral-200 min-h-48 font-mono text-sm"
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-neutral-700">Available Variables</h4>
              <div className="grid grid-cols-2 gap-2">
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
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>
                {template ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card className="p-6 bg-neutral-50 border border-neutral-200">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-600 mb-1">From</p>
                  <p className="font-semibold text-neutral-900">HR Team &lt;hr@company.com&gt;</p>
                </div>

                <div>
                  <p className="text-xs text-neutral-600 mb-1">Subject</p>
                  <p className="font-semibold text-neutral-900">{formData.subject || "(No subject)"}</p>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <p className="text-xs text-neutral-600 mb-2">Body</p>
                  <div className="bg-white p-4 rounded border border-neutral-200 text-sm text-neutral-700 whitespace-pre-wrap">
                    {formData.body || "(Empty body)"}
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
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
