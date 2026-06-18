import {
  PACKAGE_SOURCE_EMPTY_STATE,
  PACKAGE_SOURCE_ORIGIN_OPTIONS,
  type WorkflowRoute,
} from '@/lib/workflow-mapping'

export type SourceOriginModule =
  | 'surat'
  | 'survey'
  | 'proyek'
  | 'package'
  | 'approval'
  | 'audit-log'
  | 'dashboard'
  | 'peil'
  | 'administrasi'
  | 'dokumen'
  | 'unknown'

export type SourceOriginStatus =
  | 'formal'
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'archived'
  | 'rejected'
  | 'unknown'

export type SourceOriginMetadata = {
  id?: string
  module?: SourceOriginModule | string
  originModule?: SourceOriginModule | string
  sourceModule?: SourceOriginModule | string
  entityId?: string
  originId?: string
  sourceId?: string
  entityCode?: string
  originCode?: string
  entityName?: string
  originName?: string
  title?: string
  label?: string
  status?: SourceOriginStatus | string
  statusLabel?: string
  route?: string
  href?: string
  sourceLabel?: string
  createdAt?: string
  createdBy?: string
  note?: string
  isFormal?: boolean
  formal?: boolean
  isConcept?: boolean
  isDemo?: boolean
}

export type SourceOriginViewModel = {
  id: string
  module: SourceOriginModule
  moduleLabel: string
  title: string
  subtitle?: string
  status: SourceOriginStatus
  statusLabel: string
  href: WorkflowRoute
  sourceLabel: 'Database' | 'Resmi'
  note?: string
  createdAt?: string
  createdBy?: string
}

export type PackageOriginViewModel = {
  hasFormalOrigins: boolean
  emptyState: typeof PACKAGE_SOURCE_EMPTY_STATE
  origins: SourceOriginViewModel[]
  conceptOptions: typeof PACKAGE_SOURCE_ORIGIN_OPTIONS
}

type PackageLikeWithOrigins = Record<string, unknown>

const MODULE_LABELS: Record<SourceOriginModule, string> = {
  surat: 'Surat Masuk & Keluar',
  survey: 'Survey Investigasi',
  proyek: 'Paket Pekerjaan',
  package: 'Paket Pekerjaan',
  approval: 'Approval Center',
  'audit-log': 'Audit Log',
  dashboard: 'Dashboard',
  peil: 'Peil Banjir',
  administrasi: 'Administrasi',
  dokumen: 'Dokumen',
  unknown: 'Sumber tidak dikenal',
}

const MODULE_ROUTES: Record<Exclude<SourceOriginModule, 'unknown'>, WorkflowRoute> = {
  surat: '/surat',
  survey: '/survey',
  proyek: '/proyek',
  package: '/proyek',
  approval: '/approval',
  'audit-log': '/audit-log',
  dashboard: '/dashboard',
  peil: '/peil',
  administrasi: '/administrasi',
  dokumen: '/dokumen',
}

const STATUS_LABELS: Record<SourceOriginStatus, string> = {
  formal: 'Resmi',
  pending: 'Menunggu',
  in_progress: 'Ditindaklanjuti',
  completed: 'Selesai',
  archived: 'Arsip',
  rejected: 'Ditolak',
  unknown: 'Status belum dipetakan',
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
}

function asString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function asBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : false
}

function normalizeModule(value: unknown): SourceOriginModule {
  const raw = asString(value)?.toLowerCase().replace(/_/g, '-')
  if (!raw) return 'unknown'
  if (raw === 'letter' || raw === 'surat-masuk' || raw === 'surat-keluar') return 'surat'
  if (raw === 'survey-investigasi') return 'survey'
  if (raw === 'paket' || raw === 'project' || raw === 'project-origin') return 'proyek'
  if (raw === 'package') return 'package'
  if (raw === 'approval-center') return 'approval'
  if (raw === 'audit' || raw === 'auditlog') return 'audit-log'
  if (raw === 'peil-banjir') return 'peil'
  if (raw in MODULE_LABELS) return raw as SourceOriginModule
  return 'unknown'
}

function normalizeStatus(value: unknown): SourceOriginStatus {
  const raw = asString(value)?.toLowerCase().replace(/-/g, '_')
  if (!raw) return 'unknown'
  if (raw === 'resmi' || raw === 'database' || raw === 'formal') return 'formal'
  if (raw === 'ditindaklanjuti' || raw === 'progress') return 'in_progress'
  if (raw in STATUS_LABELS) return raw as SourceOriginStatus
  return 'unknown'
}

