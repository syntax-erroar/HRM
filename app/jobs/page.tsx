"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Briefcase, DollarSign, Search, ArrowRight } from "lucide-react"

interface Job {
  id: number
  title: string
  department: string
  location: string
  type: "Full-time" | "Part-time" | "Contract"
  salary: string
  description: string
  requirements: string[]
  postedDate: string
}

const jobs: Job[] = [
  {
    id: 1,
    title: "Investment Analyst",
    department: "Investment Research",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹8L - ₹12L",
    description: "Conduct in-depth research and analysis to support investment decisions for our global client base. Work with investment firms, family offices, and corporates across 10+ countries.",
    requirements: ["CFA/CA preferred", "2-4 years investment research", "Financial modeling", "Due diligence experience"],
    postedDate: "Oct 20, 2025",
  },
  {
    id: 2,
    title: "Manager - Accounts",
    department: "Accounting & Finance",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹12L - ₹18L",
    description: "Lead accounting operations for our global advisory services. Supervise team members, manage month-end closing, and ensure compliance across multiple entities.",
    requirements: ["CA/CPA qualified", "10+ years experience", "Team management", "International accounting standards"],
    postedDate: "Oct 18, 2025",
  },
  {
    id: 3,
    title: "Financial Modeling Expert",
    department: "Due Diligence",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹10L - ₹15L",
    description: "Develop sophisticated financial models for investment analysis, M&A transactions, and corporate valuations. Support due diligence processes for private equity and family office clients.",
    requirements: ["Advanced Excel/VBA", "3-5 years modeling", "DCF/LBO models", "Investment banking experience"],
    postedDate: "Oct 15, 2025",
  },
  {
    id: 4,
    title: "Senior Accountant - Real Estate",
    department: "Accounting & Finance",
    location: "Toronto, Canada",
    type: "Full-time",
    salary: "CAD $70k - $90k",
    description: "Lead QuickBooks Online setup and management across multiple real estate entities. Handle daily bookkeeping, HST filings, and project-level reporting for our Canadian operations.",
    requirements: ["Canadian CPA", "QuickBooks Online expert", "Real estate accounting", "HST compliance"],
    postedDate: "Oct 10, 2025",
  },
  {
    id: 5,
    title: "Due Diligence Specialist",
    department: "Investment Research",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹6L - ₹10L",
    description: "Conduct comprehensive due diligence for investment opportunities. Analyze financial statements, market conditions, and risk factors for private equity and family office clients.",
    requirements: ["CA/CFA preferred", "2-3 years experience", "Financial analysis", "Risk assessment"],
    postedDate: "Oct 8, 2025",
  },
  {
    id: 6,
    title: "FP&A Analyst",
    department: "Financial Planning",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹7L - ₹11L",
    description: "Provide outsourced FP&A services to our corporate clients. Develop budgets, forecasts, and financial planning models to support strategic decision-making.",
    requirements: ["CA/MBA preferred", "3-4 years FP&A", "Budgeting & forecasting", "Corporate finance"],
    postedDate: "Oct 5, 2025",
  },
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = selectedDepartment === "all" || job.department === selectedDepartment
    const matchesType = selectedType === "all" || job.type === selectedType

    return matchesSearch && matchesDepartment && matchesType
  })

  const departments = Array.from(new Set(jobs.map((job) => job.department)))
  const types = Array.from(new Set(jobs.map((job) => job.type)))

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900">Open Positions</h1>
              <p className="text-neutral-600 mt-2">Join our team and make an impact</p>
            </div>
            <Link href="/apply">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                Quick Apply
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
              <Input
                placeholder="Search jobs, departments, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-neutral-200"
              />
            </div>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="border-neutral-200">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="border-neutral-200">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {filteredJobs.length === 0 ? (
          <Card className="p-12 text-center border border-neutral-200">
            <Briefcase size={48} className="mx-auto mb-4 text-neutral-400" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No jobs found</h3>
            <p className="text-neutral-600">Try adjusting your search filters</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="p-6 border border-neutral-200 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        {job.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} />
                        {job.salary}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 whitespace-nowrap">{job.type}</Badge>
                </div>

                <p className="text-neutral-700 mb-4">{job.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-neutral-900 mb-2">Key Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, idx) => (
                      <Badge key={idx} variant="outline" className="border-neutral-300 text-neutral-700">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <span className="text-xs text-neutral-500">Posted {job.postedDate}</span>
                  <Link href={`/apply?job=${job.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                      Apply Now
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border border-neutral-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{jobs.length}</div>
            <p className="text-neutral-600">Open Positions</p>
          </Card>
          <Card className="p-6 border border-neutral-200 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{departments.length}</div>
            <p className="text-neutral-600">Departments</p>
          </Card>
          <Card className="p-6 border border-neutral-200 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">Remote</div>
            <p className="text-neutral-600">Friendly</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
