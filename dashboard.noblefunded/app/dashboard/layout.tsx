"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Mock auth guard — redirect to login if not signed in
    const loggedIn = sessionStorage.getItem("nf_logged_in")
    if (!loggedIn) {
      router.replace("/login")
    }
  }, [router])

  return <>{children}</>
}
