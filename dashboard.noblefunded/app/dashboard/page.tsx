"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { OverviewContent } from "@/components/dashboard/overview-content"
import { mockUser } from "@/lib/data"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Overview"
      subtitle={`${getGreeting()}, ${mockUser.name.split(" ")[0]}`}
    >
      <OverviewContent />
    </DashboardShell>
  )
}
