# Cleanup Route Root Duplikat SIAGA-SDA - Tahap 3A

Tanggal pengerjaan: 14 Juni 2026

## 1. Tujuan Tahap

Tahap 3A membersihkan konflik konseptual route root `/` tanpa mengubah dashboard aktif `/dashboard`, login final, Auth, RBAC, Prisma, database, dependency, atau tampilan aplikasi.

Dashboard aktif final tetap:

```text
Route: /dashboard
File: src/app/(dashboard)/dashboard/page.tsx
```

## 2. File dan Area yang Dibaca

Dokumen acuan:

```text
AGENTS.md
docs/core/*
docs/design/*
docs/audit/SIAGA_SDA_DASHBOARD_AUDIT_TAHAP_1.md
docs/audit/SIAGA_SDA_DASHBOARD_FOUNDATION_TAHAP_2.md
docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md
```

Source yang diaudit:

```text
src/app/page.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/layout.tsx
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/components/layout/Topbar.tsx
src/app/login/page.tsx
src/app/not-found.tsx
src/components/access/AccessSafetyPage.tsx
src/components/modules/ModuleLandingPage.tsx
src/lib/rbac.ts
```

Pencarian source juga dilakukan terhadap seluruh file `.ts` dan `.tsx` untuk:

```text
link atau redirect ke /
link atau redirect ke /dashboard
import atau referensi langsung ke src/app/(dashboard)/page.tsx
```

## 3. Backup dan Preservasi

Backup wajib dibuat sebelum perubahan:

```text
backup/backup-route-root-cleanup-tahap-3a-before-change
```

Isi backup:

```text
src/app/(dashboard)/page.tsx
src/app/page.tsx
src/app/(dashboard)/dashboard/page.tsx
```

Dashboard root lama juga dipreservasi utuh setelah dipindahkan ke:

```text
backup/legacy-route-root-tahap-3a/src/app/(dashboard)/page.tsx
```

Dengan demikian isi dashboard lama tidak hilang dan dapat dipulihkan jika diperlukan.

## 4. Status Sebelum Cleanup

Sebelum cleanup terdapat dua file `page.tsx` yang secara struktur Next.js memetakan route root `/`:

```text
src/app/page.tsx
src/app/(dashboard)/page.tsx
```

Kondisinya:

1. `src/app/page.tsx` adalah root aplikasi yang melakukan redirect ke `/login`.
2. `src/app/(dashboard)/page.tsx` berisi implementasi dashboard lama sekitar 46 KB.
3. Dashboard aktif aktual berada di `src/app/(dashboard)/dashboard/page.tsx`.
4. Login, Sidebar, MobileNav, tombol kembali, dan permission dashboard menggunakan `/dashboard`.
5. Tidak ditemukan import atau link yang secara langsung menggunakan `src/app/(dashboard)/page.tsx`.
6. Tidak ditemukan link penting yang mengarah ke `/` untuk membuka dashboard lama.

## 5. Tindakan Cleanup

File route duplikat berikut dipindahkan keluar dari `src/app`:

```text
src/app/(dashboard)/page.tsx
```

Tujuan preservasi:

```text
backup/legacy-route-root-tahap-3a/src/app/(dashboard)/page.tsx
```

Cara ini dipilih karena:

1. file tidak lagi bernama/lokasi route Next.js di bawah `src/app`;
2. konflik route root benar-benar dinonaktifkan;
3. isi dashboard lama tetap dipreservasi utuh;
4. tidak perlu mengubah root redirect, dashboard aktif, link, atau logic aplikasi;
5. file legacy tidak ikut dikompilasi sebagai source aplikasi aktif.

## 6. Status Setelah Cleanup

### Route `/`

Root resmi tunggal sekarang:

```text
src/app/page.tsx
```

Perilaku tetap:

```text
/ -> /login
```

File ini tidak diubah.

### Route `/dashboard`

Dashboard aktif tetap:

```text
src/app/(dashboard)/dashboard/page.tsx
```

Route tetap:

```text
/dashboard
```

File dashboard aktif tidak diubah pada Tahap 3A. Perubahan yang sudah ada dari Tahap 2 dipertahankan.

### Status `src/app/(dashboard)/page.tsx`

File tersebut tidak lagi berada di source route aktif. Git akan mencatatnya sebagai file yang dihapus dari `src/app`, tetapi kontennya tetap tersedia pada dua lokasi preservasi:

