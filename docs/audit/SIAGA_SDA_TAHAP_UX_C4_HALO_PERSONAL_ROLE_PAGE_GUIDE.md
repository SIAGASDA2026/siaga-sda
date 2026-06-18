# SIAGA-SDA Tahap UX-C4 - Halo Personal Role Page Guide

## 1. Ringkasan Tujuan

Tahap UX-C4 memperkaya panel Halo SIAGA-SDA agar tidak hanya menjadi pintasan bantuan, tetapi juga memberi sapaan personal, panduan fungsi role, panduan halaman aktif, batasan akses, dan arahan langkah berikutnya.

Halo tetap bersifat panduan lokal. Komponen ini tidak membaca AI eksternal, tidak menulis database, tidak menjalankan API resmi, dan tidak mengubah data aplikasi.

## 2. Commit Acuan

Commit acuan:

```text
021e534 fix: filter halo berdasarkan akses role
```

Tahap ini dikerjakan setelah RBAC-GLOBAL.2 sehingga filtering FAQ dan akses modul tetap mengikuti `canAccessPage`.

## 3. Masalah / Lanjutan UX-C3 dan RBAC-GLOBAL.2

Sebelum UX-C4, Halo sudah memiliki filter FAQ berbasis role dan route, tetapi belum cukup menjelaskan:

- siapa user yang sedang masuk;
- apa fungsi role user;
- apa fungsi halaman aktif;
- apa yang boleh dilihat dan dilakukan;
- kenapa menu Peil, Surat, Approval, atau Manajemen Pengguna tidak muncul;
- batas bahwa Halo masih panduan lokal dan bukan sumber data resmi.

## 4. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_1_AUDIT_ROLE_PRISMA_FRONTEND_PENDING.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_2_FRONTEND_GUARD_PENDING_ROLES.md`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/store/useAppStore.ts`

## 5. File yang Diubah