function isFormalSource(input: SourceOriginMetadata) {
  const sourceLabel = input.sourceLabel?.toLowerCase()
  if (input.isConcept || input.isDemo) return false
  if (sourceLabel?.includes('demo') || sourceLabel?.includes('simulasi') || sourceLabel?.includes('konsep')) return false
  return Boolean(input.isFormal || input.formal || sourceLabel === 'database' || sourceLabel === 'resmi' || sourceLabel === 'formal')
}

function readOriginCandidate(value: unknown): SourceOriginMetadata | null {
  const record = asRecord(value)
  if (!record) return null

  return {
    id: asString(record.id),
    module: asString(record.module) || asString(record.originModule) || asString(record.sourceModule),
    originModule: asString(record.originModule),
    sourceModule: asString(record.sourceModule),
    entityId: asString(record.entityId),
    originId: asString(record.originId),
    sourceId: asString(record.sourceId),
    entityCode: asString(record.entityCode),
    originCode: asString(record.originCode),
    entityName: asString(record.entityName),
    originName: asString(record.originName),
    title: asString(record.title),
    label: asString(record.label),
    status: asString(record.status),
    statusLabel: asString(record.statusLabel),
    route: asString(record.route),
    href: asString(record.href),
    sourceLabel: asString(record.sourceLabel),
    createdAt: asString(record.createdAt),
    createdBy: asString(record.createdBy),
    note: asString(record.note),
    isFormal: asBoolean(record.isFormal),
    formal: asBoolean(record.formal),
    isConcept: asBoolean(record.isConcept),
    isDemo: asBoolean(record.isDemo),
  }
}

function readOriginCollections(packageLike: PackageLikeWithOrigins) {
  const keys = ['origins', 'sourceOrigins', 'packageOrigins', 'projectOrigins', 'sourceOrigin', 'origin'] as const
  return keys.flatMap((key) => {
    const value = packageLike[key]
    if (Array.isArray(value)) return value
    return value ? [value] : []
  })
}

export function getPackageOriginRoute(origin: Pick<SourceOriginMetadata, 'module' | 'originModule' | 'sourceModule' | 'route' | 'href'>): WorkflowRoute {
  const explicitRoute = origin.route || origin.href
  if (isWorkflowRoute(explicitRoute)) return explicitRoute

  const module = normalizeModule(origin.module || origin.originModule || origin.sourceModule)
  if (module !== 'unknown') return MODULE_ROUTES[module as Exclude<SourceOriginModule, 'unknown'>]
  return '/proyek'
}

export function normalizePackageOrigins(input: unknown): SourceOriginViewModel[] {
  const packageLike = asRecord(input)
  if (!packageLike) return []

  return readOriginCollections(packageLike)
    .map(readOriginCandidate)
    .filter((origin): origin is SourceOriginMetadata => Boolean(origin && isFormalSource(origin)))
    .map((origin, index) => {
      const module = normalizeModule(origin.module || origin.originModule || origin.sourceModule)
      const id = origin.entityId || origin.originId || origin.sourceId || origin.id || `${module}-${index}`
      const title = origin.title || origin.label || origin.entityName || origin.originName || MODULE_LABELS[module]
      const subtitle = origin.entityCode || origin.originCode
      const status = normalizeStatus(origin.status)

      return {
        id,
        module,
        moduleLabel: MODULE_LABELS[module],
        title,
        subtitle,
        status,
        statusLabel: origin.statusLabel || STATUS_LABELS[status],
        href: getPackageOriginRoute(origin),
        sourceLabel: origin.sourceLabel?.toLowerCase() === 'database' ? 'Database' : 'Resmi',
        note: origin.note,
        createdAt: origin.createdAt,
        createdBy: origin.createdBy,
      }
    })
}

export function hasFormalPackageOrigin(packageLike: unknown) {
  return normalizePackageOrigins(packageLike).length > 0
}

export function getPackageOriginEmptyState() {
  return PACKAGE_SOURCE_EMPTY_STATE
}

export function getPackageOriginViewModel(packageLike: unknown): PackageOriginViewModel {
  const origins = normalizePackageOrigins(packageLike)

  return {
    hasFormalOrigins: origins.length > 0,
    emptyState: getPackageOriginEmptyState(),
    origins,
    conceptOptions: PACKAGE_SOURCE_ORIGIN_OPTIONS,
  }
}

function isWorkflowRoute(value: unknown): value is WorkflowRoute {
  return typeof value === 'string' && [
    '/surat',
    '/survey',
    '/proyek',
    '/peil',
    '/approval',
    '/dashboard',
    '/audit-log',
    '/administrasi',
    '/dokumen',
  ].includes(value)
}