```text
backup/backup-route-root-cleanup-tahap-3a-before-change/src/app/(dashboard)/page.tsx
backup/legacy-route-root-tahap-3a/src/app/(dashboard)/page.tsx
```

## 7. Link dan Navigasi yang Dicek

Alur berikut dikonfirmasi tetap mengarah ke `/dashboard`:

```text
login sukses
Sidebar menu Dashboard
MobileNav menu Dashboard
tombol kembali dari Peta Monitoring
tombol kembali dari detail Paket
halaman not found
halaman Akses Dibatasi
Topbar/notifikasi
ModuleLandingPage
permission route dashboard
```

Tidak ditemukan link penting yang perlu diubah dari `/` menjadi `/dashboard`.

## 8. File yang Diubah pada Tahap 3A

Perubahan Tahap 3A:

```text
src/app/(dashboard)/page.tsx
docs/audit/SIAGA_SDA_ROUTE_ROOT_CLEANUP_TAHAP_3A.md
```

`src/app/(dashboard)/page.tsx` dipindahkan keluar source dan dipreservasi, bukan dihapus tanpa salinan.

File berikut memiliki perubahan dari Tahap 2 yang sudah ada sebelum Tahap 3A dan tidak diubah lagi dalam tahap ini:

```text
src/app/(dashboard)/dashboard/page.tsx
src/store/useAppStore.ts
docs/audit/SIAGA_SDA_DASHBOARD_AUDIT_TAHAP_1.md
docs/audit/SIAGA_SDA_DASHBOARD_FOUNDATION_TAHAP_2.md
```

## 9. Hal yang Tidak Disentuh

Tidak diubah:

```text
src/app/page.tsx
src/app/(dashboard)/dashboard/page.tsx pada Tahap 3A
src/app/(dashboard)/layout.tsx
halaman dan komponen login final
Auth / NextAuth
middleware
RBAC
roles.ts
Prisma schema
Prisma migration
database
package.json
dependency
src/app/globals.css
Sidebar
MobileNav
Topbar
file .bak
```

## 10. Risiko Tersisa

1. File legacy berada di folder backup yang umumnya tidak masuk version control. Preservasi permanen di repository memerlukan keputusan khusus jika diinginkan.
2. Perubahan Tahap 2 pada dashboard aktif dan store masih berada di working tree dan harus tetap direview bersama.
3. Route root `/` selalu menuju `/login`, termasuk untuk user yang mungkin sudah memiliki sesi. Ini adalah perilaku existing dan sengaja tidak diubah.
4. Validasi runtime/deployment tetap perlu memastikan konfigurasi hosting tidak memiliki rewrite eksternal untuk `/`.

## 11. Rekomendasi Tahap 3B

Tahap berikutnya sebaiknya berfokus pada role final dan permission mapping secara bertahap:

1. petakan alias role frontend, database, dan role final;
2. pertahankan compatibility `ADMINISTRASI_KONTRAK`;
3. validasi assignment scope setiap role;
4. uji akses menu, tab dashboard, API, dan route per role;
5. jangan memulai redesign besar sebelum role dan permission mapping disetujui.

## 12. Validasi

Hasil validasi:

```text
npx tsc --noEmit: lulus
git diff --check: lulus
```

Script `lint` tidak tersedia pada `package.json`.

Hasil build:

```text
npm run build: gagal sebelum kompilasi Next.js
penyebab: prisma generate mendapat EPERM karena query_engine-windows.dll.node sedang terkunci

npx next build: lulus
```

`npx next build` mengonfirmasi route manifest hanya memiliki satu route `/` dan satu route `/dashboard`. Build menampilkan peringatan bahwa ESLint belum terpasang, tetapi kompilasi, pemeriksaan tipe, page data, dan static page generation selesai.

## 13. Cara Rollback

Untuk mengembalikan route legacy, salin kembali salah satu file preservasi berikut:

```text
backup/backup-route-root-cleanup-tahap-3a-before-change/src/app/(dashboard)/page.tsx
backup/legacy-route-root-tahap-3a/src/app/(dashboard)/page.tsx
```

ke:

```text
src/app/(dashboard)/page.tsx
```

Rollback tersebut akan mengembalikan kondisi konflik route root sebelumnya dan hanya dilakukan jika benar-benar diperlukan.
