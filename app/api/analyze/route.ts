// app/api/analyze/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { scrapeOffer, scrapeCompany, extractCompanyUrl } from '@/lib/scraper'
import { analyzeOffer } from '@/lib/claude/analyze'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { url, rawText } = await req.json()

    if (!url && !rawText) {
      return NextResponse.json({ error: 'URL ou texte requis' }, { status: 400 })
    }

    // 1. Récupération du contenu de l'offre
    let offerContent: string
    if (rawText) {
      offerContent = rawText
    } else {
      offerContent = await scrapeOffer(url)
    }

    // 2. Scraping de la boîte (best effort)
    const companyUrl = extractCompanyUrl(offerContent)
    const companyContent = companyUrl
      ? await scrapeCompany(companyUrl)
      : "Aucune URL de boîte détectée dans l'offre."

    // 3. Récupération du CV utilisateur (optionnel)
    const profile = await db.userProfile.findFirst()
    const userCv = profile?.cvRaw || undefined

    // 4. Analyse Claude
    const analysis = await analyzeOffer(offerContent, companyContent, userCv)

    return NextResponse.json({ analysis, offerContent })

  } catch (err) {
    console.error('[/api/analyze]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
