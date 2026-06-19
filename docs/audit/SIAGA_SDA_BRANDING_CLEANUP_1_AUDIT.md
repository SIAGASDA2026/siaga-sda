# SIAGA-SDA Branding Cleanup 1 Audit

Tanggal: 19 Juni 2026
Tahap: BRANDING-CLEANUP.1
Commit acuan: `a05acf4 docs: cleanup blueprint role mapping`

## 1. Ringkasan Tahap

Tahap ini membersihkan sisa nama lama `SIMONPRO`/`simonpro` dari output user-facing yang terkait dokumen cetak, PDF/print, export Excel, judul laporan, nama file export, dan fallback nama program.

Perubahan dibatasi pada file yang masuk scope prompt. Tidak ada perubahan ke login, Auth, middleware, RBAC runtime, Prisma schema, migration, database, package/dependency, dashboard/modal, Halo final, Sidebar/MobileNav, atau route/menu utama.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/audit/SIAGA_SDA_DOCS_CLEANUP_1_BLUEPRINT_ROLE_MAPPING.md`
- `src/lib/print.ts`
- `src/lib/reporting.ts`
- `src/lib/project-db.ts`
- `src/app/(dashboard)/laporan/page.tsx`
- `src/lib/brand.ts`
- `src/components/admin/RoleAccessPanel.tsx`
- `package.json`
- `package-lock.json`
- `prisma/schema.prisma`

## 3. File yang Diubah

- `src/lib/print.ts`
- `src/lib/reporting.ts`
- `src/lib/project-db.ts`
- `src/app/(dashboard)/laporan/page.tsx`

## 4. File yang Dibuat

- `docs/audit/SIAGA_SDA_BRANDING_CLEANUP_1_AUDIT.md`

## 5. Backup

Backup dibuat sebelum perubahan source:

- `backup/backup-branding-cleanup-1-before-change/print.ts`
- `backup/backup-branding-cleanup-1-before-change/reporting.ts`
- `backup/backup-branding-cleanup-1-before-change/project-db.ts`
- `backup/backup-branding-cleanup-1-before-change/laporan-page.tsx`

## 6. Daftar Temuan SIMONPRO/simonpro

### 6.1 User-Facing Output yang Diperbaiki

| File | Temuan | Status |
|---|---|---|
| `src/lib/print.ts` | Watermark cetak `SIMONPRO` | Diganti ke `BRAND.name` |
| `src/lib/print.ts` | Logo teks cetak `SIMONPRO` | Diganti ke `BRAND.name` |
| `src/lib/print.ts` | Footer dokumen `Dokumen ini dicetak dari sistem SIMONPRO` | Diganti ke `BRAND.name` dan instansi resmi |
| `src/lib/print.ts` | Footer survey `Laporan Survey Lapangan - SIMONPRO` | Diganti ke `BRAND.name` dan instansi resmi |
| `src/lib/reporting.ts` | Header print generated report `SIMONPRO - Dinas PU Kota Dumai` | Diganti ke `BRAND.name` dan instansi resmi |
| `src/lib/project-db.ts` | Fallback program `Program Monitoring Proyek SIMONPRO` | Diganti ke `Program Monitoring Proyek SIAGA-SDA` |
| `src/lib/project-db.ts` | Fallback kode program `SIMONPRO` | Diganti ke `SIAGA_SDA` |
| `src/app/(dashboard)/laporan/page.tsx` | Nama file export `laporan-harian-simonpro` | Diganti ke `laporan-harian-siaga-sda` |
| `src/app/(dashboard)/laporan/page.tsx` | Judul Excel `Laporan Harian SIMONPRO` | Diganti ke `Laporan Harian SIAGA-SDA` |
| `src/app/(dashboard)/laporan/page.tsx` | Judul Excel mingguan/bulanan `SIMONPRO` | Diganti ke `SIAGA-SDA` |
| `src/app/(dashboard)/laporan/page.tsx` | Nama file export `laporan-{mode}-simonpro` | Diganti ke `laporan-{mode}-siaga-sda` |

### 6.2 Temuan yang Sengaja Tidak Diperbaiki

| Lokasi | Alasan tidak diubah |
|---|---|
| `package.json` dan `package-lock.json` | Package metadata internal. Prompt melarang perubahan package/dependency pada tahap ini. |
| `prisma/schema.prisma` | Komentar internal schema. Prompt melarang perubahan Prisma/schema. |
| `src/lib/brand.ts` | `oldName: 'SIMONPRO'` adalah metadata compatibility internal, bukan output langsung. Tidak diubah agar audit historis tetap jelas. |
| `src/components/admin/RoleAccessPanel.tsx` | UI runtime di luar daftar file boleh disentuh. Dicatat sebagai sisa user-facing non-export untuk tahap khusus bila user menyetujui. |
| `docs/core/SIAGA_SDA_REBRANDING_RULES.md` | Dokumen historis rebranding. Tidak diubah agar konteks migrasi tetap utuh. |
| `docs/roles/SIAGA_SDA_ADMIN_KEGIATAN_UI.md` | Dokumen historis/acuan lama. Tidak diubah pada tahap output user-facing. |
| `docs/audit/*` lama | Catatan audit historis tentang temuan branding lama. Tidak diubah agar jejak audit tetap utuh. |

## 7. Risiko yang Dikurangi

- Dokumen cetak/PDF tidak lagi membawa nama lama.
- Export Excel tidak lagi menggunakan judul atau nama file lama.
- Fallback program baru tidak lagi menghasilkan nama program lama jika data input kosong.
- Output resmi lebih konsisten dengan identitas SIAGA-SDA.

## 8. Risiko Tersisa

- `src/components/admin/RoleAccessPanel.tsx` masih memuat teks `schema SIMONPRO` yang terlihat di UI admin, tetapi file tersebut berada di luar scope edit tahap ini.
- `src/lib/brand.ts` masih menyimpan `oldName` untuk compatibility.
- `package.json`, `package-lock.json`, dan komentar Prisma masih menyimpan nama lama sebagai metadata/internal reference.
- Dokumen historis tetap menyimpan nama lama untuk jejak audit.

## 9. Validasi yang Dijalankan

- `rg -n "SIMONPRO|simonpro|Simonpro" src docs prisma package.json package-lock.json`
- `rg -n "SIMONPRO|simonpro|Simonpro" src/lib/print.ts src/lib/reporting.ts src/lib/project-db.ts src/app/(dashboard)/laporan/page.tsx`
- `npx tsc --noEmit`
- `git diff --check`

## 10. Rekomendasi Tahap Berikutnya

1. Jika disetujui, buat tahap kecil terpisah untuk mengganti teks user-facing di `src/components/admin/RoleAccessPanel.tsx` tanpa menyentuh RBAC.
2. Jangan ubah `package.json`, `package-lock.json`, atau komentar Prisma sebelum ada tahap cleanup internal yang eksplisit.
3. Pertahankan `oldName` di `src/lib/brand.ts` sampai keputusan compatibility branding dibuat.
