# SIAGA-SDA RBAC-GLOBAL.6 - Permission Granular Pengaturan

## 1. Ringkasan Tahap

Tahap RBAC-GLOBAL.6 menambahkan permission granular untuk area Pengaturan tanpa mengubah route, UI, database, schema Prisma, middleware, Auth, atau role besar. Perubahan dibuat sebagai fondasi permission yang lebih eksplisit agar pengaturan personal, pengaturan sistem, master data, role, permission, assignment, dan sistem inti tidak terus tercampur dalam satu permission umum.

Tahap ini tidak mengaktifkan menu baru, tidak membuat halaman baru, dan tidak mengubah behavior halaman Pengaturan yang sudah ada.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_5_AUDIT_PENGATURAN_PERSONAL_MASTER_SYSTEM.md`
- `src/lib/rbac.ts`
- `src/lib/navigation.ts`
- `src/app/(dashboard)/pengaturan/page.tsx`
- `src/app/(dashboard)/pengguna/page.tsx`
- `package.json`

## 3. File yang Diubah

- `src/lib/rbac.ts`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_6_PERMISSION_GRANULAR_PENGATURAN.md`

## 4. Backup

Backup dibuat sebelum perubahan source:

- Folder: `backup/backup-rbac-global-6-before-change/`
- File: `backup/backup-rbac-global-6-before-change/rbac.ts`

## 5. Permission Baru

Permission granular yang ditambahkan:

| Permission | Role penerima awal | Tujuan |
| --- | --- | --- |
| `view_profile_settings` | Semua role existing | Membaca pengaturan profil, notifikasi, tampilan, dan keamanan akun sendiri. |
| `view_system_settings` | `super_admin` | Membaca pengaturan sistem secara terbatas. Dibuat konservatif sampai UI read-only resmi tersedia. |
| `manage_master_data` | `super_admin`, `admin` | Fondasi pengelolaan master data ketika modul resmi tersedia. |
| `manage_roles` | `super_admin` | Fondasi pengelolaan role sistem. |
| `manage_permissions` | `super_admin` | Fondasi pengelolaan permission granular sistem. |
| `manage_assignments` | `super_admin`, `admin` | Fondasi pengelolaan penugasan user ke paket, kegiatan, atau modul. |
| `manage_system_settings` | `super_admin` | Fondasi pengubahan pengaturan sistem inti. |

Catatan konservatif: `view_system_settings` belum diberikan ke `pimpinan` atau `auditor` karena belum ada UI Pengaturan Sistem read-only yang bisa dibuktikan aman dan scoped.

## 6. Permission yang Tidak Diubah

Permission existing berikut sengaja dipertahankan:

- `view_settings`
- `manage_users`
- `manage_admin_users`
- `manage_asset_sda`

`view_settings` tetap menjadi permission route `/pengaturan` agar semua role yang sebelumnya bisa membuka pengaturan personal tetap tidak kehilangan akses.

`manage_users` tetap menjadi permission route `/pengguna` agar User Management tidak ikut berubah pada tahap ini.

## 7. Route Mapping Sebelum dan Sesudah

Tidak ada perubahan route mapping.

| Route | Permission sebelum | Permission sesudah | Status |
| --- | --- | --- | --- |
| `/pengaturan` | `view_settings` | `view_settings` | Tidak diubah |
| `/pengguna` | `manage_users` | `manage_users` | Tidak diubah |

## 8. Alasan `/pengaturan` Tidak Diubah

Halaman `/pengaturan` saat ini berisi pengaturan personal:

- Profil Saya
- Notifikasi
- Tampilan
- Keamanan

Karena halaman ini masih personal, route tetap memakai `view_settings`. Mengubah route `/pengaturan` menjadi permission sistem seperti `view_system_settings` akan berisiko memblokir user biasa dari pengaturan akunnya sendiri.

## 9. Dampak Role

Role existing tetap berjalan seperti sebelumnya untuk halaman Pengaturan dan Pengguna.

Dampak tahap ini hanya berupa penambahan permission metadata:

- Semua role tetap bisa membuka pengaturan personal melalui `view_settings`.
- `super_admin` mendapat permission sistem dan pengelolaan penuh.
- `admin` mendapat fondasi untuk `manage_master_data` dan `manage_assignments`.
- Role baru seperti `admin_surat`, `admin_peil_banjir`, `admin_asset`, mandor, dan petugas tidak diaktifkan pada tahap ini.

## 10. Risiko yang Dikurangi

- Pengaturan personal tidak lagi secara konsep bercampur dengan pengaturan sistem.
- Pengelolaan user tidak lagi harus menjadi satu-satunya permission administratif.
- Fondasi permission untuk master data, assignment, role, permission, dan system settings sudah tersedia tanpa memaksa UI baru.
- Risiko user biasa terkunci dari pengaturan personal dihindari karena `/pengaturan` tetap memakai `view_settings`.

## 11. Risiko Tersisa

- UI Pengaturan Sistem resmi belum dibuat.
- Permission granular baru belum dipakai oleh route atau tombol runtime.
- Pembagian read-only Pengaturan Sistem untuk `pimpinan` dan `auditor` perlu tahap khusus setelah UI terbukti aman.
- Role baru terkait surat, peil, asset, dan operasional belum diaktifkan.
- Belum ada audit khusus untuk tombol/aksi master data karena UI resminya belum tersedia.

## 12. Validasi

Validasi yang diwajibkan tahap ini:

- `npx tsc --noEmit`
- `git diff --check`

`npm run lint` tidak tersedia di `package.json`.

`npm run build` tidak dijalankan karena tahap ini hanya perubahan RBAC metadata dan dokumen, tanpa perubahan UI/runtime berat.

## 13. Rekomendasi Tahap Berikutnya

Tahap berikutnya sebaiknya tetap bertahap:

1. Audit UI Pengaturan untuk memisahkan Pengaturan Personal dan Pengaturan Sistem.
2. Buat mapping tombol/aksi master data sebelum menghubungkan permission granular baru ke UI.
3. Tambahkan guard tombol berbasis `manage_master_data`, `manage_assignments`, `manage_roles`, `manage_permissions`, dan `manage_system_settings` hanya setelah UI resmi tersedia.
4. Pertimbangkan `view_system_settings` untuk `pimpinan` dan `auditor` hanya jika kontennya benar-benar read-only dan tidak membuka data lintas scope.