- `src/components/ai/ProjectAiAssistant.tsx`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C4_HALO_PERSONAL_ROLE_PAGE_GUIDE.md`

## 6. Helper / Type yang Ditambahkan

Pada `ProjectAiAssistant.tsx` ditambahkan type dan helper frontend-only:

- `HaloRoleGuide`
- `HaloPageGuide`
- `getHaloRoleGuide()`
- `getPageGuide()`

Helper hanya membaca `pathname` dan object user dari store. Helper tidak membaca database, tidak melakukan fetch API, dan tidak membuat data resmi baru.

## 7. Backup

Backup dibuat di:

```text
backup/backup-ux-c4-halo-personal-role-page-guide-before-change/
```

File backup:

- `ProjectAiAssistant.tsx`
- `BACKUP_FILE_LIST.md`

## 8. Sapaan Personal

Halo sekarang menampilkan sapaan personal menggunakan nama user dari store:

```text
Halo, [Nama User]. Anda masuk sebagai [Role] - [Jabatan].
```

Data sensitif seperti NIP, email, token, password, atau detail session tidak ditampilkan.

## 9. Panduan Role

Panel `Panduan Role Saya` ditambahkan untuk menjelaskan:

- fokus kerja role;
- data/menu yang boleh dilihat;
- aksi yang boleh dilakukan;
- batasan role.

Role yang diberi panduan eksplisit mencakup admin, admin sub kegiatan, kabid, pimpinan, PPK, PPTK, direksi teknis, pejabat pengadaan, PPHP, tim perencanaan, tim survey, tim pengawasan, konsultan, kontraktor, auditor, dan role Peil frontend-only.

## 10. Panduan Halaman Aktif

Panel `Panduan Halaman Aktif` ditambahkan berdasarkan route aktif, antara lain:

- Dashboard
- Peta Monitoring
- Survey Investigasi
- Paket Pekerjaan
- Approval Center
- Surat Masuk & Keluar
- Peil Banjir
- Asset SDA
- Audit Log
- Manajemen Pengguna
- Pengaturan
- Administrasi

Setiap halaman menjelaskan fungsi halaman, hal yang bisa dilakukan, langkah berikutnya, dan batasan akses.

## 11. Route / Role Access Guard

UX-C4 tetap memakai `canAccessPage` dari `src/lib/rbac.ts`.

Guard RBAC-GLOBAL.2 tetap dipertahankan:

- Peil hanya tampil jika user boleh mengakses `/peil`;
- Surat hanya tampil jika user boleh mengakses `/surat`;
- Approval hanya tampil jika user boleh mengakses `/approval`;
- Manajemen Pengguna hanya tampil jika user boleh mengakses `/pengguna`;
- FAQ lama tetap difilter melalui `HALO_FAQ_ITEMS`.

Panel `Mengapa Menu Tidak Muncul?` hanya menjelaskan hasil guard frontend. Panel ini tidak membuka akses baru dan tidak mengubah RBAC runtime.

## 12. Check Tim Perencana

Untuk role Tim Perencana, panduan menegaskan:

- fokus pada survey investigasi, data lapangan, rekomendasi teknis awal, dan bahan perencanaan;
- akses Peil, Surat, Approval formal, dan Manajemen User tidak diasumsikan tampil;
- menu yang tidak muncul dijelaskan sebagai hasil role, permission, atau assignment.

Tidak ada permission tambahan diberikan ke Tim Perencana.

## 13. Check Admin / PPK / PPTK

Untuk Admin, PPK, dan PPTK, Halo memberi panduan sesuai peran:

- Admin: operasional sistem dan data sesuai kewenangan;
- PPK: pengendalian paket, risiko, review, dan approval jika tombol resmi tersedia;
- PPTK: pelaksanaan teknis, laporan, progress, survey, dan tindak lanjut sesuai assignment.

Tidak ada aksi tulis baru dibuat dari panel Halo.

## 14. Check Mobile / Desktop

Panel Halo tetap menggunakan modal ringan di kanan bawah desktop dan panel bawah pada mobile.

Perubahan layout:

- lebar desktop diperbesar secara terbatas agar teks panduan terbaca;
- mobile tetap memakai `w-[calc(100vw-1rem)]`;
- konten panjang tetap berada dalam `overflow-y-auto`;
- tidak ada horizontal overflow yang disengaja;
- footer `Tutup Halo SIAGA-SDA` tetap berada di luar body scroll.

## 15. Hal yang Tidak Disentuh

Tahap UX-C4 tidak menyentuh:

- halaman login;
- Auth / NextAuth;
- middleware;
- Prisma schema;
- migration;
- database;
- seed;
- package / dependency;
- endpoint Approval;
- endpoint Bootstrap;
- endpoint Sync Version;
- Dashboard modal 4D.2;
- shared modal;
- Approval runtime;
- RBAC runtime.

## 16. Validasi

Validasi yang ditargetkan:

- `git diff --check`
- `npx.cmd tsc --noEmit`

`npm run lint` dijalankan hanya jika script lint tersedia.

## 17. Risiko Tersisa

- Halo masih memakai mapping frontend-local, bukan sumber SOP resmi.
- Role Peil frontend-only tetap belum aktif Prisma/database.
- Beberapa role final blueprint belum seluruhnya ada sebagai akun seed runtime.
- Panduan halaman tidak menggantikan authorization backend.
- Jika route/permission berubah pada tahap berikutnya, mapping Halo perlu disesuaikan.

## 18. Rekomendasi Lanjut

Tahap berikutnya yang aman:

- review visual singkat mobile/desktop Halo setelah UX-C4;
- sinkronisasi copy Halo dengan SOP resmi setelah dokumen SOP disetujui;
- jangan menghubungkan Halo ke data resmi sebelum ada desain API, scope, dan audit trail yang jelas.

Saran commit message:

```text
feat: perkaya halo siaga sda dengan panduan role halaman
```
