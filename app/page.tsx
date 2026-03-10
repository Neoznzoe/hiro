import Link from 'next/link'
import { db } from '@/lib/db'
import { getFollowupUrgency } from '@/lib/followup'
import { Briefcase, Bell, CalendarClock, ArrowRight, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Application as PrismaApp } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <Button asChild>
          <Link href="/analyze" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Analyser une offre
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Candidatures actives"
          value={activeCount}
        />
        <StatCard
          icon={<Bell className="h-5 w-5" />}
          label="A relancer"
          value={followupCount}
          accent={followupCount > 0}
        />
        <StatCard
          icon={<CalendarClock className="h-5 w-5" />}
          label="Entretiens"
          value={interviewCount}
        />
      </div>

      {/* Relances urgentes */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-foreground">Relances urgentes</h2>
        {urgentFollowups.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-40" />
              <p>Aucune relance urgente</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {urgentFollowups.map((app: PrismaApp) => {
              const urgency = getFollowupUrgency(app.nextFollowupAt)
              return (
                <Link key={app.id} href={`/applications/${app.id}`}>
                  <Card className="hover:border-primary/50 hover:shadow-hiro-md transition-all cursor-pointer">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <span className={`urgency-${urgency}`}>
                          <span className="urgency-dot" />
                        </span>
                        <div>
                          <span className="font-medium text-foreground">{app.companyName}</span>
                          <span className="text-muted-foreground ml-2 text-sm">{app.position}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {app.nextFollowupAt && (
                          <span>{formatDistanceToNow(app.nextFollowupAt, { addSuffix: true, locale: fr })}</span>
                        )}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {activeCount === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Briefcase className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-base mb-1">Aucune candidature pour le moment</p>
            <p className="text-sm opacity-70">Commence par analyser une offre !</p>
            <Button asChild className="mt-4">
              <Link href="/analyze" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Analyser une offre
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span className={`text-3xl font-bold ${accent ? 'text-zest-300' : 'text-foreground'}`}>
          {value}
        </span>
      </CardContent>
    </Card>
  )
}
