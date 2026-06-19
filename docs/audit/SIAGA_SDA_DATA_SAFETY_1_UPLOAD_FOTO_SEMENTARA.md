# SIAGA-SDA DATA-SAFETY.1 — Upload Foto Sementara

Tanggal: 19 Juni 2026

## 1. Ringkasan Tujuan

Tahap DATA-SAFETY.1 mengaudit dan mengamankan penggunaan foto sementara berbasis `URL.createObjectURL` agar URL `blob:` tidak tampil atau tersimpan sebagai dokumentasi resmi. Perubahan ini tidak membuat storage baru, tidak membuat endpoint upload resmi, dan tidak mengubah database.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/audit/SIAGA_SDA_BRANDING_CLEANUP_1_AUDIT.md`
- `docs/database/SIAGA_SDA_STORAGE_RULES.md`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/laporan/page.tsx`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `src/app/(dashboard)/masalah/page.tsx`
- `src/app/(dashboard)/dokumen/page.tsx`
- `src/store/useAppStore.ts`
- `src/app/api/projects/[id]/records/[kind]/route.ts`
- `src/types/index.ts`
- `prisma/schema.prisma` hanya dibaca

## 3. Backup

Backup dibuat di:

`backup/backup-data-safety-1-upload-foto-before-change/`

File backup:

- `survey-page.tsx`
- `laporan-page.tsx`
- `proyek-id-page.tsx`

## 4. File yang Diubah

- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/laporan/page.tsx`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `docs/audit/SIAGA_SDA_DATA_SAFETY_1_UPLOAD_FOTO_SEMENTARA.md`

## 5. Temuan `URL.createObjectURL` dan `blob:`

Lokasi penggunaan preview lokal:

- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/laporan/page.tsx`
- `src/app/(dashboard)/proyek/[id]/page.tsx` pada tab Survey
- `src/app/(dashboard)/proyek/[id]/page.tsx` pada tab Laporan Harian

Sebelum perubahan, array `photos` dari `URL.createObjectURL` dapat masuk langsung ke payload `foto` melalui pola `photos.map(...)`. Store kemudian mengirim payload JSON ke API record proyek, dan API `saveFotos` menyimpan `foto.url` ke tabel foto tanpa guard server-side khusus terhadap URL `blob:`.

## 6. Perubahan Pengamanan

Perubahan frontend:

- Menambahkan helper `isBlobUrl(url)` di halaman yang memakai preview foto.
- Menyaring `blob:` dari payload `foto` dengan `photos.filter((url) => !isBlobUrl(url))`.
- Mengubah validasi teks dari wajib upload permanen menjadi wajib memilih preview lokal.
- Menambahkan label `Preview lokal` pada thumbnail foto yang masih `blob:`.
- Menambahkan peringatan amber bahwa foto belum tersimpan permanen.
- Mengubah toast sukses agar tidak menyatakan foto tersimpan resmi saat yang dipilih masih preview lokal.

Keputusan desain:

- `URL.createObjectURL` tetap dipakai hanya untuk preview lokal.
- `blob:` tidak lagi dikirim dari form yang disentuh pada tahap ini.
- Data survey/laporan tetap bisa disimpan tanpa foto permanen, dengan pesan yang jujur.
- Upload resmi ditunda sampai endpoint/storage permanen tersedia.

## 7. Modul yang Diaudit

### Survey Investigasi

Halaman survey memakai preview lokal untuk foto survey. Payload foto kini hanya menyertakan URL non-`blob:`. Jika semua foto baru masih preview lokal, survey disimpan tanpa foto permanen dan UI menampilkan pesan bahwa upload resmi belum tersedia.

### Laporan Proyek

Halaman laporan memakai preview lokal untuk foto laporan harian. Payload foto kini menyaring `blob:` sebelum dikirim.

### Detail Paket

Tab Survey dan Laporan Harian di detail paket memakai guard yang sama agar preview lokal tidak dikirim sebagai foto permanen.

### Masalah

Tidak ditemukan upload foto aktif berbasis `URL.createObjectURL` pada halaman masalah. Tidak diubah.

### Dokumen

Halaman dokumen sudah menampilkan peringatan bahwa upload dokumen umum memerlukan endpoint penyimpanan file. Tidak diubah.

## 8. Risiko yang Dikurangi

- Mengurangi risiko URL `blob:` tersimpan ke database sebagai bukti foto resmi.
- Mengurangi pesan UI yang menyesatkan seolah foto sudah permanen.
- Mengurangi risiko audit karena foto sementara diberi label eksplisit.
- Menjaga data demo/preview tidak tampil sebagai bukti lapangan resmi.

## 9. Risiko Tersisa

- API `src/app/api/projects/[id]/records/[kind]/route.ts` masih belum memiliki guard server-side untuk menolak URL `blob:` jika ada caller lain mengirimnya.
- Belum ada endpoint upload foto resmi.
- Belum ada storage permanen, metadata file, kompresi, watermark, atau validasi mime server-side pada tahap ini.
- Jika edit data lama memiliki foto permanen lalu user menambahkan foto preview baru, payload hanya mempertahankan URL non-`blob:` sesuai data yang masih ada di form.

## 10. Rekomendasi Tahap Lanjut

- Buat endpoint upload foto resmi dengan validasi mime, ukuran, dan extension.
- Integrasikan storage permanen sesuai aturan storage SIAGA-SDA.
- Tambahkan guard server-side untuk menolak `blob:`, `data:`, dan URL tidak sah pada API record.
- Tambahkan metadata audit: uploader, role, timestamp, koordinat, module origin, dan verification status.
- Siapkan migrasi/adapter storage hanya setelah disetujui eksplisit.

## 11. Validasi

- `git diff --check`: lulus.
- `npx tsc --noEmit`: lulus.
- `npm run lint`: tidak dijalankan karena script `lint` tidak tersedia di `package.json`.
