# SIAGA-SDA RBAC-GLOBAL.4 - Permission Asset SDA

## 1. Ringkasan Tahap

RBAC-GLOBAL.4 memisahkan permission **Asset SDA** dari permission **Peta Monitoring**.

Masalah dari RBAC-GLOBAL.3:

```text
Route /asset masih memakai permission view_map sehingga Asset SDA ikut terbuka mengikuti izin Peta Monitoring.
```

Perubahan tahap ini dibuat kecil dan terkontrol:

- menambah permission `view_asset_sda`;
- menambah permission `manage_asset_sda` sebagai permission kelola untuk tahap lanjutan;
- mengubah route `/asset` dari `view_map` ke `view_asset_sda`;
- tidak mengubah menu, UI Asset, Dashboard, Halo, Auth, Prisma, database, migration, package, atau dependency.

## 2. Status Acuan

| Item | Status |
|---|---|
| Commit acuan | `08e054a docs: audit rbac asset pengaturan` |
| RBAC-GLOBAL.3 | Selesai |
| Login | Final/locked, tidak disentuh |
| Halo SIAGA-SDA | Final lock, tidak disentuh |
| Dashboard modal 4D.2 | Final, tidak disentuh |
| Prisma/database/migration | Tidak disentuh |
| Endpoint/API | Tidak disentuh |
| UI Asset SDA | Tidak diubah |

## 3. File yang Dibaca

Dokumen:

- `AGENTS.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_3_AUDIT_ASSET_PENGATURAN.md`
- `docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_1_AUDIT_ROLE_PERMISSION_MENU_HALO.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_2_FIX_HALO_ROLE_AWARE_SUGGESTIONS.md`
- `docs/modules/SIAGA_SDA_ASSET_UI.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`

Source:

- `src/lib/rbac.ts`
- `src/lib/navigation.ts`
- `src/lib/roles.ts`
- `src/types/index.ts`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/app/(dashboard)/asset/page.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`
- `package.json`

## 4. File yang Diubah

Source runtime:

- `src/lib/rbac.ts`

Dokumen:

- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_4_PERMISSION_ASSET_SDA.md`

File yang sengaja tidak diubah:

