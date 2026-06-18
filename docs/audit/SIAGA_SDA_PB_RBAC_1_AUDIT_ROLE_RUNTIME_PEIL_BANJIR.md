# SIAGA-SDA PB-RBAC.1 — Audit Role Runtime Peil Banjir

Tanggal audit: 2026-06-19  
Commit acuan lokal: `4ec6cde docs: finalisasi konsep peil banjir siaga sda`  
Branch: `master` (`ahead 4` dari `origin/master` saat audit)

## 1. Ringkasan Tujuan

Tahap PB-RBAC.1 mengaudit struktur role/RBAC runtime aktual dan menyiapkan dua role Peil Banjir secara terbatas di layer frontend TypeScript:

- `admin_peil_banjir` → **Admin Peil Banjir**
- `tim_teknis_peil_banjir` → **Tim Teknis Peil Banjir**

Perubahan ini tidak mengubah Prisma schema, migration, database, seed, Auth, middleware, login, endpoint Approval, atau workflow dashboard.

## 2. File yang Diaudit

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md`
- `docs/core/SIAGA_SDA_PEIL_BANJIR_FINAL_CONCEPT.md`
- `docs/modules/SIAGA_SDA_PEIL_UI.md`
- `docs/roles/SIAGA_SDA_ADMIN_PEIL_UI.md`
- `docs/audit/SIAGA_SDA_PB_DOC_1_FINALISASI_KONSEP_PEIL_BANJIR.md`
- `src/types/index.ts`
- `src/lib/roles.ts`
- `src/lib/rbac.ts`
- `src/lib/utils.ts`
- `src/lib/workflow-mapping.ts`
- `src/lib/project-db.ts`
- `src/lib/db-mappers.ts`
- `src/store/useAppStore.ts`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/components/dashboard/DashboardRoleHeader.tsx`
- `src/components/admin/RoleAccessPanel.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/pengguna/page.tsx`

Pencarian wajib dijalankan:

```bash
rg -n "super_admin|admin_bidang|admin_sub_kegiatan|ppk|pptk|direksi_teknis|tim_survey|tim_pengawasan|kontraktor|auditor|roles|rbac|permission|permissions|Role|UserRole" src docs AGENTS.md
```

## 3. Backup

Backup dibuat di:

```text
backup/backup-pb-rbac-1-role-runtime-peil-banjir-before-change/
```

File yang dibackup:

- `src/types/index.ts`
- `src/lib/roles.ts`
- `src/lib/rbac.ts`
- `src/lib/utils.ts`
- `src/lib/workflow-mapping.ts`
- `src/app/(dashboard)/pengguna/page.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/components/dashboard/DashboardRoleHeader.tsx`
- `BACKUP_FILE_LIST.md`

## 4. Struktur Role Runtime Aktual

Sistem runtime frontend menggunakan union lokal `Role` di `src/types/index.ts`.

Role Peil Banjir belum ada sebelum tahap ini pada union runtime. Di dokumen mapping sebelumnya, `admin_peil_banjir` dan `tim_teknis_peil_banjir` masih konseptual.

Tahap ini menambahkan dua role tersebut ke union frontend agar komponen role-aware dapat mengenali label, scope, dan permission terbatas.

## 5. Struktur Permission Aktual

RBAC runtime aktual berada di `src/lib/rbac.ts`:

- `Permission` adalah union string lokal.
- `PERMISSION_ROLES` mengatur role yang boleh memakai permission.
- `PAGE_PERMISSIONS` mengatur guard halaman.
- `canAccessPage()` dan `hasPermission()` menjadi helper utama komponen navigation/dashboard.

Sebelum tahap ini:

- `/peil` memakai permission umum `view_map`.
- `/surat` memakai permission umum `view_announcements`.
- Kedua role Peil belum dapat dipetakan secara runtime tanpa ikut membuka permission umum lain.

## 6. Status Binding Database/Prisma

Audit menemukan dua file penting yang mengikat role ke Prisma enum:

- `src/lib/project-db.ts`
- `src/lib/db-mappers.ts`

Keduanya membaca/memetakan `Role` dari `@prisma/client`. Prisma enum belum memiliki `admin_peil_banjir` atau `tim_teknis_peil_banjir`.

Keputusan PB-RBAC.1:

- Prisma schema tidak diubah.
- Migration tidak dibuat.
- Database tidak diubah.
- Role Peil **tidak diizinkan disimpan dari UI Manajemen Pengguna** sebelum schema/database resmi siap.
- Runtime frontend hanya disiapkan agar bila role ini kelak hadir dari sumber resmi, UI tidak crash dan aksesnya tetap terbatas.

## 7. Perubahan yang Dilakukan

### `src/types/index.ts`

Menambahkan role union:

- `admin_peil_banjir`
- `tim_teknis_peil_banjir`

### `src/lib/roles.ts`

Menambahkan alias dan definisi role:

- `admin_peil` → `admin_peil_banjir`
- `admin_peil_banjir` → `admin_peil_banjir`
- `tim_teknis_peil_banjir` → `tim_teknis_peil_banjir`

