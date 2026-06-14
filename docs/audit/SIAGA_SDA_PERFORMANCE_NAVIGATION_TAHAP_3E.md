# SIAGA-SDA Performance Navigasi - Tahap 3E

Tanggal pengerjaan: 14 Juni 2026  
Sifat perubahan: audit dan optimasi performa navigasi berbasis bukti tanpa redesign

## 1. Tujuan Tahap

Tahap 3E mengaudit penyebab perpindahan menu terasa lambat dan menerapkan perbaikan ringan pada lifecycle bootstrap, polling Topbar, dan subscription Zustand.

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
docs/audit/SIAGA_SDA_SUBFEATURE_ENTRYPOINT_TAHAP_3D.md
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/components/layout/Topbar.tsx
src/components/ai/ProjectAiAssistant.tsx
src/components/navigation/SubfeatureEntryPoints.tsx
src/store/useAppStore.ts
src/app/api/bootstrap/route.ts
src/app/api/sync-version/route.ts
```

## 3. Backup

Backup dibuat sebelum perubahan:

```text
backup/backup-performance-navigation-tahap-3e-before-change/
```

File yang dibackup:

```text
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/components/layout/Topbar.tsx
src/components/ai/ProjectAiAssistant.tsx
```

## 4. File yang Diubah

```text
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/components/layout/Topbar.tsx
src/components/ai/ProjectAiAssistant.tsx
```

File baru:

```text
docs/audit/SIAGA_SDA_PERFORMANCE_NAVIGATION_TAHAP_3E.md
```

## 5. Route yang Diuji

Pengujian HTTP dilakukan pada server development yang sudah aktif:

```text
/login
/dashboard
/proyek
/administrasi
/peta
/approval
/serapan-anggaran
```

Protected route tanpa session mengembalikan redirect `307`, sehingga pengukuran ini hanya membuktikan respons routing/middleware dan bukan waktu render penuh setelah login.

Hasil sampel setelah perubahan:

| Route | Status | Waktu |
|---|---:|---:|
| `/login` percobaan pertama | 200 | 2,684 detik |
| `/login` percobaan kedua | 200 | 1,436 detik |
| `/dashboard` tanpa session | 307 | 0,346 detik |
| `/proyek` tanpa session | 307 | 0,025 detik |
| `/administrasi` tanpa session | 307 | 0,041 detik |
| `/peta` tanpa session | 307 | 0,025 detik |
| `/approval` tanpa session | 307 | 0,040 detik |
| `/serapan-anggaran` tanpa session | 307 | 0,040 detik |

## 6. Penyebab Lambat yang Ditemukan

### 6.1 Bootstrap layout berulang

Effect bootstrap di `src/app/(dashboard)/layout.tsx` bergantung pada objek `currentUser`.

`hydrateFromDatabase()` mengganti referensi `currentUser`, sehingga effect dapat dibersihkan dan dijalankan ulang. Effect baru kembali menjadwalkan:

```text
/api/bootstrap
/api/sync-version
interval sync
focus/visibility listener
```

Trace Next sebelum optimasi mencatat:

```text
/api/bootstrap: sekitar 1.757 occurrence
/api/sync-version: sekitar 1.854 occurrence
/api/announcements: sekitar 1.073 occurrence
```

`/api/bootstrap` cukup berat karena memuat user, proyek legacy, paket, assignment, kontrak, laporan, survey, RAB/items, pengawasan, masalah, chat, foto, dan audit log.

### 6.2 Polling pengumuman terlalu sering

Setiap instance `Topbar`:

- langsung memanggil `/api/announcements` saat mount;
- membuat interval baru setiap 5 detik;
- kehilangan hasil sebelumnya saat berpindah halaman.

Karena Topbar berada pada masing-masing halaman, navigasi memicu request tambahan.

### 6.3 Subscription Zustand seluruh store

Komponen berikut menggunakan `useAppStore()` tanpa selector:

```text
DashboardLayout
DashboardPage
Sidebar
MobileNav
Topbar
ProjectAiAssistant
```

Akibatnya, perubahan state yang tidak relevan dapat merender ulang komponen layout dan dashboard berat.

### 6.4 Dashboard berat tetapi sudah cukup termemoisasi

Dashboard aktif memiliki banyak agregat, chart, tabel, dan panel. Audit menemukan:

- sebagian besar agregat utama sudah menggunakan `useMemo`;
- konten tab berat dirender berdasarkan tab aktif;
- tidak ditemukan kebutuhan aman untuk refactor besar pada tahap ini.

## 7. Dev Compile vs Render Aplikasi

Perpindahan pertama ke route development dapat lebih lambat karena Next.js melakukan compile-on-demand. Route yang sudah hangat umumnya lebih cepat.

Namun request berulang pada trace membuktikan bahwa masalah bukan hanya dev compile. Lifecycle bootstrap dan polling aplikasi menghasilkan pekerjaan jaringan/database berulang setelah halaman aktif.

Typecheck pertama setelah perubahan juga berjalan lebih lambat karena bersamaan dengan server development/hot compilation. Hal ini merupakan contention environment development, bukan bukti error TypeScript.

## 8. Perbaikan yang Dilakukan

### 8.1 Menghentikan siklus bootstrap ulang

`DashboardLayout` sekarang:

- memakai selector Zustand per field;
- membaca kondisi current user melalui `useAppStore.getState()` di dalam effect;
- tidak lagi menjadikan referensi objek `currentUser` sebagai dependency effect bootstrap.

### 8.2 Mengurangi polling Topbar

Topbar sekarang:

- menyimpan cache pengumuman tingkat modul;
- menggunakan cache ketika Topbar baru ter-mount;
- refresh setiap 60 detik, bukan setiap 5 detik;
- tetap membersihkan interval saat unmount.

### 8.3 Membatasi subscription Zustand

Komponen layout/dashboard hanya subscribe ke bagian store yang digunakan:

```text
DashboardLayout
DashboardPage
Sidebar
MobileNav
Topbar
ProjectAiAssistant
```

Ini mengurangi render ulang akibat perubahan state yang tidak relevan.

## 9. Performa Setelah Perubahan

Setelah hot reload stabil, trace diamati selama 15 detik:

```text
Tambahan /api/bootstrap: 0
Tambahan /api/sync-version: 0
Tambahan /api/announcements: 0
```

Hasil tersebut menunjukkan siklus request berulang telah berhenti pada jendela pengamatan.

## 10. Perbaikan yang Ditunda

1. Refactor query `/api/bootstrap` menjadi endpoint/payload modular ditunda karena menyentuh arsitektur data/API.
2. Refactor dashboard besar menjadi komponen terpisah ditunda karena bukan scope Tahap 3E.
3. Memoisasi seluruh derivasi Topbar ditunda karena dampak utama sudah berasal dari request berulang dan subscription store.
4. Dynamic import chart/dashboard ditunda sampai tersedia pengukuran render authenticated yang lebih lengkap.
5. Interval sync 15 detik tidak diubah; setelah siklus bootstrap diperbaiki, interval tersebut tetap menjadi mekanisme realtime existing.

## 11. Hal yang Tidak Disentuh

```text
halaman dan komponen login
Auth / NextAuth
middleware
RBAC, role, dan permission
shared navigation config
11 menu utama
mobile bottom navigation
entry point sub-fitur Tahap 3D
Prisma schema dan migration
database
package.json dan dependency
src/app/globals.css
route /dashboard
root redirect /login
```

## 12. Risiko Tersisa

1. Render penuh route authenticated belum dapat diukur secara otomatis pada audit ini.
2. `/api/bootstrap` masih memuat payload relasional besar ketika perubahan data memang terdeteksi.
3. Dashboard tetap merupakan client component besar.
4. Banyak Topbar tetap menghitung ringkasan notifikasi dari seluruh `projects` saat render awal.
5. Next development compile-on-demand tetap dapat membuat klik pertama ke route terasa lambat.

## 13. Rekomendasi Tahap Berikutnya

1. Uji navigasi authenticated setelah seluruh route utama tercompile.
2. Gunakan React Profiler/browser performance untuk mengukur commit Dashboard, Topbar, dan Assistant.
3. Audit payload dan durasi `/api/bootstrap` secara server-side sebelum memecah endpoint.
4. Pertimbangkan cache/payload modular setelah desain data Tahap 4 disepakati.

## 14. Hasil Validasi

```text
npx tsc --noEmit: lulus
git diff --check: lulus
npm run lint: tidak tersedia
build: tidak dijalankan sesuai batasan tahap
```
