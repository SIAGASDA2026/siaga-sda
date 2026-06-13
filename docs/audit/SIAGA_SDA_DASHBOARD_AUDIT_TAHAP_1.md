# Audit Dashboard Utama SIAGA-SDA - Tahap 1

Tanggal audit: 14 Juni 2026
Sifat audit: baca-saja terhadap source code aplikasi
Scope perubahan: hanya dokumen audit ini

## 1. Ringkasan Audit

Dashboard utama yang aktif setelah login adalah route `/dashboard`, dengan implementasi utama di:

```text
src/app/(dashboard)/dashboard/page.tsx
```

Alur login, sidebar, mobile navigation, halaman akses dibatasi, dan sejumlah tombol kembali mengarah ke `/dashboard`. Dashboard sudah memiliki banyak komponen monitoring yang relevan, filter proyek, shortcut berbasis role, navigasi clickable, tampilan responsive, serta integrasi data dari Zustand/store.

Namun dashboard belum aman untuk langsung di-redesign secara besar karena terdapat beberapa risiko struktural:

1. Terdapat implementasi dashboard kedua di `src/app/(dashboard)/page.tsx` yang memetakan route `/`, sementara `src/app/page.tsx` juga memetakan route `/` dan melakukan redirect ke `/login`.
2. Dashboard aktif masih berupa file client component sangat besar, sekitar 1.600 baris, yang mencampur agregasi data, role action, tab, mock pasang surut, tabel, chart, dan presentasi UI.
3. Store selalu menggabungkan data database dengan `DUMMY_PROJECTS`, sehingga data fallback/demo dapat ikut masuk ke statistik resmi.
4. Statistik dashboard aktif dihitung dari seluruh `projects` setelah filter UI. Pembatasan proyek berdasarkan assignment tidak terlihat diterapkan pada agregat utama dashboard.
5. Sidebar/mobile menu sudah role-based, tetapi 14 tab internal dashboard ditampilkan untuk semua role.
6. Model role frontend, role database, role target SIAGA-SDA, dan beberapa role yang disebut di dashboard belum sepenuhnya selaras.
7. Beberapa modul dashboard masih berupa panel persiapan dengan angka nol/static karena tabel atau workflow resminya belum tersedia.

Halaman login dan seluruh file login final tidak diubah dalam audit ini.

## 2. Dokumen Acuan yang Dibaca

Audit mengacu pada `AGENTS.md` dan seluruh dokumen Markdown di `/docs`, terutama:

```text
docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md
docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md
docs/design/SIAGA_SDA_DESIGN_SYSTEM.md
docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md
docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md
```

## 3. File Dashboard yang Ditemukan

### 3.1 Dashboard aktif

| Fungsi | File | Temuan |
|---|---|---|
| Dashboard utama aktif | `src/app/(dashboard)/dashboard/page.tsx` | Route `/dashboard`; tujuan setelah login dan sumber dashboard yang aktif |
| Implementasi dashboard lain | `src/app/(dashboard)/page.tsx` | Route `/`; implementasi dashboard besar lain sekitar 848 baris |
| Root aplikasi | `src/app/page.tsx` | Juga memetakan `/`, lalu redirect ke `/login` |
| Layout dashboard | `src/app/(dashboard)/layout.tsx` | Session gate, bootstrap data, sidebar, mobile nav, footer, realtime sync |
| Sidebar desktop | `src/components/layout/Sidebar.tsx` | Menu desktop role-based |
| Navigasi mobile | `src/components/layout/MobileNav.tsx` | Bottom navigation dan expandable menu role-based |
| Header/topbar | `src/components/layout/Topbar.tsx` | Header, notifikasi, dan logout |

### 3.2 Komponen dashboard

```text
src/components/dashboard/DashboardRoleHeader.tsx
src/components/dashboard/PrayerTimeWidget.tsx
src/components/dashboard/TideDashboardPanel.tsx
src/components/project/ProjectScopeFilters.tsx
```

