# SIAGA-SDA Tahap 5G - Frontend Adapter Source-Origin Tanpa Migration

Tanggal: 18 Juni 2026  
Commit acuan: `cfee27d docs: review schema surat dan risiko tahap 5f`  
Branch: `master`  
Status tahap: adapter frontend, tanpa migration, tanpa schema, tanpa API Surat resmi

## 1. Ringkasan Tujuan

Tahap 5G membuat adapter frontend source-origin untuk detail Paket Pekerjaan. Adapter ini menyiapkan cara baca metadata asal-usul paket jika kelak tersedia dari data resmi, tetapi kondisi saat ini tetap menampilkan empty state jujur karena belum ada field/relasi database formal.

Tahap ini tidak membuat relasi palsu, tidak membuat data demo baru, tidak membaca database, tidak melakukan fetch API, dan tidak menghitung data konseptual sebagai data resmi Dashboard.

## 2. Status Acuan

- Tahap 5A selesai: audit workflow inti.
- Tahap 5B selesai: mapping workflow inti dan helper workflow.
- Tahap 5C selesai: UI workflow Surat tanpa database.
- Tahap 5D selesai: source-origin Paket & traceability view tanpa database.
- Tahap 5E selesai: proposal data model Surat & relasi tanpa migration.
- Tahap 5F selesai: review schema Surat dan risiko.
- Keputusan 5F: `PackageOrigin`/`ProjectOrigin` lebih aman daripada field `source_origin` tunggal.
- Login final/locked dan tidak disentuh.
- Modal Dashboard 4D.2 final dan tidak disentuh.
- Prisma schema belum boleh diubah.

