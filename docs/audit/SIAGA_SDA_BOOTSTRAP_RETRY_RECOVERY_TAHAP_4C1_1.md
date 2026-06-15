# SIAGA-SDA Bootstrap Retry & Recovery - Tahap 4C.1.1

## 1. Ringkasan

Tanggal audit dan perubahan: **15 Juni 2026**

Tahap 4C.1.1 memperkuat proses bootstrap data dashboard ketika koneksi database Neon gagal atau lambat sesaat.

Sebelumnya, kegagalan pertama `GET /api/bootstrap` langsung menandai bootstrap selesai dan merender Data Demo/Fallback. Kondisi tersebut dapat terjadi walaupun database pulih beberapa detik kemudian.

Setelah perubahan:

1. bootstrap awal mencoba maksimal tiga kali;
2. halaman tetap pada loading state selama retry;
3. fallback baru dirender setelah seluruh percobaan gagal;
4. fallback menyediakan tombol manual `Muat Ulang Data Database`;
5. recovery otomatis dari `/api/sync-version` tetap berjalan;
6. kegagalan sinkronisasi background tidak menukar data database menjadi fallback.

## 2. File yang Dibaca

```text
AGENTS.md
docs/core/*
docs/design/*
docs/audit/*
src/app/(dashboard)/layout.tsx
src/app/api/bootstrap/route.ts
src/app/api/sync-version/route.ts
src/store/useAppStore.ts
src/lib/data.ts
src/app/(dashboard)/dashboard/page.tsx
```

## 3. Backup

Backup dibuat sebelum source diubah:

```text
backup/backup-bootstrap-retry-recovery-4c1-1-before-change
```

File yang dibackup:

```text
src/app/(dashboard)/layout.tsx
```

## 4. File yang Diubah

```text
src/app/(dashboard)/layout.tsx
docs/audit/SIAGA_SDA_BOOTSTRAP_RETRY_RECOVERY_TAHAP_4C1_1.md
```

`src/app/api/bootstrap/route.ts`, `src/app/api/sync-version/route.ts`, store, dan data demo diaudit tetapi tidak perlu diubah.

## 5. Alur Bootstrap Sebelum

```text
Session authenticated
-> GET /api/bootstrap sekali
-> jika berhasil: hydrate database
-> jika gagal pertama kali: tandai bootstrapped
-> render Data Demo/Fallback
```

Error bootstrap ditangkap di client tanpa retry. Session tidak dijatuhkan, tetapi fallback muncul terlalu cepat.

`dashboardDataSource` menjadi `database` hanya ketika `hydrateFromDatabase()` berhasil. Store tetap berisi `demo` jika bootstrap gagal.

## 6. Alur Bootstrap Sesudah

```text
Session authenticated
-> tampilkan "Memuat data database..."
-> percobaan bootstrap pertama langsung
-> jika gagal: tampilkan "Koneksi database belum stabil, mencoba ulang..."
-> tunggu 1000 ms dan coba kedua
-> jika gagal: tunggu 1500 ms dan coba ketiga
-> jika salah satu berhasil: hydrate database dan render dashboard
-> jika semua gagal: render Data Demo/Fallback
```

Fallback tidak lagi muncul setelah satu kegagalan sementara.

## 7. Retry dan Manual Reload

Konfigurasi retry:

```text
Jumlah maksimal percobaan: 3
Percobaan pertama: langsung
Delay percobaan kedua: 1000 ms
Delay percobaan ketiga: 1500 ms
Total jeda retry: 2500 ms
```

Retry dibatasi dan tidak berjalan tanpa batas.

Saat fallback aktif, banner menampilkan:

```text
Database belum berhasil dimuat. Periksa koneksi atau coba lagi.
```

Tombol:

```text
Muat Ulang Data Database
```

Tombol menjalankan rangkaian retry bootstrap tanpa reload seluruh halaman. Selama recovery manual berjalan:

- data fallback tetap terlihat;
- tombol dinonaktifkan;
- teks berubah menjadi `Mencoba Ulang...`;
- jika berhasil, store di-hydrate dengan database dan banner fallback hilang;
- jika gagal, fallback tetap aktif dengan pesan aman.

## 8. Recovery Otomatis dan Sync-version

`/api/sync-version` tetap diperiksa setiap 15 detik, hanya ketika tab terlihat, serta pada focus/visibility change.

Perubahan edge case:

