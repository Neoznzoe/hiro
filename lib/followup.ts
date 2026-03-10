// lib/followup.ts
// Calcul intelligent de la date de relance selon le type de candidature

import type { ApplicationSource } from '@/types'

const FOLLOWUP_DELAYS: Record<ApplicationSource, number> = {
  indeed: 10,
  linkedin: 7,
  wttj: 10,
  spontaneous: 30,
  other: 14,
}

// Override selon des keywords dans le poste (cabinet de recrutement, ESN...)
const KEYWORD_OVERRIDES: Array<{ keywords: string[]; days: number }> = [
  { keywords: ['cabinet', 'recrutement', 'chasse', 'headhunter', 'talent'], days: 14 },
  { keywords: ['esn', 'ssii', 'consulting', 'conseil'], days: 14 },
  { keywords: ['startup', 'scale-up', 'scaleup'], days: 7 },
  { keywords: ['grand groupe', 'corporate', 'administration', 'fonction publique'], days: 21 },
]

export function computeFollowupDate(
  source: ApplicationSource,
  position: string
): number {
  const positionLower = position.toLowerCase()

  for (const override of KEYWORD_OVERRIDES) {
    if (override.keywords.some(k => positionLower.includes(k))) {
      return override.days
    }
  }

  return FOLLOWUP_DELAYS[source] ?? 10
}

export function getFollowupUrgency(nextFollowupAt: Date | null): 'overdue' | 'today' | 'soon' | 'ok' | 'none' {
  if (!nextFollowupAt) return 'none'

  const now = new Date()
  const diff = (nextFollowupAt.getTime() - now.getTime()) / 86400000

  if (diff < 0) return 'overdue'
  if (diff < 1) return 'today'
  if (diff <= 3) return 'soon'
  return 'ok'
}
