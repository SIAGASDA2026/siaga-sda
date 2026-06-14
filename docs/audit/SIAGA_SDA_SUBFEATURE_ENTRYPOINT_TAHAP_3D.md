# SIAGA-SDA Sub-feature Entry Point - Tahap 3D

Tanggal pengerjaan: 14 Juni 2026  
Sifat perubahan: mapping permission dan penambahan entry point ringan tanpa redesign besar

## 1. Tujuan Tahap

Tahap 3D menutup fallback akses terbuka untuk route `/serapan-anggaran` dan memastikan sub-fitur lama dapat ditemukan dari parent modul yang sesuai tanpa menjadikannya menu utama.

## 2. File yang Dibaca

```text
AGENTS.md
docs/core/*
docs/design/*
docs/audit/SIAGA_SDA_DASHBOARD_AUDIT_TAHAP_1.md
docs/audit/SIAGA_SDA_DASHBOARD_FOUNDATION_TAHAP_2.md
docs/audit/SIAGA_SDA_ROUTE_ROOT_CLEANUP_TAHAP_3A.md
docs/audit/SIAGA_SDA_ROLE_PERMISSION_MENU_TAHAP_3B.md
docs/audit/SIAGA_SDA_SHARED_MENU_CONFIG_TAHAP_3C.md
docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md
src/lib/rbac.ts
src/lib/navigation.ts
src/components/modules/ModuleLandingPage.tsx
src/app/(dashboard)/administrasi/page.tsx
src/app/(dashboard)/proyek/page.tsx
src/app/(dashboard)/dashboard/page.tsx
src/components/layout/Topbar.tsx
src/app/(dashboard)/peta/page.tsx
src/app/(dashboard)/surat/page.tsx
```

## 3. Backup

Backup dibuat sebelum perubahan:

```text
backup/backup-subfeature-entrypoint-tahap-3d-before-change/
```

File yang dibackup:

```text
src/lib/rbac.ts
src/lib/navigation.ts
src/components/modules/ModuleLandingPage.tsx
src/app/(dashboard)/administrasi/page.tsx
src/app/(dashboard)/proyek/page.tsx
```

## 4. File yang Diubah dan Dibuat

File yang diubah:

```text
src/lib/rbac.ts
src/lib/navigation.ts
src/components/modules/ModuleLandingPage.tsx
src/app/(dashboard)/administrasi/page.tsx
src/app/(dashboard)/proyek/page.tsx
```

File baru:

```text
src/components/navigation/SubfeatureEntryPoints.tsx
docs/audit/SIAGA_SDA_SUBFEATURE_ENTRYPOINT_TAHAP_3D.md
```

## 5. Status Mapping `/serapan-anggaran`

Sebelum Tahap 3D, `/serapan-anggaran` tidak memiliki entry pada `PAGE_PERMISSIONS`. Karena `canAccessPage()` mengembalikan `true` untuk route tanpa mapping, akses route tersebut bergantung pada fallback yang terlalu luas.

Mapping final:

```text
/serapan-anggaran -> view_keuangan
```

`view_keuangan` dipilih karena:

1. permission sudah tersedia;
2. cakupan role sudah didefinisikan;
3. secara fungsi paling dekat dengan ringkasan pagu, kontrak, dan realisasi;
4. tidak memerlukan role, enum, atau permission baru.

## 6. Shared Navigation Config

`src/lib/navigation.ts` tetap menjadi sumber metadata menu dan sub-fitur.

Metadata child diperjelas dengan field:

```text
id
label
description
href
routeKey
```

Sebelas menu utama dan mobile bottom navigation tidak diubah.

## 7. Komponen Entry Point

Komponen baru:

```text
src/components/navigation/SubfeatureEntryPoints.tsx
```

Karakteristik:

- membaca children dari `MAIN_NAVIGATION_ITEMS`;
- memfilter setiap link menggunakan `canAccessPage(role, routeKey)`;
- tidak mengubah permission;
- tidak menampilkan link tanpa izin;
- berupa daftar link compact, bukan redesign halaman;
- dapat dipakai ulang oleh parent modul lain pada tahap berikutnya.

`ModuleLandingPage` hanya ditambah slot `children` agar parent shell dapat menyisipkan entry point tanpa mengubah layout utamanya.

## 8. Status Sub-fitur Lama

