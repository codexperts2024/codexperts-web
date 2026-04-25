import RoleGuard from '@/components/auth/RoleGuard'

export default function ProblemsPage() {
  return (
    <RoleGuard>
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">Problems</h1>
          <p className="mt-3 text-gray-400 text-lg">Weekly coding problems</p>
          <p className="mt-1 text-gray-300 text-sm">Members only</p>
        </div>
      </main>
    </RoleGuard>
  )
}
