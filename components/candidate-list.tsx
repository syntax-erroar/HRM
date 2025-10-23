"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, Mail, Phone } from "lucide-react"
import { useState } from "react"

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

interface CandidateListProps {
  candidates: Candidate[]
  onCandidateClick?: (candidate: Candidate) => void
}

const statusConfig = {
  new: {
    color: "bg-blue-50 text-blue-700",
    badge: "bg-blue-100 text-blue-800",
  },
  reviewing: {
    color: "bg-amber-50 text-amber-700",
    badge: "bg-amber-100 text-amber-800",
  },
  shortlisted: {
    color: "bg-green-50 text-green-700",
    badge: "bg-green-100 text-green-800",
  },
  rejected: {
    color: "bg-red-50 text-red-700",
    badge: "bg-red-100 text-red-800",
  },
}

export function CandidateList({ candidates, onCandidateClick }: CandidateListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {candidates.length === 0 ? (
        <Card className="p-8 text-center border border-neutral-200">
          <p className="text-neutral-500">No candidates found. Try adjusting your search.</p>
        </Card>
      ) : (
        candidates.map((candidate) => {
          const config = statusConfig[candidate.status]
          const isExpanded = expandedId === candidate.id

          return (
            <Card key={candidate.id} className="border border-neutral-200 overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : candidate.id)}
                className="w-full p-6 hover:bg-neutral-50 transition-colors text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-neutral-900">{candidate.fullName}</h3>
                      <Badge className={config.badge}>
                        {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <span>{candidate.position}</span>
                      <span>•</span>
                      <span>{candidate.experience} years</span>
                      <span>•</span>
                      <span>Applied {candidate.appliedDate}</span>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-neutral-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-neutral-200 p-6 bg-neutral-50">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <a
                        href={`mailto:${candidate.email}`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Mail size={16} />
                        {candidate.email}
                      </a>
                      <a
                        href={`tel:${candidate.phone}`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Phone size={16} />
                        {candidate.phone}
                      </a>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">Resume</h4>
                      <p className="text-sm text-neutral-600 bg-white p-3 rounded border border-neutral-200">
                        {candidate.resume}
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => onCandidateClick?.(candidate)}
                      >
                        View Details
                      </Button>
                      {candidate.status === "new" && (
                        <Button variant="outline" className="flex-1 border-neutral-200 bg-transparent">
                          Reject
                        </Button>
                      )}
                      {candidate.status === "reviewing" && (
                        <Button variant="outline" className="flex-1 border-neutral-200 bg-transparent">
                          Reject
                        </Button>
                      )}
                      {candidate.status === "shortlisted" && (
                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                          Schedule Interview
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })
      )}
    </div>
  )
}
