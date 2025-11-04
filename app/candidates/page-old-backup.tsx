"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { CandidateList } from "@/components/candidate-list"
import { CandidateDetailModal } from "@/components/candidate-detail-modal"
import { ResomeScreeningFilters, type FilterState } from "@/components/resume-screening-filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download } from "lucide-react"

interface Candidate {
  id: number
  fullName: string
  email: string
  phone: string
  position: string
  experience: string
  status: "new" | "reviewing" | "shortlisted" | "rejected"
  appliedDate: string
  resume: string
}

export default function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    experienceRange: [0, 15],
    statuses: ["new", "reviewing", "shortlisted"],
    ratingMin: 0,
  })

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      fullName: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1 (555) 123-4567",
      position: "Senior Developer",
      experience: "5-10",
      status: "new",
      appliedDate: "Oct 22, 2025",
      resume: "Experienced developer with 7 years in full-stack development...",
    },
    {
      id: 2,
      fullName: "Bob Smith",
      email: "bob@example.com",
      phone: "+1 (555) 234-5678",
      position: "Product Manager",
      experience: "2-5",
      status: "reviewing",
      appliedDate: "Oct 21, 2025",
      resume: "Product manager with experience in SaaS and mobile apps...",
    },
    {
      id: 3,
      fullName: "Carol Davis",
      email: "carol@example.com",
      phone: "+1 (555) 345-6789",
      position: "UX Designer",
      experience: "5-10",
      status: "shortlisted",
      appliedDate: "Oct 20, 2025",
      resume: "UX designer specializing in accessibility and user research...",
    },
    {
      id: 4,
      fullName: "David Wilson",
      email: "david@example.com",
      phone: "+1 (555) 456-7890",
      position: "Senior Developer",
      experience: "10+",
      status: "rejected",
      appliedDate: "Oct 19, 2025",
      resume: "Senior developer with expertise in cloud architecture...",
    },
  ])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleStatusChange = (candidateId: number, newStatus: string) => {
    setCandidates(candidates.map((c) => (c.id === candidateId ? { ...c, status: newStatus as any } : c)))
    setIsModalOpen(false)
  }

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setIsModalOpen(true)
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase())

    const experienceNum = Number.parseInt(candidate.experience.split("-")[0])
    const matchesExperience = experienceNum >= filters.experienceRange[0] && experienceNum <= filters.experienceRange[1]

    const matchesStatus = filters.statuses.includes(candidate.status)

    return matchesSearch && matchesExperience && matchesStatus
  })

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">Candidates</h1>
            <p className="text-neutral-500 mt-1">Review and manage job applications</p>
          </div>

          <div className="mb-6 flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
              <Input
                placeholder="Search by name, email, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-neutral-200"
              />
            </div>
            <ResomeScreeningFilters onFilterChange={handleFilterChange} />
            <Button variant="outline" className="border-neutral-200 gap-2 bg-transparent">
              <Download size={16} />
              Export
            </Button>
          </div>

          <CandidateList candidates={filteredCandidates} onCandidateClick={handleCandidateClick} />
        </div>
      </main>

      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
