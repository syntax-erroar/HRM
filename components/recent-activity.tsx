"use client"

import { Card } from "@/components/ui/card"

export function RecentActivity() {
  const activities = [
    { id: 1, type: "application", message: "New application from Alice Johnson", time: "2 hours ago" },
    { id: 2, type: "approval", message: "Job request approved by HR Manager", time: "4 hours ago" },
    { id: 3, type: "interview", message: "Interview scheduled with Bob Smith", time: "1 day ago" },
    { id: 4, type: "application", message: "New application from Carol Davis", time: "2 days ago" },
  ]

  return (
    <Card className="p-6 border border-neutral-200">
      <h3 className="text-lg font-bold text-neutral-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 pb-4 border-b border-neutral-200 last:border-0 last:pb-0"
          >
            <div className="flex-1">
              <p className="text-sm text-neutral-700">{activity.message}</p>
              <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
