# SIAGA-SDA Shared Menu Config - Tahap 3C

Tanggal pengerjaan: 14 Juni 2026  
Sifat perubahan: perapihan fondasi navigasi tanpa redesign UI, perubahan role, atau perubahan database

## 1. Tujuan Tahap

Tahap 3C menyatukan sumber metadata menu utama untuk Sidebar desktop dan expandable MobileNav, sekaligus memetakan route lama sebagai sub-fitur dari modul utama SIAGA-SDA.

Perubahan ini mempertahankan:

- 11 menu utama final sementara;
- filter akses menggunakan `canAccessPage()`;
- mobile bottom navigation berisi 5 entry point;
- semua route lama/sub-fitur;
- tampilan dan perilaku navigasi yang sudah ada.

## 2. File yang Dibaca

Dokumen dan source utama yang dibaca:

```text
AGENTS.md
docs/core/*
docs/design/*
docs/audit/SIAGA_SDA_DASHBOARD_AUDIT_TAHAP_1.md
docs/audit/SIAGA_SDA_DASHBOARD_FOUNDATION_TAHAP_2.md
docs/audit/SIAGA_SDA_ROUTE_ROOT_CLEANUP_TAHAP_3A.md
docs/audit/SIAGA_SDA_ROLE_PERMISSION_MENU_TAHAP_3B.md
docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/components/layout/Topbar.tsx
src/lib/rbac.ts
src/lib/roles.ts
src/app/(dashboard)/*
```

## 3. Backup

Backup dibuat sebelum source diubah:

```text
backup/backup-shared-menu-config-tahap-3c-before-change/
```

File yang dibackup:

```text
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
```

## 4. File yang Diubah dan Dibuat

File source yang diubah:

```text
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
```

File baru:

```text
src/lib/navigation.ts
docs/audit/SIAGA_SDA_SHARED_MENU_CONFIG_TAHAP_3C.md
```

## 5. Struktur Shared Menu Config

Shared config berada di:

```text
src/lib/navigation.ts
```

Setiap menu utama memiliki metadata:

```text
id
label
shortLabel (opsional)
description
href
routeKey
iconKey
group
desktopInclude
mobileInclude
mobileBottomInclude (opsional)
children (opsional)
```

`routeKey` dipakai Sidebar dan MobileNav saat memanggil `canAccessPage()`. Ikon Lucide tetap dipetakan secara lokal di komponen layout agar shared config tidak bergantung pada komponen visual.

## 6. Menu Utama Final Sementara

| No. | Menu | Route | Permission existing |
|---:|---|---|---|
| 1 | Dashboard | `/dashboard` | `view_dashboard` |
| 2 | Peta Monitoring | `/peta` | `view_map` |
| 3 | Survey Investigasi | `/survey` | `view_survey` |
| 4 | Paket Pekerjaan | `/proyek` | `view_projects` |
| 5 | Approval Center | `/approval` | `view_approval` |
| 6 | Surat Masuk & Keluar | `/surat` | `view_announcements` |
| 7 | Administrasi | `/administrasi` | `view_contracts` |
| 8 | Peil Banjir | `/peil` | `view_map` |
| 9 | Asset SDA | `/asset` | `view_map` |
| 10 | Audit Log | `/audit-log` | `view_audit_log` |
| 11 | Pengaturan | `/pengaturan` | `view_settings` |

Tidak ada menu utama baru yang ditambahkan.

## 7. Mobile Bottom Navigation

Mobile bottom navigation tetap:

```text
Dashboard
Peta
Paket
Approval
Menu
```

Empat link utama berasal dari shared config melalui `mobileBottomInclude`. Tombol `Menu` tetap merupakan tombol lokal untuk membuka expandable MobileNav.

## 8. Mapping Sub-Fitur Lama

Route lama tetap hidup dan dimodelkan sebagai `children` pada shared config. Children belum dirender sebagai menu tambahan agar visual tidak berubah dan akses tidak diperluas sebelum permission khusus selesai dipetakan.

