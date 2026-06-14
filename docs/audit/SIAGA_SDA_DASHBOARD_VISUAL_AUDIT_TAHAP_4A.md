# SIAGA-SDA Dashboard Visual Audit Tahap 4A

## 1. Informasi Audit

- Tanggal audit: 15 Juni 2026
- Tahap: 4A - Audit visual dan struktur dashboard aktif sebelum redesign
- Commit acuan terakhir: `ebfd77c finalisasi halaman login siaga sda`
- Dashboard aktif: `/dashboard`
- File dashboard aktif: `src/app/(dashboard)/dashboard/page.tsx`
- Metode audit: pembacaan source code, dokumen project, konfigurasi navigasi/RBAC, dan pemeriksaan respons route lokal
- Status perubahan: tidak ada source code aplikasi yang diubah

## 2. Status Login Final

Halaman login dianggap final sesuai `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md` dan commit acuan.

Pada Tahap 4A:

- file login tidak dibaca untuk analisis implementasi dashboard;
- file login tidak diubah;
- aset dan dokumen final login tidak diubah;
- Auth, NextAuth, middleware, RBAC, Prisma, database, route `/`, dan route `/login` tidak diubah.

## 3. Ringkasan Eksekutif

Dashboard aktif sudah memiliki fondasi yang cukup baik untuk dilanjutkan ke redesign bertahap:

- route aktif dan shell dashboard sudah jelas;
- menu desktop dan mobile memakai shared navigation;
- tab internal dashboard sudah role-aware;
- agregat utama dashboard sudah memakai assignment scope defensif;
- data demo memiliki penanda visual;
- tidak ada peta interaktif besar di dashboard;
- konten tab berat umumnya hanya dirender saat tab aktif;
- komponen sudah responsif secara struktur.

Namun dashboard saat ini terlalu panjang dan padat untuk dipaksa menjadi satu halaman desktop tanpa pengurangan prioritas informasi. Redesign Tahap 4B sebaiknya membuat ringkasan command center yang muat di area awal desktop, sementara detail tetap tersedia melalui tab, drill-down, dan modul asal.

## 4. Route dan Struktur Dashboard Aktif

### Route utama

| Area | Status |
|---|---|
| Route dashboard aktif | `/dashboard` |
| File dashboard aktif | `src/app/(dashboard)/dashboard/page.tsx` |
| Layout dashboard | `src/app/(dashboard)/layout.tsx` |
| Root `/` | Tetap terpisah dan tidak diubah |
| Route `/login` | Final dan tidak disentuh |

Pemeriksaan HTTP lokal tanpa sesi autentik menghasilkan respons `307` untuk `/dashboard`, `/proyek`, `/administrasi`, `/peta`, dan `/approval`. Ini menunjukkan guard/redirect aktif, tetapi visual dashboard terautentikasi tidak dapat diverifikasi langsung pada audit read-only ini.

### Shell dashboard

Layout dashboard selalu memuat:

- `Sidebar`
- `MobileNav`
- area konten utama
- `ProjectAiAssistant`
- footer aplikasi

`Topbar` dirender oleh halaman dashboard dan halaman modul, bukan oleh layout global dashboard.

## 5. Komponen Dashboard yang Dipakai

Komponen dan helper utama yang terhubung langsung dengan dashboard aktif:

| Komponen/helper | Fungsi |
|---|---|
| `Topbar` | Judul halaman, notifikasi, profil, dan aksi shell |
| `ProjectScopeFilters` | Filter kategori, jenis paket, tahap, tahun, program, dan sub kegiatan |
| `DashboardRoleHeader` | Ringkasan role, cakupan assignment, dan akses user |
| `TideDashboardPanel` | Panel pasang surut dashboard |
| `PrayerTimeWidget` | Panel waktu salat |
| Recharts | Bar chart dan pie chart dashboard |
| Zustand `useAppStore` | Sumber project, user, audit log, dan status sumber data |
| RBAC/reporting helpers | Role-aware tab, assignment scope, agregat, dan label paket |

`src/app/(dashboard)/dashboard/page.tsx` merupakan client component besar, sekitar 1.663 baris. Komponen ini menangani tab, filter, agregat, chart, ringkasan, alert, quick action, dan beberapa panel modul sekaligus.

## 6. Struktur Data Dashboard

Dashboard membaca state utama berikut dari `useAppStore`:

- `projects`
- `currentUser`
- `auditLogs`
- `dashboardDataSource`

