'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Briefcase, Loader2 } from 'lucide-react'
import { StatusBadge, SourceBadge } from '@/components/StatusBadge'
import { ManualApplicationForm } from '@/components/ManualApplicationForm'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ApplicationStatus } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AppRow {
  id: string
  companyName: string
  position: string
  source: string
  status: ApplicationStatus
  appliedAt: string | null
  nextFollowupAt: string | null
  createdAt: string
}

const TABS: { label: string; value: ApplicationStatus | 'all' }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'A postuler', value: 'to_apply' },
  { label: 'Postulé', value: 'applied' },
  { label: 'Relance', value: 'followup' },
  { label: 'Entretien', value: 'interview' },
  { label: 'Offre', value: 'offer' },
  { label: 'Refus', value: 'rejected' },
  { label: 'Archivé', value: 'archived' },
]

export default function ApplicationsPage() {
  const [apps, setApps] = useState<AppRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all')
  const [showForm, setShowForm] = useState(false)

  const fetchApps = useCallback(async () => {
    setLoading(true)
    const params = filter !== 'all' ? `?status=${filter}` : ''
    const res = await fetch(`/api/applications${params}`)
    const data = await res.json()
    setApps(data)
    setLoading(false)
  }, [filter])

  useEffect(() => { fetchApps() }, [fetchApps])

  function getUrgencyClass(nextFollowupAt: string | null): string {
    if (!nextFollowupAt) return ''
    const diff = (new Date(nextFollowupAt).getTime() - Date.now()) / 86400000
    if (diff < 0) return 'urgency-overdue'
    if (diff < 1) return 'urgency-today'
    if (diff <= 3) return 'urgency-soon'
    return 'urgency-ok'
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Candidatures</h1>
        <Button variant="secondary" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter manuellement
        </Button>
      </div>

      {/* Filter tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as ApplicationStatus | 'all')}>
        <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0">
          {TABS.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Table */}
      {loading ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mb-2" />
            <p>Chargement...</p>
          </CardContent>
        </Card>
      ) : apps.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Briefcase className="h-10 w-10 mb-3 opacity-30" />
            <p>Aucune candidature{filter !== 'all' ? ' dans ce filtre' : ''}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {apps.map(app => {
            const urgencyClass = getUrgencyClass(app.nextFollowupAt)
            return (
              <Link key={app.id} href={`/applications/${app.id}`}>
                <Card className="hover:border-primary/50 hover:shadow-hiro-md transition-all cursor-pointer">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4 min-w-0">
                      {urgencyClass && (
                        <span className={urgencyClass}>
                          <span className="urgency-dot" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <div className="font-medium truncate text-foreground">{app.companyName}</div>
                        <div className="text-sm text-muted-foreground truncate">{app.position}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <SourceBadge source={app.source} />
                      <StatusBadge status={app.status} />
                      <span className="text-xs text-muted-foreground w-20 text-right">
                        {app.appliedAt
                          ? format(new Date(app.appliedAt), 'dd MMM yyyy', { locale: fr })
                          : format(new Date(app.createdAt), 'dd MMM yyyy', { locale: fr })
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {showForm && (
        <ManualApplicationForm
          onSuccess={() => { setShowForm(false); fetchApps() }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