Sebagian besar card, tabel, tab, dan helper presentasi dashboard masih didefinisikan langsung di `src/app/(dashboard)/dashboard/page.tsx`, antara lain:

```text
SurveyInvestigationTab
PackageWorkspaceTab
WarningCenterTab
ModulePreparationTab
ModuleHeader
MiniMetric
EmptyModuleState
ProjectTable
```

### 3.3 Data, store, tipe, role, dan akses

```text
src/store/useAppStore.ts
src/lib/data.ts
src/lib/reporting.ts
src/lib/brand.ts
src/lib/roles.ts
src/lib/rbac.ts
src/lib/db-mappers.ts
src/lib/project-db.ts
src/types/index.ts
prisma/schema.prisma
```

### 3.4 Styling yang memengaruhi dashboard

Dashboard tidak memiliki CSS module khusus. Styling utama berasal dari:

1. Utility Tailwind yang ditulis langsung di file TSX.
2. `src/app/globals.css`, terutama class:
   - `siaga-card`
   - `siaga-gemini-bg`
   - `siaga-glass-card`
   - layout global aplikasi dan aturan responsive/overflow.
3. `tailwind.config.js` sebagai konfigurasi global.

### 3.5 Artefak source cadangan

Ditemukan file cadangan di dalam source route:

```text
src/app/(dashboard)/peta/page.tsx.bak
src/app/(dashboard)/proyek/page.tsx.bak
```

File ini tidak diubah. Keberadaannya meningkatkan risiko kebingungan saat audit, pencarian istilah lama, dan maintenance.

## 4. Struktur Dashboard Saat Ini

### 4.1 Layout global dashboard

`src/app/(dashboard)/layout.tsx`:

1. Memastikan sesi NextAuth tersedia.
2. Mengarahkan user tanpa sesi ke `/login`.
3. Memuat data awal dari `/api/bootstrap`.
4. Menyimpan data ke `useAppStore`.
5. Menampilkan `Sidebar`, `MobileNav`, area konten, footer, dan assistant.
6. Melakukan sinkronisasi versi data berkala serta saat focus/visibility berubah.

### 4.2 Struktur dashboard aktif `/dashboard`

Dashboard aktif memiliki:

1. Topbar.
2. Role header dan konteks penugasan.
3. Filter scope proyek.
4. Empat belas tab internal.
5. Command brief dan indikator utama.
6. Shortcut cepat berdasarkan role.
7. Ringkasan paket, anggaran, progress fisik/keuangan, dan deviasi.
8. Alert dan warning.
9. Ringkasan sub kegiatan.
10. Grafik dan tabel paket.
11. Aktivitas/audit terbaru.
12. Ringkasan pasang surut dan waktu salat.
13. Panel persiapan modul yang datanya belum tersedia.

### 4.3 Risiko duplikasi route `/`

Terdapat dua file yang sama-sama secara konseptual memetakan route `/`:

```text
src/app/page.tsx
src/app/(dashboard)/page.tsx
```

Alur aplikasi aktual secara konsisten menggunakan `/dashboard`, sehingga `src/app/(dashboard)/page.tsx` terlihat sebagai implementasi lama/duplikat yang perlu diputuskan statusnya sebelum redesign. Jangan menghapusnya tanpa audit route/build dan persetujuan eksplisit.

## 5. Audit Menu dan Tab

### 5.1 Menu sidebar desktop saat ini

Sumber: `src/components/layout/Sidebar.tsx`

1. Dashboard
2. Peta Monitoring
3. Survey Investigasi
4. Laporan Harian
5. Masalah & Kendala
6. Paket Pekerjaan
7. Approval Center
8. RAB
9. Serapan Anggaran
10. Kontrak
11. Dokumen
12. Chat Proyek
13. Pengumuman
14. Surat Masuk/Keluar
15. Peil Banjir
16. Asset SDA
17. Pengguna
18. Audit Log
19. Pengaturan

