# Mapping Role, Permission, dan Menu SIAGA-SDA - Tahap 3B

Tanggal pengerjaan: 14 Juni 2026

## 1. Tujuan Tahap

Tahap 3B menyelaraskan role final SIAGA-SDA dengan role frontend dan database yang sudah tersedia, merapikan permission modul secara konservatif, serta menyamakan menu utama Sidebar dan MobileNav sebelum redesign visual dashboard.

Tahap ini tidak menambah enum role, tidak mengubah Prisma/database, tidak menghapus route sub-fitur, dan tidak menyentuh login final.

## 2. File yang Dibaca

```text
AGENTS.md
docs/core/*
docs/design/*
docs/audit/SIAGA_SDA_DASHBOARD_AUDIT_TAHAP_1.md
docs/audit/SIAGA_SDA_DASHBOARD_FOUNDATION_TAHAP_2.md
docs/audit/SIAGA_SDA_ROUTE_ROOT_CLEANUP_TAHAP_3A.md
docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md
src/types/index.ts
src/lib/roles.ts
src/lib/rbac.ts
src/lib/db-mappers.ts
src/lib/project-db.ts
prisma/schema.prisma
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/app/(dashboard)/dashboard/page.tsx
src/components/dashboard/DashboardRoleHeader.tsx
```

## 3. Backup

Backup dibuat sebelum perubahan source:

```text
backup/backup-role-permission-menu-tahap-3b-before-change
```

File yang dibackup:

```text
src/lib/roles.ts
src/lib/rbac.ts
src/types/index.ts
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/app/(dashboard)/dashboard/page.tsx
src/components/dashboard/DashboardRoleHeader.tsx
src/lib/db-mappers.ts
src/lib/project-db.ts
prisma/schema.prisma
```

## 4. File yang Diubah

```text
src/lib/roles.ts
src/lib/rbac.ts
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/app/(dashboard)/dashboard/page.tsx
docs/audit/SIAGA_SDA_ROLE_PERMISSION_MENU_TAHAP_3B.md
```

## 5. Role Frontend Existing

Union `Role` frontend tetap berisi 17 role:

```text
super_admin
admin
pejabat_pengadaan
pphp
admin_sub_kegiatan
pptk
ppk
kabid
direksi_teknis
pimpinan
tim_perencanaan
tim_survey
tim_pengawasan
konsultan_perencana
konsultan_pengawasan
kontraktor
auditor
```

Union role tidak diperluas pada tahap ini karena role baru harus selaras dengan session, Auth, mapper, Prisma, data user, dan assignment.

## 6. Role Database/Prisma Relevan

Enum Prisma yang ditemukan:

```text
SUPER_ADMIN
ADMIN
PEJABAT_PENGADAAN
PPHP
ADMINISTRASI_KONTRAK
KEPALA_DINAS
PIMPINAN
PPK
PPTK
KABID
DIREKSI_TEKNIS
KONSULTAN_PERENCANA
KONSULTAN_PENGAWAS
TIM_PERENCANA
TIM_SURVEYOR
TIM_PENGAWAS
KONTRAKTOR
AUDITOR
```

Compatibility mapper existing tetap dipertahankan:

```text
ADMINISTRASI_KONTRAK -> admin_sub_kegiatan
KEPALA_DINAS / PIMPINAN -> pimpinan
KABID -> kabid
TIM_PERENCANA -> tim_perencanaan
TIM_SURVEYOR -> tim_survey
TIM_PENGAWAS -> tim_pengawasan
KONSULTAN_PENGAWAS -> konsultan_pengawasan
```

## 7. Alias Role Final ke Frontend

`src/lib/roles.ts` sekarang memiliki `FINAL_ROLE_FRONTEND_ALIASES`.

Nilai `null` berarti tidak ada padanan frontend yang aman dan role tersebut belum boleh dianggap aktif.