| Sub-fitur | Route | Parent modul | Permission existing | Entry point aktif yang ditemukan |
|---|---|---|---|---|
| Laporan Harian | `/laporan` | Paket Pekerjaan | `view_reports` | Dashboard, Paket, dan Peta |
| Masalah & Kendala | `/masalah` | Paket Pekerjaan | `view_issues` | Dashboard, Peta, dan Topbar |
| RAB | `/rab` | Paket Pekerjaan | `view_rab` | Route aktif; parent metadata disiapkan, link modul utama belum konsisten |
| Serapan Anggaran | `/serapan-anggaran` | Administrasi | Belum ada mapping eksplisit | Shortcut Dashboard |
| Kontrak | `/kontrak` | Administrasi | `view_contracts` | Topbar |
| Dokumen | `/dokumen` | Paket Pekerjaan | `view_documents` | Dashboard dan Paket |
| Chat Proyek | `/chat` | Paket Pekerjaan | `view_chat` | Dashboard, Peta, dan Topbar |
| Pengumuman | `/pengumuman` | Dashboard | `view_announcements` | Dashboard, Surat, dan Topbar |
| Pengguna | `/pengguna` | Pengaturan | `manage_users` | Shell Administrasi |

Route tidak dihapus, dipindahkan, atau diubah.

## 9. Status Sidebar

Sidebar sekarang membaca daftar menu dari `MAIN_NAVIGATION_ITEMS`.

- Menu desktop tetap difilter melalui `canAccessPage(currentUser.role, item.routeKey)`.
- Ikon dan badge approval tetap menggunakan logic lokal yang sudah ada.
- Children tidak ditampilkan sebagai menu utama.
- Visual Sidebar tidak diubah secara besar.

## 10. Status MobileNav

Expandable MobileNav sekarang membaca menu dan group dari shared config.

- Menu mobile memakai sumber metadata yang sama dengan Sidebar.
- Filter akses tetap memakai `canAccessPage()`.
- Pencarian menu tetap bekerja pada label/group.
- Bottom navigation tetap 5 item.
- Visual MobileNav tidak diubah secara besar.

Perbedaan desktop/mobile yang disengaja:

- Desktop menampilkan deskripsi singkat tiap menu.
- Mobile expandable menu menampilkan grid menu tanpa deskripsi.
- Mobile bottom navigation hanya menampilkan empat route prioritas dan tombol `Menu`.

## 11. Status Permission

`src/lib/rbac.ts` dan `src/lib/roles.ts` tidak diubah pada Tahap 3C.

Shared config menggunakan `routeKey` agar `canAccessPage()` tetap menjadi sumber filter akses. Risiko permission existing yang masih luas tetap dipertahankan dan tidak diperluas:

- Surat masih memakai `view_announcements`.
- Peil dan Asset masih memakai `view_map`.
- Administrasi masih memakai `view_contracts`.
- `/serapan-anggaran` belum memiliki mapping eksplisit pada `PAGE_PERMISSIONS`.

## 12. Hal yang Tidak Disentuh

Tahap ini tidak mengubah:

```text
halaman dan komponen login
Auth / NextAuth
middleware
role dan permission existing
Prisma schema dan migration
database
package.json dan dependency
src/app/globals.css
route /dashboard
root redirect /login
dashboard UI
route sub-fitur lama
```

## 13. Risiko Tersisa

1. Children masih berupa metadata dan belum dirender sebagai entry point di UI modul utama.
2. RAB belum memiliki link entry point yang konsisten dari modul utama walaupun route dan permission tersedia.
3. `/serapan-anggaran` belum memiliki mapping eksplisit di `PAGE_PERMISSIONS`; direct URL masih bergantung pada behavior fallback `canAccessPage()`.
4. Permission Surat, Peil, Asset, dan Administrasi masih memakai permission existing yang cukup luas.
5. Ikon tetap dipetakan di dua komponen secara sengaja; metadata menu sudah tunggal, tetapi representasi visual masih lokal.

## 14. Rekomendasi Tahap Berikutnya

1. Tetapkan permission khusus Surat, Peil, Asset, Operasional, dan Administrasi setelah role extension disetujui.
2. Tambahkan mapping aman untuk `/serapan-anggaran`.
3. Buat entry point children pada halaman parent secara bertahap, dengan filter `canAccessPage()` dan assignment scope.
4. Standarkan query/filter ketika parent modul membuka route sub-fitur.
5. Uji navigasi per role desktop dan mobile sebelum redesign dashboard.

## 15. Hasil Validasi

```text
npx tsc --noEmit: lulus
git diff --check: lulus
npm run lint: tidak tersedia (script lint tidak ditemukan)
```