- `src/lib/navigation.ts`
- `src/types/index.ts`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/app/(dashboard)/asset/page.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`

## 5. Backup yang Dibuat

Backup dibuat sebelum mengubah source runtime:

```text
backup/backup-rbac-global-4-before-change/
```

Isi backup:

- `rbac.ts`

## 6. Perubahan Permission

Permission baru:

```ts
view_asset_sda
manage_asset_sda
```

`view_asset_sda` dipakai sebagai permission baca route Asset SDA.

`manage_asset_sda` disiapkan sebagai permission kelola Asset SDA untuk tahap lanjutan, tetapi belum dipakai untuk tombol/form karena tahap ini tidak membuat UI kelola Asset.

## 7. Role yang Mendapat `view_asset_sda`

Untuk tahap awal, cakupan `view_asset_sda` dibuat sama dengan cakupan lama `view_map` agar tidak merusak navigasi existing:

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

Catatan:

- `super_admin` tetap memiliki bypass melalui `hasPermission`.
- Role frontend-only Peil tidak ditambahkan ke `view_asset_sda`.
- Role konseptual `admin_asset`, `mandor_operasional_sda`, `mandor_pintu_air`, `petugas_pintu_air`, `mandor_rehabilitasi_drainase`, `admin_surat`, dan role lain yang belum aktif tidak dipaksakan ke runtime.

## 8. Role yang Mendapat `manage_asset_sda`

Permission kelola Asset SDA hanya diberikan awal kepada:

```text
super_admin
admin
```

Alasan:

- runtime saat ini masih memakai `admin` sebagai alias sementara untuk admin sistem/admin bidang;
- belum ada role `admin_asset` di runtime;
- belum ada model assignment Asset/Operasional resmi;
- pimpinan, auditor, kontraktor, konsultan, dan role lapangan tidak boleh mendapat akses kelola Asset secara default.

## 9. Route Mapping `/asset` Sebelum dan Sesudah

Sebelum:

```ts
'/asset': 'view_map'
```

Sesudah:

```ts
'/asset': 'view_asset_sda'
```

Route `/peta` tetap:

```ts
'/peta': 'view_map'
```

Dengan ini Asset SDA tidak lagi bergantung langsung pada permission Peta Monitoring.

## 10. Dampak ke Sidebar dan MobileNav

Tidak ada perubahan kode pada Sidebar atau MobileNav.

Keduanya sudah memakai pola yang benar:

```ts
canAccessPage(currentUser.role, item.routeKey)
```

Karena `routeKey` Asset tetap `/asset`, menu desktop dan mobile otomatis mengikuti permission baru `view_asset_sda`.

## 11. Dampak ke Halo SIAGA-SDA

Halo SIAGA-SDA tidak diubah karena statusnya final lock dan tidak ada TypeScript error akibat permission baru.

Catatan risiko:

- `ProjectAiAssistant.tsx` memiliki copy panduan Asset yang masih menyebut permission Asset perlu audit karena sebelumnya terkait `view_map`.
- Copy tersebut tidak memengaruhi RBAC/runtime.
- Jika ingin menyelaraskan copy Halo, sebaiknya dibuat tahap kecil khusus karena dokumen final lock Halo melarang perubahan tanpa scope eksplisit.

## 12. Risiko yang Berhasil Dikurangi

| Risiko Sebelum | Status Setelah 4 |
|---|---|
| Asset SDA menumpang `view_map` | Dikurangi, `/asset` sudah memakai `view_asset_sda` |
| Peta Monitoring dan Asset SDA tidak bisa dipisah permission-nya | Dikurangi, permission route sudah terpisah |
| Menu Asset tidak punya permission khusus | Dikurangi, menu mengikuti route `/asset` yang sekarang punya permission khusus |
| Permission kelola Asset belum ada | Dikurangi secara konseptual, `manage_asset_sda` sudah tersedia tetapi belum dipakai UI |

## 13. Risiko Tersisa

- `view_asset_sda` masih memakai cakupan role yang sama dengan `view_map` untuk menjaga kompatibilitas navigasi.
- Belum ada assignment scope khusus Asset SDA.
- Belum ada tabel/model Asset SDA resmi.
- `manage_asset_sda` belum dipakai oleh UI/API karena belum ada form atau endpoint kelola Asset resmi.
- Halo copy Asset belum diselaraskan agar tidak menyentuh final lock Halo pada tahap ini.

## 14. Validasi yang Dijalankan

Validasi wajib:

- `npx.cmd tsc --noEmit`
- `git diff --check`

Lint:

- `npm run lint` tidak tersedia di `package.json`.

Build:

- Tidak dijalankan karena perubahan terbatas pada RBAC TypeScript dan dokumen. Typecheck sudah cukup untuk memverifikasi permission type dan mapping route.

## 15. Cek Manual Source

Hasil audit source setelah perubahan:

- `/asset` tidak lagi memakai `view_map`.
- `/asset` memakai `view_asset_sda`.
- `/peta` tetap memakai `view_map`.
- Sidebar tetap memakai `canAccessPage()`.
- MobileNav tetap memakai `canAccessPage()`.
- Tidak ada role baru yang dipaksakan aktif.
- Tidak ada perubahan Auth/Prisma/database/login/dashboard/Halo final.

## 16. Rekomendasi Tahap Berikutnya

Tahap berikutnya yang aman:

1. Audit dan pisahkan Pengaturan personal vs pengaturan master/system.
2. Tentukan role assignment Asset SDA sebelum membuat form/input Asset resmi.
3. Buat audit khusus bila ingin menyelaraskan copy Halo Asset setelah permission baru stabil.
4. Jangan aktifkan `admin_asset` atau role mandor sebelum schema/role/assignment resmi disetujui.

## 17. Saran Commit Message

```text
feat: pisahkan permission asset sda
```
