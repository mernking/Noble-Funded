"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { OverviewContent } from "@/components/dashboard/overview-content"
import { auth } from "@/lib/api"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const user = auth.getUser()
  const greeting = `${getGreeting()}, ${user?.fullName?.split(" ")[0] || "Trader"}`
  
  return (
    <DashboardShell
      title="Overview"
      subtitle={greeting}
    >
      <OverviewContent />
    </DashboardShell>
  )
}
