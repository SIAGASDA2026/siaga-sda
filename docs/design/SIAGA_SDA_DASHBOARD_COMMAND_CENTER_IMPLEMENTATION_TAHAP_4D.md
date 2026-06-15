# SIAGA-SDA Dashboard Command Center - Implementasi Tahap 4D

## 1. Ringkasan Tujuan

- Tanggal implementasi: 15 Juni 2026
- Dashboard aktif: `/dashboard`
- Fokus: implementasi visual awal Command Center pada tab `Ringkasan`
- Pendekatan: bertahap, mempertahankan tab dan rekap lama

Tahap 4D mengubah landing tab Ringkasan menjadi command center keputusan cepat. Informasi prioritas ditempatkan pada area compact, sedangkan rekap lama tetap tersedia melalui tombol `Buka Rekap Tambahan`.

## 2. File yang Dibaca

- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/components/layout/Topbar.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/approval/ApprovalSummaryProvider.tsx`
- `src/components/dashboard/DashboardRoleHeader.tsx`
- `src/lib/dashboard-scope.ts`
- `src/lib/navigation.ts`
- `src/store/useAppStore.ts`
- dokumen audit dan desain Tahap 4A sampai 4C.3

## 3. File yang Diubah dan Dibuat

Diubah:

- `src/app/(dashboard)/dashboard/page.tsx`

Dibuat:

- `src/components/dashboard/CommandCenterOverview.tsx`
- `docs/design/SIAGA_SDA_DASHBOARD_COMMAND_CENTER_IMPLEMENTATION_TAHAP_4D.md`

## 4. Backup

Backup dibuat sebelum perubahan di:

`backup/backup-dashboard-command-center-4d-before-change`

File yang dibackup:

- `src/app/(dashboard)/dashboard/page.tsx`

Komponen Command Center dan dokumen ini merupakan file baru sehingga tidak memerlukan backup awal.

## 5. Struktur Desktop

Struktur tab Ringkasan:

1. Header compact berisi role aktif, scope, tahun, sumber data, dan pembaruan terakhir.
2. KPI role-aware maksimal enam card.
3. Panel Command Brief, Progress, dan Risk & Approval.
4. Panel Quick Action, Aktivitas Terbaru, dan shortcut Peta Monitoring.
5. Tombol untuk membuka rekap lama bila detail tambahan diperlukan.

Dashboard tidak memuat peta interaktif besar. Shortcut Peta hanya menampilkan jumlah lokasi dan paket yang perlu perhatian.

## 6. Struktur Mobile

- KPI menggunakan grid dua kolom.
- Panel keputusan berubah menjadi satu kolom pada layar kecil.
- Quick Action tetap maksimal empat aksi.
- Tidak ada tabel lebar pada landing Command Center.
- Rekap lama tidak langsung dirender dan hanya dibuka atas tindakan user.
- Mobile tetap dapat scroll vertikal dan tidak dipaksa menjadi satu viewport.

## 7. KPI dan Source Data

| KPI | Source data | Navigasi |
|---|---|---|
| Total Paket Aktif | `stats.total` dari project scoped dan filter aktif | `/proyek?tahun=...&status=aktif&source_module=dashboard` |
| Progres Fisik | `stats.avgFisik` dari project scoped | `/proyek?tahun=...&source_module=dashboard` |
| Progres Keuangan | `stats.avgKeuangan` dari project scoped | `/serapan-anggaran?tahun=...&source_module=dashboard` |
| Deviasi / Risiko | `stats.kritis + stats.warning` | `/proyek?tahun=...&health=kritis&source_module=dashboard` |
| Approval Pending | `approvalSummary.pending` dari source-of-truth formal Tahap 4C.3 | `/approval?approval_status=pending&source_module=dashboard` |
| Survey Belum Ditindaklanjuti | `stats.surveyMenunggu` | `/survey?status=belum-ditindaklanjuti&source_module=dashboard` |

KPI difilter dengan `canAccessPage()` sebelum ditampilkan.

## 8. Role-Aware Behavior

- KPI dan Quick Action hanya tampil jika route terkait dapat diakses role.
- Approval formal tidak tampil untuk role tanpa akses `/approval`.
- Panel Risk & Approval menyembunyikan item approval untuk role tanpa akses dan mengarahkan CTA ke paket berisiko.
- Aktivitas menggunakan daftar aktivitas scoped yang sudah tersedia pada dashboard.
- Tombol `Lihat Semua` Audit Log hanya tampil untuk role yang dapat mengakses `/audit-log`.
- Pimpinan, Auditor, dan role read-only tetap mengikuti Quick Action existing yang sudah difilter permission.

Tidak ada permission atau role baru yang ditambahkan.

## 9. Clickable Navigation

Navigasi yang dipertahankan:

- Approval Pending ke `/approval` dengan filter pending.
- Survey pending ke `/survey` dengan filter belum ditindaklanjuti.
- Paket kritis ke `/proyek` dengan filter health kritis.
- Progress dan jenis paket ke `/proyek`.
- Peta Monitoring ke `/peta`.
- Masalah open ke `/masalah`.

Semua link menggunakan route existing dan tetap mengikuti guard akses existing.

## 10. Data Source Badge

Header compact menampilkan:

- `Data Database` ketika data resmi berhasil dimuat.
- `Data Demo/Fallback` ketika fallback aktif.

Saat fallback aktif, warning eksplisit menjelaskan bahwa angka ringkasan bukan data resmi. Tahap ini tidak mengubah bootstrap, endpoint, atau data dummy.

## 11. Perubahan terhadap Ringkasan Lama

- Tab lama dan seluruh source rekap lama tidak dihapus.
- Rekap detail lama dipertahankan di bawah tombol `Buka Rekap Tambahan`.
- Area lama yang redundan disembunyikan hanya ketika tab Ringkasan aktif.
- Tab dashboard lain tetap menggunakan struktur existing.

## 12. Hal yang Tidak Disentuh

- Halaman dan asset login
- Auth, NextAuth, middleware, RBAC, role, dan permission
- Prisma, database, migration, schema, dan data production
- Endpoint Approval dan Bootstrap
- Approval Summary source-of-truth
- Sidebar, MobileNav, Topbar, dan menu utama
- Route root, `/login`, dan `/dashboard`
- Package dan dependency
- Data dummy/demo

## 13. Risiko Tersisa

- Target satu viewport desktop bersifat best-effort karena tinggi Topbar, navigasi tab, jumlah KPI yang diizinkan role, dan ukuran viewport dapat berbeda.
- Rekap tambahan tetap panjang ketika dibuka, sesuai keputusan untuk tidak menghapus data/tab lama.
- Panel aktivitas mengikuti scope existing; audit lintas entitas non-paket tetap perlu validasi terpisah.
- Panel lama yang memuat data simulasi tetap tersedia di Rekap Tambahan dan harus mempertahankan label simulasi existing.
- Verifikasi visual browser lintas viewport diperlukan pada environment yang mendukung browser automation.

## 14. Validasi

- `npx tsc --noEmit`: lulus.
- `git diff --check`: lulus; terdapat warning normalisasi LF ke CRLF pada working copy dashboard.
- `npm run lint`: script lint tidak tersedia pada `package.json`.
- `npm run build`: tidak dijalankan karena tidak wajib pada tahap ini dan dapat memicu proses Prisma/build yang berat.
- Uji visual browser/HTTP lokal: tidak selesai karena proses lokal tidak merespons dalam batas waktu; perlu pemeriksaan manual desktop/mobile.

## 15. Rekomendasi Tahap Berikutnya

1. Uji visual dan interaksi role PPK, Tim Perencana, Pimpinan, dan Auditor pada desktop/mobile.
2. Evaluasi apakah tinggi landing desktop perlu tuning setelah data production nyata digunakan.
3. Lanjutkan perapian tab detail secara bertahap tanpa menghapus tab lama.
4. Pertahankan Approval Summary formal dan assignment scope sebagai sumber data utama.