Semua item sidebar difilter menggunakan `canAccessPage()`. Badge approval dan masalah juga dihitung berdasarkan proyek yang ditugaskan untuk role non-admin.

### 5.2 Menu mobile saat ini

Sumber: `src/components/layout/MobileNav.tsx`

Bottom navigation utama:

```text
Dashboard
Paket
Approval
Masalah
Menu
```

Menu expandable mobile mencakup sebagian besar menu desktop, tetapi tidak memuat `Serapan Anggaran`. Menu mobile juga difilter menggunakan `canAccessPage()`.

### 5.3 Tab internal dashboard aktif

Sumber: `src/app/(dashboard)/dashboard/page.tsx`

1. Ringkasan
2. Monitoring
3. Survey
4. Paket
5. Approval & Risiko
6. Surat
7. Peil Banjir
8. Asset SDA
9. Operasional
10. Pasang Surut
11. Warning Center
12. Waktu & Salat
13. Aktivitas
14. AI Analisis

Semua tab dirender dari `DASHBOARD_TABS` tanpa filter role. Ini berbeda dari sidebar/mobile menu yang sudah role-based.

### 5.4 Kesesuaian dengan menu target SIAGA-SDA

Menu yang sudah sesuai atau sangat dekat:

```text
Dashboard
Peta Monitoring
Survey Investigasi
Paket Pekerjaan
Approval Center
Peil Banjir
Asset SDA
Audit Log
Pengaturan
```

Menu yang perlu penyesuaian nama:

```text
Surat Masuk/Keluar -> Surat Masuk & Keluar
```

Menu target yang route-nya sudah tersedia tetapi belum tampil di sidebar/mobile menu:

```text
Administrasi -> route /administrasi
```

Menu utama saat ini yang menurut blueprint lebih tepat dikonsolidasikan menjadi sub-fitur:

```text
Laporan Harian
Masalah & Kendala
RAB
Serapan Anggaran
Kontrak
Dokumen
Chat Proyek
Pengumuman
Pengguna
```

Rekomendasi tahap redesign: jangan langsung menghapus route tersebut. Rapikan hierarki menu terlebih dahulu dan pertahankan route lama sebagai tujuan sub-fitur/compatibility sampai navigasi serta permission selesai dipetakan.

## 6. Audit Role dan Akses

### 6.1 Role frontend yang ditemukan

Sumber utama: `src/types/index.ts`, `src/lib/roles.ts`, dan `src/lib/rbac.ts`.

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

Semua role frontend memperoleh permission `view_dashboard`.

### 6.2 Role yang dipakai dashboard aktif

Shortcut khusus tersedia untuk:

```text
admin
super_admin
ppk
pptk
tim_survey
tim_pengawasan
pimpinan
default
```

Dashboard juga memiliki pemetaan tugas role untuk:

```text
ppk
pptk
admin_kegiatan
konsultan_pengawas
konsultan_perencana
kontraktor
mandor_operasional_sda
mandor_rehab_drainase
admin_surat
admin_peil
admin_asset
```

Sebagian role pada pemetaan tugas tersebut tidak ada dalam union `Role` frontend, sehingga pemetaan itu tidak konsisten dan berpotensi tidak pernah aktif untuk user aktual.

### 6.3 Gap terhadap role penting SIAGA-SDA

Role/istilah yang belum selaras atau belum tersedia sebagai role frontend:

