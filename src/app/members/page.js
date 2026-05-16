import RoleGuard from '@/components/auth/RoleGuard'
import MemberCard from '@/components/members/MemberCard'

// TODO: link with Supabase for actual members data
const tempMembers = [
  {
    id: '1',
    name: 'Alice Chen',
    school: 'Seneca College',
    workplace: 'Shopify',
    status: 'Student',
    role: 'Executive',
    linkedinUrl: 'https://linkedin.com/in/alice',
    githubUrl: 'https://github.com/alice',
  },
  {
    id: '2',
    name: 'Bob Patel',
    school: 'York University',
    status: 'Graduate',
    role: 'Member',
    githubUrl: 'https://github.com/bob',
  },
  {
    id: '3',
    name: 'Carlos Diaz',
    school: 'Seneca College',
    status: 'Student',
    role: 'Member',
  },
  {
    id: '4',
    name: 'Diana Wu',
    school: 'York University',
    workplace: 'RBC',
    status: 'Graduate',
    role: 'Executive',
    linkedinUrl: 'https://linkedin.com/in/diana',
  },
  {
    id: '5',
    name: 'Ethan Brown',
    school: 'Seneca College',
    status: 'Student',
    role: 'Member',
    linkedinUrl: 'https://linkedin.com/in/ethan',
    githubUrl: 'https://github.com/ethan',
  },
]

export default function MembersPage() {
  return (
    <RoleGuard>
      <main className="min-h-screen">
        {/*HEADER SECTION*/}
        <section className="bg-bg-surface py-8 px-6">
          <div className="max-w-[1200px] mx-auto">
            <h1 className="font-montserrat text-4xl font-bold text-text-primary">
              Members
            </h1>
            <p className="mt-2 text-base text-text-secondary">
              Active and alumni codeXperts community
            </p>
          </div>
        </section>

        {/*FILTER ROW*/}
        <section className="bg-white py-4 px-6">
          <div className="max-w-[1200px] mx-auto flex flex-row gap-3 flex-wrap">
            <select className="border border-border-strong rounded-md px-3 py-2 text-sm text-text-primary bg-bg-base focus:outline-none focus:ring-2 focus:ring-border"
            defaultValue="">
              <option value="">All Cohorts</option>
              <option value="winter-2024">Winter 2024</option>
              <option value="summer-2024">Summer 2024</option>
              <option value="fall-2024">Fall 2024</option>
              <option value="winter-2025">Winter 2025</option>
            </select>

            <select className="border border-border-strong rounded-md px-3 py-2 text-sm text-text-primary bg-bg-base focus:outline-none focus:ring-2 focus:ring-border"
            defaultValue="">
              <option value="">All Schools</option>
              <option value="seneca">Seneca College</option>
              <option value="york">York University</option>
            </select>

            <select className="border border-border-strong rounded-md px-3 py-2 text-sm text-text-primary bg-bg-base focus:outline-none focus:ring-2 focus:ring-border"
            defaultValue="">
              <option value="">All Status</option>
              <option value="student">Student</option>
              <option value="graduate">Graduate</option>
            </select>

            <select className="border border-border-strong rounded-md px-3 py-2 text-sm text-text-primary bg-bg-base focus:outline-none focus:ring-2 focus:ring-border"
            defaultValue="">
              <option value="">All Roles</option>
              <option value="member">Member</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </section>

        {/*MEMBER GRID*/}
        <section className="bg-bg-base py-8 px-6">
          <div className="max-w-[1200px] mx-auto">
            {/* TODO: sort by activity score */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center">
              {tempMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </RoleGuard>
  )
}