| Role final/target | Frontend existing | Database/Prisma | Status | Risiko/catatan |
|---|---|---|---|---|
| `super_admin` | `super_admin` | `SUPER_ADMIN` | Siap | Akses penuh existing |
| `admin_sistem` | `admin` | `ADMIN` | Alias sementara | `admin` masih menggabungkan fungsi sistem/bidang |
| `admin_bidang` / `admin_sda` | `admin` | `ADMIN` | Alias sementara | Belum ada pemisahan scope admin bidang |
| `admin_sub_kegiatan` | `admin_sub_kegiatan` | `ADMINISTRASI_KONTRAK` | Alias aktif | Compatibility database wajib dipertahankan |
| `kepala_bidang` | `kabid` | `KABID` | Alias aktif | Label frontend sudah Kepala Bidang |
| `kepala_dinas` / `pimpinan` | `pimpinan` | `KEPALA_DINAS` / `PIMPINAN` | Alias aktif | Dua enum database masih dipertahankan |
| `ppk` | `ppk` | `PPK` | Siap | Existing |
| `pptk` | `pptk` | `PPTK` | Siap | Existing |
| `direksi_teknis` | `direksi_teknis` | `DIREKSI_TEKNIS` | Siap | Existing |
| `pejabat_pengadaan` | `pejabat_pengadaan` | `PEJABAT_PENGADAAN` | Siap | Existing |
| `pphp` | `pphp` | `PPHP` | Siap | Existing |
| `admin_surat` | Belum ada | Belum ada | Belum tersedia | Perlu extension role dan permission Surat |
| `admin_peil` / `admin_peil_banjir` | Belum ada | Belum ada | Belum tersedia | Perlu extension setelah workflow Peil final |
| `admin_asset` | Belum ada | Belum ada | Belum tersedia | Perlu extension setelah model Asset final |
| `tim_perencana_rutin` | `tim_perencanaan` | `TIM_PERENCANA` | Alias aktif | Belum memiliki suffix rutin di frontend/database |
| `tim_pengawas_rutin` | `tim_pengawasan` | `TIM_PENGAWAS` | Alias aktif | Belum memiliki suffix rutin di frontend/database |
| `tim_survey` | `tim_survey` | `TIM_SURVEYOR` | Alias aktif | Nama database berbeda |
| `konsultan_perencana` | `konsultan_perencana` | `KONSULTAN_PERENCANA` | Siap | Existing |
| `konsultan_pengawas` / `konsultan_pengawasan` | `konsultan_pengawasan` | `KONSULTAN_PENGAWAS` | Alias aktif | Suffix frontend berbeda |
| `kontraktor` | `kontraktor` | `KONTRAKTOR` | Siap | Existing |
| `mandor_operasional_sda` | Belum ada | Belum ada | Belum tersedia | Perlu model operasional dan assignment |
| `mandor_pintu_air` | Belum ada | Belum ada | Belum tersedia | Perlu model asset/operasional |
| `petugas_pintu_air` | Belum ada | Belum ada | Belum tersedia | Kebijakan project menyatakan petugas biasa tidak wajib login |
| `mandor_rehab_drainase` / `mandor_rehabilitasi_drainase` | Belum ada | Belum ada | Belum tersedia | Perlu workflow rehab dan assignment |
| `auditor` | `auditor` | `AUDITOR` | Siap | Harus tetap read-only |

Cabang dashboard yang sebelumnya menyebut role belum tersedia telah dihapus dari behavior aktif. Role tersebut tetap terdokumentasi pada alias mapping dengan nilai `null`.

## 8. Permission Modul Utama

