import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Permission } from '@/lib/rbac'
import { requirePaketAccess } from '@/lib/api-authorization'
import { fromApprovalStatus, getMappedPaket, logAudit, toApprovalStatus, toHealthStatus, toPrioritas, toStatusMasalah } from '@/lib/project-db'

function jsonDate(value: unknown) {
  return value ? new Date(String(value)) : new Date()
}

type IncomingFoto = {
  url?: unknown
  keterangan?: string
  koordinat?: unknown
}

function isTemporaryPhotoUrl(url: string) {
  const normalized = url.trim().toLowerCase()
  return normalized.startsWith('blob:') || normalized.startsWith('data:')
}

function isLocalBrowserPhotoUrl(url: string) {
  const normalized = url.trim().toLowerCase()
  if (
    normalized.startsWith('file:') ||
    normalized.startsWith('about:') ||
    normalized.startsWith('javascript:') ||
    normalized.startsWith('chrome:') ||
    normalized.startsWith('edge:') ||
    normalized.startsWith('devtools:')
  ) {
    return true
  }

  try {
    const parsed = new URL(url)
    return ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname)
  } catch {
    return false
  }
}

function isAllowedStoredPhotoUrl(url: string) {
  const normalized = url.trim()
  if (!normalized) return false
  if (isTemporaryPhotoUrl(normalized) || isLocalBrowserPhotoUrl(normalized)) return false

  if (normalized.startsWith('/') && !normalized.startsWith('//')) return true
  if (/^https?:\/\//i.test(normalized)) return true

  return /^[a-zA-Z0-9][a-zA-Z0-9/_\-.:]+$/.test(normalized)
}

function sanitizeFotoPayload(fotos?: IncomingFoto[]) {
  if (!Array.isArray(fotos) || fotos.length === 0) {
    return { validFotos: [] as (IncomingFoto & { url: string })[], ignoredCount: 0 }
  }

  const validFotos: (IncomingFoto & { url: string })[] = []

  for (const foto of fotos) {
    const url = typeof foto?.url === 'string' ? foto.url.trim() : ''
    if (!isAllowedStoredPhotoUrl(url)) continue
    validFotos.push({ ...foto, url })
  }

  return { validFotos, ignoredCount: fotos.length - validFotos.length }
}

async function saveFotos(entityType: string, entityId: string, uploadedBy: string, fotos?: IncomingFoto[], relation?: Record<string, string>) {
  const { validFotos, ignoredCount } = sanitizeFotoPayload(fotos)
  if (ignoredCount > 0) {
    console.warn(`[DATA-SAFETY.2] Ignored ${ignoredCount} temporary or invalid photo URL(s) for ${entityType}:${entityId}`)
  }
  if (!validFotos.length) return { storedCount: 0, ignoredCount }

  await prisma.foto.createMany({
    data: validFotos.map((foto) => ({
      entityType,
      entityId,
      url: foto.url,
      keterangan: foto.keterangan || null,
      koordinat: (foto.koordinat || Prisma.JsonNull) as Prisma.InputJsonValue,
      uploadedBy,
      ...relation,
    })),
  })

  return { storedCount: validFotos.length, ignoredCount }
}

const CREATE_PERMISSION_BY_KIND: Record<string, Permission> = {
  surveys: 'create_survey',
  rabs: 'upload_rab',
  laporan: 'create_laporan',
  catatan: 'create_catatan_pengawasan',
  masalah: 'create_masalah',
  chat: 'send_chat',
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; kind: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id, kind } = await params
  const permission = CREATE_PERMISSION_BY_KIND[kind]
  if (!permission) {
    return NextResponse.json({ message: `Unsupported record type: ${kind}` }, { status: 400 })
  }
  const accessError = await requirePaketAccess(session, id, permission)
  if (accessError) return accessError

  const body = await request.json()
  const paket = await prisma.paket.findUnique({ where: { id } })

  if (!paket) {
    return NextResponse.json({ message: 'Project not found' }, { status: 404 })
  }

  if (kind === 'surveys') {
    const survey = await prisma.surveyBaru.create({
      data: {
        paketId: id,
        userId: session.user.id,
        tanggal: jsonDate(body.tanggal),
        koordinat: body.koordinat || null,
        kondisiEksisting: body.kondisiEksisting || '',
        dimensi: body.dimensi || null,
        material: body.material || null,
        permasalahan: body.permasalahan || null,
        rekomendasi: body.rekomendasi || null,
        status: toApprovalStatus(body.status),
      },
    })
    await saveFotos('survey', survey.id, session.user.name || session.user.id, body.foto, { surveyId: survey.id })
    await logAudit(session.user.id, 'CREATE_SURVEY', 'Input survey lapangan', { paketId: id, entityType: 'survey', entityId: survey.id })
    return NextResponse.json(await getMappedPaket(id), { status: 201 })
  }

  if (kind === 'rabs') {
    const existingCount = await prisma.rab.count({ where: { paketId: id } })
    const versionNumber = body.versionNumber || existingCount + 1
    const rab = await prisma.rab.create({
      data: {
        paketId: id,
        versi: versionNumber,
        totalAnggaran: Number(body.totalAnggaran || 0),
        status: toApprovalStatus(body.status),
        catatan: body.catatan || null,
        items: {
          create: (body.items || []).map((item: any, index: number) => ({
            urutan: Number(item.no || index + 1),
            uraian: item.uraian || '',
            satuan: item.satuan || '',
            volume: Number(item.volume || 0),
            hargaSatuan: Number(item.hargaSatuan || 0),
            total: Number(item.total || 0),
          })),
        },
      },
    })
    await logAudit(session.user.id, 'UPLOAD_RAB', `Upload RAB v${versionNumber}`, { paketId: id, entityType: 'rab', entityId: rab.id })
    return NextResponse.json(await getMappedPaket(id), { status: 201 })
  }

  if (kind === 'laporan') {
    const laporan = await prisma.laporanHarianBaru.create({
      data: {
        paketId: id,
        userId: session.user.id,
        tanggal: jsonDate(body.tanggal),
        cuaca: body.cuaca || '',
        progressFisik: Number(body.progressFisik || 0),
        progressKumulatif: Number(body.progressKumulatif || body.progressFisik || 0),
        uraianPekerjaan: body.uraianPekerjaan || '',
        disetujui: Boolean(body.disetujui),
        disetujuiOleh: body.disetujuiOleh || null,
      },
    })
    const fotoStats = await saveFotos('laporan_harian', laporan.id, session.user.name || session.user.id, body.foto, { laporanHarianId: laporan.id })
    const progressFisik = Number(body.progressFisik || 0)
    const progressKeuangan = Number(paket.progressKeuangan)
    await prisma.paket.update({
      where: { id },
      data: {
        progressFisik,
        deviasi: progressFisik - progressKeuangan,
        health: toHealthStatus(progressFisik, progressKeuangan),
      },
    })
    await logAudit(session.user.id, 'UPLOAD_LAPORAN', `Upload laporan + ${fotoStats.storedCount} foto`, { paketId: id, entityType: 'laporan_harian', entityId: laporan.id })
    return NextResponse.json(await getMappedPaket(id), { status: 201 })
  }

  if (kind === 'catatan') {
    const catatan = await prisma.catatanPengawasan.create({
      data: {
        paketId: id,
        userId: session.user.id,
        tanggal: jsonDate(body.tanggal),
        deskripsi: body.deskripsi || '',
        rekomendasi: body.rekomendasi || null,
        status: body.status || 'sesuai',
      },
    })
    await saveFotos('catatan', catatan.id, session.user.name || session.user.id, body.foto, { catatanId: catatan.id })
    await logAudit(session.user.id, 'CREATE_CATATAN', `Catatan: ${body.status || 'sesuai'}`, { paketId: id, entityType: 'catatan_pengawasan', entityId: catatan.id })
    return NextResponse.json(await getMappedPaket(id), { status: 201 })
  }

  if (kind === 'masalah') {
    const masalah = await prisma.masalahBaru.create({
      data: {
        paketId: id,
        judul: body.judul || '',
        deskripsi: body.deskripsi || '',
        status: toStatusMasalah(body.status),
        prioritas: toPrioritas(body.prioritas),
        dilaporkanOleh: session.user.name || session.user.id,
        solusi: body.solusi || null,
        resolvedAt: body.resolvedAt ? new Date(body.resolvedAt) : null,
      },
    })
    await saveFotos('masalah', masalah.id, session.user.name || session.user.id, body.foto, { masalahBaruId: masalah.id })
    await logAudit(session.user.id, 'CREATE_MASALAH', `Masalah: ${body.judul || ''}`, { paketId: id, entityType: 'masalah', entityId: masalah.id })
    return NextResponse.json(await getMappedPaket(id), { status: 201 })
  }

  if (kind === 'chat') {
    const chat = await prisma.chatBaru.create({
      data: {
        paketId: id,
        userId: session.user.id,
        pesan: body.message || body.pesan || '',
        tipe: body.type || 'text',
      },
    })
    await logAudit(session.user.id, 'SEND_CHAT', 'Kirim pesan', { paketId: id, entityType: 'chat', entityId: chat.id })
    return NextResponse.json(await getMappedPaket(id), { status: 201 })
  }

  return NextResponse.json({ message: `Unsupported record type: ${kind}` }, { status: 400 })
}