- versi database baru hanya disimpan setelah bootstrap recovery berhasil;
- jika `sync-version` berhasil tetapi bootstrap recovery gagal sekali, interval berikutnya tetap dapat mencoba kembali;
- kegagalan sync background tidak mengubah `dashboardDataSource` database menjadi demo;
- UI tidak berkedip atau kembali ke loading saat sync background gagal.

Endpoint `/api/sync-version` tidak diubah karena:

- request sudah read-only;
- payload kecil;
- error sudah ditangkap;
- interval existing tidak berlebihan;
- perubahan yang diperlukan cukup pada urutan state client.

## 9. Error Handling

UI hanya menampilkan pesan umum:

```text
Database belum berhasil dimuat. Periksa koneksi atau coba lagi.
```

Detail connection string, host database, dan error Prisma tidak ditampilkan ke UI.

Endpoint bootstrap dan payload Prisma tidak diperbesar atau ditambah query baru.

## 10. Dampak UI

### Dashboard Desktop

- loading state tetap sederhana;
- retry menampilkan status yang jelas;
- fallback banner tetap terlihat jika seluruh retry gagal;
- tombol manual ditempatkan di banner fallback tanpa redesign dashboard.

### Mobile

- banner menggunakan susunan vertikal pada layar kecil;
- tombol tetap dapat disentuh;
- tidak menambah overflow horizontal.

### Data Demo/Fallback

- data demo tidak dihapus atau diubah;
- label fallback tetap wajib terlihat;
- fallback baru muncul setelah retry selesai.

## 11. Uji Manual

### Kondisi Normal

Uji HTTP lokal terautentikasi sebagai PPK:

| Percobaan | Status | Projects | Users | Audit Logs |
|---|---:|---:|---:|---:|
| 1 | 200 | 4 | 13 | 23 |
| 2 | 200 | 4 | 13 | 23 |
| 3 | 200 | 4 | 13 | 23 |

Data bootstrap stabil pada tiga request berturut-turut.

### Kondisi Gagal Sesaat

Simulasi kegagalan database tidak dilakukan karena memutus koneksi Neon atau mengubah environment dapat mengganggu sesi aplikasi dan berada di luar batas perubahan aman.

Jalur kode terverifikasi:

- kegagalan pertama dan kedua tidak menandai bootstrap selesai;
- status berubah menjadi retrying;
- fallback hanya aktif setelah kegagalan ketiga.

### Tombol Manual

Jalur tombol manual terverifikasi melalui typecheck dan review state:

- tombol memicu ulang bootstrap;
- tidak reload halaman;
- tidak mengubah data demo;
- sukses mengarah ke hydrate database;
- gagal kembali mempertahankan fallback.

Uji visual kondisi fallback dan tombol manual masih perlu dilakukan ketika tersedia lingkungan staging/offline yang aman.

## 12. Hal yang Tidak Disentuh

```text
Login dan asset login
Auth / NextAuth
Middleware
RBAC dan role
Prisma schema dan migration
Database dan data production
package.json dan dependency
Data dummy/demo
Route root dan /login
Desain dashboard besar
Endpoint dan payload bootstrap
Endpoint sync-version
```

## 13. Risiko Tersisa

1. Retry client dapat membantu gangguan singkat, tetapi tidak menyelesaikan database outage berkepanjangan.
2. Bootstrap API masih merupakan payload besar dan query kompleks existing; optimasi payload memerlukan tahap audit performa terpisah.
3. Tidak ada telemetry server khusus untuk jumlah kegagalan bootstrap/retry.
4. Simulasi database gagal dan uji visual fallback belum dilakukan karena tidak ada environment staging/offline aman.
5. Jika database pulih setelah fallback, recovery otomatis bergantung pada `/api/sync-version` atau tombol manual.

## 14. Rekomendasi

Sebelum Tahap 4D, lakukan uji staging untuk:

1. bootstrap timeout/gagal dua kali lalu berhasil;
2. seluruh retry gagal dan fallback tampil;
3. tombol manual setelah database pulih;
4. recovery otomatis melalui sync-version;
5. mobile banner fallback.

Tahap teknis lanjutan yang disarankan adalah observability bootstrap dan penyelarasan source-of-truth badge Approval, bukan redesign visual.

## 15. Hasil Validasi

```text
npx tsc --noEmit: lulus
git diff --check: lulus, hanya peringatan normalisasi LF ke CRLF
npm run lint: script tidak tersedia
npm run build: tidak dijalankan karena tidak diwajibkan
```
