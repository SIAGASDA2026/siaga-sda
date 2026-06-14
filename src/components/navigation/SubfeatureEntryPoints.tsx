'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MAIN_NAVIGATION_ITEMS } from '@/lib/navigation'
import { canAccessPage } from '@/lib/rbac'
import { useAppStore } from '@/store/useAppStore'

type SubfeatureEntryPointsProps = {
  parentId: string
  title?: string
}

export function SubfeatureEntryPoints({
  parentId,
  title = 'Sub-fitur Terkait',
}: SubfeatureEntryPointsProps) {
  const role = useAppStore((state) => state.currentUser?.role)
  const parent = MAIN_NAVIGATION_ITEMS.find((item) => item.id === parentId)
  const visibleItems = parent?.children?.filter((item) => canAccessPage(role, item.routeKey)) ?? []

  if (visibleItems.length === 0) return null

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <div className="text-sm font-extrabold text-slate-900">{title}</div>
        <p className="mt-1 text-xs text-slate-500">Entry point mengikuti permission dan penugasan yang berlaku.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <span className="min-w-0">
              <span className="block text-sm font-bold text-slate-800">{item.label}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{item.description}</span>
            </span>
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-slate-400 transition group-hover:text-blue-600" />
          </Link>
        ))}
      </div>
    </section>
  )
}

export default SubfeatureEntryPoints
