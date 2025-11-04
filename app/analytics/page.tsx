"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Award,
  Target,
  UserCheck
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { mockAnalyticsData } from "@/lib/mock-analytics-data"
import { useRouter } from "next/navigation"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [analytics] = useState(mockAnalyticsData)

  // Redirect if not HR Admin
  useEffect(() => {
    if (user && user.role !== "hr_admin") {
      router.push("/")
    }
  }, [user, router])

  // Don't render if not authorized
  if (!user || user.role !== "hr_admin") {
    return null
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">Data Analysis</h1>
            <p className="text-neutral-500 mt-1">Team performance metrics and insights</p>
          </div>

          {/* Overall Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="p-6 border border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.overallMetrics.totalPositions}</p>
                  <p className="text-sm text-neutral-600">Total Positions</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.overallMetrics.totalCandidates}</p>
                  <p className="text-sm text-neutral-600">Total Candidates</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.overallMetrics.totalInterviews}</p>
                  <p className="text-sm text-neutral-600">Total Interviews</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.overallMetrics.avgConversionRate}%</p>
                  <p className="text-sm text-neutral-600">Avg Conversion</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <Clock size={24} className="text-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.overallMetrics.avgTimeToHire}d</p>
                  <p className="text-sm text-neutral-600">Avg Time to Hire</p>
                </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="hr-team" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="hr-team">HR Team Conversion</TabsTrigger>
              <TabsTrigger value="hiring-managers">Hiring Manager Involvement</TabsTrigger>
            </TabsList>

            {/* HR Team Analytics */}
            <TabsContent value="hr-team" className="space-y-4">
              <Card className="border border-neutral-200">
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4">HR Team Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Role</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Positions Created</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Candidates Screened</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Interviews Scheduled</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Offers Extended</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Conversion Rate</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Avg Time to Hire</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.hrTeamStats.map((member, index) => (
                          <tr key={member.id} className={index !== analytics.hrTeamStats.length - 1 ? "border-b border-neutral-100" : ""}>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-neutral-900">{member.name}</p>
                                <p className="text-sm text-neutral-500">{member.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={member.role === "HR Admin" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                                {member.role}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-right font-medium">{member.positionsCreated}</td>
                            <td className="py-4 px-4 text-right font-medium">{member.candidatesScreened}</td>
                            <td className="py-4 px-4 text-right font-medium">{member.interviewsScheduled}</td>
                            <td className="py-4 px-4 text-right font-medium">{member.offersExtended}</td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className={`w-16 h-2 rounded-full bg-neutral-200 overflow-hidden`}>
                                  <div 
                                    className="h-full bg-green-500" 
                                    style={{ width: `${Math.min(member.conversionRate * 10, 100)}%` }}
                                  />
                                </div>
                                <span className="font-medium">{member.conversionRate}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right font-medium">{member.avgTimeToHire}d</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>

              {/* Top Performers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border border-green-200 bg-green-50">
                  <div className="flex items-start gap-3">
                    <Award size={24} className="text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Best Conversion Rate</p>
                      <p className="text-xl font-bold text-neutral-900">
                        {analytics.hrTeamStats.reduce((prev, current) => 
                          prev.conversionRate > current.conversionRate ? prev : current
                        ).name}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        {analytics.hrTeamStats.reduce((prev, current) => 
                          prev.conversionRate > current.conversionRate ? prev : current
                        ).conversionRate}% conversion
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 border border-blue-200 bg-blue-50">
                  <div className="flex items-start gap-3">
                    <Users size={24} className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Most Candidates Screened</p>
                      <p className="text-xl font-bold text-neutral-900">
                        {analytics.hrTeamStats.reduce((prev, current) => 
                          prev.candidatesScreened > current.candidatesScreened ? prev : current
                        ).name}
                      </p>
                      <p className="text-sm text-blue-600 font-medium">
                        {analytics.hrTeamStats.reduce((prev, current) => 
                          prev.candidatesScreened > current.candidatesScreened ? prev : current
                        ).candidatesScreened} candidates
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 border border-purple-200 bg-purple-50">
                  <div className="flex items-start gap-3">
                    <Clock size={24} className="text-purple-600 mt-1" />
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Fastest Time to Hire</p>
                      <p className="text-xl font-bold text-neutral-900">
                        {analytics.hrTeamStats.reduce((prev, current) => 
                          prev.avgTimeToHire < current.avgTimeToHire ? prev : current
                        ).name}
                      </p>
                      <p className="text-sm text-purple-600 font-medium">
                        {analytics.hrTeamStats.reduce((prev, current) => 
                          prev.avgTimeToHire < current.avgTimeToHire ? prev : current
                        ).avgTimeToHire} days avg
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Hiring Manager Analytics */}
            <TabsContent value="hiring-managers" className="space-y-4">
              <Card className="border border-neutral-200">
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4">Hiring Manager Interview Involvement</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Department</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Requested</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Accepted</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Rejected</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Acceptance Rate</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Avg Response Time</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Open/Closed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.hiringManagerStats.map((manager, index) => (
                          <tr key={manager.id} className={index !== analytics.hiringManagerStats.length - 1 ? "border-b border-neutral-100" : ""}>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-neutral-900">{manager.name}</p>
                                <p className="text-sm text-neutral-500">{manager.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="secondary">{manager.department}</Badge>
                            </td>
                            <td className="py-4 px-4 text-right font-medium">{manager.interviewsRequested}</td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="font-medium">{manager.interviewsAccepted}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <XCircle size={16} className="text-red-600" />
                                <span className="font-medium">{manager.interviewsRejected}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className={`w-16 h-2 rounded-full bg-neutral-200 overflow-hidden`}>
                                  <div 
                                    className="h-full bg-blue-500" 
                                    style={{ width: `${manager.acceptanceRate}%` }}
                                  />
                                </div>
                                <span className="font-medium">{manager.acceptanceRate}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right font-medium">{manager.avgResponseTime}h</td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-medium text-blue-600">{manager.openPositions}</span>
                              <span className="text-neutral-400 mx-1">/</span>
                              <span className="font-medium text-green-600">{manager.closedPositions}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 border border-neutral-200">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-blue-600" />
                    <div>
                      <p className="text-xs text-neutral-500">Total Requested</p>
                      <p className="text-2xl font-bold">
                        {analytics.hiringManagerStats.reduce((sum, m) => sum + m.interviewsRequested, 0)}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 border border-neutral-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <div>
                      <p className="text-xs text-neutral-500">Total Accepted</p>
                      <p className="text-2xl font-bold text-green-600">
                        {analytics.hiringManagerStats.reduce((sum, m) => sum + m.interviewsAccepted, 0)}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 border border-neutral-200">
                  <div className="flex items-center gap-3">
                    <XCircle size={20} className="text-red-600" />
                    <div>
                      <p className="text-xs text-neutral-500">Total Rejected</p>
                      <p className="text-2xl font-bold text-red-600">
                        {analytics.hiringManagerStats.reduce((sum, m) => sum + m.interviewsRejected, 0)}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 border border-neutral-200">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={20} className="text-purple-600" />
                    <div>
                      <p className="text-xs text-neutral-500">Avg Acceptance</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {(analytics.hiringManagerStats.reduce((sum, m) => sum + m.acceptanceRate, 0) / analytics.hiringManagerStats.length).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
