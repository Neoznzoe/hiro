'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Search, Briefcase } from 'lucide-react'
import { HiroWordmark } from './HiroLogo'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analyze', label: 'Analyser une offre', icon: Search },
  { href: '/applications', label: 'Candidatures', icon: Briefcase },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-woodsmoke-700 border-r border-woodsmoke-600 flex flex-col z-50">
      <div className="p-6">
        <HiroWordmark variant="transparent-light" size={28} />
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-woodsmoke-600 text-blue-ribbon-400'
                  : 'text-athens-gray-200 hover:bg-woodsmoke-600 hover:text-athens-gray-50'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 text-xs text-woodsmoke-300">
        hiro v1.0
      </div>
    </aside>
  )
}
