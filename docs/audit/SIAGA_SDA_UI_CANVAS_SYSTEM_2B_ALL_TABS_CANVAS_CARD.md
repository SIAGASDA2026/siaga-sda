# SIAGA-SDA UI-CANVAS-SYSTEM.2B - Standarisasi Canvas dan Card Semua Tab

Tanggal: 22 Juni 2026

## 1. Ringkasan Tahap

Tahap ini memperluas standar visual SIAGA-SDA dari card individual ke canvas/wadah utama pada 11 tab utama serta Halo SIAGA-SDA sebagai floating assistant. Fokus perubahan adalah warna solid lembut, border tegas, dan efek 3D/elevated pada page canvas, panel, filter, table wrapper, form wrapper, empty state, dan card.

Perubahan bersifat visual-only. Tidak ada perubahan logic bisnis, API, Auth, RBAC, Prisma, database, package, login, route/menu utama, Sidebar, MobileNav, seed, atau backend.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/roadmap/ROADMAP_SIAGA_SDA_MENUJU_100_PERSEN.md`
- `docs/audit/SIAGA_SDA_UI_CARD_SYSTEM_1_CANVAS_CARD_STANDARDIZATION.md`
- `docs/audit/SIAGA_SDA_DATA_CONSISTENCY_2_TASK_WARNING_HALO_SOURCE.md`
- `docs/audit/SIAGA_SDA_UI_CARD_SYSTEM_2_SOLID_3D_CARD_STYLE.md`
- `src/app/globals.css`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/peta/page.tsx`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/proyek/page.tsx`
- `src/app/(dashboard)/approval/page.tsx`
- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/administrasi/page.tsx`
- `src/app/(dashboard)/peil/page.tsx`
- `src/app/(dashboard)/asset/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`
- `src/app/(dashboard)/pengaturan/page.tsx`
- `src/components/modules/ModuleLandingPage.tsx`
- `src/components/navigation/SubfeatureEntryPoints.tsx`
- `src/components/project/ProjectScopeFilters.tsx`
- `src/components/ui/index.tsx`
- `src/components/dashboard/TideDashboardPanel.tsx`
- `src/components/dashboard/DashboardRightInspector.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`
- `package.json`

## 3. File yang Diubah

- `src/app/globals.css`
- `src/app/(dashboard)/peta/page.tsx`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/proyek/page.tsx`
- `src/app/(dashboard)/approval/page.tsx`
- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`
- `src/app/(dashboard)/pengaturan/page.tsx`
- `src/components/modules/ModuleLandingPage.tsx`
- `src/components/navigation/SubfeatureEntryPoints.tsx`
- `src/components/project/ProjectScopeFilters.tsx`
- `src/components/ui/index.tsx`
- `src/components/dashboard/TideDashboardPanel.tsx`
- `src/components/dashboard/DashboardRightInspector.tsx`

## 4. File Baru

- `docs/audit/SIAGA_SDA_UI_CANVAS_SYSTEM_2B_ALL_TABS_CANVAS_CARD.md`

## 5. Backup Dibuat

Backup dibuat di:

`backup/backup-ui-canvas-system-2b-all-tabs-before-change/`

File backup:

- `globals.css`
- `ModuleLandingPage.tsx`
- `SubfeatureEntryPoints.tsx`
- `ProjectScopeFilters.tsx`
- `ui-index.tsx`
- `peta-page.tsx`
- `survey-page.tsx`
- `proyek-page.tsx`
- `approval-page.tsx`
- `surat-page.tsx`
- `audit-log-page.tsx`
- `pengaturan-page.tsx`
- `TideDashboardPanel.tsx`
- `DashboardRightInspector.tsx`
- `SIAGA_SDA_UI_CANVAS_SYSTEM_2B_ALL_TABS_CANVAS_CARD.md`

## 6. 11 Tab Utama yang Diaudit

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

Tambahan: Halo SIAGA-SDA diaudit sebagai floating assistant, bukan tab/menu utama.

## 7. Canvas/Panel yang Distandarkan

Utility canvas baru/ditingkatkan:

- `siaga-page-canvas`
- `siaga-section-canvas`
- `siaga-section-canvas-muted`
- `siaga-panel-canvas`
- `siaga-table-canvas`
- `siaga-form-canvas`
- `siaga-filter-canvas`
- `siaga-empty-canvas`

Area yang dipakaikan standar:

- page background/wadah halaman;
- panel landing module;
- filter panel;
- table/list wrapper;
- panel form/pengaturan;
- panel empty state;
- subfeature entry point;
- module preparation panel.

## 8. Card yang Distandarkan

Utility card yang dipakai:

- `siaga-card`
- `siaga-card-compact`
- `siaga-card-interactive`
- `siaga-card-info`
- `siaga-card-warning`
- `siaga-card-critical`
- `siaga-card-success`
- `siaga-card-recommendation`
- `siaga-card-neutral`

Card interactive tetap hanya untuk elemen yang memang clickable atau selectable.

## 9. Utility Global yang Dibuat/Dipakai

`src/app/globals.css` diperluas dengan utility canvas berikut:

- `siaga-page-canvas`: background halaman water tint.
- `siaga-panel-canvas`: panel utama elevated.
- `siaga-table-canvas`: wrapper tabel/list elevated.
- `siaga-form-canvas`: wrapper form/pengaturan.
- `siaga-filter-canvas`: wrapper filter.
- `siaga-empty-canvas`: empty state yang tidak datar.

Juga ditambahkan selector kombinasi agar `siaga-panel-canvas` tetap menghormati varian warna seperti `siaga-card-warning`, `siaga-card-info`, dan varian lain.

## 10. Warna Solid per Fungsi

- Info/umum: biru/cyan lembut.
- Warning/perhatian: amber/krem solid.
- Critical/terlambat: merah/salmon lembut.
- Recommendation/tindak lanjut: tosca/cyan.
- Success/aman: hijau lembut.
- Neutral/empty state: slate/putih kebiruan.

Warna dibuat lebih solid daripada putih polos, tetapi tetap profesional dan tidak ramai.

## 10A. Revisi Tambahan User: Semua Card Mengikuti Warna Halo SIAGA-SDA

Revisi tambahan user menegaskan bahwa semua card pada 11 tab utama harus terasa seperti card Halo SIAGA-SDA: berwarna lembut, solid, punya border jelas, dan memiliki efek elevated/3D. Canvas utama, panel besar, table wrapper, dan form wrapper tetap boleh lebih netral agar tidak membuat halaman terlalu ramai.

Penyesuaian tambahan:

- default `government-card`, `siaga-card`, `siaga-card-compact`, dan `siaga-card-interactive` tidak lagi dominan putih polos;
- hover card interaktif memakai tint cyan/biru, bukan kembali ke putih;
- `siaga-card-neutral` tetap netral tetapi diberi tint slate/cyan;
- card pasang surut, aktivitas, warning, modal approval, dan detail inspector dashboard memakai varian warna `siaga-card-info`, `siaga-card-warning`, `siaga-card-critical`, `siaga-card-success`, `siaga-card-recommendation`, atau `siaga-card-neutral`;
- chip, select, input, header gelap, overlay, dan table row hover tidak dipaksa menjadi card berwarna karena fungsinya adalah kontrol/indikator kecil, bukan surface card utama.

Daftar tab yang card-nya sudah diberi warna melalui utility global dan patch tambahan:

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

Area yang tetap lebih netral:

- canvas halaman dan panel besar: menjaga hierarchy agar card berwarna tetap menonjol;
- table wrapper dan table row: menjaga keterbacaan data;
- filter/select/input: menjaga pola kontrol form;
- chip/badge kecil: status ringkas tetap ringan dan tidak bersaing dengan card utama;
- modal/shell yang sudah final: hanya inner card yang diselaraskan, bukan behavior modal.

Risiko yang dikurangi:

- card tidak lagi tampak seperti panel putih datar;
- perbedaan antara canvas, panel, card, dan kontrol lebih jelas;
- tampilan lintas tab lebih konsisten dengan Halo SIAGA-SDA;
- perubahan tetap visual-only dan tidak mengubah logic role, filter, data, API, atau route.

