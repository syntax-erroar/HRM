"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, Clock, Users, FileText, AlertCircle, CheckCircle, XCircle, Briefcase, ArrowRight, Mail, Eye, Timer, Calendar } from "lucide-react"
import { StatCard } from "./stat-card"
import { RecentActivity } from "./recent-activity"
import { UpcomingInterviews } from "./upcoming-interviews"
import { useAuth } from "@/lib/auth-context"
import { usePositions } from "@/lib/positions-context"
import { Position } from "@/lib/position-types"
import { useRouter } from "next/navigation"
import { useMemo } from "react"

export function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { positions, approvePosition, rejectPosition } = usePositions()
  const isHRAdmin = user?.role === "hr_admin"
  const isHRTeam = user?.role === "hr_team"
  const isHR = isHRAdmin || isHRTeam
  const isHiringManager = user?.role === "hiring_manager"

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const pendingApproval = positions.filter(p => p.status === "pending_approval")
    const myPendingApprovals = isHiringManager 
      ? pendingApproval.filter(p => p.hiringManagerEmail === user?.email)
      : pendingApproval
    
    const openPositions = positions.filter(p => p.status === "open")
    const myOpenPositions = isHiringManager
      ? openPositions.filter(p => p.hiringManagerEmail === user?.email)
      : openPositions
    
    const draftPositions = positions.filter(p => p.status === "draft")
    const approvedPositions = positions.filter(p => p.status === "approved")
    const rejectedPositions = positions.filter(p => p.status === "rejected")
    const closedPositions = positions.filter(p => p.status === "closed")
    
    // Calculate days pending for overdue alerts
    const overdueApprovals = myPendingApprovals.filter(p => {
      const daysSince = Math.floor((Date.now() - new Date(p.submittedDate).getTime()) / (1000 * 60 * 60 * 24))
      return daysSince > 3
    })

    return {
      pendingApproval: myPendingApprovals.length,
      openPositions: isHiringManager ? myOpenPositions.length : openPositions.length,
      totalCandidates: 248, // TODO: Connect to candidates data
      upcomingInterviews: 8, // TODO: Connect to interviews data
      draftPositions: draftPositions.length,
      approvedPositions: isHiringManager ? approvedPositions.filter(p => p.hiringManagerEmail === user?.email).length : approvedPositions.length,
      rejectedPositions: rejectedPositions.length,
      closedPositions: closedPositions.length,
      overdueApprovals: overdueApprovals.length,
      myPendingApprovals,
      overdueApprovalsList: overdueApprovals
    }
  }, [positions, user, isHiringManager])

  const getDaysSince = (date: string) => {
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-8 bg-gradient-to-br from-neutral-50 to-emerald-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">
            {isHRAdmin ? "HR Admin Dashboard" : isHRTeam ? "HR Team Dashboard" : "Hiring Manager Dashboard"}
          </h1>
          <p className="text-neutral-600 mt-2">
            {isHR ? "Manage recruitment and hiring workflow" : "Review and approve job descriptions for your team"}
          </p>
        </div>
        {isHRAdmin && (
          <Button 
            onClick={() => router.push('/job-requests')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg"
          >
            <Plus size={20} />
            Create Position
          </Button>
        )}
      </div>

      {/* Urgent Alerts Banner */}
      {metrics.overdueApprovals > 0 && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200 border-2">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="text-red-600" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900">
                {isHiringManager ? "Urgent: Approvals Needed" : "Overdue Approvals"}
              </h3>
              <p className="text-sm text-red-700">
                {metrics.overdueApprovals} {metrics.overdueApprovals === 1 ? 'position' : 'positions'} pending approval for more than 3 days
              </p>
            </div>
            <Button 
              onClick={() => router.push('/approvals')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              View Now
            </Button>
          </div>
        </Card>
      )}

      {/* Role-specific stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isHR ? (
          <>
            <div onClick={() => router.push('/job-requests')} className="cursor-pointer">
              <StatCard 
                title="Active Positions" 
                value={metrics.openPositions.toString()} 
                icon={FileText} 
                trend={`${metrics.approvedPositions} approved`} 
                color="emerald" 
              />
            </div>
            <div onClick={() => router.push('/approvals')} className="cursor-pointer">
              <StatCard 
                title="Pending Approvals" 
                value={metrics.pendingApproval.toString()} 
                icon={Clock} 
                trend={metrics.overdueApprovals > 0 ? `${metrics.overdueApprovals} overdue` : "Up to date"} 
                color={metrics.pendingApproval > 0 ? "amber" : "emerald"} 
              />
            </div>
            <div onClick={() => router.push('/candidates')} className="cursor-pointer">
              <StatCard 
                title="Total Candidates" 
                value={metrics.totalCandidates.toString()} 
                icon={Users} 
                trend="Across all positions" 
                color="blue" 
              />
            </div>
            <div onClick={() => router.push('/interviews')} className="cursor-pointer">
              <StatCard 
                title="Upcoming Interviews" 
                value={metrics.upcomingInterviews.toString()} 
                icon={TrendingUp} 
                trend="This week" 
                color="purple" 
              />
            </div>
          </>
        ) : (
          <>
            <div onClick={() => router.push('/my-requisitions')} className="cursor-pointer">
              <StatCard 
                title="My Open Positions" 
                value={metrics.openPositions.toString()} 
                icon={FileText} 
                trend={`${metrics.approvedPositions} approved`} 
                color="emerald" 
              />
            </div>
            <div onClick={() => router.push('/approvals')} className="cursor-pointer">
              <StatCard 
                title="Awaiting My Approval" 
                value={metrics.pendingApproval.toString()} 
                icon={Clock} 
                trend={metrics.overdueApprovals > 0 ? `${metrics.overdueApprovals} urgent` : "Up to date"} 
                color={metrics.pendingApproval > 0 ? "amber" : "emerald"} 
              />
            </div>
            <div onClick={() => router.push('/candidates')} className="cursor-pointer">
              <StatCard 
                title="Candidates for My Roles" 
                value={metrics.totalCandidates.toString()} 
                icon={Users} 
                trend="In pipeline" 
                color="blue" 
              />
            </div>
            <div onClick={() => router.push('/interviews')} className="cursor-pointer">
              <StatCard 
                title="My Interviews" 
                value={metrics.upcomingInterviews.toString()} 
                icon={TrendingUp} 
                trend="This week" 
                color="purple" 
              />
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hiring Manager: Pending Approvals Section */}
          {isHiringManager && metrics.myPendingApprovals.length > 0 && (
            <Card className="p-6 border-2 border-amber-200 bg-amber-50">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-amber-600" />
                Positions Awaiting Your Approval ({metrics.myPendingApprovals.length})
              </h3>
              <div className="space-y-3">
                {metrics.myPendingApprovals.slice(0, 3).map((position) => (
                  <Card key={position.id} className="p-4 bg-white border border-amber-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900">{position.title}</h4>
                        <p className="text-sm text-neutral-600">{position.department} Department</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">
                        {getDaysSince(position.submittedDate)} days pending
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push('/approvals')}
                        className="flex-1"
                      >
                        <Eye size={14} className="mr-1" />
                        Review
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          approvePosition(position.id)
                          router.push('/approvals')
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Quick Approve
                      </Button>
                    </div>
                  </Card>
                ))}
                {metrics.myPendingApprovals.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/approvals')}
                  >
                    View All {metrics.myPendingApprovals.length} Approvals
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* HR: Workflow Status Overview */}
          {isHR && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Position Workflow Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => router.push('/job-requests')}
                  className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-blue-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Draft</span>
                    <Badge variant="outline">{metrics.draftPositions}</Badge>
                  </div>
                  <p className="text-xs text-neutral-500">Needs submission</p>
                </div>
                <div 
                  onClick={() => router.push('/approvals')}
                  className="p-4 bg-amber-50 rounded-lg border border-amber-200 hover:border-amber-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Pending Approval</span>
                    <Badge className="bg-amber-100 text-amber-800">{metrics.pendingApproval}</Badge>
                  </div>
                  <p className="text-xs text-neutral-500">Waiting for HM</p>
                </div>
                <div 
                  onClick={() => router.push('/job-requests')}
                  className="p-4 bg-green-50 rounded-lg border border-green-200 hover:border-green-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Approved</span>
                    <Badge className="bg-green-100 text-green-800">{metrics.approvedPositions}</Badge>
                  </div>
                  <p className="text-xs text-neutral-500">Ready to open</p>
                </div>
                <div 
                  onClick={() => router.push('/job-requests')}
                  className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Open</span>
                    <Badge className="bg-blue-100 text-blue-800">{metrics.openPositions}</Badge>
                  </div>
                  <p className="text-xs text-neutral-500">Accepting candidates</p>
                </div>
              </div>
            </Card>
          )}

          {/* Upcoming Interviews */}
          <UpcomingInterviews />
        </div>

        {/* Right Column - Quick Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          {isHRAdmin && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => router.push('/job-requests')}
                >
                  <Plus size={16} />
                  Create New Position
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => router.push('/approvals')}
                >
                  <FileText size={16} />
                  View All Approvals
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => router.push('/candidates')}
                >
                  <Users size={16} />
                  Screen Candidates
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => router.push('/interviews')}
                >
                  <Calendar size={16} />
                  Schedule Interview
                </Button>
              </div>
            </Card>
          )}

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