Alur data:

1. `src/app/(dashboard)/layout.tsx` melakukan bootstrap data.
2. `src/app/api/bootstrap/route.ts` mengembalikan data sesuai role dan assignment yang tersedia.
3. Store mengganti fallback demo dengan data database saat bootstrap berhasil.
4. Dashboard membentuk `scopedProjects`.
5. Filter UI membentuk `visibleProjects`.
6. KPI, chart, tabel, alert, dan sebagian shortcut dihitung dari data scoped/visible.

### Data database dan demo

- `DUMMY_PROJECTS`, `DUMMY_USERS`, dan `DUMMY_AUDIT_LOGS` tetap menjadi fallback awal.
- Data demo tidak lagi otomatis digabungkan dengan data database ketika bootstrap berhasil.
- `dashboardDataSource` membedakan sumber `demo` dan `database`.
- Dashboard menampilkan warning ketika fallback demo aktif.
- Beberapa panel masih memakai data simulasi/static:
  - pasang surut dashboard;
  - panel persiapan Surat, Peil Banjir, Asset SDA, dan Operasional;
  - beberapa ringkasan lokasi/peta;
  - AI Analisis lokal berbasis aturan.

Data simulasi tersebut tidak boleh dipresentasikan sebagai data resmi saat redesign.

## 7. Role, Permission, dan Assignment Scope

### Kondisi yang sudah baik

- Semua role frontend yang aktif memiliki akses dasar `view_dashboard`.
- Tab internal difilter menggunakan `canAccessPage()`.
- Role luas mengikuti `canViewAllProjects()`.
- Role terbatas memakai `currentUser.projectIds` atau `project.assignedUsers`.
- API bootstrap juga menerapkan pembatasan paket untuk role terbatas.
- Aktivitas terbaru untuk role terbatas disaring secara konservatif.

### Risiko scope yang tersisa

1. `Topbar` menghitung notifikasi dari seluruh `projects` yang ada di store, bukan dari project scoped dashboard. Jika store suatu saat menerima data lebih luas, jumlah notifikasi atau kode paket berpotensi terlihat lintas assignment.
2. Badge Sidebar dan MobileNav memakai logika scope yang tidak sepenuhnya identik dengan dashboard.
3. Assignment scope untuk Surat, Peil Banjir, Asset SDA, dan Operasional belum sekuat scope paket.
4. Sebagian audit log tidak memiliki relasi project yang cukup kuat untuk dibuktikan aman pada role terbatas.
5. Mapping role final frontend dan role database masih bersifat transisi untuk role admin khusus dan mandor.

Risiko tersebut perlu ditutup pada tahap khusus permission/assignment, bukan melalui redesign visual.

## 8. Menu, Tab, dan Navigasi

### Menu utama

`src/lib/navigation.ts` menjadi shared source untuk 11 menu utama:

1. Dashboard
2. Peta Monitoring
3. Survey Investigasi
4. Paket Pekerjaan
5. Approval Center
6. Surat Masuk & Keluar
7. Administrasi
8. Peil Banjir
9. Asset SDA
10. Audit Log
11. Pengaturan

Sidebar dan MobileNav membaca konfigurasi bersama serta memfilter akses menggunakan `canAccessPage()`.

### Tab internal dashboard

Dashboard memiliki 14 tab:

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

Tab sudah role-aware, tetapi jumlahnya terlalu banyak untuk dashboard ringkas dan beberapa tab menduplikasi fungsi menu utama.

### Temuan clickable navigation

Sebagian besar card dan shortcut sudah memiliki link. Namun beberapa link hidup secara teknis tetapi belum tepat secara semantik atau belum mengaktifkan filter tujuan:

- KPI `Survey Belum Ditindaklanjuti` menuju `/proyek`, bukan `/survey`.
- tab Surat sementara menuju `/pengumuman`, bukan `/surat`.
- tab Peil Banjir sementara menuju `/peta`, bukan `/peil`.
- tab Asset SDA sementara menuju `/peta`, bukan `/asset`.
- tab Operasional sementara menuju `/chat`, bukan sub-tab operasional Asset SDA.
- beberapa link dashboard mengirim query seperti `tahun`, `health`, `status`, `source`, atau `masalah`, tetapi halaman `/proyek` dan `/approval` belum membaca query tersebut sebagai initial auto-filter.

Tidak ditemukan bukti link tersebut mati, tetapi konteks asal klik dan auto-filter belum konsisten dengan Global Clickable Navigation Rule.

