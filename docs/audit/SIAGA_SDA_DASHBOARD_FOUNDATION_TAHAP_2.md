# Perapihan Fondasi Dashboard SIAGA-SDA - Tahap 2

Tanggal pengerjaan: 14 Juni 2026
Tujuan: membersihkan fondasi dashboard aktif sebelum redesign UI besar, tanpa mengubah login, Auth, RBAC, database, Prisma, route utama, dependency, atau visual dashboard secara besar.

## 1. Ringkasan Tindakan

Tahap ini menerapkan empat perbaikan fondasi:

1. Menetapkan `/dashboard` sebagai dashboard aktif final tanpa mengubah route root yang berisiko.
2. Menghentikan penggabungan otomatis `DUMMY_PROJECTS` dengan data database.
3. Menerapkan assignment scope defensif untuk seluruh agregat utama dashboard aktif.
4. Membuat tab internal dashboard mengikuti permission route yang sudah digunakan Sidebar dan MobileNav.

Selain itu, istilah aman `admin_kegiatan` dan `Admin Kegiatan` pada dashboard aktif diperbarui menjadi `admin_sub_kegiatan` dan `Admin Sub Kegiatan`.

## 2. Dokumen dan File yang Dibaca

Dokumen acuan:

```text
AGENTS.md
docs/core/*
docs/design/*
docs/audit/SIAGA_SDA_DASHBOARD_AUDIT_TAHAP_1.md
docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md
```

File source utama yang diaudit:

```text
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/page.tsx
src/app/page.tsx
src/app/(dashboard)/layout.tsx
src/app/api/bootstrap/route.ts
src/store/useAppStore.ts
src/lib/data.ts
src/lib/rbac.ts
src/lib/roles.ts
src/lib/db-mappers.ts
src/lib/project-db.ts
src/types/index.ts
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/components/layout/Topbar.tsx
```

## 3. Backup

Backup dibuat sebelum source code diubah:

```text
backup/backup-dashboard-foundation-tahap-2-before-change
```

Isi backup:

```text
src/app/(dashboard)/dashboard/page.tsx
src/store/useAppStore.ts
```

File route root tidak dibackup karena tidak diubah.

## 4. File yang Diubah

```text
src/app/(dashboard)/dashboard/page.tsx
src/store/useAppStore.ts
docs/audit/SIAGA_SDA_DASHBOARD_FOUNDATION_TAHAP_2.md
```

Tidak ada file source lain yang diubah.

## 5. Dashboard Aktif Final

Dashboard aktif final tetap:

```text
Route: /dashboard
File: src/app/(dashboard)/dashboard/page.tsx
```

Bukti alur aplikasi:

1. Login mengarahkan user ke `/dashboard`.
2. Sidebar dan MobileNav mengarahkan menu Dashboard ke `/dashboard`.
3. Tombol kembali dari beberapa modul mengarah ke `/dashboard`.
4. Permission dashboard terdaftar untuk `/dashboard`.

## 6. Status Route Duplikat

File berikut tetap tidak diubah:

```text
src/app/(dashboard)/page.tsx
src/app/page.tsx
```

Status:

1. Keduanya secara struktur Next.js memetakan route root `/`.
2. `src/app/page.tsx` melakukan redirect ke `/login`.
3. `src/app/(dashboard)/page.tsx` berisi implementasi dashboard lama/duplikat.

Keputusan teknis:

`src/app/(dashboard)/page.tsx` tidak diubah menjadi redirect karena perubahan isi file menjadi redirect tetap tidak menyelesaikan konflik dua file yang memetakan route `/`. Penyelesaian yang benar memerlukan pemindahan atau penghapusan salah satu route, sedangkan file deletion dan perubahan route destruktif tidak diizinkan pada tahap ini.

Rekomendasi: lakukan tahap cleanup route khusus setelah verifikasi build dan persetujuan eksplisit.

## 7. Status DUMMY_PROJECTS dan Data Demo

Sebelum perubahan, `hydrateFromDatabase()` menggunakan `mergeFallbackProjects()` yang selalu:

1. memasukkan seluruh `DUMMY_PROJECTS`;
2. memasukkan data database;
3. menggabungkan keduanya untuk dashboard.

