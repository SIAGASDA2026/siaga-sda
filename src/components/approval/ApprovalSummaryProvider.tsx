'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { canAccessPage } from '@/lib/rbac'
import type { ApprovalSummary } from '@/lib/approval-workflow'
import { useAppStore } from '@/store/useAppStore'

const APPROVAL_SUMMARY_REFRESH_MS = 30_000
const EMPTY_SUMMARY: ApprovalSummary = {
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  revision: 0,
}

type ApprovalSummaryContextValue = {
  canViewApproval: boolean
  summary: ApprovalSummary
  refreshApprovalSummary: () => Promise<void>
}

const ApprovalSummaryContext = createContext<ApprovalSummaryContextValue | null>(null)

export function ApprovalSummaryProvider({ children }: { children: React.ReactNode }) {
  const currentUser = useAppStore((state) => state.currentUser)
  const canViewApproval = canAccessPage(currentUser?.role ?? '', '/approval')
  const [summary, setSummary] = useState<ApprovalSummary>(EMPTY_SUMMARY)
  const requestInFlightRef = useRef(false)

  const refreshApprovalSummary = useCallback(async () => {
    if (!canViewApproval) {
      setSummary(EMPTY_SUMMARY)
      return
    }
    if (requestInFlightRef.current) return

    requestInFlightRef.current = true
    try {
      const response = await fetch('/api/approval/summary', { cache: 'no-store' })
      if (response.status === 403) {
        setSummary(EMPTY_SUMMARY)
        return
      }
      if (!response.ok) throw new Error('Gagal memuat ringkasan approval')
      const data = await response.json()
      setSummary(data.summary ?? EMPTY_SUMMARY)
    } catch {
      // Pertahankan ringkasan terakhir agar badge tidak berkedip saat koneksi sementara gagal.
    } finally {
      requestInFlightRef.current = false
    }
  }, [canViewApproval])

  useEffect(() => {
    void refreshApprovalSummary()
    if (!canViewApproval) return

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refreshApprovalSummary()
    }, APPROVAL_SUMMARY_REFRESH_MS)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void refreshApprovalSummary()
    }
    const handleFocus = () => void refreshApprovalSummary()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [canViewApproval, refreshApprovalSummary])

  const value = useMemo(
    () => ({ canViewApproval, summary, refreshApprovalSummary }),
    [canViewApproval, refreshApprovalSummary, summary],
  )

  return (
    <ApprovalSummaryContext.Provider value={value}>
      {children}
    </ApprovalSummaryContext.Provider>
  )
}

export function useApprovalSummary() {
  const context = useContext(ApprovalSummaryContext)
  if (!context) throw new Error('useApprovalSummary harus digunakan di dalam ApprovalSummaryProvider')
  return context
}
