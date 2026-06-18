# SIAGA-SDA PB-RBAC.2 — Audit Akses Menu Peil Banjir dan Surat

Tanggal audit: 2026-06-19  
Commit acuan: `fdd7945 feat: audit role runtime peil banjir tahap pb-rbac-1`  
Project: SIAGA-SDA

## 1. Tujuan Tahap

Tahap PB-RBAC.2 mengaudit perubahan PB-RBAC.1 setelah route:

- `/peil` dipisah dari `view_map` menjadi `view_peil_banjir`;
- `/surat` dipisah dari `view_announcements` menjadi `view_surat`;
- role `admin_peil_banjir` dan `tim_teknis_peil_banjir` disiapkan di frontend runtime secara terbatas.

Tujuan utama tahap ini adalah memastikan role lama yang masih relevan tetap dapat mengakses Peil Banjir/Surat, sementara role baru Peil tidak terbuka ke menu sensitif.

## 2. File yang Diaudit

- `AGENTS.md`
- `docs/core/SIAGA_SDA_PEIL_BANJIR_FINAL_CONCEPT.md`
- `docs/modules/SIAGA_SDA_PEIL_UI.md`
- `docs/audit/SIAGA_SDA_PB_DOC_1_FINALISASI_KONSEP_PEIL_BANJIR.md`
- `docs/audit/SIAGA_SDA_PB_RBAC_1_AUDIT_ROLE_RUNTIME_PEIL_BANJIR.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md`
- `src/lib/rbac.ts`
- `src/lib/navigation.ts`
- `src/lib/roles.ts`
- `src/types/index.ts`
- `src/lib/utils.ts`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/DashboardRoleHeader.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/app/(dashboard)/pengguna/page.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`

## 3. Backup

Backup runtime dibuat sebelum koreksi source:

```text
backup/backup-pb-rbac-2-audit-akses-menu-peil-surat-before-change/
```

Isi backup:

- `src/lib/rbac.ts`
- `BACKUP_FILE_LIST.md`

## 4. Struktur Permission Setelah PB-RBAC.1

Audit awal menemukan:

```ts
'/surat': 'view_surat'
'/peil': 'view_peil_banjir'
```

Pemisahan route sudah benar.

Namun `SURAT_ROLES` dan `PEIL_ROLES` masih memakai `ALL_ROLES`, sehingga role seperti kontraktor/konsultan ikut mendapat akses Surat dan Peil tanpa justifikasi eksplisit. Ini perlu dikoreksi pada PB-RBAC.2.

## 5. Koreksi Permission

Perubahan dilakukan di `src/lib/rbac.ts`.

Sebelum:

```ts
const SURAT_ROLES: Role[] = [...ALL_ROLES, 'admin_peil_banjir']
const PEIL_ROLES: Role[] = [...ALL_ROLES, 'admin_peil_banjir', 'tim_teknis_peil_banjir']
```

Sesudah:

```ts
const SURAT_ROLES: Role[] = ['admin', 'kabid', 'pimpinan', 'ppk', 'pptk', 'auditor', 'admin_peil_banjir']
const PEIL_ROLES: Role[] = ['admin', 'kabid', 'pimpinan', 'ppk', 'pptk', 'direksi_teknis', 'auditor', 'admin_peil_banjir', 'tim_teknis_peil_banjir']
```

Catatan:

- `super_admin` tetap mendapat akses melalui override `hasPermission()`.
- `admin_sistem` dan `admin_bidang` saat ini dipetakan ke runtime role `admin` melalui alias frontend.
- `kepala_bidang` dipetakan ke runtime role `kabid`.
- Role Peil baru tetap tidak dimasukkan ke `ALL_ROLES`.

## 6. Matrix Akses Role Lama

| Role | Dashboard | Surat | Peil | Approval | Pengaturan | Catatan |
| --- | --- | --- | --- | --- | --- | --- |
| `super_admin` | Ya | Ya | Ya | Ya | Ya | Override penuh via `hasPermission`. |
| `admin` | Ya | Ya | Ya | Ya | Ya | Mewakili `admin_sistem`, `admin_bidang`, dan `admin_sda` di alias frontend. |
| `kabid` | Ya | Ya | Ya | Ya | Tidak | `view_settings` tetap tidak diberikan eksplisit ke role baru; existing lama tidak diubah. |
| `pimpinan` | Ya | Ya | Ya | Ya | Tidak | Read-only konseptual; action write tidak ditambah. |
| `ppk` | Ya | Ya | Ya | Ya | Tidak | Tetap punya workflow review sesuai pola existing. |
| `pptk` | Ya | Ya | Ya | Ya | Tidak | Surat/Peil dibuka karena workflow teknis dapat melibatkan PPTK. |
| `direksi_teknis` | Ya | Tidak | Ya | Ya | Tidak | Peil dibuka sebagai teknis dinas; Surat tidak wajib. |
| `auditor` | Ya | Ya | Ya | Ya | Tidak | Read-only audit/monitoring sesuai pola existing. |
| `admin_sub_kegiatan` | Ya | Tidak | Tidak | Ya | Tidak | Tidak dibuka ke Surat/Peil karena tidak diminta pada matrix minimal. |
| `tim_survey` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak dibuka ke Peil/Surat agar tidak melebar. |
| `tim_perencanaan` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak dibuka ke Peil/Surat pada tahap ini. |
| `tim_pengawasan` | Ya | Tidak | Tidak | Ya | Tidak | Tidak dibuka ke Peil/Surat pada tahap ini. |
| `konsultan_perencana` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak dibuka tanpa dokumen/assignment Peil formal. |
| `konsultan_pengawasan` | Ya | Tidak | Tidak | Ya | Tidak | Tidak dibuka tanpa dokumen/assignment Peil formal. |
| `kontraktor` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak dibuka ke Surat/Peil. |
| `pejabat_pengadaan` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak relevan untuk Peil/Surat pada tahap ini. |
| `pphp` | Ya | Tidak | Tidak | Ya | Tidak | Tidak relevan untuk Peil/Surat pada tahap ini. |

## 7. Matrix Akses Role Peil Baru

| Role | Dashboard | Surat | Peil | Approval | Pengaturan | Catatan |
| --- | --- | --- | --- | --- | --- | --- |
| `admin_peil_banjir` | Ya | Ya | Ya | Tidak | Tidak | Akses terbatas sesuai PB-RBAC.1: Dashboard, Surat, Peil. |
| `tim_teknis_peil_banjir` | Ya | Tidak | Ya | Tidak | Tidak | Akses teknis hanya Dashboard dan Peil. |

## 8. Temuan Akses Aman

- Route `/peil` sudah memakai `view_peil_banjir`.
- Route `/surat` sudah memakai `view_surat`.
- Role Peil baru tidak masuk `ALL_ROLES`.
- Admin Peil tidak mendapat Approval/Pengaturan/User Management.
- Tim Teknis Peil tidak mendapat Surat/Approval/Pengaturan.
- Form Manajemen Pengguna masih memblokir penyimpanan role Peil karena Prisma enum belum siap.
- Halo SIAGA-SDA masih memberi label dan ringkasan role Peil sebagai panduan lokal, bukan klaim aksi resmi.

## 9. Temuan yang Dikoreksi

Temuan:

- `SURAT_ROLES` masih memakai `ALL_ROLES`, sehingga kontraktor/konsultan berpotensi melihat Surat.
- `PEIL_ROLES` masih memakai `ALL_ROLES`, sehingga kontraktor/konsultan berpotensi melihat Peil.

Koreksi:

- `SURAT_ROLES` diganti menjadi daftar eksplisit role internal/pemantau yang relevan.
- `PEIL_ROLES` diganti menjadi daftar eksplisit role internal/pemantau/teknis yang relevan.

## 10. Role/Menu yang Sengaja Tidak Dibuka

Role berikut tidak diberi akses Surat/Peil pada PB-RBAC.2:

- `kontraktor`
- `konsultan_perencana`
- `konsultan_pengawasan`
- `tim_survey`
- `tim_perencanaan`
- `tim_pengawasan`
- `pejabat_pengadaan`
- `pphp`
- `admin_sub_kegiatan`

Alasan: belum ada assignment atau dokumen runtime Peil/Surat resmi yang mengharuskan akses tersebut. Prinsip aman adalah tidak membuka modul lintas role tanpa kebutuhan jelas.

## 11. Status Manajemen Pengguna

Manajemen Pengguna tetap aman:

- `admin_peil_banjir` dan `tim_teknis_peil_banjir` ada di definisi frontend.
- Role Peil belum ditawarkan sebagai role assignable di form user.
- Submit role Peil diblokir dengan pesan bahwa Prisma/database belum dimigrasikan.
- Tidak ada perubahan API user.

## 12. Status Prisma/Database

Tidak ada perubahan:

- `prisma/schema.prisma` tidak disentuh.
- Migration tidak dibuat.
- Database tidak diubah.
- Seed data tidak diubah.
- Prisma enum role belum memiliki role Peil.

## 13. Status Halo SIAGA-SDA

Halo SIAGA-SDA tetap aman:

- Label `Admin Peil Banjir` dan `Tim Teknis Peil Banjir` tersedia.
- Ringkasan role tidak menyebut akses tulis resmi.
- Ringkasan role tidak menyebut approval formal.
- Panel tetap mode panduan lokal.
- Tidak mengklaim membaca data resmi Peil.

## 14. Validasi

Diisi pada laporan akhir:

- `git diff --check`
- `npx tsc --noEmit`
- `npm run lint` jika tersedia
- `npm run build` jika dijalankan

## 15. Risiko Tersisa

1. Role Peil masih frontend-only sampai Prisma enum dan user database siap.
2. Peil Banjir belum punya assignment database formal.
3. Jika nanti kontraktor/konsultan perlu membaca Peil tertentu, harus dibuat assignment/guard khusus, bukan membuka global.
4. Middleware/Auth masih mengikuti role yang tersimpan di database aktual.
5. Role alias seperti `admin_bidang` tetap bergantung pada mapping frontend ke `admin`.

## 16. Rekomendasi Tahap Berikutnya

1. Buat audit PB-RBAC.3 untuk rencana Prisma enum/seed role Peil sebelum migration.
2. Siapkan konsep assignment Peil Banjir agar Tim Teknis bisa dibatasi per permohonan/lokasi.
3. Jangan membuka role Peil di Manajemen Pengguna sampai schema dan mapper Prisma siap.
4. Jika Peil akan melibatkan pihak eksternal, buat permission berbasis assignment khusus, bukan akses global.
