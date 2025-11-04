"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, FileText, Phone, CheckCircle, XCircle, Clock } from "lucide-react"
import { mockCandidates } from "@/lib/mock-candidates-data"
import { Candidate, CandidateStatus, ScreeningType, CandidateSource } from "@/lib/candidate-types"
import { CandidateDetailModal } from "@/components/enhanced-candidate-detail-modal"

export default function CandidatesPage() {
  const [screeningType, setScreeningType] = useState<ScreeningType>("resume")
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sourceFilter, setSourceFilter] = useState<CandidateSource | "all">("all")
  const [relevanceMin, setRelevanceMin] = useState(0)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates)

  // Filter candidates based on screening type and filters
  const filteredCandidates = candidates.filter(candidate => {
    const status = screeningType === "resume" ? candidate.resumeScreeningStatus : candidate.callScreeningStatus
    const matchesStatus = statusFilter === "all" || status === statusFilter
    const matchesSearch = 
      candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSource = sourceFilter === "all" || candidate.source === sourceFilter
    const matchesRelevance = !candidate.resumeInsights || candidate.resumeInsights.relevanceScore >= relevanceMin
    
    return matchesStatus && matchesSearch && matchesSource && matchesRelevance
  })

  const handleAccept = (candidate: Candidate) => {
    // Update candidate status to approved
    setCandidates(prevCandidates => 
      prevCandidates.map(c => 
        c.id === candidate.id 
          ? {
              ...c,
              [screeningType === "resume" ? "resumeScreeningStatus" : "callScreeningStatus"]: "approved" as CandidateStatus
            }
          : c
      )
    )
  }

  const handleReject = (candidate: Candidate) => {
    // Update candidate status to rejected
    setCandidates(prevCandidates => 
      prevCandidates.map(c => 
        c.id === candidate.id 
          ? {
              ...c,
              [screeningType === "resume" ? "resumeScreeningStatus" : "callScreeningStatus"]: "rejected" as CandidateStatus
            }
          : c
      )
    )
  }

  const getCountByStatus = (status: CandidateStatus) => {
    return candidates.filter(c => {
      const candidateStatus = screeningType === "resume" ? c.resumeScreeningStatus : c.callScreeningStatus
      return candidateStatus === status
    }).length
  }

  const statusConfig = {
    pending: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
    reviewing: { label: "Reviewing", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    approved: { label: "Approved", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
    rejected: { label: "Rejected", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">Candidates</h1>
            <p className="text-neutral-500 mt-1">Screen and manage candidate applications</p>
          </div>

          {/* Main Tabs: Resume Screening / Call Screening */}
          <Tabs value={screeningType} onValueChange={(v) => setScreeningType(v as ScreeningType)} className="space-y-6">
            <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-neutral-100 p-1 text-neutral-600 w-auto">
              <TabsTrigger 
                value="resume" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm gap-2"
              >
                <FileText size={16} />
                Resume Screening
              </TabsTrigger>
              <TabsTrigger 
                value="call"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm gap-2"
              >
                <Phone size={16} />
                Call Screening
              </TabsTrigger>
            </TabsList>

            {/* Search and Filters */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
                <Input
                  placeholder="Search by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as any)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="Campus">Campus</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Naukri.com">Naukri.com</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                </SelectContent>
              </Select>

              {screeningType === "resume" && (
                <Select value={relevanceMin.toString()} onValueChange={(v) => setRelevanceMin(parseInt(v))}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Relevance Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Scores</SelectItem>
                    <SelectItem value="70">70+ Score</SelectItem>
                    <SelectItem value="80">80+ Score</SelectItem>
                    <SelectItem value="90">90+ Score</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button variant="outline" className="gap-2">
                <Download size={16} />
                Export
              </Button>
            </div>

            {/* Status Sub-tabs */}
            <Card className="border-2 border-neutral-200">
              <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <TabsList className={`w-full grid ${screeningType === "call" ? "grid-cols-4" : "grid-cols-5"} h-14 bg-neutral-50 rounded-t-lg rounded-b-none border-b border-neutral-200`}>
                  <TabsTrigger 
                    value="all"
                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
                  >
                    All ({candidates.filter(c => screeningType === "resume" ? true : true).length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pending"
                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 rounded-none"
                  >
                    Pending ({getCountByStatus("pending")})
                  </TabsTrigger>
                  {screeningType === "resume" && (
                    <TabsTrigger 
                      value="reviewing"
                      className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
                    >
                      Reviewing ({getCountByStatus("reviewing")})
                    </TabsTrigger>
                  )}
                  <TabsTrigger 
                    value="approved"
                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none"
                  >
                    Approved ({getCountByStatus("approved")})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rejected"
                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-red-600 data-[state=active]:text-red-600 rounded-none"
                  >
                    Rejected ({getCountByStatus("rejected")})
                  </TabsTrigger>
                </TabsList>

              {/* Candidates List */}
              <div className="p-6 space-y-4 bg-white">
                {filteredCandidates.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-neutral-500">No candidates found matching your criteria</p>
                  </div>
                ) : (
                  filteredCandidates.map(candidate => {
                    const status = screeningType === "resume" ? candidate.resumeScreeningStatus : candidate.callScreeningStatus
                    const config = statusConfig[status]
                    
                    return (
                      <Card key={candidate.id} className="p-6 hover:shadow-lg transition-all border-l-4 hover:border-l-blue-600">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-neutral-900">{candidate.fullName}</h3>
                              <Badge className={`${config.bg} ${config.color} border ${config.border}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Badge>
                              {candidate.resumeInsights && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  {candidate.resumeInsights.relevanceScore}% Match
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
                              <span>{candidate.position}</span>
                              <span>•</span>
                              <span>{candidate.experience}</span>
                              <span>•</span>
                              <span>{candidate.source}</span>
                              <span>•</span>
                              <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex gap-2 text-sm text-neutral-600 mb-3">
                              <span>{candidate.email}</span>
                              <span>•</span>
                              <span>{candidate.phone}</span>
                            </div>

                            {/* Timeline Preview */}
                            <div className="mt-3 flex items-center gap-2">
                              <Clock size={14} className="text-neutral-400" />
                              <div className="flex gap-2">
                                {candidate.timeline.filter(e => e.status === "completed").slice(0, 4).map((event, idx) => (
                                  <div key={event.id} className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-xs text-neutral-600">{event.title}</span>
                                    {idx < Math.min(candidate.timeline.filter(e => e.status === "completed").length, 4) - 1 && (
                                      <span className="text-neutral-300 mx-1">→</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {status !== "approved" && status !== "rejected" && (
                              <>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReject(candidate)}
                                  className="text-red-600 hover:bg-red-50 border-red-200"
                                >
                                  <XCircle size={16} className="mr-1" />
                                  Reject
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAccept(candidate)}
                                  className="text-green-600 hover:bg-green-50 border-green-200"
                                >
                                  <CheckCircle size={16} className="mr-1" />
                                  Accept
                                </Button>
                              </>
                            )}
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedCandidate(candidate)
                                setIsModalOpen(true)
                              }}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Review Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })
                )}
              </div>
              </Tabs>
            </Card>
          </Tabs>
        </div>
      </main>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          screeningType={screeningType}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCandidate(null)
          }}
          onUpdate={(updatedCandidate) => {
            // Update candidate in list
            setCandidates(prevCandidates => 
              prevCandidates.map(c => 
                c.id === updatedCandidate.id ? updatedCandidate : c
              )
            )
            setSelectedCandidate(updatedCandidate)
          }}
        />
      )}
    </div>
  )
}