## 9. Kondisi Visual Desktop

### Komponen visual yang ada

- role/assignment header;
- internal tab navigation;
- empat KPI utama;
- data-source warning;
- filter ringkas dan filter lanjutan;
- role-specific quick actions;
- command brief;
- alert dan risiko;
- chart progres fisik/keuangan;
- distribusi kesehatan paket;
- ringkasan jenis paket;
- ringkasan anggaran/sub kegiatan;
- ringkasan lokasi/peta;
- tugas role;
- aktivitas terbaru;
- panel pasang surut;
- panel waktu salat;
- panel persiapan modul;
- AI insight lokal.

### Bagian yang perlu dipertahankan

- warning data demo/database;
- role dan assignment context;
- empat KPI utama yang clickable;
- quick action sesuai role;
- alert/risk summary;
- chart fisik dan keuangan;
- ringkasan paket Fisik, Konsultan, dan Rutin;
- aktivitas terbaru;
- tombol menuju Peta Monitoring, tanpa peta besar;
- Reset Filter dan konteks navigasi.

### Bagian yang terlalu penuh atau redundan

- role header, tab, KPI, filter, dan quick action menghabiskan area vertikal sebelum konten utama;
- KPI dan command brief mengulang beberapa angka yang sama;
- alert/risk summary dan Warning Center memiliki tumpang tindih;
- quick action dan beberapa kumpulan link memiliki tujuan serupa;
- 14 tab internal terlalu banyak dan bertumpang tindih dengan menu utama;
- card besar, rounded besar, gradient, dan glass layer membuat kepadatan visual meningkat;
- RoleHeader dapat mengembang dan mengubah tinggi halaman secara signifikan.

### Bagian yang belum cukup informatif

- Surat, Peil, Asset, dan Operasional masih berupa panel persiapan dengan data nol/static;
- pasang surut dashboard masih simulasi;
- AI Analisis belum auditable sebagai analisis resmi;
- sebagian ringkasan lokasi belum dapat dianggap sebagai data spasial resmi.

## 10. Kondisi Responsive dan Mobile

### Desktop/laptop

- Sidebar desktop bersifat fixed dan dapat collapse.
- Grid dashboard memiliki breakpoint `sm`, `md`, `lg`, dan `xl`.
- Chart memakai `ResponsiveContainer`.
- Tabel memiliki horizontal overflow container.
- Dashboard saat ini memang dirancang untuk scroll vertikal.

### Mobile

- Sidebar desktop disembunyikan.
- MobileNav dan bottom navigation tersedia.
- Internal tabs menggunakan horizontal scroll.
- Grid berubah menjadi satu kolom atau kolom lebih sedikit.
- Banyak card dan panel menyebabkan halaman mobile sangat panjang.
- Struktur dasar mobile tersedia, tetapi kepadatan informasi dan panjang halaman perlu diringkas pada redesign.

Potensi overflow horizontal utama berasal dari tab, tabel, dan konten data panjang. Container overflow sudah tersedia pada beberapa area, tetapi perlu diuji visual setelah redesign.

## 11. Kelayakan Dashboard Satu Halaman Desktop

Dashboard desktop layak dibuat sebagai **satu layar ringkasan command center**, tetapi tidak layak jika seluruh konten dashboard saat ini dipaksa masuk ke satu viewport.

Pendekatan aman:

- tampilkan hanya informasi prioritas di area awal desktop;
- pertahankan detail melalui tab aktif, drill-down, dan modul asal;
- gunakan peta ringkas atau tombol menuju Peta Monitoring;
- izinkan bagian detail memiliki scroll internal terkontrol atau berada setelah ringkasan;
- mobile tetap menggunakan scroll vertikal.

Risiko jika seluruh konten dipaksa satu halaman tanpa scroll:

- teks dan angka menjadi terlalu kecil;
- card berhimpitan;
- informasi audit dan konteks assignment tersembunyi;
- tinggi layout tidak stabil akibat warning, role detail, filter, alert, dan data dinamis;
- aksesibilitas dan kenyamanan mobile menurun;
- potensi overflow dan overlap meningkat.

## 12. Audit Performa

### Kondisi yang sudah baik

- dashboard memakai selector Zustand untuk state utama;
- banyak agregat memakai `useMemo`;
- konten tab berat umumnya hanya dirender ketika tab aktif;
- tidak ada peta interaktif besar di dashboard;
- bootstrap tidak otomatis dijalankan ulang pada setiap navigasi jika data masih valid;
- sync version digunakan untuk menentukan kebutuhan refresh.

