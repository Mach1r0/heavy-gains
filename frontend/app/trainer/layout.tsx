import type React from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { TopHeader } from "@/components/top-header"

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav userType="trainer" />
      <div className="flex-1 pl-64">
        <TopHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
