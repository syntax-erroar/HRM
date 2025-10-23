"use client"

import { Badge } from "@/components/ui/badge"

interface NotificationBadgeProps {
  count: number
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count === 0) return null

  return (
    <Badge className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
      {count > 9 ? "9+" : count}
    </Badge>
  )
}
