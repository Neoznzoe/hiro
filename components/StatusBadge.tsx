'use client'

import type { ApplicationStatus } from '@/types'

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  to_apply: 'A postuler',
  applied: 'Postulé',
  followup: 'Relance',
  interview: 'Entretien',
  offer: 'Offre',
  rejected: 'Refus',
  archived: 'Archivé',
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cssClass = `status-${status.replace('_', '-')}`
  return <span className={cssClass}>{STATUS_LABELS[status]}</span>
}

const SOURCE_COLORS: Record<string, string> = {
  indeed: 'bg-blue-ribbon-50 text-blue-ribbon-500',
  linkedin: 'bg-blue-ribbon-50 text-blue-ribbon-400',
  wttj: 'bg-zest-50 text-zest-300',
  spontaneous: 'bg-chateau-green-50 text-chateau-green-300',
  other: 'bg-athens-gray-100 text-woodsmoke-400',
}

export function SourceBadge({ source }: { source: string }) {
  return (
    <span className={`hiro-badge ${SOURCE_COLORS[source] ?? SOURCE_COLORS.other}`}>
      {source}
    </span>
  )
}
