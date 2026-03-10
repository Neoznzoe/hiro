import Link from 'next/link'
import { db } from '@/lib/db'
import { getFollowupUrgency } from '@/lib/followup'
import { Briefcase, Bell, CalendarClock, ArrowRight, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Application as PrismaApp } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const now = new Date()

  const [activeCount, followupCount, interviewCount, urgentFollowups] = await Promise.all([
    db.application.count({
      where: { status: { notIn: ['rejected', 'archived'] } }
    }),
    db.application.count({
      where: {
        nextFollowupAt: { lte: now },
        status: { notIn: ['offer', 'rejected', 'archived'] }
      }
    }),
    db.application.count({
      where: { status: 'interview' }
    }),
    db.application.findMany({
      where: {
        nextFollowupAt: { lte: new Date(now.getTime() + 3 * 86400000) },
        status: { notIn: ['offer', 'rejected', 'archived'] }
      },
      orderBy: { nextFollowupAt: 'asc' },
      take: 5,
    }),
  ])

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/analyze" className="hiro-btn-primary flex items-center gap-2">
          <Search size={16} />
          Analyser une offre
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={<Briefcase size={20} />}
          label="Candidatures actives"
          value={activeCount}
        />
        <StatCard
          icon={<Bell size={20} />}
          label="A relancer"
          value={followupCount}
          accent={followupCount > 0}
        />
        <StatCard
          icon={<CalendarClock size={20} />}
          label="Entretiens"
          value={interviewCount}
        />
      </div>

      {/* Relances urgentes */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Relances urgentes</h2>
        {urgentFollowups.length === 0 ? (
          <div className="hiro-empty">
            <Bell size={32} className="mb-2 opacity-40" />
            <p>Aucune relance urgente</p>
          </div>
        ) : (
          <div className="space-y-2">
            {urgentFollowups.map((app: PrismaApp) => {
              const urgency = getFollowupUrgency(app.nextFollowupAt)
              return (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="hiro-card-hover flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className={`urgency-${urgency}`}>
                      <span className="urgency-dot" />
                    </span>
                    <div>
                      <span className="font-medium">{app.companyName}</span>
                      <span className="text-[var(--text-muted)] ml-2 text-sm">{app.position}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                    {app.nextFollowupAt && (
                      <span>{formatDistanceToNow(app.nextFollowupAt, { addSuffix: true, locale: fr })}</span>
                    )}
                    <ArrowRight size={14} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {activeCount === 0 && (
        <div className="hiro-empty">
          <Briefcase size={40} className="mb-3 opacity-30" />
          <p className="text-base mb-1">Aucune candidature pour le moment</p>
          <p className="text-[var(--text-subtle)]">Commence par analyser une offre !</p>
          <Link href="/analyze" className="hiro-btn-primary mt-4 flex items-center gap-2">
            <Search size={16} />
            Analyser une offre
          </Link>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent?: boolean }) {
  return (
    <div className="hiro-card p-5">
      <div className="flex items-center gap-3 mb-2 text-[var(--text-muted)]">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-3xl font-bold ${accent ? 'text-[var(--zest-300)]' : ''}`}>
        {value}
      </span>
    </div>
  )
}
