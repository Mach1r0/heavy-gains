import type React from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { TopHeader } from "@/components/top-header"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav userType="student" />
      <div className="flex-1 pl-64">
        <TopHeader userName="João Silva" userType="student" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