| Target/istilah | Kondisi aktual |
|---|---|
| `admin_sistem` | Tidak ada di union role frontend; disebut sebagai broad role di dashboard |
| `admin_sda` / `admin_bidang` | Tidak ada; role generik `admin` masih dipakai |
| `kepala_bidang` | Aktual memakai `kabid` |
| `admin_surat` | Disebut di dashboard tetapi tidak ada di union frontend |
| `admin_peil` / `admin_peil_banjir` | Disebut di dashboard tetapi tidak ada di union frontend |
| `tim_perencana_rutin` | Aktual memakai `tim_perencanaan` |
| `tim_pengawas_rutin` | Aktual memakai `tim_pengawasan` |
| `mandor_operasional_sda` | Disebut di dashboard tetapi tidak ada di union frontend |
| `mandor_rehab_drainase` | Disebut di dashboard tetapi tidak ada di union frontend |
| `mandor_pintu_air` | Tidak ditemukan sebagai role frontend |
| `petugas_pintu_air` | Tidak ditemukan sebagai role frontend |
| `mandor_rehabilitasi_drainase` | Tidak ditemukan sebagai role frontend |

Role final harus dipetakan bertahap terhadap data dan enum database sebelum perubahan besar.

### 6.4 Temuan `administrasi_kontrak`

Role lama/transisional `administrasi_kontrak` masih ditemukan:

```text
prisma/schema.prisma
src/lib/db-mappers.ts
src/lib/project-db.ts
src/app/api/announcements/route.ts
```

Kondisi saat ini:

1. Prisma masih memiliki enum `ADMINISTRASI_KONTRAK`.
2. Mapper mengubah `administrasi_kontrak` menjadi `admin_sub_kegiatan` pada frontend.
3. Penulisan ke database masih memetakan `admin_sub_kegiatan` ke `ADMINISTRASI_KONTRAK`.
4. Terdapat komentar TODO untuk migrasi enum Prisma.

Artinya, `administrasi_kontrak` tidak menjadi role frontend aktif, tetapi masih merupakan compatibility layer database. Jangan mengganti atau menghapusnya tanpa migration dan audit data.

### 6.5 Apakah akses dashboard sudah berbeda sesuai role?

Sebagian:

1. Sidebar dan mobile menu sudah difilter berdasarkan permission role.
2. Shortcut dashboard tertentu sudah role-based.
3. Role header menampilkan permission dan assignment.
4. Badge sidebar/mobile dihitung berdasarkan assignment untuk role terbatas.

Belum konsisten:

1. Tab internal dashboard tidak role-based.
2. `visibleProjects` pada dashboard aktif berasal dari seluruh `projects` dan filter UI, tanpa pembatasan assignment yang terlihat.
3. Statistik, chart, risiko, dan tabel yang memakai `visibleProjects` berpotensi menampilkan agregat lintas assignment.
4. Beberapa role khusus dashboard tidak tersedia dalam model role frontend.

## 7. Audit Isi Dashboard Saat Ini

### 7.1 Card dan indikator yang tersedia

Dashboard aktif sudah memuat indikator relevan berikut:

```text
Total Paket
Progres/On Track
Paket Selesai
Stuck/Kritis
Approval Pending
Survey Belum Ditindaklanjuti
Masalah Open
Titik Kritis
Total Anggaran
Progres Fisik
Progres Keuangan
Deviasi
Ringkasan sub kegiatan
Ringkasan jenis paket
Aktivitas/audit terbaru
Status pasang surut
```

### 7.2 Bagian yang cocok dipertahankan

1. Filter tahun, program, sub kegiatan, jenis paket, metode/kategori, dan tahap.
2. Ringkasan paket tahun aktif.
3. Perbandingan progress fisik dan keuangan.
4. Indikator deviasi, warning, dan kritis.
5. Shortcut cepat berbasis role.
6. Link cepat ke Peta Monitoring.
7. Ringkasan berdasarkan jenis paket Fisik, Konsultan, dan Rutin.
8. Aktivitas/audit terbaru.
9. Navigasi clickable ke modul asal.
10. Widget pasang surut sebagai konteks operasional SDA.

### 7.3 Bagian yang belum lengkap atau terlalu umum

