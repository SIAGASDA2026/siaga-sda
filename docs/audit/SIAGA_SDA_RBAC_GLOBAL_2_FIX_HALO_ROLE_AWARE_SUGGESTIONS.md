# SIAGA-SDA RBAC-GLOBAL.2 - Fix Halo Role-Aware Suggestions

Tanggal: 2026-06-19  
Commit acuan: `3576e63 docs: audit global role permission menu halo siaga sda`  
Project: SIAGA-SDA

## 1. Tujuan Tahap

Tahap RBAC-GLOBAL.2 memperbaiki FAQ/suggestion Halo SIAGA-SDA agar mengikuti role dan permission yang sudah ada.

Target utama:

- Peil Banjir hanya tampil jika user dapat mengakses `/peil`.
- Surat Masuk & Keluar hanya tampil jika user dapat mengakses `/surat`.
- Approval hanya tampil jika user dapat mengakses `/approval`.
- Pengaturan/User Management hanya tampil jika user dapat mengakses `/pengaturan` atau `/pengguna`.
- Suggestion umum tetap tampil untuk semua user Dashboard.

Tahap ini tidak mengubah RBAC besar dan tidak membuka akses baru.

## 2. Masalah yang Diperbaiki

Audit RBAC-GLOBAL.1 menemukan:

```text
Tim Perencana/Rutin tidak melihat menu Peil Banjir, tetapi Halo SIAGA-SDA masih menampilkan FAQ Peil Banjir.
```

Penyebab:

- `Sidebar` dan `MobileNav` sudah memakai `canAccessPage()`.
- `ProjectAiAssistant` masih memakai daftar FAQ statis tanpa metadata akses.

## 3. File yang Diaudit

- `AGENTS.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_1_AUDIT_ROLE_PERMISSION_MENU_HALO.md`
- `docs/audit/SIAGA_SDA_PB_RBAC_2_AUDIT_AKSES_MENU_PEIL_SURAT.md`
- `docs/audit/SIAGA_SDA_PB_RBAC_3_AUDIT_RENCANA_PRISMA_ROLE_PEIL.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/core/SIAGA_SDA_PEIL_BANJIR_FINAL_CONCEPT.md`
- `docs/modules/SIAGA_SDA_PEIL_UI.md`
- `docs/modules/SIAGA_SDA_SURAT_UI.md`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/lib/rbac.ts`
- `src/lib/navigation.ts`
- `src/lib/roles.ts`
- `src/types/index.ts`

## 4. File yang Diubah

- `src/components/ai/ProjectAiAssistant.tsx`

## 5. File yang Dibuat

- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_2_FIX_HALO_ROLE_AWARE_SUGGESTIONS.md`

## 6. Backup

Backup dibuat sebelum source runtime diubah:

```text
backup/backup-rbac-global-2-fix-halo-role-aware-suggestions-before-change/
```

Isi backup:

- `ProjectAiAssistant.tsx`
- `BACKUP_FILE_LIST.md`

## 7. Cara Filter Suggestion Diterapkan

Perubahan di `ProjectAiAssistant.tsx`:

1. Menambahkan import:

```ts
import { canAccessPage } from '@/lib/rbac'
```

2. Menambahkan tipe metadata FAQ:

```ts
type HaloFaqItem = {
  question: string
  answer: string
  alwaysVisible?: boolean
  accessPath?: string
  roles?: string[]
}
```

3. Mengubah daftar FAQ menjadi `HALO_FAQ_ITEMS` dengan metadata:

- `alwaysVisible` untuk suggestion umum.
- `accessPath` untuk modul yang harus mengikuti route guard.
- `roles` untuk suggestion khusus role perencanaan.

4. Memfilter FAQ:

```ts
const faqItems = useMemo(() => {
  const role = currentUser?.role

  return HALO_FAQ_ITEMS.filter((item) => {
    if (item.alwaysVisible) return true
    if (!role) return false
    if (item.roles?.includes(role)) return true
    if (item.accessPath) return canAccessPage(role, item.accessPath)
    return false
  })
}, [currentUser?.role])
```

Fallback aman:

- Jika `currentUser` belum ada, hanya FAQ umum yang tampil.
- Jika role tidak dikenal, hanya FAQ umum dan item yang benar-benar lolos route guard yang tampil.

## 8. Matrix Suggestion per Kategori

