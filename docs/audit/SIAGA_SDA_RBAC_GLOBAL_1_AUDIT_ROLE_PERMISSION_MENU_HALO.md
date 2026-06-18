# SIAGA-SDA RBAC-GLOBAL.1 - Audit Role, Permission, Menu, Dashboard, dan Halo SIAGA-SDA

Tanggal audit: 2026-06-19  
Commit acuan: `ccda027 docs: audit rencana prisma role peil banjir tahap pb-rbac-3`  
Project: SIAGA-SDA

## 1. Tujuan Audit

Audit RBAC-GLOBAL.1 dilakukan untuk memetakan konsistensi role, permission, menu, Dashboard, Halo SIAGA-SDA, Manajemen Pengguna, mapper role, dan risiko Prisma/database.

Masalah awal yang diaudit:

```text
Akun Tim Perencana/Rutin tidak melihat menu Peil Banjir, tetapi Halo SIAGA-SDA masih menampilkan suggestion tentang Peil Banjir.
```

Kesimpulan awal:

- Menu Peil Banjir untuk Tim Perencana/Rutin memang tersembunyi sesuai RBAC saat ini.
- Halo SIAGA-SDA masih memiliki FAQ Peil Banjir statis dan belum difilter berdasarkan permission role.
- Masalah ini bukan hanya Peil, tetapi pola role-aware content Halo perlu dirapikan untuk semua modul sensitif.

Tahap ini hanya audit dan dokumentasi. Tidak ada perubahan source runtime.

## 2. File dan Dokumen yang Diaudit

