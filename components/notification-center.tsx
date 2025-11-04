"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, XCircle, FileText, Globe, Users, Clock, AlertCircle } from "lucide-react"
import { notificationService, type Notification } from "@/lib/notification-service"
import { useAuth } from "@/lib/auth-context"

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    // Load initial notifications
    const userNotifications = notificationService.getUserNotifications(user.id)
    setNotifications(userNotifications)
    setUnreadCount(notificationService.getUnreadCount(user.id))

    // Subscribe to real-time notifications
    const unsubscribe = notificationService.subscribe((notification) => {
      if (notification.userId === user.id || !notification.userId) {
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
      }
    })

    return unsubscribe
  }, [user])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_request_submitted':
        return <FileText className="text-blue-600" size={20} />
      case 'job_request_approved':
        return <CheckCircle className="text-green-600" size={20} />
      case 'job_request_rejected':
        return <XCircle className="text-red-600" size={20} />
      case 'job_published':
        return <Globe className="text-purple-600" size={20} />
      case 'interview_scheduled':
        return <Clock className="text-amber-600" size={20} />
      case 'candidate_applied':
        return <Users className="text-indigo-600" size={20} />
      default:
        return <Bell className="text-neutral-600" size={20} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-amber-500 bg-amber-50'
      case 'low':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-neutral-500 bg-neutral-50'
    }
  }

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId)
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = () => {
    if (!user) return
    
    const count = notificationService.markAllAsRead(user.id)
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
    setUnreadCount(0)
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return timestamp.toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 p-6">
            <div className="flex items-center gap-3">
              <Bell className="text-neutral-600" size={24} />
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Notifications</h2>
                {unreadCount > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <XCircle size={16} />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Bell className="text-neutral-400 mb-3" size={48} />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No notifications</h3>
                <p className="text-neutral-600">You're all caught up!</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`p-4 border-l-4 transition-colors cursor-pointer ${
                      notification.read 
                        ? 'border-neutral-200 bg-white' 
                        : getPriorityColor(notification.priority)
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-semibold ${
                            notification.read ? 'text-neutral-700' : 'text-neutral-900'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${
                          notification.read ? 'text-neutral-500' : 'text-neutral-700'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-neutral-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.priority === 'high' && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              High Priority
                            </Badge>
                          )}
                        </div>
                        {notification.actionUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-blue-600 hover:text-blue-700 p-0 h-auto"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Navigate to action URL
                              window.location.href = notification.actionUrl!
                            }}
                          >
                            View Details →
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 p-4">
            <Button
              variant="outline"
              className="w-full border-neutral-200"
              onClick={() => {
                // Navigate to full notifications page
                window.location.href = '/notifications'
              }}
            >
              View All Notifications
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