| Kategori | Contoh suggestion | Guard |
| --- | --- | --- |
| Umum | Misi harian, belum ada tugas, fungsi Dashboard, membaca status tugas, status tanya jawab | `alwaysVisible` |
| Tim Perencana | Tugas Tim Perencana, alur Survey, rekomendasi survey, data awal RAB/gambar | `roles: ['tim_perencanaan']` atau `/survey` |
| Peil Banjir | Fungsi Peil, alur permohonan, survey dan koordinat Peil | `canAccessPage(role, '/peil')` |
| Surat | Alur Surat, cek sebelum surat ditindaklanjuti, surat teguran deviasi | `canAccessPage(role, '/surat')` |
| Approval | Cek Approval Center, membaca pending approval | `canAccessPage(role, '/approval')` |
| Pengaturan | Preferensi akun | `canAccessPage(role, '/pengaturan')` |
| User Management | Mengelola user dan role | `canAccessPage(role, '/pengguna')` |

## 9. Hasil Cek Akun Tim Perencana/Rutin

Berdasarkan RBAC saat ini:

- `tim_perencanaan` tidak memiliki akses `/peil`.
- `tim_perencanaan` tidak memiliki akses `/surat`.
- `tim_perencanaan` memiliki akses `/survey`.

Hasil setelah perubahan:

- FAQ Peil Banjir tidak lolos filter.
- FAQ Surat Masuk & Keluar tidak lolos filter.
- FAQ Survey/Perencanaan tetap tampil.
- FAQ umum tetap tampil.

## 10. Hasil Cek Role yang Punya Akses Peil

Role yang memiliki akses `/peil` menurut `PERMISSION_ROLES.view_peil_banjir`:

- `super_admin` melalui override
- `admin`
- `kabid`
- `pimpinan`
- `ppk`
- `pptk`
- `direksi_teknis`
- `auditor`
- `admin_peil_banjir`
- `tim_teknis_peil_banjir`

Hasil setelah perubahan:

- FAQ Peil Banjir tampil untuk role yang lolos `canAccessPage(role, '/peil')`.
- Role Peil frontend-only tetap hanya mendapat panduan lokal; tidak ada klaim database/Prisma sudah aktif.

## 11. Hasil Cek Role Eksternal

Role eksternal seperti:

- `kontraktor`
- `konsultan_perencana`
- `konsultan_pengawasan`

tidak memiliki akses `/peil` dan `/surat` pada RBAC saat ini.

Hasil setelah perubahan:

- FAQ Peil tidak tampil.
- FAQ Surat tidak tampil.
- FAQ umum tetap tampil.
- FAQ terkait modul yang dimiliki tetap mengikuti `canAccessPage()`.

## 12. Mobile dan Desktop

Perubahan hanya mengubah daftar item yang dirender, bukan struktur modal Halo.

Dampak:

- Desktop tetap memakai panel Halo existing.
- Mobile tetap memakai panel existing dengan scroll internal.
- Tidak ada class layout, z-index, portal, overlay, atau modal yang diubah.

## 13. Hal yang Sengaja Tidak Disentuh

- halaman login
- asset login
- Auth/NextAuth
- middleware
- Prisma schema
- migration
- database
- seed
- package/dependency
- endpoint API
- Dashboard modal 4D.2
- Approval Center runtime
- shared modal portal
- Bootstrap
- Sync Version
- `src/lib/rbac.ts`
- `src/lib/navigation.ts`
- menu utama
- permission besar

## 14. Validasi

Validasi yang dijalankan:

- `git diff --check`
- `npx.cmd tsc --noEmit`

`npm run lint` tidak tersedia di `package.json`.

`npm run build` tidak dijalankan karena perubahan kecil, terbatas pada UI client component Halo, dan typecheck sudah lulus.

## 15. Risiko Tersisa

- Filter ini berbasis route guard existing. Jika permission route salah, suggestion juga mengikuti kesalahan tersebut.
- Suggestion masih panduan lokal, belum membaca SOP resmi atau data misi resmi.
- Belum ada uji visual browser langsung pada beberapa akun karena tahap ini difokuskan pada patch kecil dan validasi statis/typecheck.
- Role Peil masih frontend-only sampai Prisma/database dimigrasikan pada tahap khusus.

## 16. Rekomendasi Tahap Berikutnya

Tahap berikutnya yang aman:

1. RBAC-GLOBAL.3 - audit/rapikan permission `Asset SDA` agar tidak menumpang `view_map`.
2. RBAC-GLOBAL.4 - guard API user create/update untuk role pending frontend-only.
3. Visual/manual check Halo dengan akun:
   - Tim Perencana
   - Admin/PPK/PPTK/Direksi Teknis
   - Kontraktor/Konsultan
   - Auditor/Pimpinan

## 17. Kesimpulan

Halo SIAGA-SDA sekarang memakai filter role-aware berbasis `canAccessPage()` untuk suggestion modul sensitif.

Masalah awal ditutup secara teknis:

```text
Tim Perencana/Rutin tidak lagi mendapat FAQ Peil Banjir atau Surat dari Halo karena role tersebut tidak memiliki akses /peil dan /surat.
```
