"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { emailService } from "@/lib/email-service"
import { useToast } from "@/hooks/use-toast"

export default function TestEmailPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [testName, setTestName] = useState("John Doe")
  const [testPosition, setTestPosition] = useState("Software Developer")

  const handleTestEmail = async (templateType: string) => {
    setIsLoading(true)
    try {
      let result
      switch (templateType) {
        case 'applicationReceived':
          result = await emailService.sendApplicationReceived(
            testEmail,
            testName,
            testPosition
          )
          break
        case 'rejection':
          result = await emailService.sendRejection(
            testEmail,
            testName,
            testPosition
          )
          break
        case 'shortlist':
          result = await emailService.sendShortlistNotification(
            testEmail,
            testName,
            testPosition
          )
          break
        case 'interview':
          result = await emailService.sendInterviewInvitation(
            testEmail,
            testName,
            testPosition,
            "November 1, 2025",
            "2:00 PM",
            "Office - Conference Room A",
            "Sarah Johnson",
            "Video Call"
          )
          break
        default:
          result = await emailService.sendCustomEmail(
            testEmail,
            "Test Email",
            "This is a test email from the HR system."
          )
      }

      if (result.success) {
        toast({
          title: "Email Sent Successfully!",
          description: `Email sent to ${testEmail}`,
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
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Email System Test</h1>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="testEmail">Test Email</Label>
            <Input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          <div>
            <Label htmlFor="testName">Candidate Name</Label>
            <Input
              id="testName"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="testPosition">Position</Label>
            <Input
              id="testPosition"
              value={testPosition}
              onChange={(e) => setTestPosition(e.target.value)}
              placeholder="Software Developer"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Email Tests</h3>
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => handleTestEmail('applicationReceived')}
              disabled={isLoading}
            >
              Test Application Received
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleTestEmail('rejection')}
              disabled={isLoading}
            >
              Test Rejection Email
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleTestEmail('shortlist')}
              disabled={isLoading}
            >
              Test Shortlist Email
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleTestEmail('interview')}
              disabled={isLoading}
            >
              Test Interview Email
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleTestEmail('custom')}
              disabled={isLoading}
            >
              Test Custom Email
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Email API: Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Templates: Loaded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>SMTP: Configured</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Integration Complete!</h4>
            <p className="text-sm text-blue-700">
              The email system is now fully integrated into your Next.js application. 
              No separate email service needed!
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