## 11. Efek Border/3D/Elevasi

Standar yang diterapkan:

- border minimal 1px lebih terlihat;
- shadow bawah soft multi-layer;
- inset highlight atas;
- inset edge bawah pada card;
- radius konsisten;
- hover lift hanya pada card interaktif;
- `min-width: 0` tetap dipakai untuk mencegah overflow horizontal.

## 12. Dampak ke Dashboard

Dashboard sudah banyak memakai utility UI-CARD-SYSTEM.1. Tahap ini memperkuat dampaknya melalui:

- utility global yang lebih kuat;
- `ProjectScopeFilters` yang kini memakai `siaga-filter-canvas`;
- `EmptyState` global yang kini memakai `siaga-empty-canvas`.

Dashboard modal 4D.2, overlay blur/dim, route, role-aware behavior, dan source data tidak disentuh.

## 13. Dampak ke Peta Monitoring

Perubahan:

- page memakai `siaga-page-canvas`;
- layer panel memakai `siaga-panel-canvas`;
- filter peta memakai `siaga-filter-canvas`;
- map wrapper memakai `siaga-table-canvas`;
- detail panel memakai `siaga-panel-canvas`;
- stat card peta memakai `siaga-card-interactive`.

Peta interaktif, marker, layer, filter, route, dan logic Leaflet tidak diubah.

## 14. Dampak ke Survey Investigasi

Perubahan:

- page memakai `siaga-page-canvas`;
- filter scope dan query memakai canvas filter;
- KPI survey memakai `siaga-card-compact`;
- panel proyek belum survey memakai warning canvas;
- item survey memakai `siaga-card-interactive`;
- metadata kecil di dalam card memakai `siaga-card-compact`;
- empty state mengikuti `siaga-empty-canvas`.

Logic survey, foto, filter URL, role create, dan modal form tidak diubah.

## 15. Dampak ke Paket Pekerjaan

Perubahan:

- page memakai `siaga-page-canvas`;
- header workspace memakai `siaga-section-canvas`;
- nilai kontrak aktif memakai `siaga-card-compact`;
- filter paket memakai `siaga-filter-canvas`;
- table wrapper desktop memakai `siaga-table-canvas`;
- stat card paket memakai `siaga-card-compact`.

Logic paket, CRUD, filter, assignment scope, route detail, dan source-origin tidak diubah.

## 16. Dampak ke Approval Center

Perubahan:

- page memakai `siaga-page-canvas`;
- query filter chip memakai `siaga-filter-canvas`;
- akses dibatasi memakai warning panel;
- stat approval memakai `siaga-card-compact`;
- daftar approval memakai `siaga-table-canvas`;
- item approval memakai `siaga-card-interactive`;
- loading/empty state memakai `siaga-empty-canvas`.

Endpoint Approval, GET read-only, polling, canAct, tombol approve/revisi/tolak, dan summary approval tidak diubah.

## 17. Dampak ke Surat Masuk & Keluar

Perubahan:

- shell module tetap lewat `ModuleLandingPage`;
- workflow surat memakai `siaga-section-canvas` dan `siaga-panel-canvas`;
- timeline/status/kategori/tindak lanjut memakai varian card;
- contoh konseptual memakai warning canvas;
- route resmi tetap sama.

Tidak ada form Surat resmi, API Surat, database Surat, atau data palsu resmi.

## 18. Dampak ke Administrasi

Administrasi terdampak melalui:

- `ModuleLandingPage` dengan `siaga-page-canvas`;
- card ringkasan dengan `siaga-card-interactive siaga-card-info`;
- subfeature entry point dengan `siaga-panel-canvas`;
- preparation warning dengan `siaga-panel-canvas siaga-card-warning`.

Logic permission Administrasi dan route Pengguna/Pengaturan/Audit Log tidak diubah.

## 19. Dampak ke Peil Banjir

Peil Banjir terdampak melalui `ModuleLandingPage`:

- landing canvas lebih jelas;
- card persiapan lebih elevated;
- checklist tahap lanjut menjadi sub-card;
- badge persiapan tetap jujur.

