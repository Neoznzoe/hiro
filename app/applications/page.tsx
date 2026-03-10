'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Briefcase, Loader2 } from 'lucide-react'
import { StatusBadge, SourceBadge } from '@/components/StatusBadge'
import { ManualApplicationForm } from '@/components/ManualApplicationForm'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ApplicationStatus } from '@/types'

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
        <h1 className="text-2xl font-bold">Candidatures</h1>
        <button onClick={() => setShowForm(true)} className="hiro-btn-secondary flex items-center gap-2">
          <Plus size={16} />
          Ajouter manuellement
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === tab.value
                ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-medium'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="hiro-empty">
          <Loader2 size={24} className="animate-spin mb-2" />
          <p>Chargement...</p>
        </div>
      ) : apps.length === 0 ? (
        <div className="hiro-empty">
          <Briefcase size={40} className="mb-3 opacity-30" />
          <p>Aucune candidature{filter !== 'all' ? ' dans ce filtre' : ''}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {apps.map(app => {
            const urgencyClass = getUrgencyClass(app.nextFollowupAt)
            return (
              <Link
                key={app.id}
                href={`/applications/${app.id}`}
                className="hiro-card-hover flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {urgencyClass && (
                    <span className={urgencyClass}>
                      <span className="urgency-dot" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="font-medium truncate">{app.companyName}</div>
                    <div className="text-sm text-[var(--text-muted)] truncate">{app.position}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <SourceBadge source={app.source} />
                  <StatusBadge status={app.status} />
                  <span className="text-xs text-[var(--text-subtle)] w-20 text-right">
                    {app.appliedAt
                      ? format(new Date(app.appliedAt), 'dd MMM yyyy', { locale: fr })
                      : format(new Date(app.createdAt), 'dd MMM yyyy', { locale: fr })
                    }
                  </span>
                </div>
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
