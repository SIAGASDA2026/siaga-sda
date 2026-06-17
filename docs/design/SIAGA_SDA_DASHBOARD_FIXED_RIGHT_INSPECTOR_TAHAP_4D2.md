# SIAGA-SDA Dashboard Fixed Right Inspector - Tahap 4D.2

## 1. Ringkasan Tujuan

- Tanggal: 15 Juni 2026
- Dashboard aktif: `/dashboard`
- Fokus: master-detail layout pada landing Ringkasan
- Pendekatan: presentasi data existing tanpa request atau source data baru

Tahap 4D.2 menambahkan Right Inspector pada desktop dan bottom sheet pada mobile. Area Command Center tengah menjadi area scroll internal pada desktop, sementara inspector kanan tetap diam dan menampilkan detail pilihan user.

## 2. File yang Dibaca

- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`
- `src/components/dashboard/CommandCenterNavigation.tsx`
- `src/components/approval/ApprovalSummaryProvider.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Topbar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/lib/dashboard-scope.ts`
- `src/lib/navigation.ts`
- `src/store/useAppStore.ts`
- dokumen dashboard Tahap 4A sampai 4D.1

## 3. File yang Diubah dan Dibuat

Diubah:

- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`
- `src/components/dashboard/CommandCenterNavigation.tsx`

Dibuat:

- `src/components/dashboard/DashboardRightInspector.tsx`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`

## 4. Backup

Backup dibuat di:

`backup/backup-dashboard-fixed-right-inspector-4d2-before-change`

File backup:

- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`
- `src/components/dashboard/CommandCenterNavigation.tsx`

## 5. Implementasi Desktop

### Layout

Pada breakpoint desktop lebar (`xl`), Command Center memakai grid:

```text
-------------------------------+--------------------+
| Middle Scroll Area            | Right Inspector    |
| Command Center Ringkasan      | Fixed dalam grid   |
| overflow-y-auto               | tidak ikut scroll  |
+-------------------------------+--------------------+
```

Tinggi area memakai kalkulasi viewport internal. Perubahan tidak diterapkan pada shell semua modul agar tidak mengganggu route lain.

### Middle Scroll Area

- Header, navigasi compact, KPI, decision panels, akses/aktivitas, dan modul pendukung berada pada area tengah.
- Area tengah menggunakan `overflow-y-auto` pada desktop.
- Mobile tetap menggunakan scroll halaman normal.

### Right Inspector

- Lebar desktop sekitar 280px.
- Inspector berada di kolom grid terpisah dan tidak ikut scroll area tengah.
- Konten inspector sendiri dapat scroll jika detail melebihi tinggi aman.
- Tidak memuat data panjang atau peta interaktif.

### Card Restructure

- Header dipadatkan.
- Navigasi Command Center dipadatkan dan mengubah fokus inspector.
- Command Brief dibatasi maksimal tiga prioritas.
- KPI mengubah isi inspector saat diklik.
- Progress dan Risk & Approval mengubah fokus inspector melalui kontrol terkait.
- Akses & Aktivitas serta Modul Pendukung tetap compact.

## 6. Implementasi Mobile

- Kolom Right Inspector disembunyikan.
- Klik KPI, navigasi, prioritas, aktivitas, atau modul pendukung membuka bottom sheet.
- Bottom sheet dapat ditutup melalui tombol, backdrop, atau Escape.
- Tinggi sheet dibatasi agar bottom navigation tidak tertutup permanen.
- Mobile tetap scroll vertikal normal dan tidak bergantung pada hover.

## 7. Isi Inspector

### Default

- Role aktif dan scope.
- Paket scoped.
- Paket kritis.
- Approval Pending bila role berhak.
- Survey Pending.
- Status sumber data.
- Shortcut Paket, Approval, dan Peta sesuai akses.

### Paket/Risiko

Menggunakan paket pertama dari `riskProjects` yang sudah scoped:

- kode dan nama paket;
- health;
- jenis dan metode;
- lokasi;
- progres fisik dan keuangan;
- PPK dan PPTK;
- tombol menuju daftar Paket Kritis.

Tidak ada request baru untuk mengambil detail paket.

### Approval

- memakai Approval Summary formal Tahap 4C.3;
- menampilkan count pending/revisi sesuai item terpilih;
- tombol menuju Approval Center hanya untuk role dengan akses.

