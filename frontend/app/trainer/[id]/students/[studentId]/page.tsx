import { NavHeader } from "@/components/nav-header"
import { StudentDetailTabs } from "@/components/student-detail-tabs"

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <main className="container mx-auto px-4 py-8">
        <StudentDetailTabs studentId={params.id} />
      </main>
    </div>
  )
}