## 3. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/audit/SIAGA_SDA_TAHAP_5A_AUDIT_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5B_MAPPING_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5C_UI_DETAIL_WORKFLOW_SURAT.md`
- `docs/audit/SIAGA_SDA_TAHAP_5D_SOURCE_ORIGIN_PAKET_TRACEABILITY.md`
- `docs/audit/SIAGA_SDA_TAHAP_5E_PROPOSAL_DATA_MODEL_SURAT.md`
- `docs/audit/SIAGA_SDA_TAHAP_5F_REVIEW_SCHEMA_SURAT_DAN_RISIKO.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `src/lib/workflow-mapping.ts`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/store/useAppStore.ts`
- `src/types/index.ts`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/approval/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`

## 4. Backup yang Dibuat

Backup dibuat di:

`backup/backup-frontend-source-origin-adapter-5g-before-change/`

File backup:

- `src/lib/workflow-mapping.ts`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `docs/audit/SIAGA_SDA_TAHAP_5F_REVIEW_SCHEMA_SURAT_DAN_RISIKO.md`

## 5. File yang Dibuat/Diubah

Dibuat:

- `src/lib/source-origin-adapter.ts`
- `docs/audit/SIAGA_SDA_TAHAP_5G_FRONTEND_ADAPTER_SOURCE_ORIGIN.md`

Diubah:

- `src/app/(dashboard)/proyek/[id]/page.tsx`

Tidak diubah:

- `src/lib/workflow-mapping.ts`
- `prisma/schema.prisma`
- source Dashboard 4D.2
- source login

## 6. Desain Adapter Source-Origin

Adapter baru berada di:

`src/lib/source-origin-adapter.ts`

Prinsip desain:

1. Adapter hanya membaca object frontend yang diberikan.
2. Adapter tidak fetch API.
3. Adapter tidak membaca database.
4. Adapter tidak menulis data.
5. Adapter tidak mengubah store.
6. Adapter tidak membuat data demo baru.
7. Adapter hanya menampilkan origin formal jika item origin diberi penanda resmi.
8. Jika tidak ada origin formal, adapter mengembalikan empty state jujur.

## 7. Type dan Helper yang Ditambahkan

Type frontend:

- `SourceOriginModule`
- `SourceOriginStatus`
- `SourceOriginMetadata`
- `SourceOriginViewModel`
- `PackageOriginViewModel`

Helper:

- `normalizePackageOrigins(input)`
- `getPackageOriginViewModel(packageLike)`
- `hasFormalPackageOrigin(packageLike)`
- `getPackageOriginEmptyState()`
- `getPackageOriginRoute(origin)`

Mapping module route:

| Module | Route |
|---|---|
| `surat` | `/surat` |
| `survey` | `/survey` |
| `proyek` / `package` | `/proyek` |
| `approval` | `/approval` |
| `audit-log` | `/audit-log` |
| `dashboard` | `/dashboard` |
| `peil` | `/peil` |
| `administrasi` | `/administrasi` |
| `dokumen` | `/dokumen` |

## 8. Cara Adapter Membaca Data Jika Kelak Tersedia

Adapter mencari metadata origin dari field opsional pada object paket:

- `origins`
- `sourceOrigins`
- `packageOrigins`
- `projectOrigins`
- `sourceOrigin`
- `origin`

Setiap item origin dapat berisi:

- module/originModule/sourceModule
- entityId/originId/sourceId
- entityCode/originCode
- entityName/originName
- title/label
- status/statusLabel
- route/href
- sourceLabel
- createdAt/createdBy
- note
- isFormal/formal

Adapter hanya memunculkan item jika dianggap formal/resmi. Kriteria aman:

- `isFormal === true`; atau
- `formal === true`; atau
- `sourceLabel` bernilai `Database`, `Resmi`, atau `Formal`.

Item dengan `isConcept`, `isDemo`, atau source label demo/simulasi/konsep tidak ditampilkan sebagai origin formal.

## 9. Cara Adapter Fallback ke Empty State

Jika object paket belum punya metadata origin resmi, adapter mengembalikan:

- `hasFormalOrigins: false`
- `origins: []`
- empty state dari `PACKAGE_SOURCE_EMPTY_STATE`
- concept options dari `PACKAGE_SOURCE_ORIGIN_OPTIONS`

Pesan empty state tetap:

`Sumber asal paket belum terhubung secara formal.`

Dengan cara ini, UI detail paket tetap jujur dan tidak menampilkan asal spesifik sebelum data resmi tersedia.

## 10. Integrasi di Detail Paket

File:

`src/app/(dashboard)/proyek/[id]/page.tsx`

Perubahan:

- `PackageTraceabilityPanel` sekarang menerima `proyek`.
- Panel memanggil `getPackageOriginViewModel(proyek)`.
- Jika `hasFormalOrigins` false, panel tetap menampilkan opsi konsep seperti tahap 5D.
- Jika kelak metadata formal tersedia pada object paket, panel siap menampilkan daftar origin resmi.
- Tombol route tetap memakai route resmi dari adapter atau mapping workflow.
- Tidak ada perubahan tab internal besar.
- Tidak ada perubahan Dashboard 4D.2.

## 11. Hal yang Masih Konseptual

- Source-origin paket masih belum berasal dari database resmi.
- Belum ada `PackageOrigin` / `ProjectOrigin` di Prisma schema.
- Belum ada API Surat resmi.
- Belum ada relasi formal Surat -> Survey -> Paket.
- Belum ada role `admin_surat` aktif.
- Panel detail paket tetap menampilkan empty state sampai data formal tersedia.

## 12. Hal yang Tidak Disentuh

- Halaman login.
- Modal Dashboard 4D.2.
- Dashboard visual 4D.2.
- Prisma schema.
- Migration.
- Database.
- Prisma migrate / db push.
- Auth / NextAuth / middleware.
- RBAC besar.
- Role besar.
- Role `admin_surat`.
- Endpoint Approval GET/read-only.
- API Surat resmi.
- Form Surat resmi.
- `package.json`.
- Dependency.
- Compatibility `admin_sub_kegiatan` / `ADMINISTRASI_KONTRAK`.

## 13. Validasi

Validasi yang dijalankan:

- `git diff --check`: lulus. Git memberi peringatan line ending LF/CRLF pada `src/app/(dashboard)/proyek/[id]/page.tsx`, tetapi tidak ada whitespace error.
- `npx.cmd tsc --noEmit`: lulus.
- `npm.cmd run build`: gagal pada tahap `prisma generate` karena `EPERM` saat rename `query_engine-windows.dll.node`; ini kendala environment lokal/Prisma engine terkunci, bukan perubahan source 5G.
- `npm run lint`: tidak tersedia karena `package.json` tidak memiliki script `lint`.

## 14. Masalah yang Ditunda ke 5H/5I

1. Draft Prisma schema untuk `PackageOrigin` / `ProjectOrigin`.
2. Draft Prisma schema untuk `Surat`, `SuratDisposition`, `SuratFollowUp`, `SuratAttachment`, dan `SuratComment`.
3. Desain detail apakah `SurveyRequest` mandiri diperlukan.
4. Desain Approval subject generik jika Surat non-paket perlu approval.
5. Migration hanya setelah persetujuan eksplisit user.
6. API Surat resmi.
7. Dashboard summary Surat scoped dari data resmi.

## 15. Cara Rollback

Rollback dapat dilakukan dengan:

1. Mengembalikan `src/app/(dashboard)/proyek/[id]/page.tsx` dari `backup/backup-frontend-source-origin-adapter-5g-before-change/`.
2. Menghapus `src/lib/source-origin-adapter.ts` jika ingin membatalkan adapter.
3. Menghapus dokumen 5G hanya jika user meminta eksplisit.

Tidak ada migration/database yang perlu di-rollback.

## 16. Saran Commit Message

`feat: tambah adapter source-origin frontend tahap 5g`