### Survey

- menampilkan Survey Belum Ditindaklanjuti dari statistik scoped;
- tombol menuju Survey dengan filter dashboard.

### Progress

- progres fisik;
- progres keuangan;
- deviasi;
- tombol menuju Paket Pekerjaan.

### Modul

- status modul;
- badge sumber seperti Persiapan, Utility, atau Insight Lokal;
- tombol membuka modul hanya jika route tersedia untuk role.

## 8. Interaction Behavior

State ringan disimpan di `CommandCenterOverview`:

- `selectedInspectorId`
- `mobileInspectorOpen`

Item yang mengubah inspector:

- Navigasi Command Center
- KPI
- Command Brief
- indikator deviasi/progress
- item Risk & Approval
- Aktivitas
- Modul Pendukung

Tombol utama pada inspector tetap membawa user ke modul asal.

## 9. Role-Aware Behavior

- Semua data tetap berasal dari props yang sudah difilter dashboard.
- `riskProjects[0]` merupakan paket dari assignment scope existing.
- Approval formal hanya tersedia jika `canViewApproval` true.
- Role tanpa Approval diarahkan ke Paket Berisiko.
- Modul pendukung tetap difilter menggunakan `canAccessPage()`.
- Tidak ada permission baru atau perluasan akses.

## 10. Scroll Behavior

Desktop:

- Command Center memakai tinggi viewport internal.
- Area tengah menjadi scroll utama untuk landing Ringkasan.
- Inspector kanan tetap diam di kolom terpisah.
- Isi inspector memiliki scroll internal jika diperlukan.

Mobile:

- scroll halaman tetap normal;
- inspector menjadi bottom sheet;
- tidak ada kolom kanan atau horizontal overflow yang disengaja.

Shell global tidak diubah agar seluruh modul lain tidak terdampak.

## 11. Data Source

- Paket, progress, risiko, survey, dan aktivitas memakai data scoped dashboard existing.
- Approval Pending memakai Approval Summary formal Tahap 4C.3.
- Data Database dan Data Demo/Fallback tetap dibedakan.
- Modul Persiapan dan Insight Lokal tidak dipresentasikan sebagai data resmi.
- Tidak ada fetch/API baru.

## 12. Hal yang Tidak Disentuh

- Login dan asset login
- Auth, NextAuth, middleware, RBAC, role, permission
- Prisma, database, migration, schema
- Endpoint Approval, Bootstrap, Sync Version
- Approval Summary Provider
- Sidebar, Topbar, MobileNav, dan menu utama
- Route root, `/login`, dan `/dashboard`
- Data dummy/demo
- Package dan dependency

## 13. Validasi

- `npx tsc --noEmit`: lulus pada revisi 4D.2.1.
- `git diff --check`: lulus pada revisi 4D.2.1.
- `npm run lint`: script lint tidak tersedia.
- `npm run build`: tidak dijalankan karena tidak wajib dan dapat memicu Prisma/build berat.

## 14. Uji Manual

- `/login`: HTTP 200.
- `/dashboard` tanpa sesi: redirect 307 ke alur autentikasi.
- Browser visual terintegrasi tidak tersedia pada sesi ini.
- Verifikasi visual mobile 390x844/430x932 masih perlu dilakukan manual.

## 17. Revisi 4D.2.1 Mobile Inspector dan Shortcut

Tanggal revisi: 17 Juni 2026.

Perbaikan kecil:

- overlay bottom sheet mobile tidak lagi memakai `backdrop-blur`;
- overlay memakai gelap transparan tipis;
- bottom sheet memakai z-index lebih tinggi dari backdrop dan safe-area bawah;
- shortcut Command Center mobile berubah menjadi grid 2 kolom x 3 baris;
- tablet menjadi 3 kolom x 2 baris;
- desktop tetap 6 kolom x 1 baris;
- label mobile dipendekkan untuk Risiko, Peta, dan Modul;
- tidak ada perubahan data, role, Auth, RBAC, Prisma, database, endpoint, atau source data.

Hasil validasi revisi 4D.2.1:

- `npx tsc --noEmit`: lulus.
- `git diff --check`: lulus.
- `npm run lint`: tidak tersedia.
- Uji HTTP dasar: `/login` 200 dan `/dashboard` tanpa sesi 307.
- Uji visual browser: belum dilakukan karena browser terintegrasi tidak tersedia.