Tidak ada aktivasi role khusus Peil, API, database, atau migration.

## 20. Dampak ke Asset SDA

Asset SDA terdampak melalui `ModuleLandingPage`:

- landing canvas lebih jelas;
- card asset/operasional persiapan lebih solid;
- checklist tahap lanjut lebih terbaca.

Tidak ada perubahan data asset, operasional, route, role mandor, atau source data.

## 21. Dampak ke Audit Log

Perubahan:

- page memakai `siaga-page-canvas`;
- akses terbatas memakai `siaga-empty-canvas`;
- KPI audit memakai `siaga-card-compact`;
- filter log memakai `siaga-filter-canvas`;
- item log memakai `siaga-card-compact`;
- empty state memakai `siaga-empty-canvas`.

Mechanism audit log, action metadata, permission guard, dan data store tidak diubah.

## 22. Dampak ke Pengaturan

Perubahan:

- page memakai `siaga-page-canvas`;
- tab/sidebar pengaturan memakai `siaga-panel-canvas`;
- preview user memakai `siaga-card-compact`;
- panel Profil/Notifikasi/Tampilan/Keamanan memakai `siaga-form-canvas`;
- row notifikasi/tampilan memakai `siaga-card-compact`.

Tidak ada perubahan Auth, password backend, role, permission, atau preference persistence besar.

## 23. Dampak ke Halo SIAGA-SDA

Halo SIAGA-SDA sudah memakai utility card/canvas dari tahap sebelumnya. Tahap ini memperkuat tampilannya melalui utility global yang sama:

- canvas besar tetap;
- body scroll internal tetap;
- footer tombol tetap;
- card warning/rekomendasi tetap konseptual;
- filter aktif dan daftar peringatan tetap role-aware;
- logic DATA-CONSISTENCY.2 tidak diubah.

Halo tetap floating assistant, bukan tab/menu utama.

## 24. Tab/Area yang Belum Penuh dan Alasan

- Beberapa modal internal dan form detail masih memakai class manual agar tidak mengubah behavior modal/form yang sudah stabil.
- Tabel yang kompleks tidak dirombak total agar tidak memicu regresi layout.
- Halaman non-11-menu seperti Laporan, Kontrak, Masalah, Chat, Pengguna, dan Pengumuman tidak menjadi target utama tahap ini, kecuali efek tidak langsung dari shared component.
- Cek visual manual browser belum menggantikan audit kode; tetap perlu verifikasi layar nyata.

## 25. Risiko yang Dikurangi

- Tab utama tidak lagi terasa terlalu datar.
- Canvas dan card lebih mudah dibedakan.
- Filter/tabel/list/empty state lebih terlihat sebagai area kerja.
- Landing modul persiapan lebih konsisten.
- Penggunaan utility global mengurangi kebutuhan class manual baru.

## 26. Risiko Tersisa

- Karena perubahan lintas tab bersifat visual, masih perlu cek manual desktop dan mobile.
- Ada kemungkinan beberapa warna manual lama masih terlihat pada modal/detail kecil.
- Build penuh tidak dijalankan pada tahap ini jika dianggap berat.
- Beberapa page non-menu utama masih punya panel datar dan perlu tahap terpisah jika ingin distandarkan penuh.

## 27. Validasi yang Dijalankan

- `git diff --check`: lulus.
- `npx.cmd tsc --noEmit`: lulus.
- `npm run lint`: tidak tersedia pada `package.json`.
- `npm run build`: tidak dijalankan jika dianggap berat, karena tahap ini visual CSS/TSX terbatas.

## 28. Rekomendasi Tahap Berikutnya

- Lakukan cek visual manual pada 11 tab utama dan Halo SIAGA-SDA.
- Jika ada area non-menu utama yang masih terlalu datar, kerjakan tahap khusus terpisah.
- Jangan lanjut refactor besar sebelum user menyetujui tampilan canvas/card baru.

## 29. Saran Commit Message

`style: standarkan canvas dan card semua tab`

## 30. Revisi UI-CANVAS-SYSTEM.2C Setelah Cek Visual User

