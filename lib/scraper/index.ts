// lib/scraper/index.ts
// Scraping d'offres et de pages boîtes via Firecrawl

import FirecrawlApp from '@mendable/firecrawl-js'

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

export async function scrapeOffer(url: string): Promise<string> {
  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: ['markdown'],
      onlyMainContent: true,
    })

    if (!result.success || !result.markdown) {
      throw new Error('Scraping échoué ou contenu vide')
    }

    return result.markdown
  } catch (err) {
    throw new Error(`Impossible de scraper l'offre : ${err instanceof Error ? err.message : 'erreur inconnue'}`)
  }
}

export async function scrapeCompany(companyUrl: string): Promise<string> {
  try {
    // Scrape la page principale + la page "À propos" si possible
    const results = await firecrawl.crawlUrl(companyUrl, {
      limit: 3,
      scrapeOptions: {
        formats: ['markdown'],
        onlyMainContent: true,
      }
    })

    if (!results.success || !results.data?.length) {
      return `Site de la boîte : ${companyUrl} (contenu non accessible)`
    }

    return results.data
      .map(page => page.markdown || '')
      .filter(Boolean)
      .join('\n\n---\n\n')
      .slice(0, 8000) // Limite pour ne pas exploser le contexte
  } catch {
    return `Site de la boîte : ${companyUrl} (scraping non disponible)`
  }
}

// Extraction de l'URL de la boîte depuis une offre
export function extractCompanyUrl(offerContent: string): string | null {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
  const urls = offerContent.match(urlRegex) || []

  // Filtre les URLs de job boards connus pour garder uniquement l'URL de la boîte
  const jobBoards = ['indeed.com', 'linkedin.com', 'welcometothejungle.com', 'apec.fr', 'monster.fr']
  return urls.find(url => !jobBoards.some(jb => url.includes(jb))) || null
}
