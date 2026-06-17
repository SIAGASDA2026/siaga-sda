# SIAGA-SDA Tahap 5C - UI Detail Workflow Surat Tanpa Database

Tanggal: 18 Juni 2026  
Commit acuan: `02012ea feat: mapping workflow inti siaga sda tahap 5b`  
Branch: `master`  
Route modul: `/surat`

## 1. Ringkasan Tujuan

Tahap 5C membuat UI detail workflow Surat Masuk & Keluar yang lebih jelas, traceable, dan siap menjadi fondasi implementasi database resmi nanti, tanpa mengubah schema, database, API resmi Surat, atau permission besar.

Fokus implementasi:

- panel workflow Surat;
- timeline/alur visual;
- card status Surat;
- card kategori Surat;
- card tindak lanjut Surat;
- tombol route resmi;
- contoh alur konseptual dengan suffix `-demo`;
- empty state yang jujur.

## 2. Status Acuan

- Commit acuan: `02012ea`.
- Tahap 5A sudah selesai: audit workflow inti dan perbaikan ringan Surat/Audit Log.
- Tahap 5B sudah selesai: mapping workflow inti dan helper `src/lib/workflow-mapping.ts`.
- Login final/locked dan tidak disentuh.
- Modal Dashboard 4D.2 final dan tidak disentuh.
- Prisma schema, migration, database, Auth, RBAC besar, dan endpoint Approval tidak disentuh.

## 3. File yang Dibaca

- `AGENTS.md`
- `docs/audit/SIAGA_SDA_TAHAP_5A_AUDIT_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5B_MAPPING_WORKFLOW_INTI.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `src/lib/workflow-mapping.ts`
- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/proyek/page.tsx`
- `src/app/(dashboard)/approval/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`
- `src/lib/navigation.ts`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`

## 4. Backup yang Dibuat

Backup dibuat di:

`backup/backup-surat-workflow-ui-5c-before-change/`

File backup:

- `src/app/(dashboard)/surat/page.tsx`
- `src/lib/workflow-mapping.ts`

Dokumen 5C belum ada sebelum tahap ini, sehingga tidak ada backup dokumen lama.

## 5. File yang Diubah

- `src/lib/workflow-mapping.ts`
- `src/app/(dashboard)/surat/page.tsx`
- `docs/audit/SIAGA_SDA_TAHAP_5C_UI_DETAIL_WORKFLOW_SURAT.md`

## 6. Desain UI Workflow Surat yang Diterapkan

Halaman `/surat` sekarang memiliki:

1. Panel utama `Workflow Surat Masuk & Keluar`.
2. Badge jujur `Tahap Persiapan`.
3. Timeline alur visual:
   - Surat Masuk;
   - Dibaca;
   - Disposisi Kabid;
   - Tindak Lanjut;
   - Survey / Paket / Peil / Approval / Arsip;
   - Dashboard / Audit Log.
4. Card status tampilan Surat.
5. Card kategori Surat.
6. Card tindak lanjut Surat.
7. Tombol route resmi.
8. Contoh alur konseptual dengan suffix `-demo`.
9. Catatan bahwa tidak ada form input Surat resmi dan tidak ada data resmi palsu.

## 7. Status Surat yang Ditampilkan

Status tampilan diambil dari `SURAT_STATUS_FLOW`:

- Draft
- Surat Masuk
- Dibaca
- Disposisi Kabid
- Perlu Survey
- Perlu Paket
- Perlu Approval
- Diteruskan ke Peil Banjir
- Ditindaklanjuti
- Selesai
- Arsip
- Ditolak

Status ini hanya label UI/mapping. Belum ada penulisan status ke database Surat.

## 8. Alur Tindak Lanjut Surat

Alur tindak lanjut diambil dari `SURAT_FOLLOW_UP_ACTIONS`:

| Aksi | Route | Status Konsep |
|---|---|---|
| Lanjut ke Survey Investigasi | `/survey` | Perlu Survey |
| Lanjut ke Paket Pekerjaan | `/proyek` | Perlu Paket |
| Lanjut ke Peil Banjir | `/peil` | Diteruskan ke Peil Banjir |
| Lanjut ke Approval Center | `/approval` | Perlu Approval |
| Arsipkan | `/surat` | Arsip |
| Masuk Rekap Dashboard | `/dashboard` | Ditindaklanjuti |
| Tercatat di Audit Log | `/audit-log` | Jejak Audit |

Semua route bersifat navigasi UI. Tidak ada mutasi database.

## 9. Route Tujuan yang Digunakan

Tombol route resmi di `/surat`:

- Kembali ke Dashboard -> `/dashboard`
- Lihat Survey -> `/survey`
- Lihat Paket Pekerjaan -> `/proyek`
- Lihat Approval Center -> `/approval`
- Lihat Peil Banjir -> `/peil`
- Lihat Audit Log -> `/audit-log`

Route `/pengumuman` tidak digunakan sebagai pengganti Surat Masuk & Keluar.

## 10. Hal yang Masih Konseptual/Simulasi

- Contoh alur konseptual masih hardcoded sebagai UI helper.
- Semua contoh diberi suffix `-demo`.
- Belum ada tabel data Surat resmi.
- Belum ada API Surat resmi.
- Belum ada relasi Surat -> Survey/Paket/Peil/Approval di database.
- Belum ada backend audit action Surat.
- Role `admin_surat` belum diaktifkan.

## 11. Hal yang Tidak Disentuh

- Halaman login.
- Komponen login.
- Modal Dashboard 4D.2.
- Dashboard visual 4D.2.
- Auth / NextAuth.
- Middleware.
- RBAC besar.
- Role besar.
- Prisma schema.
- Migration.
- Database.
- Endpoint Approval GET/read-only.
- `package.json`.
- Dependency.

## 12. Validasi

- `git diff --check`: lulus.
- `npx tsc --noEmit`: lulus.
- `npm run build`: gagal sebelum `next build` karena `prisma generate` terkena `EPERM` saat rename `query_engine-windows.dll.node`; indikasi Prisma engine terkunci oleh proses/environment lokal.
- `npm run lint`: gagal karena script `lint` tidak tersedia di `package.json`.

## 13. Masalah Ditunda ke 5D/5E

1. Proposal data model Surat resmi sebelum Prisma migration.
2. API Surat resmi dan validasi form.
3. Permission khusus Surat setelah role extension disetujui.
4. Backend audit action Surat.
5. Relasi formal Surat dengan Survey, Paket, Peil, Approval, Dashboard, dan Audit Log.
6. Detail paket/source-origin Surat atau Survey tanpa membuat relasi palsu.

## 14. Saran Commit Message

`feat: tambah ui workflow surat tahap 5c`
