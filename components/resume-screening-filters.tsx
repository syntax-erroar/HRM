"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter, X } from "lucide-react"
import { useState } from "react"

interface ScreeningFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  experienceRange: [number, number]
  statuses: string[]
  ratingMin: number
}

export function ResomeScreeningFilters({ onFilterChange }: ScreeningFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    experienceRange: [0, 15],
    statuses: ["new", "reviewing", "shortlisted"],
    ratingMin: 0,
  })

  const handleExperienceChange = (value: [number, number]) => {
    const newFilters = { ...filters, experienceRange: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleStatusToggle = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status]
    const newFilters = { ...filters, statuses: newStatuses }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleRatingChange = (value: number[]) => {
    const newFilters = { ...filters, ratingMin: value[0] }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      experienceRange: [0, 15],
      statuses: ["new", "reviewing", "shortlisted"],
      ratingMin: 0,
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <div className="relative">
      <Button variant="outline" className="border-neutral-200 gap-2 bg-transparent" onClick={() => setIsOpen(!isOpen)}>
        <Filter size={16} />
        Filters
      </Button>

      {isOpen && (
        <Card className="absolute top-12 right-0 w-80 p-6 border border-neutral-200 shadow-lg z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Screening Filters</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-neutral-100 rounded">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Experience Range */}
            <div>
              <Label className="text-sm font-semibold text-neutral-700 mb-3 block">
                Experience: {filters.experienceRange[0]} - {filters.experienceRange[1]} years
              </Label>
              <Slider
                value={filters.experienceRange}
                onValueChange={handleExperienceChange}
                min={0}
                max={15}
                step={1}
                className="w-full"
              />
            </div>

            {/* Status Filter */}
            <div>
              <Label className="text-sm font-semibold text-neutral-700 mb-3 block">Status</Label>
              <div className="space-y-2">
                {["new", "reviewing", "shortlisted", "rejected"].map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <Checkbox
                      id={status}
                      checked={filters.statuses.includes(status)}
                      onCheckedChange={() => handleStatusToggle(status)}
                    />
                    <Label htmlFor={status} className="text-sm text-neutral-700 cursor-pointer">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <Label className="text-sm font-semibold text-neutral-700 mb-3 block">
                Minimum Rating: {filters.ratingMin}+ stars
              </Label>
              <Slider
                value={[filters.ratingMin]}
                onValueChange={handleRatingChange}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            {/* Reset Button */}
            <Button variant="outline" className="w-full border-neutral-200 bg-transparent" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
