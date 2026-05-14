import RoleGuard from '@/components/auth/RoleGuard'

export default function MembersPage() {
  return (
    <RoleGuard>
      <main className="min-h-screen">
        {/*HEADER SECTION*/}
        <section className="bg-[#F9F9F9] py-8 px-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="font-montserrat text-4xl font-bold text-gray-900">
              Members
            </h1>
            <p className="mt-2 text-base text-[#555555]">
              Active and alumni codeXperts community
            </p>
          </div>
        </section>

        {/*FILTER ROW*/}
        <section className="bg-white py-4 px-6">
          <div className="max-w-[1200px] mx-auto flex flex-row gap-3 flex-wrap">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                defaultValue="">
              <option value="">All Cohorts</option>
              <option value="winter-2024">Winter 2024</option>
              <option value="summer-2024">Summer 2024</option>
              <option value="fall-2024">Fall 2024</option>
              <option value="winter-2025">Winter 2025</option>
            </select>

            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
              defaultValue="">
              <option value="">All Schools</option>
              <option value="seneca">Seneca College</option>
              <option value="york">York University</option>
            </select>

            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
              defaultValue="">
              <option value="">All Status</option>
              <option value="student">Student</option>
              <option value="graduate">Graduate</option>
            </select>

            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
              defaultValue="">
              <option value="">All Roles</option>
              <option value="member">Member</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </section>
          <p className="mt-3 text-gray-400 text-lg">Member directory · Profile cards · Cohort filter</p>
          <p className="mt-1 text-gray-300 text-sm">Members only</p>
      </main>
    </RoleGuard>
  )
}