1. Status pintu air/rumah pompa belum terhubung ke data operasional resmi.
2. Panel Surat, Peil Banjir, Asset SDA, dan Operasional masih berupa panel persiapan dengan nilai nol/static.
3. Ringkasan peta memakai angka titik status yang bersifat static.
4. Pasang surut di dashboard aktif memakai data simulasi/static dan tanggal tahun 2025.
5. Approval dihitung dari beberapa status survey/RAB/laporan, belum terlihat sebagai workflow approval terpadu.
6. Dashboard memiliki tab dan card sangat banyak, sehingga hierarki informasi utama untuk pimpinan belum cukup tegas.
7. `AI Analisis` masih berupa rule-based text lokal, bukan sumber analisis resmi yang dapat diaudit.

### 7.4 Kesesuaian terhadap kebutuhan dashboard berikutnya

| Kebutuhan | Kondisi |
|---|---|
| Ringkasan paket tahun aktif | Sudah ada |
| Progres fisik | Sudah ada |
| Progres keuangan | Sudah ada |
| Deviasi keterlambatan | Sudah ada |
| Paket kritis | Sudah ada |
| Survey investigasi terbaru | Ada, tetapi perlu validasi scope dan data resmi |
| Approval menunggu persetujuan | Ada, tetapi agregasinya belum workflow terpadu |
| Laporan lapangan terbaru | Ada dari data proyek |
| Status pasang surut/rob | Ada, tetapi masih simulasi/static |
| Status pintu air/rumah pompa | Belum berbasis data resmi |
| Surat/usulan/undangan terbaru | Belum berbasis data resmi |
| Shortcut sesuai role | Sebagian sudah ada |
| Akses cepat Peta Monitoring | Sudah ada |
| Rekap Fisik/Konsultan/Rutin | Sudah ada |

## 8. Audit Data Dummy dan Store

### 8.1 Sumber data

Dashboard menggunakan `useAppStore` dari:

```text
src/store/useAppStore.ts
```

Fallback/demo berasal dari:

```text
src/lib/data.ts
```

Store mengimpor:

```text
DUMMY_PROJECTS
DUMMY_USERS
DUMMY_AUDIT_LOGS
USER_CREDENTIALS
```

### 8.2 Pencampuran data database dan dummy

Saat bootstrap database, fungsi `mergeFallbackProjects()` selalu memasukkan semua `DUMMY_PROJECTS`, lalu menimpa ID yang sama dengan data database. Akibatnya:

1. Statistik dashboard dapat mencampur data resmi dan fallback.
2. Data dummy yang ID-nya berbeda akan tetap tampil walaupun database sudah berisi data.
3. Tidak ada label UI yang membedakan data fallback dengan data resmi.

Tidak ditemukan konvensi ID atau label `-demo` pada data fallback.

### 8.3 Tahun data

Data yang ditemukan menggunakan tahun 2025 dan 2026. Tidak ditemukan data tahun 2024 pada sumber dashboard/data utama yang diaudit.

Beberapa data pasang surut dashboard masih memakai tanggal Juni 2025 dan secara eksplisit disebut sebagai simulasi sementara.

### 8.4 Relasi data paket

Model frontend `Proyek` telah memuat atau mendukung banyak relasi penting:

```text
program
kegiatan
sub kegiatan
paket/proyek
jenis/kategori pekerjaan
metode/kategori pengadaan
progress fisik dan keuangan
survey
RAB
laporan harian
catatan pengawasan
masalah
chat
lokasi/koordinat
assigned users
PPK/PPTK
```

Catatan:

1. Dokumen dan kontrak berada pada jalur/model/modul terpisah; relasi generik dokumen tidak terlihat sebagai satu field relasi utama pada model frontend `Proyek`.
2. Approval masih disimpulkan dari status beberapa entitas, bukan satu relasi approval terpadu.
3. Konsistensi antara model frontend, database, dan data dummy perlu diaudit sebelum redesign yang bergantung pada angka resmi.

## 9. Audit Responsive Dashboard

### 9.1 Kondisi yang sudah tersedia

