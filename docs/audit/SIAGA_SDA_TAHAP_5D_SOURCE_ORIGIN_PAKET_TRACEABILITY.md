# SIAGA-SDA Tahap 5D - Source-Origin Paket & Traceability View Tanpa Database

Tanggal: 18 Juni 2026  
Commit acuan: `798df2a feat: tambah ui workflow surat tahap 5c`  
Branch: `master`  
Route utama: `/proyek`  
Route detail paket: `/proyek/[id]`

## 1. Ringkasan Tujuan

Tahap 5D menambahkan tampilan source-origin/asal-usul paket dan traceability view di detail Paket Pekerjaan tanpa mengubah database, Prisma schema, API, Auth, RBAC besar, atau dependency.

Tujuan utama:

- menampilkan konsep asal paket secara jujur;
- menyiapkan traceability view dari Paket ke sumber asal;
- menyiapkan mapping tujuan lanjutan Paket;
- menampilkan empty state jika asal paket belum terhubung formal;
- memakai helper mapping frontend yang aman;
- tidak membuat relasi palsu Surat/Survey/Paket.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/audit/SIAGA_SDA_TAHAP_5A_AUDIT_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5B_MAPPING_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5C_UI_DETAIL_WORKFLOW_SURAT.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `src/lib/workflow-mapping.ts`
- `src/app/(dashboard)/proyek/page.tsx`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/approval/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`
- `src/lib/navigation.ts`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/store/useAppStore.ts`

## 3. Backup yang Dibuat

Backup dibuat di:

`backup/backup-package-traceability-5d-before-change/`

File backup:

- `src/app/(dashboard)/proyek/page.tsx`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `src/lib/workflow-mapping.ts`

Dokumen 5D belum ada sebelum tahap ini, sehingga tidak ada backup dokumen lama.

## 4. File yang Diubah

- `src/lib/workflow-mapping.ts`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `docs/audit/SIAGA_SDA_TAHAP_5D_SOURCE_ORIGIN_PAKET_TRACEABILITY.md`

`src/app/(dashboard)/proyek/page.tsx` hanya dibaca dan dibackup, tidak diubah.

## 5. Desain Source-Origin Paket yang Diterapkan

Detail paket sekarang memiliki panel:

`Jejak Asal Paket / Source-Origin`

Isi panel:

- badge `Traceability Paket`;
- empty state jujur: `Sumber asal paket belum terhubung secara formal.`;
- penjelasan bahwa paket nantinya dapat berasal dari Surat Masuk, Survey Investigasi, input langsung Admin/PPK/PPTK, Program Rutin, atau Paket Tahun Berjalan;
- daftar sumber asal konsep;
- catatan bahwa asal paket spesifik tidak boleh ditampilkan sebelum field relasi resmi tersedia.

## 6. Mapping Sumber Asal Paket

Mapping berasal dari `PACKAGE_SOURCE_ORIGIN_OPTIONS`:

| Sumber Asal Konsep | Route | Status |
|---|---|---|
| Surat Masuk | `/surat` | Konseptual, link resmi ke modul Surat |
| Survey Investigasi | `/survey` | Konseptual, link resmi ke Survey |
| Input langsung Admin/PPK/PPTK | `/proyek` | Konseptual |
| Program Rutin | `/proyek` | Konseptual |
| Paket Tahun Berjalan | `/proyek` | Konseptual |

Catatan:

- Tidak ada klaim paket tertentu berasal dari sumber tertentu.
- Tidak ada field data baru.
- Tidak ada relasi palsu.

## 7. Mapping Tujuan Lanjutan Paket

Mapping berasal dari `PACKAGE_TRACEABILITY_TARGETS`:

| Tujuan Lanjutan | Route/Internal | Status UI |
|---|---|---|
| Approval Center | `/approval` | Route resmi |
| Administrasi | belum dibuka dari detail paket | Konsep |
| Dokumen | belum dibuka dari detail paket | Konsep |
| Dokumentasi Foto | tab internal `survey` | Internal |
| Laporan | tab internal `laporan` | Internal |
| Audit Log | `/audit-log` | Route resmi |
| Dashboard | `/dashboard` | Route resmi |

Administrasi dan Dokumen belum dibuat sebagai tombol route dari detail paket agar tidak menciptakan konteks palsu. Dokumentasi Foto dan Laporan memakai navigasi internal yang sudah ada.

## 8. Route/Link yang Digunakan

Route yang dipakai:

- `/surat`
- `/survey`
- `/proyek`
- `/approval`
- `/audit-log`
- `/dashboard`

Navigasi internal detail paket:

- tab `survey` untuk dokumentasi foto terkait paket;
- tab `laporan` untuk laporan paket.

## 9. Hal yang Masih Konseptual/Simulasi

- Source-origin paket belum berasal dari data resmi.
- Panel traceability hanya empty state dan mapping UI.
- Administrasi/Dokumen ditampilkan sebagai konsep karena belum ada konteks internal detail paket yang formal.
- Tidak ada data demo baru.
- Tidak ada field `source_origin`, `origin_module`, atau relasi Surat/Survey/Paket.

## 10. Hal yang Tidak Disentuh

- Halaman login.
- Modal Dashboard 4D.2.
- Dashboard visual 4D.2.
- Halaman `/surat` hasil 5C.
- Prisma schema.
- Migration.
- Database.
- Auth / NextAuth.
- Middleware.
- RBAC besar.
- Role besar.
- Endpoint Approval GET/read-only.
- `package.json`.
- Dependency.

## 11. Validasi

- `git diff --check`: lulus.
- `npx tsc --noEmit`: lulus.
- `npm run build`: gagal sebelum `next build` karena `prisma generate` terkena `EPERM` saat rename `query_engine-windows.dll.node`; indikasi Prisma engine terkunci oleh proses/environment lokal.
- `npm run lint`: gagal karena script `lint` tidak tersedia di `package.json`.

## 12. Masalah Ditunda ke 5E/5F

1. Proposal field/relasi source-origin paket sebelum perubahan Prisma.
2. Adapter frontend untuk membaca metadata source-origin jika kelak tersedia.
3. Relasi formal Surat -> Survey -> Paket.
4. Relasi formal Survey -> Paket/Approval.
5. Integrasi Administrasi/Dokumen ke traceability detail paket.
6. Backend audit untuk `PROJECT_STATUS_UPDATE`, `PROJECT_ADD_DOCUMENT`, dan `PROJECT_ADD_PHOTO` bila belum konsisten.

## 13. Saran Commit Message

`feat: tambah traceability paket tahap 5d`
