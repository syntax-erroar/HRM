"use client"

import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Clock, Users, FileText } from "lucide-react"
import { StatCard } from "./stat-card"
import { RecentActivity } from "./recent-activity"
import { UpcomingInterviews } from "./upcoming-interviews"
import { useAuth } from "@/lib/auth-context"

export function Dashboard() {
  const { user } = useAuth()
  const isHR = user?.role === "hr"

  return (
    <div className="p-8 bg-gradient-to-br from-neutral-50 to-emerald-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">{isHR ? "HR Dashboard" : "Hiring Manager Dashboard"}</h1>
          <p className="text-neutral-600 mt-2">
            {isHR ? "Manage recruitment for our global advisory services team" : "Track hiring for investment research, due diligence, and financial modeling roles"}
          </p>
        </div>
        {isHR && (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg">
            <Plus size={20} />
            Create Job Request
          </Button>
        )}
      </div>

      {/* Role-specific stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isHR ? (
          <>
            <StatCard title="Active Job Posts" value="12" icon={FileText} trend="+2 this week" color="emerald" />
            <StatCard title="Pending Approvals" value="5" icon={Clock} trend="3 urgent" color="amber" />
            <StatCard title="Total Candidates" value="248" icon={Users} trend="+45 this month" color="blue" />
            <StatCard title="Upcoming Interviews" value="8" icon={TrendingUp} trend="This week" color="purple" />
          </>
        ) : (
          <>
            <StatCard title="My Open Requisitions" value="3" icon={FileText} trend="2 in progress" color="emerald" />
            <StatCard title="Pending Approvals" value="2" icon={Clock} trend="1 urgent" color="amber" />
            <StatCard title="Candidates for My Roles" value="45" icon={Users} trend="+12 this week" color="blue" />
            <StatCard title="My Interviews" value="4" icon={TrendingUp} trend="This week" color="purple" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingInterviews />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
