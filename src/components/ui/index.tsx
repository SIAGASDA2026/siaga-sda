'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  footer?: React.ReactNode
}

export function Modal({ open, onClose, title, subtitle, children, size = 'md', footer }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !open) return
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      window.removeEventListener('keydown', handler)
    }
  }, [mounted, open, onClose])

  if (!mounted || !open) return null

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-3xl', xl: 'max-w-5xl' }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center px-3 py-4 sm:items-center sm:px-4 sm:py-6">
      <div className="fixed inset-0 z-[9998] bg-slate-950/55 backdrop-blur-md" onClick={onClose} />
      <div
        ref={ref}
        className={`relative z-[9999] flex max-h-[84dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200 sm:max-h-[82dvh] sm:rounded-2xl ${sizes[size]}`}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between border-b border-slate-100 p-4 sm:p-5">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-800">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors ml-4 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-5 sm:p-5 sm:pb-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 rounded-b-2xl border-t border-slate-100 bg-slate-50 p-3 sm:p-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Hapus', danger = true }: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-100' : 'bg-blue-100'}`}>
          <span className="text-2xl">{danger ? '🗑️' : '❓'}</span>
        </div>
        <h3 className="text-base font-bold text-slate-800 text-center mb-2">{title}</h3>
        <p className="text-sm text-slate-500 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 font-medium">
            Batal
          </button>
          <button onClick={() => { onConfirm(); onClose() }}
            className={`flex-1 py-2.5 rounded-xl text-sm text-white font-medium ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}

export function FormField({ label, required, error, hint, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {hint && <span className="text-slate-400 font-normal text-xs ml-1">({hint})</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const { error, className, ...rest } = props
  return (
    <input
      {...rest}
      className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors
        ${error ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'}
        disabled:bg-slate-50 disabled:text-slate-400
        ${className || ''}`}
    />
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  const { error, className, ...rest } = props
  return (
    <textarea
      {...rest}
      className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors resize-none
        ${error ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'}
        ${className || ''}`}
    />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  const { error, className, ...rest } = props
  return (
    <select
      {...rest}
      className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors bg-white
        ${error ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'}
        ${className || ''}`}
    />
  )
}

interface StatusBadgeProps {
  color: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'slate'
  label: string
  dot?: boolean
}

export function StatusBadge({ color, label, dot }: StatusBadgeProps) {
  const colors = {
    green: 'bg-green-100 text-green-700 border-green-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    yellow: 'bg-amber-100 text-amber-700 border-amber-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
  }
  const dotColors = {
    green: 'bg-green-500', red: 'bg-red-500', yellow: 'bg-amber-500',
    blue: 'bg-blue-500', purple: 'bg-purple-500', slate: 'bg-slate-400',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${colors[color]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[color]}`} />}
      {label}
    </span>
  )
}

export function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode, title: string, description?: string, action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-700 mb-1">{title}</h3>
      {description && <p className="text-xs text-slate-400 mb-4">{description}</p>}
      {action}
    </div>
  )
}

export function ActionButtons({ onEdit, onDelete, editLabel = 'Edit', small }: {
  onEdit?: () => void, onDelete?: () => void, editLabel?: string, small?: boolean
}) {
  const cls = small ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'
  return (
    <div className="flex items-center gap-1.5">
      {onEdit && (
        <button onClick={onEdit}
          className={`${cls} bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-colors border border-blue-100`}>
          {editLabel}
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete}
          className={`${cls} bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium transition-colors border border-red-100`}>
          Hapus
        </button>
      )}
    </div>
  )
}
