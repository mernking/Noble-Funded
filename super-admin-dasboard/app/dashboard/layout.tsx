"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { auth } from "@/lib/api"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.replace("/login")
    }
  }, [router])

  return <>{children}</>
}
