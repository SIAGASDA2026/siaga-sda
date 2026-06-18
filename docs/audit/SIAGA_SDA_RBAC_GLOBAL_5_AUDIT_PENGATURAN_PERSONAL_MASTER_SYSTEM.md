# SIAGA-SDA RBAC-GLOBAL.5 - Audit Pengaturan Personal vs Master/System

## 1. Ringkasan Eksekutif

Status tahap: **dokumen-only / audit dan mapping**.

RBAC-GLOBAL.5 mengaudit batas aman menu **Pengaturan** agar jelas mana yang boleh dibuka semua user sebagai pengaturan pribadi, dan mana yang harus dibatasi sebagai pengaturan master, admin, role, assignment, atau sistem.

Scope audit:

- route `/pengaturan`;
- route `/pengguna`;
- permission `view_settings` dan `manage_users`;
- menu Sidebar dan MobileNav;
- copy/panduan Halo yang berkaitan dengan Pengaturan dan Manajemen Pengguna;
- risiko jika fitur admin/system digabung ke `/pengaturan` tanpa guard granular.

Kesimpulan:

- `/pengaturan` saat ini masih aman untuk semua role yang termasuk `ALL_ROLES` karena isinya masih pengaturan pribadi: profil, notifikasi, tampilan, dan keamanan akun.
- `/pengguna` lebih aman karena memakai permission `manage_users` dan guard internal halaman.
- Batas aman berikutnya: jangan menambah Master Data, User Management, Role/Permission Management, Assignment Management, System Settings, integrasi, backup, storage, atau parameter global ke `/pengaturan` tanpa permission granular dan guard per-section/per-route.

Tahap ini tidak mengubah source runtime, RBAC runtime, Prisma, database, Auth, Login, Dashboard, Halo, API, package, atau dependency.

## 2. Status Acuan

| Item | Status |
|---|---|
| Commit acuan | `4107377 feat: pisahkan permission asset sda` |
| RBAC-GLOBAL.3 | Audit Asset & Pengaturan selesai |
| RBAC-GLOBAL.4 | Permission Asset SDA selesai |
| Login | Final/locked, tidak disentuh |
| Dashboard modal 4D.2 | Final, tidak disentuh |
| Halo SIAGA-SDA | Final lock, tidak disentuh |
| Prisma/database/migration | Tidak disentuh |
| Runtime source | Tidak diubah |

## 3. File yang Dibaca

Dokumen:

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_3_AUDIT_ASSET_PENGATURAN.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_4_PERMISSION_ASSET_SDA.md`
- `docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_1_AUDIT_ROLE_PERMISSION_MENU_HALO.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_2_FIX_HALO_ROLE_AWARE_SUGGESTIONS.md`

Source yang diaudit secara read-only:

- `src/lib/rbac.ts`
- `src/lib/navigation.ts`
- `src/types/index.ts`
- `src/lib/roles.ts`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/app/(dashboard)/pengaturan/page.tsx`
- `src/app/(dashboard)/pengguna/page.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`

## 4. File Baru

Dokumen baru:

- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_5_AUDIT_PENGATURAN_PERSONAL_MASTER_SYSTEM.md`

## 5. File Diubah

Tidak ada file source runtime yang diubah.

Dokumen lama tidak diubah.

## 6. Backup

Backup tidak dibuat karena tahap ini hanya membuat dokumen baru dan tidak mengubah dokumen lama atau source runtime.

Jika tahap berikutnya mengubah source atau dokumen lama, gunakan:

```text
backup/backup-rbac-global-5-before-change/
```

## 7. Kondisi Aktual `/pengaturan`

Route:

```text
/pengaturan
```

Mapping permission aktual:

```ts
'/pengaturan': 'view_settings'
```

Permission `view_settings` saat ini diberikan ke `ALL_ROLES`:

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

Isi halaman aktual `src/app/(dashboard)/pengaturan/page.tsx`:

- Profil Saya;
- Notifikasi;
- Tampilan;
- Keamanan.

Catatan detail:

- Profil memperbarui `name`, `jabatan`, dan `nip` milik `currentUser` melalui store.
- Email ditampilkan disabled dan diarahkan untuk menghubungi Admin.
- Role sistem ditampilkan disabled.
- Notifikasi dan tampilan bersifat preferensi UI.
- Password memakai validasi UI lokal dan toast, tanpa audit API khusus pada tahap ini.

Penilaian:

- Masih layak dibuka untuk semua user login karena isinya personal.
- Risiko akan muncul jika halaman yang sama mulai memuat master data, role, user, assignment, storage, backup, integrasi API, atau parameter global tanpa guard granular.

## 8. Kondisi Aktual `/pengguna`

Route:

```text
/pengguna
```

Mapping permission aktual:

```ts
'/pengguna': 'manage_users'
```

Permission `manage_users` saat ini diberikan kepada:

```text
super_admin
admin
```

Guard aktual:

- route/menu memakai `canAccessPage()`;
- halaman `/pengguna` melakukan guard internal:

```ts
hasPermission(currentUser?.role || '', 'manage_users')
```

Jika user tidak punya `manage_users`, halaman menampilkan empty/denial state lokal:

```text
Akses Terbatas
Hanya Super Admin dan Administrator yang dapat mengelola pengguna
```

Pola ini lebih aman daripada memasukkan manajemen user langsung ke tab `/pengaturan` tanpa guard. Jika User Management digabung ke `/pengaturan`, setiap tab/section harus tetap memakai `manage_users`, bukan hanya `view_settings`.

## 9. Kondisi Aktual Menu

`src/lib/navigation.ts` menempatkan:

- `Pengaturan` sebagai menu utama route `/pengaturan`;
- `Pengguna` sebagai child route `/pengguna`.

Sidebar:

- mengambil `MAIN_NAVIGATION_ITEMS`;
- memfilter menu dengan `canAccessPage(currentUser.role, item.routeKey)`.

MobileNav:

- mengambil sumber menu yang sama;
- memfilter drawer menu dengan `canAccessPage(currentUser?.role ?? '', item.routeKey)`.

Catatan risiko:

- Pengaturan terlihat untuk role yang memiliki `view_settings`.
- Pengguna child secara konsep berada di bawah Pengaturan, tetapi route `/pengguna` tetap dibatasi `manage_users`.
- Jika UI child ditampilkan eksplisit di masa depan, child item harus difilter dengan routeKey masing-masing, bukan mengikuti parent `/pengaturan`.

## 10. Kondisi Aktual Halo SIAGA-SDA

`ProjectAiAssistant.tsx` sudah memiliki panduan kontekstual:

- `/pengaturan`: panduan preferensi akun dan pengaturan sesuai role;
- `/pengguna`: panduan Manajemen Pengguna dengan batas `manage_users`.

FAQ/suggestion Halo memakai `accessPath`:

- `/pengaturan` untuk panduan Pengaturan;
- `/pengguna` untuk Manajemen Pengguna.

Risiko tersisa:

- Jika nanti `/pengaturan` memuat master/system settings, Halo harus membedakan "pengaturan personal" dari "pengaturan sistem".
- Halo tidak boleh menyarankan User Management, Role Management, Assignment, atau System Settings kepada role yang hanya punya `view_settings`.

## 11. Klasifikasi Pengaturan

### A. Pengaturan Personal

Contoh:

- Profil Saya;
- password/keamanan pribadi;
- notifikasi pribadi;
- tema/tampilan pribadi;
- preferensi dashboard pribadi.

Permission:

- `view_settings` saat ini masih cukup;
- `view_profile_settings` dapat dipertimbangkan jika ingin memisahkan profil personal dari pengaturan lain.

Akses:

- semua user login.

Catatan:

- Tidak boleh mengubah role, assignment, email utama, status aktif, atau data user lain.
- Jika ada update profil ke backend nanti, endpoint tetap harus memastikan user hanya mengubah dirinya sendiri.

### B. Pengaturan Master Data

Contoh:

- jenis paket;
- kategori surat;
- kategori asset;
- template dokumen;
- metode pengadaan;
- data referensi aplikasi;
- parameter SLA operasional.

Permission kandidat:

- `manage_master_data`.

Akses yang disarankan:

- `super_admin`;
- `admin` sebagai alias sementara `admin_sistem/admin_bidang` sampai role final dipisahkan.

Catatan:

- Jangan dibuka untuk role lapangan, kontraktor, konsultan, pimpinan, atau auditor.
- Perubahan master data harus masuk Audit Log.

### C. User Management

Contoh:

- tambah user;
- aktif/nonaktif user;
- assignment user;
- reset akses user;
- melihat daftar user dan role.

Permission:

- `manage_users`.

Akses:

- `super_admin`;
- `admin` sesuai aturan aktual.

Catatan:

- Pola route `/pengguna` saat ini lebih aman daripada menggabungkannya langsung dalam `/pengaturan`.
- Jika dijadikan subtab Pengaturan, guard tetap harus `manage_users`.

### D. Role/Permission Management

Contoh:

- ubah role;
- mapping permission;
- akses menu global;
- role compatibility;
- membuka/menutup permission untuk role tertentu.

Permission kandidat:

- `manage_roles`;
- `manage_permissions`.

Akses yang disarankan:

- `super_admin` saja untuk tahap awal.

Catatan:

- Risiko lockout sangat tinggi.
- Jangan mengubah role runtime atau Prisma enum tanpa tahap migration/compatibility khusus.

### E. Assignment Management

Contoh:

- assignment paket;
- assignment sub kegiatan;
- assignment asset;
- assignment Peil Banjir;
- assignment tim teknis/lapangan;
- assignment kontraktor/konsultan per paket.

Permission kandidat:

- `manage_assignments`.

Akses yang disarankan:

- `super_admin`;
- admin sistem/admin bidang sesuai scope jika role sudah siap.

Catatan:

- Assignment harus scoped.
- Jangan berikan assignment global ke admin biasa tanpa batas bidang/sub kegiatan.

### F. System Settings

Contoh:

- integrasi API;
- backup/storage;
- parameter global aplikasi;
- konfigurasi notifikasi global;
- pengaturan keamanan sistem;
- parameter pasang surut;
- storage/QR asset.

Permission kandidat:

- `manage_system_settings`;
- `view_system_settings` bila perlu mode baca.

Akses yang disarankan:

- `super_admin` saja untuk tahap awal;
- read-only terbatas untuk auditor/pimpinan hanya bila ada kebutuhan audit dan datanya tidak sensitif.

Catatan:

- Jangan dicampur dengan Pengaturan Personal.
- Perubahan wajib diaudit dan idealnya butuh konfirmasi.

## 12. Matriks Role vs Pengaturan

| Role | Pengaturan personal | Master data | User management | Role/permission management | Assignment management | System settings | Catatan pembatasan |
|---|---|---|---|---|---|---|---|
| `super_admin` | Ya | Ya | Ya | Ya | Ya | Ya | Tetap perlu audit log untuk aksi berisiko |
| `admin` / admin_sistem / admin_bidang | Ya | Ya bertahap | Ya sesuai runtime | Tidak default | Ya terbatas jika scope siap | Tidak default | `admin` masih alias luas, perlu dipisah nanti |
| `admin_sub_kegiatan` | Ya | Tidak default | Tidak | Tidak | Terbatas hanya jika diberi assignment sub kegiatan | Tidak | Jangan punya akses global |
| `kabid` / kepala_bidang | Ya | Tidak | Tidak | Tidak | Tidak default | Tidak | Monitoring/decision, bukan konfigurasi |
| `pimpinan` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Read-only; jangan beri tombol tulis |
| `ppk` | Ya | Tidak | Tidak | Tidak | Tidak default | Tidak | Decision paket, bukan admin sistem |
| `pptk` | Ya | Tidak | Tidak | Tidak | Tidak default | Tidak | Operasional teknis sesuai assignment |
| `direksi_teknis` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Teknis/pengawasan, bukan pengaturan global |
| `pejabat_pengadaan` | Ya | Tidak default | Tidak | Tidak | Tidak | Tidak | Hanya data pengadaan yang relevan |
| `pphp` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Pemeriksaan hasil, read/input terbatas |
| `tim_perencanaan` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak boleh akses User/Role/System |
| `tim_survey` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Lapangan/survey scoped |
| `tim_pengawasan` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Pengawasan scoped |
| `konsultan_perencana` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Eksternal; hanya assignment paket |
| `konsultan_pengawasan` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Eksternal; hanya assignment paket |
| `kontraktor` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak boleh melihat master/user/system |
| `auditor` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak default | Read-only; dapat diberi `view_system_settings` bila perlu audit |

Role yang belum boleh dipaksakan pada tahap ini:

- `admin_surat`;
- `admin_peil_banjir`;
- `admin_asset`;
- `mandor_operasional_sda`;
- `mandor_pintu_air`;
- `petugas_pintu_air`;
- `mandor_rehabilitasi_drainase`.

## 13. Rekomendasi Permission Kandidat

Permission yang ada dan tetap dipertahankan:

- `view_settings`: buka halaman pengaturan personal saat ini;
- `manage_users`: user management;
- `manage_admin_users`: admin user management khusus Super Admin.

Permission kandidat untuk tahap berikutnya:

- `view_profile_settings`: jika ingin memisahkan profil personal dari pengaturan umum;
- `manage_master_data`: master data referensi;
- `manage_roles`: role management;
- `manage_permissions`: permission/menu matrix;
- `manage_assignments`: penugasan paket/sub kegiatan/asset/peil;
- `manage_system_settings`: integrasi, backup, storage, parameter global;
- `view_system_settings`: mode baca untuk audit/pimpinan jika dibutuhkan.

Catatan:

- Jangan implementasi permission kandidat pada RBAC-GLOBAL.5.
- Permission kandidat harus masuk tahap implementasi kecil, disertai guard route dan guard API.

## 14. Risiko Teknis

1. **Client-side hiding tidak cukup aman.**  
   Menyembunyikan tab di UI tidak cukup jika API masih menerima aksi dari role tidak berwenang.

2. **Route guard wajib.**  
   Setiap route admin/system harus punya permission route sendiri, bukan hanya child UI di `/pengaturan`.

3. **Server-side permission check wajib.**  
   Jika nanti ada API master data/user/role/assignment/settings, backend harus memeriksa permission yang sama.

4. **Alias admin terlalu luas.**  
   `admin_sistem`, `admin_bidang`, dan `admin_sda` saat ini masih alias ke `admin`. Memberi permission sistem ke `admin` bisa membuka akses terlalu luas.

5. **Pengaturan master terbuka ke semua user.**  
   Jika master data ditempatkan di `/pengaturan` tanpa guard granular, semua role dengan `view_settings` dapat melihatnya.

6. **Role lockout.**  
   Salah konfigurasi role/permission dapat membuat user tidak bisa mengakses sistem atau membuat Super Admin kehilangan kontrol.

7. **Assignment global tanpa scope.**  
   Assignment harus mengikuti bidang/sub kegiatan/paket/asset/Peil, bukan global untuk semua admin.

8. **Mencampur pengaturan pribadi dan sistem.**  
   Pengguna lapangan membutuhkan pengaturan pribadi sederhana, bukan panel sistem kompleks.

9. **Halo menyarankan menu tidak sesuai role.**  
   Halo harus membedakan `/pengaturan` personal dari `/pengguna` dan future system settings.

## 15. Rekomendasi Tahap Implementasi Berikutnya

### RBAC-GLOBAL.6 - Permission Granular Pengaturan

Tambahkan permission konseptual/tipe secara kecil:

- `view_profile_settings`;
- `manage_master_data`;
- `manage_roles`;
- `manage_permissions`;
- `manage_assignments`;
- `manage_system_settings`;
- `view_system_settings` jika diperlukan.

Jangan langsung mengubah UI besar.

### SETTINGS.1 - Pisahkan UI Personal dari Admin/System Panel

Pertahankan `/pengaturan` sebagai personal settings untuk semua user.

Admin/system panel dapat:

- tetap menjadi route child seperti `/pengguna`;
- atau menjadi sub-section yang guard per-tab dengan permission khusus.

Jangan membuat tab Master Data sebagai menu utama.

### USERS.1 - Audit User Management dan Assignment

Audit:

- user create/update/delete;
- role pending;
- assignment user;
- guard API;
- audit log.

### ROLES.1 - Audit Role/Permission Management

Sebelum implementasi role management:

- petakan role final vs runtime;
- tentukan Super Admin recovery path;
- buat rollback plan;
- pastikan Prisma/database belum diubah tanpa approval eksplisit.

## 16. Checklist Validasi Dokumen

| Checklist | Status |
|---|---|
| Tidak ada source code berubah | Ya |
| Tidak ada Prisma/migration berubah | Ya |
| Tidak ada package/dependency berubah | Ya |
| Tidak ada login/dashboard/Halo berubah | Ya |
| Dokumen baru tersimpan di lokasi benar | Ya |
| Konsisten dengan RBAC-GLOBAL.3 | Ya |
| Konsisten dengan RBAC-GLOBAL.4 | Ya |

## 17. Hal yang Tidak Disentuh

- `src/**`
- `prisma/**`
- `package.json`
- lockfile package
- middleware
- Auth/NextAuth
- Login final
- Dashboard final
- Halo final lock
- API Approval/Bootstrap/Sync
- UI Pengaturan
- UI Pengguna
- RBAC runtime
- database/migration/seed

## 18. Validasi yang Dijalankan

Validasi wajib:

- `git status`
- `git diff --check`

Tidak dijalankan karena tahap dokumen-only:

- `npx tsc --noEmit`;
- `npm run lint`;
- `npm run build`.

## 19. Risiko Tersisa

- `view_settings` masih terlalu luas jika Pengaturan diperluas tanpa guard.
- `/pengaturan` belum punya pemisahan eksplisit antara personal settings dan admin/system settings karena belum diperlukan pada UI aktual.
- `/pengguna` aman secara route dan guard internal, tetapi tetap perlu audit API lanjutan bila user management diperluas.
- Halo copy Pengaturan perlu diaudit lagi jika system settings benar-benar ditambahkan.

## 20. Saran Commit Message

```text
docs: audit pengaturan personal master system
```
