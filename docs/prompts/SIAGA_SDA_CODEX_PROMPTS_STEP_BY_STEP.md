# SIAGA-SDA Codex Prompts Step by Step

> Dokumen acuan SIAGA-SDA / SIMONPRO 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Prompt Umum Wajib

```text
Baca dan patuhi file berikut:

/docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md
/docs/design/SIAGA_SDA_DESIGN_SYSTEM.md

Project ini adalah rebranding dan pengembangan dari SIMONPRO menjadi SIAGA-SDA.
SIAGA-SDA bukan project baru.

Jangan rebuild total.
Jangan menghapus data lama tanpa audit.
Gunakan migration Supabase.
Gunakan assignment-based access.
Jangan hardcode role.
Semua UI harus responsive desktop dan mobile.
Ikuti visual referensi di /docs/assets.

Kerjakan hanya tahap yang diminta.
Setelah selesai, jalankan build/lint/typecheck dan laporkan file yang berubah.
```

## Tahap 1 — Audit Project Lama

```text
Audit struktur project SIMONPRO yang ada.
Jangan ubah kode dulu.
Laporkan:
1. framework yang digunakan,
2. folder penting,
3. sistem auth yang ada,
4. database/client yang dipakai,
5. menu yang ada,
6. risiko besar,
7. rekomendasi refactor bertahap.
```

## Tahap 2 — Rebranding Aman

```text
Lakukan rebranding tampilan dari SIMONPRO menjadi SIAGA-SDA secara aman.
Jangan mengubah database dulu.
Pastikan desktop dan mobile responsive.
Terapkan footer:
SIAGA-SDA
©2026 Budi Legawan, ST
All Rights Reserved
```

## Tahap 3 — Login/Auth

```text
Perbaiki login sesuai dokumen /docs/auth.
Hilangkan role dropdown di login.
Role harus ditentukan dari database/assignment setelah login.
Pastikan admin dan user mobile bisa login.
Catat failed login ke audit log bila struktur sudah tersedia.
```

## Tahap 4 — Database Core

```text
Buat migration Supabase untuk role, assignment, audit log, dan mapping user.
Jangan hardcode role.
Jangan hapus data lama.
Pastikan ada status AKTIF/NONAKTIF/ARSIP.
```

## Tahap 5 — Menu Final

```text
Sesuaikan sidebar/menu utama:
1. Dashboard
2. Peta Monitoring
3. Survey Investigasi
4. Paket Pekerjaan
5. Approval Center
6. Surat Masuk & Keluar
7. Administrasi
8. Peil Banjir
9. Asset SDA
10. Audit Log
11. Pengaturan

Hapus Master Data sebagai tab utama.
Pindahkan master data ke Pengaturan/Admin sesuai permission.
```

## Tahap 6 — Dashboard Ringan

```text
Buat Dashboard ringan.
Jangan tampilkan peta interaktif besar.
Tampilkan ringkasan dan tombol Buka Peta Monitoring.
Pastikan mobile tidak berat.
```

## Tahap 7 — Peta Monitoring

```text
Buat Peta Monitoring sebagai menu khusus.
Layer wajib:
Paket, Survey, Asset, Operasional, Peil, Pasang Surut, Surat, Deviasi/Warning.
Gunakan clustering dan filter.
Detail marker tampil sebagai drawer.
```

## Tahap 8 — Survey Investigasi

```text
Bangun Survey Investigasi.
Gunakan istilah Ditindaklanjuti, bukan Menjadi Paket.
Tambahkan follow_up_type, follow_up_status, linked_package_id, linked_letter_id, follow_up_note.
```

## Tahap 9 — Paket Pekerjaan

```text
Bangun ruang kerja paket.
Jenis paket hanya FISIK, KONSULTAN, RUTIN.
Metode pengadaan terpisah: PENGADAAN_LANGSUNG atau LELANG.
Direksi Teknis wajib ada pada workflow paket fisik.
```

## Tahap 10 — Approval Center

```text
Bangun Approval Center berbasis role + assignment.
Tampilkan pending item sesuai kewenangan user.
Pimpinan dan Auditor read-only.
User nonaktif tidak boleh approve.
```