1. Sidebar desktop disembunyikan pada viewport mobile.
2. Mobile navigation tersedia dalam bentuk fixed bottom navigation dan expandable bottom sheet.
3. Grid card memakai breakpoint `sm`, `md`, `lg`, dan `xl`.
4. Chart memakai `ResponsiveContainer`.
5. Tabel dibungkus `overflow-x-auto`.
6. Tab internal mobile menggunakan horizontal scroll.
7. Layout global memberi ruang bawah untuk mobile navigation.
8. `min-width: 0` dan aturan overflow global membantu mencegah card merusak lebar viewport.

### 9.2 Potensi masalah responsive

1. Empat belas tab internal mengandalkan horizontal scroll pada mobile.
2. Tabel sub kegiatan memiliki minimum width besar dan akan selalu horizontal-scroll pada mobile.
3. Banyak panel dan card membuat halaman dashboard sangat panjang pada mobile.
4. Fixed bottom navigation berpotensi menutup elemen jika padding global berubah.
5. `overflow-x: hidden/clip` global dapat menyembunyikan overflow yang seharusnya diperbaiki pada komponen.
6. Dua implementasi dashboard dapat memiliki perilaku responsive berbeda dan membingungkan pengujian.
7. Sidebar desktop memiliki 19 menu utama dan mengandalkan scroll internal.

### 9.3 Kesimpulan responsive

Fondasi responsive sudah ada dan cukup baik untuk dipertahankan. Redesign berikutnya harus fokus mengurangi kepadatan, menyusun prioritas informasi per role, dan menguji tabel/tab mobile tanpa mengandalkan clipping global.

## 10. Temuan Istilah dan Nama Lama

### 10.1 Istilah dashboard lama

Pada dashboard aktif ditemukan:

```text
admin_kegiatan
Admin Kegiatan
```

Lokasi:

```text
src/app/(dashboard)/dashboard/page.tsx
```

Istilah ini perlu dipetakan ke `admin_sub_kegiatan`, tetapi jangan diganti sebelum memastikan dampak terhadap role, data, dan tampilan.

### 10.2 Nama lama `SIMONPRO`

Masih ditemukan pada source yang berhubungan dengan branding/reporting:

```text
src/lib/brand.ts
src/lib/reporting.ts
src/lib/print.ts
src/app/(dashboard)/laporan/page.tsx
```

Temuan ini tidak diubah pada tahap audit. `src/lib/brand.ts` bahkan menyimpan `oldName: 'SIMONPRO'`, sehingga penghapusan harus mempertimbangkan kebutuhan compatibility/audit.

### 10.3 Istilah `proyek`

Route, nama tipe, store, API, dan banyak variabel masih memakai istilah teknis `proyek`, sementara UI target memakai `Paket Pekerjaan`. Ini merupakan istilah arsitektur lama yang luas dan tidak aman diganti secara massal tanpa mapping.

### 10.4 Istilah lain

Tidak ditemukan istilah `qurban` atau `qurban-app` pada source aktif yang diaudit.

## 11. Risiko Jika Dashboard Langsung Diubah

1. Redesign dapat dilakukan pada file dashboard yang salah karena terdapat implementasi `/` dan `/dashboard`.
2. Statistik baru dapat dianggap resmi padahal mencampur data database dan fallback dummy.
3. Role terbatas berpotensi melihat agregat proyek di luar assignment jika pembatasan `visibleProjects` tidak diselesaikan.
4. Perubahan menu dapat memutus route lama yang masih dipakai oleh shortcut, link, dan permission.
5. Penggantian role lama tanpa migration dapat merusak kompatibilitas Prisma dan data lama.
6. Memecah file dashboard besar tanpa mapping dapat mengubah behavior filter, link, chart, dan tab.
7. Perubahan styling global dapat memengaruhi semua modul, bukan hanya dashboard.
8. Menghapus panel persiapan dapat menghilangkan konteks roadmap, tetapi mempertahankannya sebagai data resmi juga menyesatkan.
9. File `.bak` dan nama lama dapat menyebabkan pencarian/replace mengenai implementasi yang bukan aktif.