Definisi role mencakup label, deskripsi, tugas, hak, dan warna UI.

### `src/lib/rbac.ts`

Menambahkan permission eksplisit:

- `view_peil_banjir`
- `view_surat`

Mapping route:

- `/peil` → `view_peil_banjir`
- `/surat` → `view_surat`

Role baru tidak dimasukkan ke `ALL_ROLES` agar tidak otomatis mendapatkan seluruh menu global.

### `src/lib/utils.ts`

Menambahkan label dashboard:

- `Admin Peil Banjir`
- `Tim Teknis Peil Banjir`

### `src/app/(dashboard)/pengguna/page.tsx`

Menambahkan warna role dan hitungan staff dinas.

Guard penting:

- Role Peil Banjir belum ditampilkan sebagai role yang bisa dipilih/simpan di form user karena Prisma enum belum siap.
- Jika role tersebut masuk ke form, submit diblokir dengan pesan eksplisit.

### `src/components/dashboard/DashboardRoleHeader.tsx`

Menambahkan cakupan kerja non-assignment untuk role Peil agar header dashboard dapat menampilkan scope yang jujur.

### `src/app/(dashboard)/dashboard/page.tsx`

Menambahkan quick action terbatas:

- Admin Peil Banjir: Dashboard, Surat, Peil.
- Tim Teknis Peil Banjir: Dashboard, Peil.

Tidak mengubah modal Dashboard 4D.2.

### `src/components/ai/ProjectAiAssistant.tsx`

Menambahkan ringkasan Halo SIAGA-SDA untuk dua role Peil.

Ringkasan menegaskan bahwa aksi tulis resmi/data misi resmi belum aktif dan akses approval/global tidak diberikan otomatis.

### `src/lib/workflow-mapping.ts`

Memperbarui status konseptual menjadi runtime frontend terbatas, dengan catatan Prisma/database belum dimigrasikan.

## 8. Detail Role Admin Peil Banjir

Role: `admin_peil_banjir`  
Label: **Admin Peil Banjir**

Akses runtime terbatas:

- Dashboard
- Surat Masuk & Keluar
- Peil Banjir

Batasan:

- Tidak mendapat `view_settings`.
- Tidak mendapat `manage_users`.
- Tidak mendapat `view_approval`.
- Tidak mendapat akses global paket/proyek.
- Tidak dapat disimpan sebagai user database sebelum Prisma enum dimigrasikan.

## 9. Detail Role Tim Teknis Peil Banjir

Role: `tim_teknis_peil_banjir`  
Label: **Tim Teknis Peil Banjir**

Akses runtime terbatas:

- Dashboard
- Peil Banjir

Batasan:

- Tidak mendapat akses Surat.
- Tidak mendapat Approval Center.
- Tidak mendapat Audit Log.
- Tidak mendapat Pengaturan.
- Tidak mendapat akses global paket/proyek.
- Tidak dapat disimpan sebagai user database sebelum Prisma enum dimigrasikan.

## 10. Risiko

Risiko utama:

1. Prisma enum belum punya role Peil, sehingga role tidak boleh disimpan melalui API user.
2. Middleware/Auth mungkin masih bergantung ke role database aktual.
3. Jika role dimasukkan ke `ALL_ROLES`, ia akan mendapat terlalu banyak menu. Itu sengaja dihindari.
4. `/peil` masih berupa UI/modul bertahap; aksi tulis resmi belum boleh dianggap aktif.
5. Role Peil belum punya assignment database formal.

Mitigasi:

- Role baru tidak dimasukkan ke `ALL_ROLES`.
- UI Manajemen Pengguna memblokir penyimpanan role Peil.
- Dokumen ini mencatat kebutuhan migration khusus pada tahap berikutnya.

## 11. Hal yang Tidak Disentuh

- Halaman login.
- Asset login.
- Auth / NextAuth.
- Middleware.
- Prisma schema.
- Migration.
- Database.
- Seed data.
- `package.json` dan dependency.
- Endpoint Approval GET/read-only.
- Endpoint Bootstrap / Sync Version.
- Modal Dashboard 4D.2 dan shared modal portal.
- Workflow approval runtime.

## 12. Validasi

Hasil validasi diisi pada laporan akhir eksekusi:

- `git diff --check`
- `npx tsc --noEmit`
- `npm run lint` jika tersedia
- `npm run build` jika aman

## 13. Rekomendasi Lanjutan

Tahap berikutnya yang disarankan:

1. Review apakah role Peil perlu masuk Prisma enum atau memakai model permission/role yang lebih fleksibel.
2. Jika disetujui eksplisit, buat draft migration role Peil terpisah.
3. Siapkan assignment model Peil Banjir sebelum mengaktifkan aksi tulis.
4. Setelah schema siap, buka pilihan role Peil di Manajemen Pengguna.
5. Jangan aktifkan upload/verifikasi resmi Peil sebelum data model dan audit trail siap.