| Sub-fitur | Parent sementara | Permission | Entry point sebelum Tahap 3D | Status setelah Tahap 3D |
|---|---|---|---|---|
| Laporan Harian | Paket Pekerjaan | `view_reports` | Dashboard, Paket detail/list, Peta | Ditambahkan juga pada panel compact Paket |
| Masalah & Kendala | Paket Pekerjaan / Approval | `view_issues` | Dashboard, Peta, Topbar | Ditambahkan juga pada panel compact Paket |
| RAB | Paket Pekerjaan / Administrasi | `view_rab` | Route tersedia, entry point parent belum jelas | Ditambahkan pada panel compact Paket |
| Serapan Anggaran | Administrasi | `view_keuangan` | Shortcut Dashboard, permission route belum eksplisit | Ditambahkan pada Administrasi dan permission dipetakan |
| Kontrak | Administrasi | `view_contracts` | Topbar | Ditambahkan pada Administrasi |
| Dokumen | Paket Pekerjaan / Administrasi | `view_documents` | Dashboard dan Paket | Ditambahkan juga pada panel compact Paket |
| Chat Proyek | Paket Pekerjaan | `view_chat` | Dashboard, Peta, Topbar | Ditambahkan juga pada panel compact Paket |
| Pengumuman | Dashboard / Surat | `view_announcements` | Dashboard, Surat, Topbar | Dipertahankan; tidak diduplikasi |
| Pengguna | Pengaturan / Administrasi | `manage_users` | Administrasi untuk role berwenang | Dipertahankan; tidak diduplikasi |

## 9. Entry Point yang Ditambahkan

Pada parent **Paket Pekerjaan**:

```text
Laporan Harian
Masalah & Kendala
RAB
Dokumen
Chat Proyek
```

Pada parent **Administrasi**:

```text
Serapan Anggaran
Kontrak
```

Semua link otomatis difilter menggunakan `canAccessPage()`.

## 10. Entry Point yang Ditunda

1. Pengumuman tidak ditambahkan lagi karena sudah memiliki entry point pada Dashboard, Surat, dan Topbar.
2. Pengguna tidak ditambahkan pada Pengaturan karena sudah tersedia dari Administrasi untuk role `manage_users`; penempatan final di Pengaturan menunggu perapihan modul Pengaturan.
3. RAB belum ditambahkan pada Administrasi karena parent utama sementaranya sudah jelas di Paket Pekerjaan.
4. Dokumen belum ditambahkan pada Administrasi untuk menghindari duplikasi sebelum struktur dokumen administrasi final tersedia.

## 11. Permission yang Dipakai

```text
/laporan -> view_reports
/masalah -> view_issues
/rab -> view_rab
/serapan-anggaran -> view_keuangan
/kontrak -> view_contracts
/dokumen -> view_documents
/chat -> view_chat
/pengumuman -> view_announcements
/pengguna -> manage_users
```

Tidak ada permission atau role baru.

## 12. Hal yang Tidak Disentuh

```text
halaman dan komponen login
Auth / NextAuth
middleware
Prisma schema dan migration
database
package.json dan dependency
src/app/globals.css
route /dashboard
root redirect /login
dashboard visual besar
role database
compatibility ADMINISTRASI_KONTRAK
route atau fitur lama
mobile bottom navigation
```

## 13. Risiko Tersisa

1. Entry point memfilter berdasarkan role melalui `canAccessPage()`; assignment scope detail tetap menjadi tanggung jawab halaman tujuan dan guard existing.
2. Permission Surat, Peil, Asset, dan beberapa modul shell masih menggunakan permission existing yang luas.
3. Pengguna belum memiliki entry point langsung dari halaman Pengaturan.
4. RAB dan Dokumen belum ditampilkan sebagai entry point Administrasi karena struktur administrasi final belum tersedia.
5. Visual entry point perlu pengecekan manual desktop/mobile sebelum Tahap 4.

## 14. Rekomendasi Tahap Berikutnya

1. Uji seluruh entry point menggunakan role luas dan role terbatas.
2. Pastikan halaman tujuan membaca query/filter dari parent secara konsisten.
3. Rapikan assignment guard pada sub-fitur yang masih hanya role-based.
4. Tetapkan konsep visual Dashboard Tahap 4 tanpa mengubah shared navigation config.

## 15. Hasil Validasi

```text
npx tsc --noEmit: lulus
git diff --check: lulus
npm run lint: tidak tersedia
build: tidak dijalankan sesuai batasan tahap
```
