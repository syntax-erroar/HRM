"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface EmailLog {
  id: number
  recipient: string
  subject: string
  template: string
  status: "sent" | "failed" | "pending"
  sentDate: string
  candidateName: string
}

interface EmailHistoryListProps {
  logs: EmailLog[]
}

export function EmailHistoryList({ logs }: EmailHistoryListProps) {
  return (
    <div className="space-y-4">
      {logs.length === 0 ? (
        <Card className="p-8 text-center border border-neutral-200">
          <Mail size={32} className="mx-auto mb-3 text-neutral-400" />
          <p className="text-neutral-600">No email history found</p>
        </Card>
      ) : (
        logs.map((log) => (
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
        ))
      )}
    </div>
  )
}
