'use client'

import type { ApplicationStatus } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  to_apply: { label: 'A postuler', className: 'bg-blue-ribbon-50 text-blue-ribbon-500 hover:bg-blue-ribbon-50' },
  applied: { label: 'Postulé', className: 'bg-zest-50 text-zest-300 hover:bg-zest-50' },
  followup: { label: 'Relance', className: 'bg-zest-100 text-zest-200 hover:bg-zest-100' },
  interview: { label: 'Entretien', className: 'bg-chateau-green-50 text-chateau-green-300 hover:bg-chateau-green-50' },
  offer: { label: 'Offre', className: 'bg-chateau-green-100 text-chateau-green-300 hover:bg-chateau-green-100' },
  rejected: { label: 'Refus', className: 'bg-tall-poppy-50 text-tall-poppy-400 hover:bg-tall-poppy-50' },
  archived: { label: 'Archivé', className: 'bg-alabaster-100 text-alabaster-300 hover:bg-alabaster-100' },
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge className={cn('font-semibold', config.className)}>
      {config.label}
    </Badge>
  )
}

const SOURCE_CONFIG: Record<string, { className: string }> = {
  indeed: { className: 'bg-blue-ribbon-50 text-blue-ribbon-500 hover:bg-blue-ribbon-50' },
  linkedin: { className: 'bg-blue-ribbon-50 text-blue-ribbon-400 hover:bg-blue-ribbon-50' },
  wttj: { className: 'bg-zest-50 text-zest-300 hover:bg-zest-50' },
  spontaneous: { className: 'bg-chateau-green-50 text-chateau-green-300 hover:bg-chateau-green-50' },
  other: { className: 'bg-athens-gray-100 text-woodsmoke-400 hover:bg-athens-gray-100' },
}

export function SourceBadge({ source }: { source: string }) {
  const config = SOURCE_CONFIG[source] ?? SOURCE_CONFIG.other
  return (
    <Badge variant="secondary" className={cn('font-medium', config.className)}>
      {source}
    </Badge>
  )
}