## 18. Finalisasi 4D.2.3 Unified Centered Inspector Modal

Tanggal finalisasi: 17 Juni 2026.

Keputusan UI final:

- desktop dan mobile memakai **Unified Centered Inspector Modal**;
- right inspector tidak lagi menjadi kolom kanan aktif pada layout dashboard;
- `DashboardRightInspector.tsx` tetap dipertahankan sebagai isi modal/detail inspector agar tidak menghapus komponen secara destruktif;
- klik KPI, Command Navigation, Command Brief, Progress, Risk & Approval, Aktivitas, dan Modul Pendukung membuka modal tengah;
- modal memakai posisi `fixed` terhadap viewport sehingga tidak bergantung pada posisi scroll;
- backdrop boleh memakai dim dan `backdrop-blur-sm`;
- blur hanya diterapkan pada layer backdrop, bukan wrapper dashboard dan bukan isi modal;
- isi modal, teks, angka, tombol, dan detail tetap tajam;
- klik backdrop atau tombol close menutup modal;
- tombol Escape menutup modal;
- shortcut Command Center tetap memakai grid responsif `grid-cols-2 sm:grid-cols-3 xl:grid-cols-6`;
- mobile tetap 2 kolom x 3 baris untuk enam shortcut atas;
- tidak ada perubahan data, role, RBAC, Auth, Prisma, database, endpoint, atau source data.

Perubahan implementasi final:

- `CommandCenterOverview` tidak lagi memakai grid 2 kolom `middle area + right inspector`;
- state inspector sekarang membuka modal di desktop dan mobile;
- `DashboardRightInspector` tidak lagi me-render `<aside>` desktop atau bottom sheet mobile;
- `DashboardRightInspector` me-render centered modal dengan backdrop z-index `80` dan modal z-index `90`;
- konten modal memakai scroll internal dengan batas tinggi `86dvh`.

Validasi final 4D.2.3:

- `npx tsc --noEmit`: lulus.
- `git diff --check`: lulus; Git menampilkan peringatan line-ending CRLF pada beberapa file existing, tetapi tidak ada whitespace error.
- `npm run lint`: tidak dijalankan karena `package.json` tidak memiliki script `lint`.

## 19. Revisi 4D.2.3 Modal Dashboard Style Approval Center

Tanggal revisi: 17 Juni 2026.

Tujuan revisi:

- modal inspector dashboard dibuat mengikuti rasa visual Detail Approval pada Approval Center;
- modal tidak lagi terasa seperti popup kecil;
- desktop memakai modal besar terpusat dengan `max-w-3xl`;
- mobile memakai modal terpusat dengan lebar aman `w-[calc(100vw-24px)]` dan `max-w-md`;
- isi modal tetap scroll internal dengan batas tinggi `86dvh`.

Perubahan struktur modal:

- Header: eyebrow, jenis detail, judul, deskripsi, dan tombol close.
- Body: kartu sumber data/status, grid metrik, detail ringkas, dan catatan role/scope.
- Footer: tombol aksi utama ke modul asal, link sekunder, dan tombol tutup.

Aturan visual:

- backdrop memakai `bg-slate-950/45 backdrop-blur-sm`;
- blur hanya berada di layer backdrop;
- isi modal, angka, teks, dan tombol tetap tajam;
- card memakai border lembut, radius besar, dan shadow halus;
- tidak memakai style neon/gaming.

Hal yang tetap dipertahankan:

- Unified Centered Inspector Modal tetap aktif pada desktop dan mobile.
- Right inspector kolom kanan tidak diaktifkan kembali.
- Shortcut Command Center tetap responsif `grid-cols-2 sm:grid-cols-3 xl:grid-cols-6`.
- Data, role-aware behavior, assignment scope, Approval Summary, endpoint, dan source data tidak diubah.

## 20. Revisi 4D.2.3 Behavior Modal Sama dengan Approval Center

Tanggal revisi: 17 Juni 2026.

Fokus revisi:

