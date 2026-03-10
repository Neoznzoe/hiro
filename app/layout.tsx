import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/ui/Sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'hiro — Job Search Cockpit',
  description: 'Analyse d\'offres, suivi de candidatures et intelligence entretien.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} min-h-screen`}>
        <TooltipProvider>
          <Sidebar />
          <main className="ml-64 min-h-screen">
            {children}
          </main>
        </TooltipProvider>
      </body>
    </html>
  )
}