| Modul utama | Route | Permission existing | Role existing yang dapat akses | Sidebar | MobileNav | Tab dashboard | Catatan |
|---|---|---|---|---|---|---|---|
| Dashboard | `/dashboard` | `view_dashboard` | Semua role frontend | Ada | Ada | Ringkasan | Assignment scope diterapkan di dashboard |
| Peta Monitoring | `/peta` | `view_map` | Semua role frontend | Ada | Ada | Monitoring/Pasang Surut | Permission masih luas |
| Survey Investigasi | `/survey` | `view_survey` | Core read, planning, PPTK, Admin Sub Kegiatan | Ada jika berhak | Ada jika berhak | Survey | Existing |
| Paket Pekerjaan | `/proyek` | `view_projects` | Semua role frontend | Ada | Ada | Paket | Data tetap assignment-scoped |
| Approval Center | `/approval` | `view_approval` | Role approval existing | Ada jika berhak | Ada jika berhak | Approval & Risiko | Existing |
| Surat Masuk & Keluar | `/surat` | `view_announcements` | Semua role frontend | Ada | Ada | Surat | Permission khusus Surat belum tersedia |
| Administrasi | `/administrasi` | `view_contracts` | Core read, Pejabat Pengadaan, Admin Sub Kegiatan, PPHP | Ditambahkan | Ditambahkan | Belum ada tab khusus | Diubah dari `view_settings` agar tidak terbuka untuk semua role |
| Peil Banjir | `/peil` | `view_map` | Semua role frontend | Ada | Ada | Peil Banjir | Permission khusus Peil belum tersedia |
| Asset SDA | `/asset` | `view_map` | Semua role frontend | Ada | Ada | Asset/Operasional | Permission khusus Asset belum tersedia |
| Audit Log | `/audit-log` | `view_audit_log` | Super Admin, Admin, PPK, Pimpinan, Kabid, Auditor | Ada jika berhak | Ada jika berhak | Aktivitas/AI | Existing |
| Pengaturan | `/pengaturan` | `view_settings` | Semua role frontend | Ada | Ada | Tidak ada | User biasa tetap dapat preferensi pribadi |

## 9. Route Sub-Fitur

Route berikut tidak dihapus dan tetap dapat dipakai oleh link internal:

```text
/laporan
/masalah
/rab
/serapan-anggaran
/kontrak
/dokumen
/chat
/pengumuman
/pengguna
```

Route tersebut tidak lagi tampil sebagai menu utama Sidebar/MobileNav. Permission existing tetap berlaku ketika route dibuka melalui modul asal atau link internal.

## 10. Status Sidebar

Sidebar sekarang memuat 11 menu utama final:

```text
Dashboard
Peta Monitoring
Survey Investigasi
Paket Pekerjaan
Approval Center
Surat Masuk & Keluar
Administrasi
Peil Banjir
Asset SDA
Audit Log
Pengaturan
```

Semua item tetap difilter oleh `canAccessPage()`. Badge Approval tetap memakai data assignment-scoped.

## 11. Status MobileNav

Menu expandable mobile sekarang memuat 11 menu utama yang sama dengan Sidebar dan memakai `canAccessPage()` yang sama.

Bottom navigation mobile sementara:

```text
Dashboard
Peta
Paket
Approval
Menu
```

Bottom navigation difilter berdasarkan permission. Item `Menu` selalu tersedia untuk membuka seluruh menu utama yang diizinkan.

## 12. Status Tab Internal Dashboard

Tab dashboard tetap tidak dihapus. Filter role-aware yang dibuat pada Tahap 2 tetap memakai `canAccessPage()`:

```text
Ringkasan: umum
Monitoring: /peta
Survey: /survey
Paket: /proyek
Approval & Risiko: /approval
Surat: /surat
Peil Banjir: /peil
Asset SDA: /asset
Operasional: /asset
Pasang Surut: /peta
Warning Center: /masalah
Waktu & Salat: umum
Aktivitas: /audit-log
AI Analisis: /audit-log
```

Tab internal tidak lebih luas dari permission route yang dipakai Sidebar/MobileNav. Perbedaan yang masih ada adalah beberapa tab memakai route sub-fitur yang tidak lagi tampil sebagai menu utama, tetapi permission route tetap aktif.