## 12. Rekomendasi Urutan Redesign Dashboard

1. Tetapkan secara eksplisit bahwa `/dashboard` dan `src/app/(dashboard)/dashboard/page.tsx` adalah dashboard aktif.
2. Audit dan putuskan status `src/app/(dashboard)/page.tsx` serta konflik route `/` tanpa menghapus langsung.
3. Pisahkan data resmi dari `DUMMY_PROJECTS`; buat fallback/demo dapat dikenali dan tidak masuk agregat resmi.
4. Terapkan assignment scope pada semua statistik, chart, tabel, alert, dan shortcut dashboard.
5. Selaraskan role frontend, role Prisma, compatibility mapper, dan role final SIAGA-SDA.
6. Rapikan hierarki menu utama sesuai blueprint; pertahankan route lama sebagai sub-fitur selama masa transisi.
7. Tentukan KPI prioritas per role sebelum mengubah visual.
8. Ekstrak bagian dashboard besar menjadi komponen terukur tanpa mengubah behavior.
9. Ganti panel static/simulasi secara bertahap setelah sumber data resmi tersedia.
10. Lakukan redesign responsive per tahap dan validasi desktop/mobile serta akses setiap role.

## 13. File yang Aman Disentuh pada Tahap Redesign Berikutnya

Daftar ini aman secara relatif hanya setelah scope tahap berikutnya disetujui:

```text
src/app/(dashboard)/dashboard/page.tsx
src/components/dashboard/DashboardRoleHeader.tsx
src/components/dashboard/TideDashboardPanel.tsx
src/components/dashboard/PrayerTimeWidget.tsx
src/components/project/ProjectScopeFilters.tsx
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/components/layout/Topbar.tsx
```

Ketentuan:

1. Perubahan visual dashboard sebaiknya tidak langsung menyentuh `src/app/globals.css`.
2. Perubahan menu/sidebar harus mengikuti audit route dan permission.
3. Perubahan komponen pasang surut/waktu salat dashboard tidak boleh menyentuh komponen login.
4. Perubahan role/RBAC/store/data tidak termasuk redesign UI biasa dan harus menjadi tahap terpisah.

## 14. File yang Tidak Boleh Disentuh pada Redesign UI Tanpa Instruksi Eksplisit

### 14.1 Login final

```text
src/app/login/page.tsx
src/components/login/login.module.css
src/components/login/LoginDigitalClock.tsx
src/components/login/LoginWeatherWidget.tsx
src/components/login/LoginTideWidget.tsx
src/components/login/LoginPrayerWidget.tsx
src/components/login/LoginBrandHero.tsx
src/components/login/LoginStatusStrip.tsx
```

### 14.2 Sistem sensitif

```text
src/lib/auth.ts
src/lib/rbac.ts
src/lib/roles.ts
src/middleware.ts
prisma/schema.prisma
prisma/migrations/*
package.json
database dan konfigurasi environment
```

File role/RBAC/data boleh dibaca dan diaudit, tetapi tidak boleh ikut berubah dalam redesign visual tanpa tugas dan persetujuan khusus.

## 15. Kesimpulan

Dashboard `/dashboard` sudah memiliki fondasi fungsional yang cukup kuat: filter, KPI, chart, role shortcut, clickable navigation, sidebar/mobile navigation role-based, audit activity, pasang surut, dan responsive layout.

Dashboard belum aman untuk redesign besar secara langsung. Tahap berikutnya harus dimulai dengan menetapkan route aktif, memisahkan data resmi dari fallback dummy, membatasi agregat berdasarkan assignment, dan menyelaraskan role/menu. Setelah empat hal tersebut jelas, redesign UI dapat dilakukan bertahap tanpa merusak login final, Auth, RBAC, database, atau workflow aplikasi.

Audit ini tidak mengubah source code, UI dashboard, halaman login, Auth, RBAC, database, Prisma, route, maupun dependency.
