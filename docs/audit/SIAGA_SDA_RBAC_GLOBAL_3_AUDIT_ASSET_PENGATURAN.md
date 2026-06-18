# SIAGA-SDA RBAC-GLOBAL.3 - Audit Asset SDA & Pengaturan

## 1. Ringkasan

Tahap RBAC-GLOBAL.3 melakukan audit read-only terhadap akses menu dan route **Asset SDA** serta **Pengaturan** setelah finalisasi Halo SIAGA-SDA.

Ruang lingkup tahap ini:

- audit route `/asset`, `/pengaturan`, dan `/pengguna`;
- audit permission aktual di `src/lib/rbac.ts`;
- audit keterhubungan menu di `src/lib/navigation.ts`, `Sidebar`, dan `MobileNav`;
- audit risiko role-aware terhadap Asset SDA dan Pengaturan;
- menyusun rekomendasi implementasi bertahap tanpa mengubah runtime.

Tahap ini tidak mengubah source runtime, Prisma schema, database, Auth, RBAC runtime, Halo SIAGA-SDA, Dashboard, Approval, Bootstrap, Sync Version, atau halaman login.

## 2. Status Acuan

| Item | Status |
|---|---|
| Commit acuan | `1ce8c1a docs: lock final halo siaga sda` |
| Halo SIAGA-SDA | Final lock, tidak disentuh |
| Dashboard modal 4D.2 | Final, tidak disentuh |
| Login | Final/locked, tidak disentuh |
| Prisma schema | Tidak diubah |
| Migration/database | Tidak dijalankan dan tidak diubah |
| RBAC runtime | Hanya diaudit, tidak diubah |
| Source runtime | Tidak diubah |

## 3. File yang Dibaca

Dokumen:

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_HALO_FINAL_LOCK.md`
- `docs/audit/SIAGA_SDA_UX_C5_FINAL_QA_LOCK_HALO.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_1_AUDIT_ROLE_PERMISSION_MENU_HALO.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_2_FIX_HALO_ROLE_AWARE_SUGGESTIONS.md`
- `docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md`
- `docs/modules/SIAGA_SDA_ASSET_UI.md`
- `docs/roles/SIAGA_SDA_ADMIN_SYSTEM_UI.md`
- `docs/roles/SIAGA_SDA_ADMIN_SUB_KEGIATAN_UI.md`
- `docs/roles/SIAGA_SDA_MANDOR_OPERASIONAL_UI.md`

Source yang diaudit:

- `src/lib/rbac.ts`
- `src/lib/navigation.ts`
- `src/lib/roles.ts`
- `src/types/index.ts`
- `src/store/useAppStore.ts`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/dashboard/DashboardRoleHeader.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/app/(dashboard)/asset/page.tsx`
- `src/app/(dashboard)/pengaturan/page.tsx`
- `src/app/(dashboard)/pengguna/page.tsx`

## 4. Backup

Tidak ada backup source yang diperlukan pada tahap ini karena perubahan hanya menambah dokumen audit baru.

Jika tahap berikutnya mulai mengubah source runtime, backup wajib dibuat sebelum edit sesuai folder tahap terkait.

## 5. File yang Dibuat/Diubah

File dibuat:

- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_3_AUDIT_ASSET_PENGATURAN.md`

File runtime/source yang diubah:

- Tidak ada.

## 6. Kondisi Aktual Asset SDA

Route `/asset` sudah tersedia dan tampil sebagai halaman modul Asset SDA. Namun implementasi saat ini masih berupa landing/shell konseptual:

- belum membaca tabel Asset SDA resmi;
- angka ringkasan masih `0`;
- tombol utama diarahkan ke `/peta`;
- checklist menyebut peta, status operasi, histori, dan relasi aset;
- belum ada permission khusus Asset SDA.

Pada RBAC aktual, route `/asset` menggunakan:

```ts
'/asset': 'view_map'
```

Permission `view_map` diberikan ke `ALL_ROLES`. Artinya Asset SDA saat ini ikut terbuka mengikuti izin Peta Monitoring, bukan izin Asset SDA yang spesifik.

## 7. Kondisi Aktual Pengaturan

Route `/pengaturan` sudah tersedia dan saat ini berisi pengaturan personal:

- Profil Saya;
- Notifikasi;
- Tampilan;
- Keamanan.

Route `/pengaturan` memakai permission:

```ts
'/pengaturan': 'view_settings'
```

Permission `view_settings` diberikan ke `ALL_ROLES`. Ini masih dapat diterima jika `/pengaturan` tetap terbatas pada pengaturan personal akun. Risiko muncul jika master data, role management, user management, parameter sistem, atau konfigurasi teknis dimasukkan ke halaman yang sama tanpa guard tab/per-section.

Route `/pengguna` sudah tersedia sebagai subfitur Pengaturan dan memakai permission:

```ts
'/pengguna': 'manage_users'
```

Selain guard route, halaman `/pengguna` juga melakukan guard UI internal dengan `hasPermission(currentUser.role, 'manage_users')`. Ini lebih aman dibanding `/pengaturan` karena akses user management tidak ikut terbuka hanya karena user memiliki `view_settings`.

## 8. Audit Asset SDA

| Item | Kondisi Sekarang | Risiko | Rekomendasi |
|---|---|---|---|
| Route `/asset` | Ada, berupa shell/landing Asset SDA | User dapat mengira modul sudah memiliki data resmi | Pertahankan label persiapan sampai tabel/workflow Asset resmi siap |
| Permission route | Menggunakan `view_map` | Asset dan Peta Monitoring tercampur, role yang boleh lihat peta otomatis melihat Asset | Tambahkan permission khusus `view_asset_sda` pada tahap implementasi RBAC berikutnya |
| Permission kelola | Belum ada `manage_asset_sda` | Tidak ada batas jelas antara lihat dan kelola Asset | Siapkan `manage_asset_sda` sebelum form/input Asset resmi dibuat |
| Menu desktop/mobile | Mengikuti `canAccessPage('/asset')` | Visibilitas Asset terlalu luas karena `view_map` = `ALL_ROLES` | Setelah permission khusus ada, filter menu memakai `/asset` -> `view_asset_sda` |
| Data resmi | Belum ada tabel/adapter Asset resmi di route ini | Angka bisa dianggap resmi jika nanti ditambah dummy tanpa label | Jangan tampilkan angka tanpa sumber data resmi atau label Demo/Persiapan |
| Operasional SDA | Blueprint menempatkan sebagai subtab Asset | Role mandor belum aktif di runtime | Jangan aktifkan mandor/operasional sebelum model assignment dan permission selesai |
| Peta Monitoring | `/asset` mengarah ke `/peta` untuk konteks lokasi | Asset bisa dianggap sama dengan marker peta | Tetapkan peta sebagai shortcut lokasi, bukan sumber otoritatif Asset |
| Audit Log | Belum ada aksi Asset formal | Perubahan asset tidak traceable jika form dibuat tanpa audit | Rancang action `ASSET_CREATE`, `ASSET_UPDATE`, `ASSET_STATUS_UPDATE`, `ASSET_OPERATION_ADD`, `ASSET_PHOTO_ADD` sebelum implementasi tulis |

## 9. Audit Pengaturan

| Level Pengaturan | Contoh Isi | Permission yang Disarankan | Role yang Disarankan | Catatan Risiko |
|---|---|---|---|---|
| Profil pribadi | nama, email, no HP, preferensi tampilan, notifikasi pribadi, password | `view_settings` atau `view_profile_settings` | Semua user login | Aman untuk semua role selama hanya mengubah data pribadi |
| Preferensi pribadi | tema, bahasa, tampilan ringkas, notifikasi personal | `view_settings` | Semua user login | Jangan campur dengan parameter sistem |
| Master data | kategori surat, jenis paket, metode pengadaan, kategori asset, template dokumen | `manage_master_data` | `super_admin`, `admin` sebagai alias sementara `admin_sistem/admin_bidang` | Jangan dibuka ke role lapangan, kontraktor, konsultan, pimpinan, auditor |
| User management | buat user, aktif/nonaktif, assignment dasar | `manage_users` | Saat ini `super_admin`, `admin` | Admin biasa terlalu luas jika kelak `admin_sistem` dan `admin_bidang` dipisahkan |
| Role management | ubah role, permission, mapping role | `manage_roles` atau `manage_admin_users` | `super_admin` dan admin sistem terbatas jika disetujui | Risiko lockout tinggi jika salah konfigurasi |
| System settings | parameter sistem, backup, storage, integrasi, notifikasi global | `manage_system_settings` | `super_admin` | Jangan digabung dengan pengaturan profil |
| Assignment | penugasan paket/sub kegiatan/asset/peil | `manage_assignments` | `super_admin`, admin sistem, admin bidang sesuai scope | Harus assignment-based, bukan global untuk semua admin |
| Audit/settings read | melihat konfigurasi tanpa ubah | `view_system_settings` | pimpinan/auditor tertentu read-only jika dibutuhkan | Jangan berikan tombol tulis |

## 10. Role Access Matrix Rekomendasi

| Role | Asset SDA | Pengaturan Profil | Pengaturan Master Data | Manajemen User/Role | Pengaturan Sistem | Catatan |
|---|---|---|---|---|---|---|
| `super_admin` | Lihat/Kelola semua | Ya | Ya | Ya | Ya | Tetap guard final untuk aksi berisiko |
| `admin` | Lihat/Kelola sesuai alias sementara | Ya | Ya, bertahap | User non-admin saat ini | Terbatas | `admin` masih terlalu generik untuk admin_sistem/admin_bidang |
| `admin_sub_kegiatan` | Lihat terbatas jika terkait sub kegiatan/paket | Ya | Tidak default | Tidak | Tidak | Jangan beri akses global Asset/Pengaturan |
| `kabid` / kepala bidang | Lihat/read-only luas sesuai bidang | Ya | Tidak | Tidak | Tidak | Cocok untuk monitoring, bukan konfigurasi |
| `pimpinan` | Read-only rekap/lokasi | Ya | Tidak | Tidak | Tidak | Read-only |
| `ppk` | Lihat/kelola terbatas jika asset terkait paket/operasional yang menjadi kewenangan | Ya | Tidak | Tidak | Tidak | Perlu scope assignment |
| `pptk` | Lihat/input terbatas jika ada tugas | Ya | Tidak | Tidak | Tidak | Jangan akses global |
| `direksi_teknis` | Lihat/input catatan teknis jika terkait pekerjaan | Ya | Tidak | Tidak | Tidak | Scope paket/asset terkait |
| `tim_survey` | Lihat asset terkait survey/lokasi jika ditugaskan | Ya | Tidak | Tidak | Tidak | Jangan tampilkan semua asset |
| `tim_perencanaan` | Lihat asset untuk perencanaan jika ditugaskan | Ya | Tidak | Tidak | Tidak | Read/input sesuai workflow |
| `tim_pengawasan` | Lihat/input pengawasan asset terkait tugas | Ya | Tidak | Tidak | Tidak | Scope wajib ketat |
| `konsultan_perencana` | Lihat asset/paket terkait kontrak | Ya | Tidak | Tidak | Tidak | Eksternal, jangan lihat master data |
| `konsultan_pengawasan` | Lihat asset/paket terkait kontrak | Ya | Tidak | Tidak | Tidak | Eksternal, scope paket |
| `kontraktor` | Lihat asset hanya jika terkait paketnya | Ya | Tidak | Tidak | Tidak | Tidak boleh lihat asset lintas paket |
| `pejabat_pengadaan` | Lihat terbatas bila terkait paket/pengadaan | Ya | Tidak | Tidak | Tidak | Tidak perlu akses operasional asset |
| `pphp` | Lihat asset/dokumen serah terima jika terkait | Ya | Tidak | Tidak | Tidak | Read/input pemeriksaan sesuai scope |
| `auditor` | Read-only sesuai audit scope | Ya | Tidak | Tidak | Tidak | Tidak ada aksi tulis |
| `admin_peil_banjir` | Lihat asset terbatas jika terkait Peil | Ya | Tidak | Tidak | Tidak | Role masih pending/terbatas di runtime |
| `tim_teknis_peil_banjir` | Lihat asset terbatas jika terkait Peil | Ya | Tidak | Tidak | Tidak | Jangan perluas di RBAC besar dulu |
| `admin_surat` | Belum aktif | Ya jika user runtime ada | Belum | Tidak | Tidak | Jangan dipaksakan sebelum schema/role siap |
| `admin_asset` | Belum aktif | Ya jika user runtime ada | Belum | Tidak | Tidak | Kandidat role kelola Asset tahap lanjut |
| `mandor_operasional_sda` | Kelola operasi asset yang ditugaskan nanti | Ya jika user runtime ada | Tidak | Tidak | Tidak | Belum aktif, perlu model assignment operasional |
| `mandor_pintu_air` | Kelola pintu air yang ditugaskan nanti | Ya jika user runtime ada | Tidak | Tidak | Tidak | Jangan dipaksakan sekarang |
| `petugas_pintu_air` | Tidak wajib login menurut blueprint | Tidak wajib | Tidak | Tidak | Tidak | Petugas biasa tidak wajib login |
| `mandor_rehabilitasi_drainase` | Kelola pekerjaan rehab yang ditugaskan nanti | Ya jika user runtime ada | Tidak | Tidak | Tidak | Belum aktif runtime |

## 11. Risiko Teknis Utama

1. **Asset SDA menumpang `view_map`.**  
   Ini membuat batas antara Peta Monitoring dan Asset SDA tidak tegas. Saat Asset masih shell, risikonya rendah. Saat Asset mulai punya data resmi, ini harus dipisah.

2. **`view_settings` diberikan ke `ALL_ROLES`.**  
   Aman hanya untuk pengaturan personal. Tidak aman untuk master data, role, user management, backup, storage, atau parameter sistem.

3. **Role `admin` masih menjadi alias banyak admin final.**  
   `admin_sistem`, `admin_bidang`, dan `admin_sda` masih dipetakan ke `admin`. Jika permission sistem diberikan ke `admin`, cakupannya bisa terlalu luas.

4. **Role final tertentu belum aktif runtime.**  
   `admin_surat`, `admin_asset`, `mandor_operasional_sda`, `mandor_pintu_air`, `petugas_pintu_air`, dan `mandor_rehabilitasi_drainase` tidak boleh dipaksakan tanpa desain schema, role, dan assignment.

5. **Pengguna berada di bawah Pengaturan tetapi route guard berbeda.**  
   Ini benar secara konsep, tetapi UI Pengaturan harus jelas membedakan personal settings dan admin/user management agar user biasa tidak mengira punya akses.

6. **Assignment scope Asset belum tersedia.**  
   Sebelum Asset punya data resmi, belum ada cara final untuk membatasi asset berdasarkan asset assignment, paket terkait, lokasi, atau Peil terkait.

## 12. Dampak ke Halo SIAGA-SDA

Halo SIAGA-SDA tidak disentuh pada tahap ini.

Dampak konseptual untuk tahap lanjut:

- Jika permission `view_asset_sda` dibuat, Halo role-aware suggestion harus membaca permission baru sebelum menyarankan navigasi Asset.
- Jika Pengaturan dipisah menjadi profil/master/user/system, Halo harus membedakan saran "Profil Saya" dari "Kelola User" atau "Master Data".
- Halo tidak boleh menyarankan role tanpa akses membuka `/asset`, `/pengguna`, atau pengaturan sistem.

Karena dokumen `SIAGA_SDA_HALO_FINAL_LOCK.md` sudah final, perubahan Halo baru boleh dilakukan di tahap khusus dan tidak masuk RBAC-GLOBAL.3.

## 13. Rekomendasi Implementasi Bertahap

### Tahap RBAC-GLOBAL.4 - Permission Asset SDA

Usulan kecil dan aman:

- tambahkan permission konseptual `view_asset_sda`;
- tambahkan permission konseptual `manage_asset_sda`;
- ubah mapping `/asset` dari `view_map` ke `view_asset_sda`;
- jangan ubah database;
- jangan aktifkan role baru;
- uji Sidebar, MobileNav, Dashboard, dan Halo suggestion secara terpisah.

### Tahap RBAC-GLOBAL.5 - Split Pengaturan

Usulan:

- pertahankan `/pengaturan` sebagai profil/preferensi pribadi untuk semua user;
- pisahkan tab/section master data dengan guard `manage_master_data`;
- pertahankan `/pengguna` dengan `manage_users`;
- siapkan permission `manage_roles`, `manage_assignments`, dan `manage_system_settings` hanya di dokumen dulu;
- jangan menggabungkan semua konfigurasi sistem dalam `view_settings`.

### Tahap Asset SDA Lanjutan

Sebelum membuat form/tabel Asset resmi:

- desain model Asset dan Operasional SDA;
- desain assignment asset/operasional;
- desain audit action asset;
- desain role mandor/admin asset;
- pastikan petugas biasa tidak wajib login;
- pastikan foto absensi tidak dibuat kembali.

## 14. Hal yang Tidak Disentuh

- Login final.
- Halo SIAGA-SDA final lock.
- Dashboard modal 4D.2.
- Auth/NextAuth.
- Middleware.
- Prisma schema.
- Migration/database.
- Seed.
- Endpoint Approval, Bootstrap, Sync Version.
- `src/lib/rbac.ts`.
- `src/lib/navigation.ts`.
- `src/types/index.ts`.
- `src/lib/roles.ts`.
- `src/components/ai/ProjectAiAssistant.tsx`.
- Source runtime lain.

## 15. Validasi

Validasi yang perlu dijalankan setelah dokumen dibuat:

- `git diff --check`
- `npx.cmd tsc --noEmit`

Build tidak wajib karena tahap ini hanya dokumen audit.

## 16. Risiko Tersisa

- Rekomendasi ini belum mengubah runtime, sehingga risiko aktual `view_map` untuk `/asset` dan `view_settings` untuk `/pengaturan` masih ada sampai tahap implementasi.
- Role alias `admin` masih terlalu luas untuk membedakan admin sistem, admin bidang, dan admin SDA.
- Asset SDA masih belum memiliki sumber data resmi.
- Pengaturan master/system belum memiliki guard granular karena tahap ini hanya audit.
- Dokumen role tertentu masih memakai istilah transisi yang perlu dibereskan pada tahap role cleanup khusus.

## 17. Saran Commit Message

```text
docs: audit rbac asset pengaturan
```