Setelah perubahan:

1. `hydrateFromDatabase()` menggunakan `data.projects` dari bootstrap secara langsung;
2. data dummy tidak lagi digabung otomatis ketika bootstrap database berhasil;
3. `DUMMY_PROJECTS`, `DUMMY_USERS`, dan `DUMMY_AUDIT_LOGS` tetap dipertahankan sebagai fallback awal;
4. store memiliki status eksplisit:

```text
dashboardDataSource: "demo" | "database"
```

5. dashboard menampilkan peringatan:

```text
Data demo/fallback ditampilkan sementara karena data database belum berhasil dimuat.
```

Peringatan hanya tampil saat sumber data masih `demo`. Setelah bootstrap database berhasil, termasuk ketika database mengembalikan daftar kosong, store beralih ke `database` dan tidak memasukkan dummy.

Risiko tersisa:

1. Fallback dummy masih menjadi state awal store agar aplikasi tetap memiliki data saat bootstrap gagal.
2. `DUMMY_USERS`, `DUMMY_AUDIT_LOGS`, dan helper login lama masih tersedia untuk compatibility/testing.
3. Pemisahan source data saat ini berada di level store, belum menjadi metadata per-record.

## 8. Status Assignment Scope Dashboard

### 8.1 Logic yang ditemukan

Endpoint bootstrap sudah membatasi paket untuk role terbatas berdasarkan:

```text
ppkId
pptkId
assignments.userId
```

Role luas mengikuti `canViewAllProjects()` dari RBAC existing.

### 8.2 Defense in depth yang diterapkan

Dashboard aktif sekarang membuat `scopedProjects` sebelum filter UI:

1. Role luas menurut `canViewAllProjects()` tetap melihat seluruh proyek yang diterima dari bootstrap.
2. Role terbatas hanya melihat proyek yang:
   - ID-nya ada pada `currentUser.projectIds`; atau
   - memuat ID user pada `project.assignedUsers`.

Seluruh data berikut sekarang diturunkan dari `scopedProjects` atau `visibleProjects`:

```text
opsi filter tahun/program/sub kegiatan
Total Paket
Progres/On Track
Paket Selesai
Stuck/Kritis
Approval Pending
Survey Belum Ditindaklanjuti
Masalah Open
Titik Kritis
Total Anggaran
progress fisik
progress keuangan
deviasi
chart
tabel paket
ringkasan jenis paket
ringkasan sub kegiatan
perbandingan tahun sebelumnya
badge shortcut dashboard
DashboardRoleHeader
```

Aktivitas/audit untuk role terbatas difilter secara konservatif menjadi:

1. aktivitas milik user tersebut; atau
2. aktivitas dengan `entityId` yang langsung cocok dengan ID proyek dalam scope.

Jumlah notifikasi pada `DashboardRoleHeader` juga memakai jumlah aktivitas yang telah di-scope.

### 8.3 Risiko kebocoran yang ditutup

Dashboard tidak lagi menghitung agregat role terbatas langsung dari seluruh `projects` di store. Ini menutup risiko utama statistik, chart, tabel, alert, dan badge shortcut menampilkan agregat lintas assignment.

### 8.4 Risiko tersisa

1. Audit log untuk entitas turunan seperti laporan/RAB/survey tidak selalu membawa `entityId` proyek induk. Filter dashboard memilih mengecualikan data yang tidak dapat dibuktikan scope-nya.
2. Role luas tetap mengikuti definisi `canViewAllProjects()` existing, termasuk PPK dan Auditor.
3. Assignment untuk modul non-paket seperti Asset, Peil, Surat, dan Operasional belum memiliki model scope lengkap pada dashboard.
4. Perlindungan utama tetap harus berada di API/backend; filter dashboard hanya defense in depth.

## 9. Status Tab Internal Role-Aware

Tab tidak dihapus. Tab internal sekarang difilter dengan `canAccessPage()` dan permission route existing.

Tab yang tetap tampil untuk semua role dengan akses dashboard:

```text
Ringkasan
Waktu & Salat
```

Mapping permission yang diterapkan:

| Tab | Permission mengikuti route |
|---|---|
| Monitoring | `/peta` |
| Survey | `/survey` |
| Paket | `/proyek` |
| Approval & Risiko | `/approval` |
| Surat | `/surat` |
| Peil Banjir | `/peil` |
| Asset SDA | `/asset` |
| Operasional | `/asset` |
| Pasang Surut | `/peta` |
| Warning Center | `/masalah` |
| Aktivitas | `/audit-log` |
| AI Analisis | `/audit-log` |

Jika active tab tidak lagi tersedia setelah role/permission berubah, dashboard kembali aman ke tab `Ringkasan`.

Catatan mapping lanjutan:

1. `Peil`, `Asset`, `Operasional`, dan `Pasang Surut` saat ini mengikuti permission route yang masih luas.
2. `AI Analisis` dibatasi mengikuti akses Audit Log karena insight belum merupakan analisis resmi yang auditable.
3. Mapping khusus role operasional baru tidak dibuat karena role union/RBAC tidak boleh diperluas pada tahap ini.

## 10. Status Istilah Lama

Istilah yang diubah secara aman pada dashboard aktif:

```text
admin_kegiatan -> admin_sub_kegiatan
Admin Kegiatan -> Admin Sub Kegiatan
```

Lokasi:

```text
src/app/(dashboard)/dashboard/page.tsx
```

Istilah yang sengaja tidak diubah:

| Istilah | Lokasi utama | Alasan |
|---|---|---|
| `SIMONPRO` | `src/lib/brand.ts`, `src/lib/reporting.ts`, `src/lib/print.ts`, halaman laporan | Berhubungan dengan compatibility branding dan output laporan/print di luar scope dashboard foundation |
| `administrasi_kontrak` / `ADMINISTRASI_KONTRAK` | Prisma, DB mapper, project DB, API announcement | Compatibility layer database; dilarang dihapus atau diubah tanpa migration |
| `proyek` | route, tipe, API, store, variabel | Istilah teknis lama yang luas; penggantian massal berisiko merusak aplikasi |

## 11. Hal yang Tidak Disentuh

Tidak diubah:

```text
halaman dan komponen login final
Auth / NextAuth
middleware
src/lib/rbac.ts
src/lib/roles.ts
Prisma schema
Prisma migration
database
package.json
dependency
src/app/globals.css
Sidebar
MobileNav
Topbar
route root dan route lama
file .bak
compatibility layer administrasi_kontrak
```

Login, komponen login, dan Auth tetap tidak berubah.

## 12. Risiko Tersisa

1. Konflik konseptual dua file route `/` belum diselesaikan.
2. Fallback demo masih tersedia saat bootstrap database gagal, tetapi sekarang diberi status dan peringatan eksplisit.
3. Audit log entitas turunan belum memiliki relasi proyek induk yang seragam untuk filtering lengkap.
4. Permission Peil, Asset, Operasional, dan Pasang Surut masih mengikuti permission map yang luas.
5. Role frontend, role final SIAGA-SDA, dan role database belum sepenuhnya selaras.
6. Source reporting/print masih memuat nama lama `SIMONPRO`.
7. Dashboard aktif masih berupa client component besar dan belum dipecah menjadi komponen domain.

## 13. Rekomendasi Tahap 3

Urutan aman berikutnya:

1. Audit dan selesaikan konflik route root dalam tahap khusus dengan persetujuan pemindahan/penghapusan file.
2. Tambahkan metadata sumber data per-record atau environment demo yang eksplisit bila mode demo masih diperlukan.
3. Perkuat relasi audit log ke paket/proyek induk agar aktivitas role terbatas dapat di-scope lengkap.
4. Selaraskan permission modul Peil, Asset, Operasional, Pasang Surut, dan Surat secara bertahap.
5. Petakan role final terhadap role frontend/database tanpa migration destruktif.
6. Pecah dashboard aktif menjadi komponen domain kecil sebelum redesign visual.
7. Setelah fondasi tersebut disetujui, baru mulai redesign dashboard responsive.

## 14. Validasi

Validasi yang dijalankan setelah perubahan:

```text
npx tsc --noEmit
git diff --check
```

`npm run lint` tidak tersedia karena `package.json` tidak memiliki script `lint`. Build penuh tidak dijalankan sesuai instruksi tahap ini.
