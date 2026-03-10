// lib/scraper/index.ts
// Scraping d'offres et de pages boîtes via fetch + Readability (sans Firecrawl)

import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml',
}

async function fetchAndParse(url: string): Promise<string> {
  const res = await fetch(url, { headers: HEADERS, redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`)

  const html = await res.text()
  const dom = new JSDOM(html, { url })
  const article = new Readability(dom.window.document).parse()

  return article?.textContent?.trim() || ''
}

export async function scrapeOffer(url: string): Promise<string> {
  try {
    const content = await fetchAndParse(url)
    if (!content) throw new Error('Contenu vide')
    return content
  } catch (err) {
    throw new Error(`Impossible de scraper l'offre : ${err instanceof Error ? err.message : 'erreur inconnue'}`)
  }
}

export async function scrapeCompany(companyUrl: string): Promise<string> {
  try {
    // Scrape la page principale
    const mainContent = await fetchAndParse(companyUrl)

    // Tente aussi la page "À propos" (best effort)
    const aboutPaths = ['/about', '/a-propos', '/qui-sommes-nous', '/about-us']
    let aboutContent = ''
    for (const path of aboutPaths) {
      try {
        const aboutUrl = new URL(path, companyUrl).href
        aboutContent = await fetchAndParse(aboutUrl)
        if (aboutContent) break
      } catch {
        // On continue avec le path suivant
      }
    }

    const combined = [mainContent, aboutContent].filter(Boolean).join('\n\n---\n\n')
    return combined.slice(0, 8000) || `Site de la boîte : ${companyUrl} (contenu non accessible)`
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
