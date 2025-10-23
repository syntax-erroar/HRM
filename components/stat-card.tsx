import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend: string
  color: "primary" | "success" | "warning" | "error" | "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5"
}

export function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const colorVar = `var(--color-${color})`

  return (
    <Card className="p-6 bg-card border border-subtle">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          <p className="text-xs text-muted mt-2">{trend}</p>
        </div>
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: `color-mix(in srgb, ${colorVar} 15%, transparent)`,
            color: colorVar,
          }}
        >
          <Icon size={24} />
        </div>
      </div>
    </Card>
  )
}
