// app/api/applications/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type RouteContext = { params: Promise<{ id: string }> }

// GET — une candidature avec tous ses événements
export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params

  const application = await db.application.findUnique({
    where: { id },
    include: { events: { orderBy: { createdAt: 'desc' } } }
  })

  if (!application) {
    return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 })
  }

  return NextResponse.json(application)
}

// PATCH — mise à jour partielle
export async function PATCH(req: NextRequest, context: RouteContext) {
  const { id } = await context.params
  const body = await req.json()

  const existing = await db.application.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 })
  }

  const {
    status, notes, contactName, contactEmail,
    salaryRange, nextFollowupAt, followupDelayDays, appliedAt
  } = body

  // Recalcul de nextFollowupAt si appliedAt ou followupDelayDays changent
  let computedFollowup = undefined
  const newAppliedAt = appliedAt ? new Date(appliedAt) : existing.appliedAt
  const newDelay = followupDelayDays ?? existing.followupDelayDays
  if (appliedAt !== undefined || followupDelayDays !== undefined) {
    computedFollowup = newAppliedAt
      ? new Date(newAppliedAt.getTime() + newDelay * 86400000)
      : null
  }

  const updated = await db.application.update({
    where: { id },
    data: {
      ...(status !== undefined && { status }),
      ...(notes !== undefined && { notes }),
      ...(contactName !== undefined && { contactName }),
      ...(contactEmail !== undefined && { contactEmail }),
      ...(salaryRange !== undefined && { salaryRange }),
      ...(appliedAt !== undefined && { appliedAt: newAppliedAt }),
      ...(followupDelayDays !== undefined && { followupDelayDays: newDelay }),
      ...(nextFollowupAt !== undefined && { nextFollowupAt: new Date(nextFollowupAt) }),
      ...(computedFollowup !== undefined && { nextFollowupAt: computedFollowup }),
      // Crée un événement si le statut change
      ...(status && status !== existing.status && {
        events: {
          create: {
            eventType: 'status_change',
            payload: { from: existing.status, to: status }
          }
        }
      })
    },
    include: { events: { orderBy: { createdAt: 'desc' }, take: 5 } }
  })

  return NextResponse.json(updated)
}

// DELETE — suppression (cascade vers events)
export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params

  const existing = await db.application.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 })
  }

  await db.application.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
