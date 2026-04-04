"use client"

import { useState } from "react"
import { Sidebar, Topbar } from "@/components/dashboard/sidebar"

interface DashboardShellProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function DashboardShell({ children, title, subtitle }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex" style={{ background: "#071210", backgroundImage: "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(13,148,136,0.18) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(6,78,59,0.22) 0%, transparent 55%), radial-gradient(ellipse 40% 40% at 50% 50%, rgba(20,184,166,0.07) 0%, transparent 60%)" }}>
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Topbar
          onMenuOpen={() => setSidebarOpen(true)}
          title={title}
          subtitle={subtitle}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
