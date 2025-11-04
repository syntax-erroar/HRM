"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  Mail,
  CheckSquare,
  Settings,
  Menu,
  Briefcase,
  LogOut,
  Bell,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { NotificationCenter } from "./notification-center"
import { notificationService } from "@/lib/notification-service"

const hrNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/job-requests", label: "Job Requests", icon: FileText },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/interviews", label: "Interviews", icon: Calendar },
  { href: "/emails", label: "Email Templates", icon: Mail },
  { href: "/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/settings", label: "Settings", icon: Settings },
]

const hiringManagerNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/my-requisitions", label: "My Requisitions", icon: FileText },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/interviews", label: "Interviews", icon: Calendar },
  { href: "/approvals", label: "Approvals", icon: CheckSquare },
]

const publicNavItems = [
  { href: "/jobs", label: "Browse Jobs", icon: Briefcase },
  { href: "/apply", label: "Apply", icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const isPublicPage = pathname === "/jobs" || pathname === "/apply" || pathname === "/login"
  const isLoginPage = pathname === "/login"

  let itemsToShow = publicNavItems
  if (user && !isPublicPage) {
    itemsToShow = user.role === "hr" ? hrNavItems : hiringManagerNavItems
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Load unread count on mount
  useEffect(() => {
    if (user) {
      const count = notificationService.getUnreadCount(user.id)
      setUnreadCount(count)
    }
  }, [user])

  // Subscribe to notifications
  useEffect(() => {
    if (!user) return

    const unsubscribe = notificationService.subscribe((notification) => {
      if (notification.userId === user.id || !notification.userId) {
        setUnreadCount(prev => prev + 1)
      }
    })

    return unsubscribe
  }, [user])

  if (isLoginPage) {
    return null
  }

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col shadow-sm`}
    >
      <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-neutral-900">Tristone</div>
              <div className="text-xs text-neutral-500">Partners</div>
            </div>
          </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
          <Menu size={20} className="text-neutral-600" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {itemsToShow.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <Icon size={20} />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Notifications Button */}
      {user && !isPublicPage && (
        <div className="px-4 pb-4">
          <button
            onClick={() => setShowNotifications(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all w-full"
          >
            <div className="relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            {isOpen && <span className="text-sm font-medium">Notifications</span>}
          </button>
        </div>
      )}

      {/* User Info and Logout */}
      <div className="p-4 border-t border-neutral-200 space-y-3">
        {user && isOpen && (
          <div className="text-xs bg-emerald-50 p-3 rounded-lg">
            <p className="font-semibold text-neutral-900">{user.name}</p>
            <p className="text-emerald-700 capitalize">{user.role.replace("_", " ")}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </aside>
  )
}