- behavior modal dashboard disamakan dengan modal Detail Approval pada Approval Center;
- overlay modal menutup seluruh viewport, termasuk sidebar, topbar, konten dashboard, dan mobile navigation;
- modal berada di layer tertinggi dashboard dengan backdrop `z-[100]`, wrapper `z-[110]`, dan konten `z-[120]`;
- backdrop memakai `bg-slate-950/45 backdrop-blur-sm`;
- blur hanya berlaku pada backdrop/background, bukan pada modal dan bukan pada isi modal;
- isi modal tetap tajam, bisa dibaca, dan bisa discroll internal;
- saat modal terbuka, `document.body` dan `document.documentElement` dikunci dengan `overflow: hidden`;
- scroll hanya terjadi pada isi modal dengan `overflow-y-auto overscroll-contain`;
- klik backdrop, tombol close, tombol `Tutup`, dan Escape tetap menutup modal.

Hal yang tidak diubah:

- Approval Center hanya dibaca sebagai referensi, tidak diubah.
- Login, Auth, RBAC, Prisma, database, endpoint Approval, endpoint Bootstrap, endpoint Sync Version, source data, dan menu utama tidak disentuh.
- Unified Centered Inspector Modal tetap menjadi standar dashboard; right inspector kolom kanan tidak diaktifkan kembali.

## 21. Revisi Final Modal Dashboard Sama dengan Approval Center

Tanggal revisi: 17 Juni 2026.

Penyesuaian final:

- shell modal dashboard memakai ulang komponen `Modal` dari `src/components/ui`, komponen yang sama dengan Detail Approval di Approval Center;
- `DashboardRightInspector.tsx` tidak lagi merender shell overlay/modal custom sendiri;
- modal dibungkus `fixed inset-0` dan tidak berada dalam flow halaman dashboard;
- mobile memakai pola bawah-ke-tengah seperti Approval Center: `items-end` lalu `sm:items-center`;
- ukuran modal dashboard memakai `size="lg"` seperti Detail Approval;
- shape modal mengikuti Approval Center: `rounded-t-2xl` pada mobile dan `sm:rounded-2xl` pada desktop;
- header memakai padding `p-4 sm:p-5`, border bawah `border-slate-100`, judul `text-base font-bold text-slate-800`, dan tombol close bulat;
- body memakai `flex-1 overflow-y-auto p-4 sm:p-5` dengan section/card ringkas;
- footer memakai `rounded-b-2xl border-t border-slate-100 bg-slate-50 p-3 sm:p-4`;
- background dikunci dengan scroll lock body/html selama modal terbuka;
- modal dashboard tetap tidak memakai right panel aktif dan tidak mengubah Approval Center.

Validasi yang wajib dijaga:

- klik backdrop menutup modal;
- Escape menutup modal;
- scroll hanya di body modal;
- sidebar, topbar, konten, mobile nav, dan floating button tertutup overlay;
- modal dan teks tetap tajam tanpa blur;
- role-aware, assignment scope, source data, endpoint, Auth, RBAC, Prisma, dan database tidak berubah.

## 22. Audit dan Fix Modal Dashboard Aktif

Tanggal audit dan fix: 17 Juni 2026.

Hasil audit komponen aktif:

- klik item Dashboard pada landing Command Center berasal dari `CommandCenterOverview`;
- state aktif adalah `selectedInspectorId` dan `inspectorModalOpen`;
- komponen modal/detail yang benar-benar muncul adalah `DashboardRightInspector`;
- `DashboardRightInspector` memakai komponen shared `Modal` dari `src/components/ui/index.tsx`;
- modal Detail Approval di Approval Center juga memakai shared `Modal` yang sama;
- karena itu, perbaikan shell dilakukan pada shared `Modal`, bukan membuat modal dashboard custom baru.

File acuan Approval Center:

- `src/app/(dashboard)/approval/page.tsx`
- pola acuan: title `Detail Approval`, body scroll internal, card detail, histori approval, dan area action dalam modal.

Perbedaan sebelum fix:

- shared `Modal` masih memakai `z-50`, sehingga berisiko sejajar atau kalah dari topbar/mobile/floating layer;
- scroll lock belum berada di shared `Modal`;
- `DashboardRightInspector` memiliki scroll lock dan Escape handler sendiri, sehingga behavior dashboard tidak sepenuhnya mengikuti shell modal Approval Center;
- body modal belum memakai `min-h-0`, sehingga pada konten panjang ada risiko footer/area bawah terasa terpotong.

Perbaikan yang dilakukan:

