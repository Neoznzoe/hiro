// app/api/applications/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { computeFollowupDate } from '@/lib/followup'

// GET — liste toutes les candidatures
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const followupsOnly = searchParams.get('followupsOnly') === 'true'

  const where: Record<string, unknown> = {}

  if (status) where.status = status

  if (followupsOnly) {
    where.nextFollowupAt = { lte: new Date() }
    where.status = { notIn: ['offer', 'rejected', 'archived'] }
  }

  const applications = await db.application.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: { events: { orderBy: { createdAt: 'desc' }, take: 5 } }
  })

  return NextResponse.json(applications)
}

// POST — crée une nouvelle candidature
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      companyName, position, source, offerUrl,
      status = 'to_apply', appliedAt, contactName,
      contactEmail, salaryRange, notes, analysisData,
      followupDelayDays
    } = body

    if (!companyName || !position || !source) {
      return NextResponse.json({ error: 'companyName, position et source sont requis' }, { status: 400 })
    }

    // Calcul automatique de la date de relance
    const delay = followupDelayDays ?? computeFollowupDate(source, position)
    const nextFollowupAt = appliedAt
      ? new Date(new Date(appliedAt).getTime() + delay * 86400000)
      : null

    const application = await db.application.create({
      data: {
        companyName, position, source, offerUrl,
        status, appliedAt: appliedAt ? new Date(appliedAt) : null,
        nextFollowupAt, followupDelayDays: delay,
        contactName, contactEmail, salaryRange, notes,
        analysisData: analysisData ?? undefined,
        events: {
          create: {
            eventType: 'status_change',
            payload: { from: null, to: status }
          }
        }
      }
    })

    return NextResponse.json(application, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