Dokumen:

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/core/SIAGA_SDA_PEIL_BANJIR_FINAL_CONCEPT.md`
- `docs/modules/SIAGA_SDA_PEIL_UI.md`
- `docs/modules/SIAGA_SDA_SURAT_UI.md`
- `docs/roles/*`
- `docs/audit/SIAGA_SDA_PB_DOC_1_FINALISASI_KONSEP_PEIL_BANJIR.md`
- `docs/audit/SIAGA_SDA_PB_RBAC_1_AUDIT_ROLE_RUNTIME_PEIL_BANJIR.md`
- `docs/audit/SIAGA_SDA_PB_RBAC_2_AUDIT_AKSES_MENU_PEIL_SURAT.md`
- `docs/audit/SIAGA_SDA_PB_RBAC_3_AUDIT_RENCANA_PRISMA_ROLE_PEIL.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- dokumen Dashboard/UX/Halo yang relevan

Source:

- `src/types/index.ts`
- `src/lib/roles.ts`
- `src/lib/rbac.ts`
- `src/lib/navigation.ts`
- `src/lib/utils.ts`
- `src/lib/workflow-mapping.ts`
- `src/lib/project-db.ts`
- `src/lib/db-mappers.ts`
- `src/lib/auth.ts`
- `src/store/useAppStore.ts`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/components/dashboard/DashboardRoleHeader.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/pengguna/page.tsx`
- `src/app/api/users/route.ts`
- `src/app/api/users/[id]/route.ts`
- `prisma/schema.prisma`
- `prisma/seed.ts`

Pencarian wajib sudah dijalankan:

```bash
rg -n "super_admin|admin_sistem|admin_bidang|admin_sub_kegiatan|kabid|kepala_bidang|pimpinan|ppk|pptk|direksi_teknis|pejabat_pengadaan|pphp|tim_perencanaan|tim_perencana_rutin|tim_survey|tim_pengawasan|tim_pengawas_rutin|konsultan_perencana|konsultan_pengawasan|kontraktor|auditor|admin_peil_banjir|tim_teknis_peil_banjir|Role|role|permissions|PERMISSION_ROLES|PAGE_PERMISSIONS|ALL_ROLES|canAccessPage|hasPermission" src prisma docs AGENTS.md
```

## 3. Backup

Backup source tidak dibuat karena RBAC-GLOBAL.1 hanya membuat dokumen audit baru dan tidak mengubah source runtime.

File baru:

```text
docs/audit/SIAGA_SDA_RBAC_GLOBAL_1_AUDIT_ROLE_PERMISSION_MENU_HALO.md
```

## 4. Daftar Role yang Ditemukan

### 4.1 Role Frontend TypeScript

`src/types/index.ts` memuat role aktif frontend:

| Role frontend | Status |
| --- | --- |
| `super_admin` | Aktif frontend |
| `admin` | Aktif frontend |
| `pejabat_pengadaan` | Aktif frontend |
| `pphp` | Aktif frontend |
| `admin_sub_kegiatan` | Aktif frontend, DB compatibility ke `ADMINISTRASI_KONTRAK` |
| `admin_peil_banjir` | Frontend-only, belum Prisma |
| `pptk` | Aktif frontend |
| `ppk` | Aktif frontend |
| `kabid` | Aktif frontend |
| `direksi_teknis` | Aktif frontend |
| `pimpinan` | Aktif frontend |
| `tim_teknis_peil_banjir` | Frontend-only, belum Prisma |
| `tim_perencanaan` | Aktif frontend |
| `tim_survey` | Aktif frontend |
| `tim_pengawasan` | Aktif frontend |
| `konsultan_perencana` | Aktif frontend |
| `konsultan_pengawasan` | Aktif frontend |
| `kontraktor` | Aktif frontend |
| `auditor` | Aktif frontend |

### 4.2 Role Prisma Enum

`prisma/schema.prisma` enum `Role` saat ini:

| Role Prisma | Mapping frontend |
| --- | --- |
| `SUPER_ADMIN` | `super_admin` |
| `ADMIN` | `admin` |
| `PEJABAT_PENGADAAN` | `pejabat_pengadaan` |
| `PPHP` | `pphp` |
| `ADMINISTRASI_KONTRAK` | `admin_sub_kegiatan` |
| `KEPALA_DINAS` | `pimpinan` |
| `PIMPINAN` | `pimpinan` |
| `PPK` | `ppk` |
| `PPTK` | `pptk` |
| `KABID` | `kabid` |
| `DIREKSI_TEKNIS` | `direksi_teknis` |
| `KONSULTAN_PERENCANA` | `konsultan_perencana` |
| `KONSULTAN_PENGAWAS` | `konsultan_pengawasan` |
| `TIM_PERENCANA` | `tim_perencanaan` |
| `TIM_SURVEYOR` | `tim_survey` |
| `TIM_PENGAWAS` | `tim_pengawasan` |
| `KONTRAKTOR` | `kontraktor` |
| `AUDITOR` | `auditor` |

Belum ada di Prisma:

- `ADMIN_PEIL_BANJIR`
- `TIM_TEKNIS_PEIL_BANJIR`
- `ADMIN_SURAT`
- `ADMIN_ASSET`
- `MANDOR_OPERASIONAL_SDA`
- `MANDOR_PINTU_AIR`
- `PETUGAS_PINTU_AIR`
- `MANDOR_REHABILITASI_DRAINASE`
- `ADMIN_SISTEM`
- `ADMIN_BIDANG`
- `KEPALA_BIDANG`
- `TIM_PERENCANA_RUTIN`
- `TIM_PENGAWAS_RUTIN`

### 4.3 Role Seed

`prisma/seed.ts` hanya membuat user:

- `SUPER_ADMIN`
- `ADMIN`
- `PIMPINAN`
- `KABID`
- `PPK`
- `PPTK`
- `DIREKSI_TEKNIS`
- `KONSULTAN_PENGAWAS`
- `TIM_PENGAWAS`
- `KONSULTAN_PERENCANA`
- `TIM_PERENCANA`
- `KONTRAKTOR`

Belum ada seed untuk:

- `PEJABAT_PENGADAAN`
- `PPHP`
- `ADMINISTRASI_KONTRAK`
- `TIM_SURVEYOR`
- `AUDITOR`
- role Peil frontend-only

### 4.4 Role Docs

Dokumen final memuat role lebih luas daripada runtime:

- `ADMIN_SISTEM`
- `ADMIN_SDA` / `ADMIN_BIDANG`
- `ADMIN_SURAT`
- `ADMIN_PEIL`
- `ADMIN_SUB_KEGIATAN`
- `TIM_PERENCANA_RUTIN`
- `TIM_PENGAWAS_RUTIN`
- `MANDOR_OPERASIONAL_SDA`
- `MANDOR_REHAB_DRAINASE`
- role Peil konseptual: `admin_peil_banjir`, `tim_teknis_peil_banjir`

Status: dokumen blueprint lebih maju daripada runtime dan schema. Ini wajar, tetapi perlu matrix resmi agar tidak terjadi klaim akses yang belum siap.

## 5. Perbandingan Role Docs vs Frontend vs Prisma vs Seed

| Role target | Docs | Frontend TS | Prisma | Seed | Status |
| --- | --- | --- | --- | --- | --- |
| super_admin | Ya | Ya | Ya | Ya | Aktif |
| admin | Ya | Ya | Ya | Ya | Aktif |
| admin_sistem | Ya | Alias ke `admin` | Tidak | Tidak | Alias dokumen |
| admin_bidang/admin_sda | Ya | Alias ke `admin` | Tidak | Tidak | Alias dokumen |
| admin_sub_kegiatan | Ya | Ya | Via `ADMINISTRASI_KONTRAK` | Tidak | Compatibility |
| kabid/kepala_bidang | Ya | `kabid` | `KABID` | Ya | Alias ke `kabid` |
| pimpinan/kepala_dinas | Ya | `pimpinan` | `PIMPINAN`/`KEPALA_DINAS` | Ya | Aktif |
| ppk | Ya | Ya | Ya | Ya | Aktif |
| pptk | Ya | Ya | Ya | Ya | Aktif |
| direksi_teknis | Ya | Ya | Ya | Ya | Aktif |
| pejabat_pengadaan | Ya | Ya | Ya | Belum | Aktif schema, belum seed |
| pphp | Ya | Ya | Ya | Belum | Aktif schema, belum seed |
| tim_perencanaan/tim_perencana_rutin | Ya | `tim_perencanaan` | `TIM_PERENCANA` | Ya | Alias rutin |
| tim_survey | Ya | Ya | `TIM_SURVEYOR` | Belum | Aktif schema, belum seed |
| tim_pengawasan/tim_pengawas_rutin | Ya | `tim_pengawasan` | `TIM_PENGAWAS` | Ya | Alias rutin |
| konsultan_perencana | Ya | Ya | Ya | Ya | Aktif |
| konsultan_pengawasan/konsultan_pengawas | Ya | `konsultan_pengawasan` | `KONSULTAN_PENGAWAS` | Ya | Alias |
| kontraktor | Ya | Ya | Ya | Ya | Aktif |
| auditor | Ya | Ya | Ya | Belum | Aktif schema, belum seed |
| admin_peil_banjir | Ya | Ya | Tidak | Tidak | Frontend-only, belum boleh DB |
| tim_teknis_peil_banjir | Ya | Ya | Tidak | Tidak | Frontend-only, belum boleh DB |
| admin_surat | Ya | Alias `null` | Tidak | Tidak | Belum aktif |
| admin_asset | Ya | Alias `null` | Tidak | Tidak | Belum aktif |
| mandor_operasional_sda | Ya | Alias `null` | Tidak | Tidak | Belum aktif |
| mandor_pintu_air | Ya | Alias `null` | Tidak | Tidak | Belum aktif |
| petugas_pintu_air | Ya | Alias `null` | Tidak | Tidak | Belum aktif |
| mandor_rehabilitasi_drainase | Ya | Alias `null` | Tidak | Tidak | Belum aktif |

## 6. Audit Alias Role

| Alias / Role input | Dipetakan ke | Lokasi mapping | Aman/Tidak | Catatan |
| --- | --- | --- | --- | --- |
| `admin_sistem` | `admin` | `src/lib/roles.ts` | Aman sementara | Hak Admin Sistem belum dibedakan dari Admin umum |
| `admin_bidang` / `admin_sda` | `admin` | `src/lib/roles.ts` | Perlu audit lanjut | Bisa terlalu luas karena menjadi Admin umum |
| `admin_sub_kegiatan` | `admin_sub_kegiatan` -> DB `ADMINISTRASI_KONTRAK` | `roles.ts`, `project-db.ts`, `db-mappers.ts` | Aman dengan catatan | Compatibility wajib dijaga |
| `kepala_bidang` | `kabid` | `roles.ts` | Aman | Perlu konsisten label UI |
| `kepala_dinas` | `pimpinan` | `roles.ts`, `db-mappers.ts` | Aman | Prisma punya `KEPALA_DINAS` dan `PIMPINAN`, keduanya map ke `pimpinan` |
| `tim_perencana_rutin` | `tim_perencanaan` | `roles.ts` | Aman sementara | Label runtime belum membedakan rutin/non-rutin |
| `tim_pengawas_rutin` | `tim_pengawasan` | `roles.ts` | Aman sementara | Label runtime belum membedakan rutin/non-rutin |
| `konsultan_pengawas` | `konsultan_pengawasan` | `roles.ts` | Aman | Naming frontend memakai `pengawasan` |
| `administrasi_kontrak` | `admin_sub_kegiatan` | `db-mappers.ts` | Aman sementara | DB compatibility |
| `admin_peil` | `admin_peil_banjir` | `roles.ts` | Belum DB | Hanya frontend/runtime |
| `admin_peil_banjir` | `admin_peil_banjir` | `roles.ts` | Belum DB | Prisma belum mendukung |
| `tim_teknis_peil_banjir` | `tim_teknis_peil_banjir` | `roles.ts` | Belum DB | Prisma belum mendukung |
| `admin_surat` | `null` | `roles.ts` | Aman karena belum aktif | Jangan dipaksa runtime |
| `admin_asset` | `null` | `roles.ts` | Aman karena belum aktif | Jangan dipaksa runtime |
| `mandor_operasional_sda` | `null` | `roles.ts` | Aman karena belum aktif | Butuh tahap khusus |
| `mandor_pintu_air` | `null` | `roles.ts` | Aman karena belum aktif | Butuh tahap khusus |
| `petugas_pintu_air` | `null` | `roles.ts` | Aman karena belum aktif | Petugas biasa tidak wajib login |
| `mandor_rehabilitasi_drainase` | `null` | `roles.ts` | Aman karena belum aktif | Butuh tahap khusus |

## 7. Audit Permission

| Permission | Role yang mendapat akses | Halaman/menu terkait | Terlalu luas? | Catatan |
| --- | --- | --- | --- | --- |
| `view_dashboard` | Semua role frontend termasuk Peil | `/dashboard` | Tidak | Super Admin tetap bypass semua permission |
| `view_map` | `ALL_ROLES` non-Peil | `/peta`, `/asset` | Perlu audit | Asset memakai `view_map`, role Peil tidak dapat Asset |
| `view_peil_banjir` | admin, kabid, pimpinan, ppk, pptk, direksi_teknis, auditor, role Peil | `/peil` | Cukup ketat | Tim Perencana memang tidak masuk |
| `view_surat` | admin, kabid, pimpinan, ppk, pptk, auditor, admin_peil_banjir | `/surat` | Cukup ketat | Super Admin via bypass |
| `view_projects` | `ALL_ROLES` non-Peil | `/proyek` | Perlu scope assignment | Role eksternal masih dapat menu Paket |
| `view_reports` | core read + field + admin_sub | `/laporan` | Relatif aman | Kontraktor dapat laporan melalui field roles |
| `view_survey` | core read + planning + pptk + admin_sub | `/survey` | Relatif aman | Tim Pengawasan tidak dapat Survey |
| `view_issues` | core read + field + pphp + admin_sub | `/masalah` | Relatif aman | Kontraktor dapat issues |
| `view_approval` | core read + pptk/direksi/tim_pengawasan/konsultan_pengawasan/pphp/admin_sub | `/approval` | Perlu audit per role | Pimpinan/auditor read-only perlu dijaga di UI/backend |
| `view_chat` | `ALL_ROLES` non-Peil | `/chat` | Perlu pembatasan assignment | Chat harus project-scoped |
| `view_announcements` | `ALL_ROLES` non-Peil | `/pengumuman` | Tidak kritis | Route lama sebagai child dashboard |
| `view_settings` | `ALL_ROLES` non-Peil | `/pengaturan` | Terlalu luas jika berisi sistem | Pengaturan harus membedakan profil pribadi vs sistem |
| `view_audit_log` | super/admin/ppk/pimpinan/kabid/auditor | `/audit-log` | Aman | Role read-only perlu dijaga |
| `view_keuangan` | core read + pejabat/admin_sub/auditor | `/serapan-anggaran` | Relatif aman | Perlu scope tahun/sub kegiatan |
| `manage_users` | super_admin/admin | `/pengguna` | Aman | Admin tidak boleh kelola admin/super admin |
| `manage_admin_users` | super_admin | internal | Aman | Tidak tampak sebagai route terpisah |
| `manage_projects` | super/admin/ppk/pejabat/admin_sub | `/proyek` actions | Perlu audit | Harus tetap scoped |
| `create_survey` | super/admin/pptk/tim_perencanaan/tim_survey/konsultan_perencana | survey actions | Relatif aman | Role Peil teknis belum punya create survey Peil formal |
| `upload_rab` | super/admin/tim_perencanaan/tim_survey/konsultan_perencana/pejabat | RAB | Perlu audit | Tim Survey boleh upload RAB, perlu keputusan normatif |
| `approve_rab` | super/admin/ppk | RAB | Aman |
| `approve_survey` | super/admin/ppk/pptk/kabid/direksi | Survey approval | Perlu audit | Approval formal perlu konsisten dengan Approval Center |
| `create_laporan` | super/admin/pptk/tim_pengawasan/konsultan_pengawasan/kontraktor | Laporan | Aman jika scoped |
| `approve_laporan` | super/admin/ppk/pphp | Laporan | Aman |
| `reject_item` | super/admin/ppk/pptk/kabid/direksi/pphp | Approval actions | Perlu audit backend | Jangan tampil ke read-only |
| `request_revision` | super/admin/ppk/pptk/kabid/direksi/pphp | Approval actions | Perlu audit backend | Sama dengan reject |
| `delete_laporan` | super/admin/ppk | Laporan | Aman |
| `create_catatan_pengawasan` | super/admin/direksi/tim_pengawasan/konsultan_pengawasan/pphp | Pengawasan | Aman |
| `create_masalah` | super/admin/pptk/direksi/tim_pengawasan/konsultan_pengawasan/pphp/kontraktor | Masalah | Aman jika scoped |
| `resolve_masalah` | super/admin/ppk/pptk/direksi | Masalah | Perlu audit role lapangan |
| `send_chat` | `ALL_ROLES` non-Peil | Chat | Perlu scope assignment |
| `delete_chat` | super/admin/ppk | Chat | Aman |
| `manage_contracts` | super/admin/ppk/pejabat/admin_sub | Kontrak/Administrasi | Aman jika scoped |
| `upload_documents` | super/admin/ppk/pptk/pejabat/admin_sub/pphp | Dokumen | Perlu scope paket |
| `publish_announcements` | super/admin/ppk | Pengumuman | Perlu audit |

## 8. Audit Route/Page Permission

| Route | Permission | Role boleh | Role tidak boleh / risiko |
| --- | --- | --- | --- |
| `/dashboard` | `view_dashboard` | Semua role frontend | Tidak ada isu besar |
| `/peta` | `view_map` | Semua non-Peil frontend | Peil role tidak dapat peta; perlu keputusan apakah Peil butuh peta lokasi |
| `/survey` | `view_survey` | core read, planning, pptk, admin_sub | Tim Pengawasan/kontraktor tidak dapat survey |
| `/proyek` | `view_projects` | Semua non-Peil frontend | Perlu assignment guard kuat |
| `/approval` | `view_approval` | core read + role approval tertentu | Kontraktor/planning tidak boleh |
| `/surat` | `view_surat` | super/admin/kabid/pimpinan/ppk/pptk/auditor/admin_peil | Tim Perencana tidak boleh |
| `/administrasi` | `view_contracts` | super/admin/core read/pejabat/admin_sub/pphp | PPTK/direksi/tim lapangan tidak boleh |
| `/peil` | `view_peil_banjir` | super/admin/kabid/pimpinan/ppk/pptk/direksi/auditor/admin_peil/tim_teknis_peil | Tim Perencana tidak boleh |
| `/asset` | `view_map` | Semua non-Peil frontend | Asset belum punya permission khusus |
| `/audit-log` | `view_audit_log` | super/admin/ppk/pimpinan/kabid/auditor | Role lain tidak boleh |
| `/pengaturan` | `view_settings` | Semua non-Peil frontend | Terlalu luas jika isi pengaturan sistem tidak dipisah |
| `/pengguna` | `manage_users` | super/admin | Aman |
| `/pengumuman` | `view_announcements` | Semua non-Peil frontend | Route lama masih ada |
| `/rab` | `view_rab` | core read/planning/pejabat/admin_sub | Perlu mapping ke Paket/Administrasi |
| `/kontrak` | `view_contracts` | core read/pejabat/admin_sub/pphp | Perlu mapping ke Administrasi |
| `/dokumen` | `view_documents` | Semua non-Peil frontend | Terlalu luas jika dokumen belum scoped |
| `/masalah` | `view_issues` | core read/field/pphp/admin_sub | Aman jika scoped |
| `/chat` | `view_chat` | Semua non-Peil frontend | Perlu assignment guard |
| `/serapan-anggaran` | `view_keuangan` | core read/pejabat/admin_sub/auditor | Perlu scope tahun/sub kegiatan |
| `/panduan` | `view_dashboard` | Semua role dashboard | Aman |

Catatan teknis: `canAccessPage()` sudah memakai fallback parent-route dengan `href.startsWith(path + '/')`, sehingga route detail turunan mengikuti permission parent.

## 9. Audit Menu Sidebar dan MobileNav

Sidebar:

- Mengambil menu dari `MAIN_NAVIGATION_ITEMS`.
- Filter role memakai `canAccessPage(currentUser.role, item.routeKey)`.
- Badge Approval memakai `ApprovalSummaryProvider`.

MobileNav:

- Mengambil sumber menu yang sama.
- Bottom nav dan menu drawer sama-sama difilter dengan `canAccessPage()`.
- Search menu hanya bekerja atas menu yang sudah lolos filter.

Temuan:

- Menu Peil tidak muncul untuk Tim Perencana/Rutin karena role tersebut tidak punya `view_peil_banjir`. Ini benar menurut RBAC saat ini.
- Menu Surat tidak muncul untuk Tim Perencana/Rutin karena role tersebut tidak punya `view_surat`. Ini konsisten.
- Role eksternal seperti kontraktor/konsultan masih dapat menu internal tertentu melalui `ALL_ROLES`, misalnya Paket, Chat, Dokumen, Peta. Ini harus bergantung pada assignment scope. Jika scope bocor, risikonya tinggi.
- `Asset SDA` saat ini memakai permission `view_map`, bukan permission khusus `view_asset`. Ini perlu audit lanjut.
- `Pengaturan` tampil untuk semua `ALL_ROLES` non-Peil karena `view_settings`. Jika halaman hanya profil pribadi, aman; jika memuat sistem, perlu pemisahan permission.

## 10. Audit Dashboard per Role

Dashboard memakai beberapa mekanisme role-aware:

- `getScopedProjects(projects, currentUser)`
- `canAccessPage(currentRole, route)`
- `DashboardRoleHeader`
- `CommandCenterOverview`
- quick actions per role
- filter KPI/card berdasarkan route access

| Role | Dashboard title/header | Quick action/card | Masalah | Rekomendasi |
| --- | --- | --- | --- | --- |
| super_admin | Command Center umum | Semua akses via bypass | Bisa melihat semua, sesuai role | Tetap butuh audit log kuat |
| admin | Admin umum | User/proyek/approval/surat sesuai filter | Admin Sistem/Admin Bidang masih jadi admin umum | Pisahkan label/UX tanpa mengubah DB dulu |
| admin_sub_kegiatan | Admin Sub Kegiatan | Paket/kontrak/dokumen | DB masih `ADMINISTRASI_KONTRAK` | Pertahankan compatibility |
| kabid/kepala_bidang | Kepala Bidang | Monitoring, risiko, approval read/decision | Alias cukup aman | Pastikan read-only jika tidak berwenang tulis |
| pimpinan | Pimpinan | Monitoring/read-only | Perlu pastikan tidak ada tombol tulis | Audit quick action lanjutan |
| ppk | PPK | Approval, paket kritis, audit | Cocok | Pastikan scoped bila bukan view all |
| pptk | PPTK | Laporan, survey/approval tertentu | Mendapat `/peil` dan `/surat` | Perlu pastikan ini memang keputusan final |
| direksi_teknis | Direksi Teknis | Teknis/pengawasan/Peil | Dapat Peil, tidak Surat | Cocok untuk teknis |
| pejabat_pengadaan | Pejabat Pengadaan | Paket/RAB/kontrak | Tidak seed | Perlu akun seed bila diperlukan |
| pphp | PPHP | Pemeriksaan/laporan/approval | Tidak seed | Perlu akun seed bila diperlukan |
| tim_perencanaan/tim_perencana_rutin | Perencana | Survey/RAB/Paket | Tidak Peil/Surat, tetapi Halo menyebut Peil | Perbaiki Halo role-aware |
| tim_survey | Tim Survey | Survey/RAB/Paket | Tidak Peil/Surat | Cocok sementara |
| tim_pengawasan/tim_pengawas_rutin | Pengawas | Laporan/masalah/pengawasan | Tidak Peil/Surat | Cocok sementara |
| konsultan_perencana | Perencana konsultan | Survey/RAB/Paket | Tidak Peil/Surat | Cocok sementara |
| konsultan_pengawasan | Pengawas konsultan | Laporan/masalah/approval read | Tidak Peil/Surat | Cocok |
| kontraktor | Penyedia | Laporan/chat/masalah/paket | Dapat Dokumen/Chat via ALL_ROLES | Perlu scope assignment ketat |
| auditor | Auditor | Audit/read-only | Dapat Peil/Surat/Audit | Cocok jika read-only |
| admin_peil_banjir | Peil frontend-only | Dashboard/Peil/Surat | Belum DB/Prisma | Jangan seed/open DB |
| tim_teknis_peil_banjir | Peil frontend-only | Dashboard/Peil | Belum DB/Prisma | Jangan seed/open DB |

Temuan dashboard spesifik:

- `CommandCenterOverview` sudah menerima `canViewApproval` dan menyembunyikan link Approval saat tidak punya akses.
- KPI/card utama sudah banyak difilter dengan `canAccessPage`.
- Ada role action broad view seperti `Admin Surat/Peil/Asset` dan `Mandor/Petugas` pada panel tugas per role/user. Ini konseptual dan perlu dipastikan tidak tampil sebagai akses resmi untuk role yang belum aktif.
- Tidak ada perubahan modal Dashboard 4D.2 pada audit ini.

## 11. Audit Halo SIAGA-SDA

Komponen aktif: `src/components/ai/ProjectAiAssistant.tsx`.

Temuan utama:

- `ProjectAiAssistant` mengenali role label dan summary Peil.
- FAQ `faqItems` bersifat statis.
- FAQ selalu memuat pertanyaan:

```text
Apa fungsi Peil Banjir di SIAGA-SDA?
```

- Tidak ada filter `hasPermission()` atau `canAccessPage()` untuk FAQ.
- Akibatnya role tanpa `view_peil_banjir`, termasuk Tim Perencana/Rutin, tetap melihat topik Peil Banjir di Halo.

Matrix rekomendasi Halo:

| Role | Suggestion Halo yang boleh | Suggestion yang tidak boleh | Masalah ditemukan | Rekomendasi |
| --- | --- | --- | --- | --- |
| super_admin/admin | Semua panduan sistem dengan label konseptual | Klaim aksi resmi tanpa data | Belum ada filter khusus | Boleh luas, tetap label lokal |
| admin_sub_kegiatan | Paket, administrasi, dokumen, assignment | Peil jika tidak punya akses | FAQ Peil statis | Filter by permission |
| kabid/pimpinan | Monitoring, risiko, read-only, dashboard | Aksi tulis user management | FAQ belum role-aware | Filter action/suggestion |
| ppk/pptk | Approval/paket/laporan/surat/Peil sesuai permission | User management | FAQ belum role-aware | Gunakan permission map |
| direksi_teknis | Teknis, pengawasan, Peil | Surat admin, user management | FAQ belum role-aware | Gunakan permission map |
| tim_perencanaan/tim_perencana_rutin | Misi harian, Survey, RAB/perencanaan, belum assignment | Peil, Surat, Approval formal, Pengaturan user | Peil tampil padahal menu Peil disembunyikan | Harus diperbaiki segera |
| tim_survey | Survey, foto/GPS, rekomendasi survey | Peil, Surat, Approval formal | FAQ Peil statis | Filter by permission |
| tim_pengawasan/tim_pengawas_rutin | Laporan, pengawasan, masalah | Peil, Surat, user management | FAQ Peil statis | Filter by permission |
| konsultan_perencana | Survey/RAB/dokumen perencanaan scoped | Peil, Surat, user management | FAQ Peil statis | Filter by permission |
| konsultan_pengawasan | Laporan/pengawasan/masalah scoped | Peil, Surat, user management | FAQ Peil statis | Filter by permission |
| kontraktor | Laporan, chat, masalah, paket assignment | Peil, Surat, Approval formal, user management | FAQ Peil statis | Filter by permission |
| auditor | Audit/read-only, dashboard, dokumen | Aksi tulis | FAQ Peil boleh jika punya `view_peil_banjir`, tetapi read-only | Tambah label read-only |
| admin_peil_banjir | Peil, Surat sumber permohonan, dokumen peil | Pengaturan user jika tidak punya manage_users | Belum DB | Tetap label frontend-only |
| tim_teknis_peil_banjir | Peil teknis, survey lokasi peil | Surat admin, approval formal, user management | Belum DB | Tetap label frontend-only |

Rekomendasi langsung tahap berikutnya:

- Tambahkan konfigurasi suggestion Halo berbasis permission.
- Setiap item FAQ/suggestion punya `accessPath` atau `permission`.
- Tampilkan hanya jika `canAccessPage(currentUser.role, accessPath)` true.
- Untuk topik konseptual lintas modul, beri label "Panduan umum" dan hindari topik modul spesifik yang user tidak punya akses.

## 12. Audit Manajemen Pengguna

Komponen aktif: `src/app/(dashboard)/pengguna/page.tsx`.

Temuan:

- Role ditampilkan dari `ROLE_DEFINITIONS`.
- `PENDING_PRISMA_ROLES` memblokir:
  - `admin_peil_banjir`
  - `tim_teknis_peil_banjir`
- Card role untuk role Peil tidak muncul di pilihan assignable role karena `ASSIGNABLE_ROLES`.
- Submit form juga memblokir role Peil dengan pesan:

```text
Role Peil Banjir belum dapat disimpan sebelum Prisma/database dimigrasikan
```

Risiko:

- Statistik "Staff Dinas" menghitung role Peil jika ada di store, tetapi role tersebut belum dapat berasal dari DB resmi.
- API user create/update belum punya explicit pending-role guard; saat ini aman karena UI memblokir, tetapi API sebaiknya tidak mengandalkan UI.
- `toRole()` fallback ke `KONTRAKTOR` jika menerima role tidak dikenal.

## 13. Audit Prisma/Database Risk

Temuan:

- `User.role` memakai enum Prisma `Role`.
- `PaketAssignment.rolePaket` juga memakai enum `Role`.
- Role Peil belum ada di enum.
- `toRole()` belum mengenali role Peil dan fallback ke `KONTRAKTOR`.
- `mapDbRole()` belum mengenali role Peil dan fallback ke `pptk`.
- Auth/session memakai `mapDbRole()`, sehingga mapper inbound wajib benar sebelum role DB baru digunakan.
- `prisma/seed.ts` belum memiliki role Peil, PPHP, Pejabat Pengadaan, Auditor, Tim Surveyor, dan Admin Sub Kegiatan compatibility.

Risiko utama:

| Risiko | Dampak | Rekomendasi |
| --- | --- | --- |
| Role Peil dibuka sebelum Prisma migration | Save user gagal atau role fallback salah | Tetap blokir sampai PB-RBAC migration khusus |
| Mapper inbound belum update setelah migration | User login sebagai role salah | Update `mapDbRole()` dalam batch migration |
| Mapper outbound belum update | API create/update user salah | Update `toRole()` dalam batch migration |
| Role enum dipakai di `PaketAssignment.rolePaket` | Role Peil dapat bocor ke assignment paket | Tambah guard assignment paket |
| Admin Sistem/Admin Bidang dipetakan ke Admin umum | Hak terlalu luas | Desain role DB/permission khusus bertahap |

## 14. Matrix Final Role-Menu

Keterangan:

- `Ya`: dapat menu/route berdasarkan RBAC.
- `Tidak`: tidak dapat berdasarkan RBAC.
- `Read-only`: perlu dijaga di UI/backend sebagai baca saja.
- `Sesuai assignment`: perlu filter data scoped.
- `Frontend-only`: role belum Prisma/database.

| Role | Dashboard | Peta | Survey | Paket | Approval | Surat | Administrasi | Peil | Asset | Audit Log | Pengaturan | Catatan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| super_admin | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Bypass semua permission |
| admin | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Admin umum terlalu luas untuk Admin Sistem/Bidang |
| admin_sistem | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Alias ke `admin` |
| admin_bidang/admin_sda | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Alias ke `admin`, perlu tahap role khusus |
| admin_sub_kegiatan | Ya | Ya | Ya | Ya | Ya | Tidak | Ya | Tidak | Ya | Tidak | Ya | DB compatibility `ADMINISTRASI_KONTRAK` |
| kabid/kepala_bidang | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Harus dominan read/decision |
| pimpinan | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Read-only wajib dijaga |
| ppk | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Decision role |
| pptk | Ya | Ya | Ya | Ya | Ya | Ya | Tidak | Ya | Ya | Tidak | Ya | Surat/Peil terbuka saat ini |
| direksi_teknis | Ya | Ya | Tidak | Ya | Ya | Tidak | Tidak | Ya | Ya | Tidak | Ya | Peil teknis terbuka |
| pejabat_pengadaan | Ya | Ya | Tidak | Ya | Tidak | Tidak | Ya | Tidak | Ya | Tidak | Ya | Belum seed |
| pphp | Ya | Ya | Tidak | Ya | Ya | Tidak | Ya | Tidak | Ya | Tidak | Ya | Belum seed |
| tim_perencanaan/tim_perencana_rutin | Ya | Ya | Ya | Ya | Tidak | Tidak | Tidak | Tidak | Ya | Tidak | Ya | Halo masih menampilkan Peil, perlu fix |
| tim_survey | Ya | Ya | Ya | Ya | Tidak | Tidak | Tidak | Tidak | Ya | Tidak | Ya | Belum seed |
| tim_pengawasan/tim_pengawas_rutin | Ya | Ya | Tidak | Ya | Ya | Tidak | Tidak | Tidak | Ya | Tidak | Ya | Sesuai assignment |
| konsultan_perencana | Ya | Ya | Ya | Ya | Tidak | Tidak | Tidak | Tidak | Ya | Tidak | Ya | Sesuai assignment |
| konsultan_pengawasan | Ya | Ya | Tidak | Ya | Ya | Tidak | Tidak | Tidak | Ya | Tidak | Ya | Sesuai assignment |
| kontraktor | Ya | Ya | Tidak | Ya | Tidak | Tidak | Tidak | Tidak | Ya | Tidak | Ya | Perlu scope ketat untuk Paket/Chat/Dokumen |
| auditor | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Read-only wajib |
| admin_peil_banjir | Ya | Tidak | Tidak | Tidak | Tidak | Ya | Tidak | Ya | Tidak | Tidak | Tidak | Frontend-only, belum DB |
| tim_teknis_peil_banjir | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Ya | Tidak | Tidak | Tidak | Frontend-only, belum DB |
| admin_surat | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Alias null |
| admin_asset | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Alias null |
| mandor_operasional_sda | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Alias null |
| mandor_pintu_air | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Alias null |
| petugas_pintu_air | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Petugas biasa tidak wajib login |
| mandor_rehabilitasi_drainase | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Belum boleh | Alias null |

## 15. Temuan Prioritas

### A. Harus Diperbaiki Segera

1. Halo SIAGA-SDA menampilkan FAQ Peil Banjir untuk role tanpa `view_peil_banjir`.
2. Halo SIAGA-SDA belum memakai `canAccessPage()` atau `hasPermission()` untuk suggestion modul.
3. Halo SIAGA-SDA bisa membahas Surat/Approval/Pengaturan secara umum tanpa guard role jika konten ditambah nanti.
4. API user create/update belum punya guard eksplisit untuk role frontend-only Peil; saat ini UI memblokir, tetapi API tetap bergantung pada mapper fallback.

### B. Perlu Diperbaiki Bertahap

1. `Asset SDA` masih memakai permission `view_map`, belum `view_asset`.
2. `view_settings` terlalu luas bila halaman Pengaturan memuat fitur sistem, bukan hanya profil pribadi.
3. Role `admin_sistem` dan `admin_bidang/admin_sda` masih alias ke `admin`, sehingga tidak ada pemisahan kewenangan.
4. Dashboard action broad view berisi role konseptual `Admin Surat/Peil/Asset` dan `Mandor/Petugas`; perlu dipastikan tetap konseptual dan tidak dianggap runtime resmi.
5. Seed belum mencakup beberapa role Prisma yang sudah ada.
6. Role external masih melihat beberapa menu berbasis `ALL_ROLES`; keamanan bergantung pada assignment scope.

### C. Ditunda Sampai Migration/Database

1. Menyimpan `admin_peil_banjir` ke `User.role`.
2. Menyimpan `tim_teknis_peil_banjir` ke `User.role`.
3. Menambahkan role Peil ke Prisma enum.
4. Membuka role Peil di Manajemen Pengguna.
5. Membuat seed user Peil.
6. Mengaktifkan `admin_surat`, `admin_asset`, mandor, dan petugas pintu air.

### D. Jangan Disentuh Dulu

1. Login final.
2. Auth/NextAuth.
3. Middleware.
4. Prisma schema.
5. Migration/database.
6. Seed.
7. Package/dependency.
8. Endpoint Approval read-only.
9. Dashboard modal 4D.2.
10. Shared modal portal.
11. Bootstrap dan sync-version.

## 16. Rekomendasi Tahap Perbaikan Berikutnya

Rekomendasi urutan aman:

1. **RBAC-GLOBAL.2 - Fix Halo Role-Aware Suggestions**
   - Tambahkan metadata suggestion berbasis permission/accessPath.
   - Sembunyikan Peil dari role tanpa `view_peil_banjir`.
   - Sembunyikan Surat dari role tanpa `view_surat`.
   - Sembunyikan Approval dari role tanpa `view_approval`.
   - Sembunyikan User Management/Pengaturan sistem dari role tanpa `manage_users`.

2. **RBAC-GLOBAL.3 - Audit dan Perbaiki Permission Asset/Pengaturan**
   - Pisahkan `view_asset` dari `view_map`.
   - Pisahkan pengaturan profil pribadi dari pengaturan sistem.

3. **RBAC-GLOBAL.4 - API Guard Role Pending**
   - Tambahkan guard server-side agar role frontend-only tidak bisa tersimpan melalui API sebelum Prisma siap.

4. **PB-RBAC Migration Khusus**
   - Hanya jika user menyetujui eksplisit.
   - Tambah enum Prisma role Peil, mapper inbound/outbound, generated client, UI Manajemen Pengguna.

5. **RBAC-GLOBAL.5 - Matrix Assignment Scope**
   - Audit data scoped untuk kontraktor, konsultan, tim lapangan, admin_sub_kegiatan, dan Peil.

## 17. File yang Sengaja Tidak Disentuh

- halaman login
- Auth/NextAuth
- middleware
- Prisma schema
- migrations
- database
- seed
- package/dependency
- endpoint API
- Dashboard/modal 4D.2
- Approval Center runtime
- shared modal portal
- bootstrap
- sync-version
- source runtime aplikasi

## 18. Validasi

Validasi yang wajib setelah dokumen dibuat:

- `git diff --check`

Validasi tambahan yang aman:

- `npx.cmd tsc --noEmit`

`npm run build` tidak wajib karena tahap ini hanya dokumen audit dan tidak mengubah TypeScript/TSX runtime.

## 19. Kesimpulan

Masalah awal bukan karena menu Peil Banjir salah. Menu Peil untuk Tim Perencana/Rutin memang tidak tampil karena role tersebut tidak memiliki `view_peil_banjir`.

Masalah utama berada pada Halo SIAGA-SDA:

```text
FAQ/suggestion Halo masih statis dan belum difilter berdasarkan permission role.
```

RBAC menu desktop/mobile sudah memakai `canAccessPage()`, tetapi Halo belum. Karena Halo adalah guidance yang terlihat lintas halaman, ia harus memakai matrix permission yang sama agar tidak menyarankan modul yang tidak dimiliki role.

Perbaikan pertama yang paling aman adalah RBAC-GLOBAL.2: membuat suggestion Halo role-aware tanpa mengubah Prisma, Auth, database, login, atau Dashboard modal.