- shared `Modal` dinaikkan ke `z-[100]` dan konten modal ke `z-[110]`;
- shared `Modal` sekarang mengunci `document.body` dan `document.documentElement` selama modal terbuka;
- body modal memakai `min-h-0 flex-1 overflow-y-auto overscroll-contain`;
- tombol close modal diberi `type="button"` dan `aria-label="Tutup modal"`;
- scroll lock dan Escape handler duplikatif di `DashboardRightInspector` dihapus;
- Dashboard dan Approval Center sekarang memakai shell modal yang sama untuk overlay, header, body scroll, footer, close button, dan Escape behavior.

Keputusan:

- panel kanan tidak digunakan sebagai layout aktif;
- Dashboard tetap memakai centered inspector modal;
- Approval Center tidak diubah logic, data, permission, workflow, endpoint, atau source-of-truth;
- perubahan ini hanya memperkuat shell reusable agar modal Dashboard benar-benar sama pola behavior-nya dengan modal Detail Approval.

## 23. Fix Portal, Overlay Global, dan Tinggi Modal

Tanggal revisi: 17 Juni 2026.

Masalah lanjutan dari uji visual:

- sidebar kiri masih terlihat terlalu jelas saat modal Dashboard terbuka;
- overlay belum terasa menutup seluruh aplikasi;
- bagian bawah modal masih berisiko terpotong pada viewport laptop;
- footer/action modal belum terasa nyaman karena tinggi modal terlalu dekat dengan batas viewport.

Hasil audit teknis:

- shared `Modal` sebelumnya masih dirender pada posisi komponen pemanggil;
- karena belum memakai portal ke `document.body`, modal masih berpotensi terpengaruh stacking context parent dashboard;
- topbar memakai `z-50`;
- MobileNav sheet memakai `z-[70]`;
- Project AI Assistant memakai `z-[70]`;
- `DashboardRightInspector` sudah content-only dan tidak lagi membuat overlay, scroll-lock, atau Escape handler sendiri.

Perbaikan implementasi:

- shared `Modal` sekarang memakai `createPortal(..., document.body)`;
- ditambahkan mount guard agar portal hanya dirender di client;
- overlay modal memakai `fixed inset-0 z-[9998] bg-slate-950/55 backdrop-blur-md`;
- wrapper modal memakai `fixed inset-0 z-[9999]`;
- konten modal memakai `relative z-[9999]`;
- scroll lock tetap berada di shared `Modal` untuk `document.body` dan `document.documentElement`;
- tinggi modal diturunkan dari kalkulasi hampir penuh viewport menjadi `max-h-[84dvh]` pada mobile dan `sm:max-h-[82dvh]` pada desktop/tablet;
- body modal tetap `min-h-0 flex-1 overflow-y-auto overscroll-contain`;
- body diberi padding bawah tambahan agar konten terakhir tidak terasa menempel footer;
- footer tetap `shrink-0` di luar body scroll.

Dampak yang diharapkan:

- sidebar, topbar, mobile nav, dan floating layer ikut dim/blur;
- modal tidak terikat stacking context dashboard;
- halaman belakang tidak ikut scroll;
- footer/action modal tetap terlihat dalam tinggi viewport;
- Dashboard dan Approval Center tetap memakai shell modal yang sama.

Hal yang tidak diubah:

- `DashboardRightInspector` tidak mengubah data, role, assignment scope, atau navigasi;
- Approval Center tidak diubah logic, workflow, permission, API, atau source-of-truth;
- login, Auth, RBAC, Prisma, database, endpoint, menu utama, dan source data tidak disentuh.

## 15. Risiko Tersisa

- Shell global tetap memiliki footer; master-detail dibatasi pada komponen landing Ringkasan agar route lain tidak terdampak.
- Tinggi viewport internal perlu pengecekan visual pada perangkat nyata karena tinggi browser chrome berbeda.
- Detail paket inspector menggunakan paket kritis pertama, bukan pemilihan setiap paket individual karena landing belum menampilkan daftar paket.
- Verifikasi visual browser lintas viewport tetap diperlukan.

## 16. Rekomendasi Tahap Berikutnya

1. Uji visual desktop 1366x768 dan 1440x900.
2. Uji mobile 390x844 dan 430x932.
3. Uji PPK, Tim Perencana, Pimpinan/Auditor, dan role assignment terbatas.
4. Jika tinggi viewport perlu tuning, ubah hanya nilai kalkulasi tinggi Command Center, bukan shell global.
