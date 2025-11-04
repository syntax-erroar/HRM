// Notification Service for HR Workflow Updates
// This service handles real-time notifications for job request workflow updates

export interface Notification {
  id: string
  type: 'job_request_submitted' | 'job_request_approved' | 'job_request_rejected' | 'job_published' | 'interview_scheduled' | 'candidate_applied'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high'
  userId?: string
  jobRequestId?: string
  candidateId?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

export interface NotificationPreferences {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  notificationTypes: {
    job_request_submitted: boolean
    job_request_approved: boolean
    job_request_rejected: boolean
    job_published: boolean
    interview_scheduled: boolean
    candidate_applied: boolean
  }
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
}

export class NotificationService {
  private static instance: NotificationService
  private notifications: Notification[] = []
  private subscribers: ((notification: Notification) => void)[] = []

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Subscribe to real-time notifications
  subscribe(callback: (notification: Notification) => void): () => void {
    this.subscribers.push(callback)
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
    }
  }

  // Create a new notification
  createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    }

    this.notifications.unshift(newNotification)
    
    // Notify subscribers
    this.subscribers.forEach(callback => callback(newNotification))
    
    return newNotification
  }

  // Get notifications for a user
  getUserNotifications(userId: string, limit: number = 50): Notification[] {
    return this.notifications
      .filter(notif => notif.userId === userId || !notif.userId) // Global notifications or user-specific
      .slice(0, limit)
  }

  // Mark notification as read
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      return true
    }
    return false
  }

  // Mark all notifications as read for a user
  markAllAsRead(userId: string): number {
    let count = 0
    this.notifications.forEach(notif => {
      if ((notif.userId === userId || !notif.userId) && !notif.read) {
        notif.read = true
        count++
      }
    })
    return count
  }

  // Get unread count for a user
  getUnreadCount(userId: string): number {
    return this.notifications.filter(notif => 
      (notif.userId === userId || !notif.userId) && !notif.read
    ).length
  }

  // Create job request submitted notification
  notifyJobRequestSubmitted(jobRequest: {
    id: string
    title: string
    department: string
    submittedBy: string
    hrUserId: string
  }): Notification {
    return this.createNotification({
      type: 'job_request_submitted',
      title: 'New Job Request Submitted',
      message: `${jobRequest.submittedBy} submitted a job request for "${jobRequest.title}" in ${jobRequest.department}`,
      priority: 'high',
      userId: jobRequest.hrUserId,
      jobRequestId: jobRequest.id,
      actionUrl: `/approvals?request=${jobRequest.id}`,
      metadata: {
        jobTitle: jobRequest.title,
        department: jobRequest.department,
        submittedBy: jobRequest.submittedBy
      }
    })
  }

  // Create job request approved notification
  notifyJobRequestApproved(jobRequest: {
    id: string
    title: string
    department: string
    submittedBy: string
    submittedByUserId: string
  }): Notification {
    return this.createNotification({
      type: 'job_request_approved',
      title: 'Job Request Approved',
      message: `Your job request for "${jobRequest.title}" in ${jobRequest.department} has been approved and is ready for publishing`,
      priority: 'medium',
      userId: jobRequest.submittedByUserId,
      jobRequestId: jobRequest.id,
      actionUrl: `/job-requests?request=${jobRequest.id}`,
      metadata: {
        jobTitle: jobRequest.title,
        department: jobRequest.department
      }
    })
  }

  // Create job request rejected notification
  notifyJobRequestRejected(jobRequest: {
    id: string
    title: string
    department: string
    submittedBy: string
    submittedByUserId: string
    reason?: string
  }): Notification {
    return this.createNotification({
      type: 'job_request_rejected',
      title: 'Job Request Rejected',
      message: `Your job request for "${jobRequest.title}" in ${jobRequest.department} has been rejected${jobRequest.reason ? `. Reason: ${jobRequest.reason}` : ''}`,
      priority: 'medium',
      userId: jobRequest.submittedByUserId,
      jobRequestId: jobRequest.id,
      actionUrl: `/job-requests?request=${jobRequest.id}`,
      metadata: {
        jobTitle: jobRequest.title,
        department: jobRequest.department,
        reason: jobRequest.reason
      }
    })
  }

  // Create job published notification
  notifyJobPublished(jobRequest: {
    id: string
    title: string
    department: string
    platforms: string[]
    submittedBy: string
    submittedByUserId: string
    hrUserId: string
  }): Notification {
    const platformNames = jobRequest.platforms.map(p => 
      p.charAt(0).toUpperCase() + p.slice(1)
    ).join(', ')

    // Notify the hiring manager
    this.createNotification({
      type: 'job_published',
      title: 'Job Published Successfully',
      message: `Your job posting for "${jobRequest.title}" has been published to ${platformNames}`,
      priority: 'medium',
      userId: jobRequest.submittedByUserId,
      jobRequestId: jobRequest.id,
      actionUrl: `/job-requests?request=${jobRequest.id}`,
      metadata: {
        jobTitle: jobRequest.title,
        department: jobRequest.department,
        platforms: jobRequest.platforms
      }
    })

    // Notify HR
    return this.createNotification({
      type: 'job_published',
      title: 'Job Published',
      message: `Job posting for "${jobRequest.title}" has been published to ${platformNames}`,
      priority: 'low',
      userId: jobRequest.hrUserId,
      jobRequestId: jobRequest.id,
      actionUrl: `/approvals?request=${jobRequest.id}`,
      metadata: {
        jobTitle: jobRequest.title,
        department: jobRequest.department,
        platforms: jobRequest.platforms
      }
    })
  }

  // Create interview scheduled notification
  notifyInterviewScheduled(interview: {
    id: string
    candidateName: string
    jobTitle: string
    scheduledDate: string
    interviewerId: string
    candidateId: string
  }): Notification {
    // Notify interviewer
    this.createNotification({
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: `Interview scheduled with ${interview.candidateName} for ${interview.jobTitle} on ${interview.scheduledDate}`,
      priority: 'medium',
      userId: interview.interviewerId,
      actionUrl: `/interviews?interview=${interview.id}`,
      metadata: {
        candidateName: interview.candidateName,
        jobTitle: interview.jobTitle,
        scheduledDate: interview.scheduledDate
      }
    })

    // Notify candidate
    return this.createNotification({
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: `Your interview for ${interview.jobTitle} has been scheduled for ${interview.scheduledDate}`,
      priority: 'high',
      userId: interview.candidateId,
      actionUrl: `/interviews?interview=${interview.id}`,
      metadata: {
        jobTitle: interview.jobTitle,
        scheduledDate: interview.scheduledDate
      }
    })
  }

  // Create candidate applied notification
  notifyCandidateApplied(application: {
    id: string
    candidateName: string
    jobTitle: string
    jobId: string
    hrUserId: string
  }): Notification {
    return this.createNotification({
      type: 'candidate_applied',
      title: 'New Application Received',
      message: `${application.candidateName} applied for ${application.jobTitle}`,
      priority: 'medium',
      userId: application.hrUserId,
      candidateId: application.id,
      actionUrl: `/candidates?application=${application.id}`,
      metadata: {
        candidateName: application.candidateName,
        jobTitle: application.jobTitle,
        jobId: application.jobId
      }
    })
  }

  // Get notification preferences for a user
  getUserPreferences(userId: string): NotificationPreferences {
    // In a real app, this would come from a database
    return {
      userId,
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      notificationTypes: {
        job_request_submitted: true,
        job_request_approved: true,
        job_request_rejected: true,
        job_published: true,
        interview_scheduled: true,
        candidate_applied: true
      },
      frequency: 'immediate'
    }
  }

  // Update notification preferences
  updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): boolean {
    // In a real app, this would update the database
    console.log(`Updating preferences for user ${userId}:`, preferences)
    return true
  }

  // Clean up old notifications (older than 30 days)
  cleanupOldNotifications(): number {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const initialCount = this.notifications.length
    this.notifications = this.notifications.filter(notif => notif.timestamp > thirtyDaysAgo)
    
    return initialCount - this.notifications.length
  }
}

export const notificationService = NotificationService.getInstance()