### Potensi beban yang tersisa

- dashboard merupakan client component sangat besar;
- Recharts di-import statis bersama bundle dashboard;
- bootstrap memuat payload relasional yang besar;
- `Topbar` menghitung beberapa filter/reduction setiap render dan memakai seluruh projects store;
- beberapa array/summary masih dibentuk ulang saat render;
- PrayerTimeWidget dan TideDashboardPanel memiliki interval realtime ketika tab terkait aktif;
- polling pengumuman dan sync tetap perlu diawasi;
- pemisahan komponen dan lazy loading dapat dipertimbangkan setelah desain final disepakati.

Lambat saat klik pertama di development juga dapat berasal dari kompilasi route Next.js. Audit performa produksi harus dibedakan dari perilaku development.

## 13. Risiko Teknis Redesign

| Area | Risiko |
|---|---|
| Route | Link hidup tetapi beberapa tujuan/auto-filter belum tepat |
| Role/RBAC | Redesign dapat tanpa sengaja menampilkan card/tab di luar permission |
| Assignment | Topbar/badge dan modul non-paket belum sepenuhnya konsisten |
| Data | Data demo/static berpotensi terlihat sebagai data resmi |
| Responsive | Memaksa no-scroll dapat membuat teks kecil dan overlap |
| Performa | Satu client component besar dan static chart imports |
| Auditability | AI insight dan data simulasi belum layak disebut analisis resmi |
| Peta | Menambahkan peta besar akan meningkatkan beban dan melanggar arah blueprint |
| Login | Login final berisiko ikut berubah jika scope redesign tidak dijaga |

## 14. Rekomendasi Tahap 4B

Tahap 4B sebaiknya berupa desain/mapping sebelum implementasi:

1. Tetapkan hierarki informasi dashboard berdasarkan role.
2. Definisikan area ringkasan desktop satu layar:
   - context role/assignment compact;
   - KPI prioritas;
   - progres fisik/keuangan;
   - alert/approval;
   - quick action;
   - aktivitas singkat;
   - tombol Peta Monitoring.
3. Gabungkan atau turunkan prioritas tab yang menduplikasi menu utama.
4. Pertahankan detail di modul asal dan pastikan auto-filter URL benar.
5. Pisahkan data resmi, demo, simulasi, dan insight lokal secara visual.
6. Susun target mobile terpisah dengan scroll vertikal.
7. Rencanakan pemecahan dashboard component dan lazy loading setelah struktur visual disetujui.
8. Audit dan tutup risiko scope Topbar/badge sebelum menampilkan notifikasi strategis.
9. Jangan menambahkan peta interaktif besar ke dashboard.
10. Jangan menyentuh login final.

## 15. File yang Hanya Dibaca

Dokumen:

- `AGENTS.md`
- `docs/core/*`
- `docs/design/*`
- `docs/audit/*`

Source dashboard dan shell:

- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/components/dashboard/DashboardRoleHeader.tsx`
- `src/components/dashboard/TideDashboardPanel.tsx`
- `src/components/dashboard/PrayerTimeWidget.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/layout/Topbar.tsx`
- `src/components/modules/ModuleLandingPage.tsx`

Data, route, dan akses:

- `src/store/useAppStore.ts`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/lib/navigation.ts`
- `src/app/api/bootstrap/route.ts`
- `src/app/api/sync-version/route.ts`
- halaman modul terkait `/proyek`, `/survey`, `/approval`, `/administrasi`, dan `/peta`

## 16. File yang Dibuat

- `docs/audit/SIAGA_SDA_DASHBOARD_VISUAL_AUDIT_TAHAP_4A.md`

Tidak ada source code aplikasi yang diubah.

## 17. Kesimpulan

Fondasi dashboard cukup aman untuk memasuki Tahap 4B berupa konsep visual dan mapping prioritas, dengan syarat redesign dilakukan bertahap dan tidak mengubah permission, assignment scope, data source, route, atau login final.

Target satu halaman desktop hanya aman untuk ringkasan prioritas, bukan untuk seluruh isi dashboard saat ini. Mobile harus tetap scroll vertikal. Sebelum implementasi visual besar, link dashboard perlu dipetakan ulang ke modul asal dan auto-filter, serta risiko scope Topbar/badge perlu ditutup pada tahap teknis terpisah.
