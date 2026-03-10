'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Search, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { HiroWordmark } from './HiroLogo'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analyze', label: 'Analyser', icon: Search },
  { href: '/applications', label: 'Candidatures', icon: Briefcase },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      <div className="p-6">
        <HiroWordmark variant="transparent-light" size={28} />
      </div>

      <Separator className="bg-sidebar-border mx-3" />

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Button
              key={href}
              variant="ghost"
              asChild
              className={cn(
                'w-full justify-start gap-3 h-10 px-3 font-medium',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Link href={href}>
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </Button>
          )
        })}
      </nav>

      <div className="p-4 text-xs text-woodsmoke-300">
        hiro v1.0
      </div>
    </aside>
  )
}
