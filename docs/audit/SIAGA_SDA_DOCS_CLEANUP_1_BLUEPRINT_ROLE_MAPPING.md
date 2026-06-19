# SIAGA-SDA DOCS-CLEANUP.1 - Blueprint Role Mapping

Tanggal: 19 Juni 2026
Commit acuan: `36f9b9a docs: desain fondasi pusat peringatan tindak lanjut`
Jenis tahap: Dokumentasi saja

## 1. Tujuan

Tahap DOCS-CLEANUP.1 memperbaiki kontradiksi internal di blueprint dan membuat rujukan mapping role 3 lapis tanpa mengubah runtime aplikasi.

Tahap ini tidak melakukan perubahan ke source code runtime, Prisma schema, RBAC runtime, Auth, middleware, login, dashboard, API, database, migration, seed, Sidebar, MobileNav, atau package.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_3_AUDIT_ASSET_PENGATURAN.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_4_PERMISSION_ASSET_SDA.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_5_AUDIT_PENGATURAN_PERSONAL_MASTER_SYSTEM.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_6_PERMISSION_GRANULAR_PENGATURAN.md`
- `docs/modules/SIAGA_SDA_WARNING_ACTION_CENTER_FOUNDATION.md`
- `docs/design/SIAGA_SDA_HALO_FINAL_LOCK.md`
- `docs/audit/SIAGA_SDA_UX_C5_FINAL_QA_LOCK_HALO.md`
- `src/lib/navigation.ts`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/lib/db-mappers.ts`
- `src/types/index.ts`
- `src/store/useAppStore.ts`
- `src/app/(dashboard)/pengguna/page.tsx`
- `prisma/schema.prisma`
- `C:\Users\User\Downloads\AUDIT_SIAGA_SDA_BLUEPRINT_RBAC_ROLE.md`

## 3. Backup

Backup dibuat sebelum mengubah blueprint:

- `backup/backup-docs-cleanup-1-before-change/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`

## 4. File yang Diubah

- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`

## 5. File yang Dibuat

- `docs/database/SIAGA_SDA_ROLE_BLUEPRINT_FRONTEND_DATABASE_MAPPING.md`
- `docs/audit/SIAGA_SDA_EXTERNAL_AUDIT_BLUEPRINT_RBAC_ROLE_CLAUDE_20260619.md`
- `docs/audit/SIAGA_SDA_DOCS_CLEANUP_1_BLUEPRINT_ROLE_MAPPING.md`

## 6. Perbaikan Kontradiksi Blueprint

### 6.1 Role yang Dihapus

Sebelum:

- Blueprint menulis `ADMIN_SUB_KEGIATAN` sebagai role tidak digunakan lagi.
- Kalimat alasan menyatakan tugas `ADMIN_SUB_KEGIATAN` digantikan oleh `ADMIN_SUB_KEGIATAN`.

Sesudah:

- Role lama yang tidak digunakan lagi adalah `ADMIN_KEGIATAN`.
- Pengganti final adalah `ADMIN_SUB_KEGIATAN`.
- Ditambahkan catatan compatibility bahwa `ADMIN_SUB_KEGIATAN` masih dipetakan ke enum Prisma `ADMINISTRASI_KONTRAK` sampai tahap schema/migration khusus disetujui.

### 6.2 Istilah Survey Investigasi

Sebelum:

- Istilah final: `Ditindaklanjuti`.
- Istilah yang dilarang juga tertulis `Ditindaklanjuti`.

Sesudah:

- Istilah final tetap `Ditindaklanjuti`.
- Istilah yang dilarang adalah `Menjadi Paket`.

## 7. Mapping Role 3 Lapis

Dokumen mapping baru menjelaskan:

- Role blueprint konseptual.
- Role frontend runtime.
- Role Prisma/database aktif.
- Status role aktif, digabung, pending Prisma, pending runtime, atau dihapus.
- Risiko jika role hanya diubah pada satu lapis.

Catatan utama:

- `ADMIN_SUB_KEGIATAN` adalah role aktif konseptual/frontend.
- Database masih memakai `ADMINISTRASI_KONTRAK` sebagai compatibility.
- `ADMIN_KEGIATAN` adalah role lama yang tidak digunakan lagi.
- `admin_peil_banjir` dan `tim_teknis_peil_banjir` masih pending Prisma.
- `admin_surat`, `admin_asset`, dan role mandor belum boleh diaktifkan runtime/database.

## 8. Hal yang Tidak Disentuh

- `src/**`
- `prisma/schema.prisma`
- Prisma migration
- Database
- Seed
- Auth/NextAuth
- Middleware
- RBAC runtime
- Role TypeScript
- `mapDbRole`
- Package/dependency
- Login
- Dashboard/modal 4D.2
- Halo final
- Approval runtime/API
- Sidebar/MobileNav
- Route/menu runtime

## 9. Risiko Tersisa

- Mapping role masih bergantung pada kedisiplinan update lintas file bila role baru benar-benar diaktifkan.
- Role pending Prisma harus tetap diblokir sampai migration disetujui.
- Assignment-empty routing dan API-level scope tetap perlu audit tahap khusus jika diminta.

## 10. Validasi

Validasi tahap ini:

- `git status`
- `git diff --check`
- `npx tsc --noEmit`

`npm run lint` dan `npm run build` tidak wajib karena tahap ini hanya dokumentasi.

## 11. Rekomendasi

Dokumen ini aman untuk commit bila validasi bersih.

Saran commit message:

```text
docs: cleanup blueprint role mapping
```