Revisi 2C dilakukan setelah cek visual user menemukan bahwa tahap 2B sudah kuat pada canvas/panel, tetapi sebagian card utama di 11 tab masih terasa terlalu putih, netral, atau seragam dan belum mengikuti karakter card Halo SIAGA-SDA.

Prinsip revisi:

- Halo SIAGA-SDA dipakai sebagai referensi visual card berwarna.
- Canvas/panel besar tetap boleh netral agar layout tidak terlalu ramai.
- Card data, card ringkasan, list item, quick action, dan sub-card diberi varian kategori.
- Tidak ada perubahan data, role-aware logic, route, API, database, Prisma, Auth, login, Sidebar, atau MobileNav.

Mapping warna yang diperkuat:

- `siaga-card-info`: total, aktif, lokasi, peta, paket, status SDA, dan data utama.
- `siaga-card-warning`: pending, perhatian, persiapan, verifikasi, disposisi, dan fallback.
- `siaga-card-critical`: kritis, deviasi, risiko, problem, rejected, dan respon mendesak.
- `siaga-card-recommendation`: tindak lanjut, rekomendasi, quick action, modul pendukung, dan insight.
- `siaga-card-success`: selesai, approved, aman, normal, dan tugas selesai.
- `siaga-card-neutral`: empty state, arsip, placeholder, dan aktivitas konservatif.

Tab dan area yang mendapat penguatan card 2C:

- Dashboard: navigasi tab, indikator utama, filter ringkas, akses cepat role, detailed summary, Command Brief tambahan, alert, paket/anggaran, Status SDA, Peta Monitoring ringkas, tugas per role, aktivitas, monitoring, approval, survey, warning, insight lokal, Waktu & Salat.
- Peta Monitoring: ringkasan marker, warning, tide, dan detail peta sudah mengikuti varian 2B.
- Survey Investigasi: KPI, detail survey, dan card status tetap memakai varian tahap 2B; card survey Dashboard juga diperkuat 2C.
- Paket Pekerjaan: stat card, mobile package card, detail panel, dokumen, deviasi, dan link detail memakai varian 2C.
- Approval Center: modal/detail dan ringkasan tetap mengikuti varian 2B; Dashboard approval summary diperkuat 2C.
- Surat Masuk & Keluar: workflow, kategori, tindak lanjut, dan ModuleLandingPage diperkuat agar card persiapan tidak netral semua.
- Administrasi: card landing, subfeature, role access, form Pengaturan, dan row preferensi memakai varian.
- Peil Banjir: card permohonan aktif dipetakan sebagai info; verifikasi sebagai warning; rekomendasi terbit sebagai success/recommendation.
- Asset SDA: card asset aktif sebagai info; perlu respon sebagai critical/warning; laporan sebagai recommendation.
- Audit Log: KPI audit dan item log memakai tone sesuai action.
- Pengaturan: profil, notifikasi, tampilan, keamanan, role access, dan assignment panel memakai varian kategori.

Area yang sengaja tetap netral:

- Canvas/page background tetap netral kebiruan agar card berwarna tetap fokus.
- Tabel besar tetap memakai `siaga-table-canvas` dan row halus agar keterbacaan data tidak turun.
- Badge kecil/filter chip tidak semuanya dijadikan card agar UI tidak terlalu padat.
- Modal dan shell final yang sudah stabil tidak dirombak.

Risiko yang dikurangi:

- Card lintas tab tidak lagi tampak putih/flat.
- Semua card tidak lagi memiliki warna yang sama.
- Fokus visual lebih jelas antara data utama, warning, critical, recommendation, success, dan neutral.
- Area Halo, Dashboard, dan modul utama lebih konsisten.

Validasi revisi 2C:

- `git diff --check`: lulus setelah revisi.
- `npx.cmd tsc --noEmit`: lulus setelah revisi.
- `npm run lint`: tidak tersedia pada `package.json` jika tetap tidak ada script lint.
- `npm run build`: tidak dijalankan karena user meminta revisi kecil visual dan tidak meminta build penuh.

Saran commit message tetap:

`style: standarkan warna card semua tab dengan halo`