## 13. Status Admin Sub Kegiatan

Status aman yang dipertahankan:

1. UI/frontend memakai `admin_sub_kegiatan`.
2. `ROLE_DEFINITIONS` menampilkan label `Admin Sub Kegiatan`.
3. Mapper database mengubah `ADMINISTRASI_KONTRAK` menjadi `admin_sub_kegiatan`.
4. Penulisan ke Prisma masih mengubah `admin_sub_kegiatan` menjadi `ADMINISTRASI_KONTRAK`.
5. Enum Prisma dan migration tidak diubah.
6. Dashboard dan bootstrap memakai assignment scope existing.

Risiko tersisa: assignment saat ini berorientasi paket/user, belum berupa relasi sub-kegiatan khusus yang dapat membuktikan seluruh akses Admin Sub Kegiatan.

## 14. Role yang Belum Tersedia

Role berikut belum tersedia pada union frontend, session, mapper lengkap, dan Prisma:

```text
admin_surat
admin_peil
admin_peil_banjir
admin_asset
mandor_operasional_sda
mandor_pintu_air
petugas_pintu_air
mandor_rehab_drainase
mandor_rehabilitasi_drainase
```

Role tersebut tidak dipaksakan memakai alias role lain karena dapat memberi akses terlalu luas. Tambahkan hanya setelah permission, assignment, workflow, data user, Auth/session, dan migration additive disetujui.

## 15. Hal yang Tidak Disentuh

```text
halaman dan komponen login final
Auth / NextAuth
middleware
src/types/index.ts
src/lib/db-mappers.ts
src/lib/project-db.ts
Prisma schema
Prisma migration
database
package.json
dependency
src/app/globals.css
route lama/sub-fitur
data dummy
compatibility ADMINISTRASI_KONTRAK
desain visual besar dashboard
```

## 16. Risiko Tersisa

1. Permission Surat, Peil, Asset, Operasional, dan Pasang Surut belum memiliki permission domain khusus.
2. `view_map`, `view_projects`, `view_announcements`, dan `view_settings` masih cukup luas.
3. Role final admin khusus dan mandor belum tersedia.
4. Alias `admin` masih mewakili Admin Sistem dan Admin SDA/Admin Bidang.
5. Role `pimpinan`, `kabid`, `ppk`, dan `auditor` termasuk kelompok read-all existing; kebijakan read-only harus tetap diuji di API aksi tulis.
6. Route sub-fitur tidak tampil di menu utama, sehingga modul asal harus menyediakan link yang cukup jelas.
7. Sidebar dan MobileNav masih mendefinisikan array menu masing-masing; permission source sudah sama, tetapi definisi menu belum menjadi satu shared constant.

## 17. Rekomendasi Tahap Berikutnya

Tahap 3C yang aman:

1. audit permission domain Surat, Peil, Asset, Operasional, dan Administrasi;
2. rancang extension role additive untuk admin khusus dan mandor tanpa langsung migration;
3. uji matriks role terhadap Sidebar, MobileNav, dashboard tab, route, dan API;
4. pastikan Pimpinan/Auditor benar-benar read-only;
5. verifikasi semua route sub-fitur memiliki entry point dari modul utama;
6. setelah matriks akses disetujui, baru lanjut redesign visual dashboard.

## 18. Validasi

Hasil validasi:

```text
npx tsc --noEmit: lulus
git diff --check: lulus
```

Script `lint` tidak tersedia pada `package.json`. Build penuh tidak dijalankan karena tidak diperlukan pada tahap mapping/struktur menu ini dan sebelumnya dapat terhambat lock Prisma engine.

## 19. Cara Rollback

Pulihkan file dari:

```text
backup/backup-role-permission-menu-tahap-3b-before-change
```

File utama untuk rollback:

```text
src/lib/roles.ts
src/lib/rbac.ts
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/app/(dashboard)/dashboard/page.tsx
```
