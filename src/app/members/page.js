import RoleGuard from '@/components/auth/RoleGuard'

export default function MembersPage() {
  return (
    <RoleGuard>
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">Members</h1>
          <p className="mt-3 text-gray-400 text-lg">Member directory · Profile cards · Cohort filter</p>
          <p className="mt-1 text-gray-300 text-sm">Members only</p>
        </div>
      </main>
    </RoleGuard>
  )
}
