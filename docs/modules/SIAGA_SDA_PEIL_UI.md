<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Peil Banjir UI

> Dokumen acuan SIAGA-SDA 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Deskripsi

Peil Banjir mengelola permohonan rekomendasi teknis peil banjir dari pihak ketiga, rekanan, perusahaan, atau pemohon lain. Modul ini dimulai dari Surat Masuk, verifikasi Persyaratan Administrasi, survey lokasi, pengambilan titik koordinat, review hidrologi dan hidrolika, penyusunan draft rekomendasi, approval PPTK/PPK, tanda tangan Kadis, penerbitan Surat Rekomendasi, dan arsip Surat Keluar.

Dinas PU Bidang SDA menerbitkan rekomendasi teknis peil banjir, bukan izin bangunan.

Peil Banjir bukan sekadar monitoring tinggi muka air, banjir, rob, atau genangan. Data tersebut boleh muncul sebagai bagian dari survey dan analisis teknis.

## Fitur Wajib

- Data pemohon
- Surat Masuk kategori Permohonan Rekomendasi Peil Banjir
- Persyaratan Administrasi
- Upload berkas gabungan pemohon
- Upload dokumen per item persyaratan
- Snapshot checklist persyaratan per permohonan
- Lokasi dan titik koordinat
- Survey lokasi
- Review hidrologi dan hidrolika
- Catatan teknis
- Draft rekomendasi teknis
- Approval PPTK/PPK
- Tanda tangan Kadis
- Surat rekomendasi terbit
- Surat Keluar dan arsip
- Master Persyaratan Peil Banjir
- Export PDF Persyaratan

## Sub-menu Disarankan

1. Semua Permohonan
2. Verifikasi Administrasi
3. Survey Lapangan
4. Analisis Teknis
5. Draft Rekomendasi
6. Approval
7. Arsip & Rekap
8. Master Persyaratan

Master Persyaratan hanya untuk admin berwenang.

## Persyaratan Administrasi

Gunakan label:

- Persyaratan Administrasi
- Daftar persyaratan yang berlaku untuk permohonan ini
- Master Persyaratan Peil Banjir
- Template Persyaratan Aktif
- Daftar Persyaratan Aktif
- Persyaratan Rekomendasi Peil Banjir

Jangan gunakan label yang menempelkan tahun pada nama persyaratan atau template UI.

Daftar awal:

1. Surat Permohonan
2. Fotocopy KTP Pemohon
3. Surat Kuasa Jika Pengurusan Diwakilkan
4. Fotocopy Surat Kepemilikan Tanah
5. Bukti Lunas PBB Tahun Terakhir
6. Akta Pendirian / Akta Perubahan Perusahaan
7. Biodata Perusahaan
8. Surat Pengesahan Menteri Kehakiman dan HAM bagi PT
9. Fotocopy NPWP
10. Gambar Situasi Tanah / Peta Lokasi / Layout
11. Detail Bangunan
12. Detail Saluran
13. Perhitungan Debit Air Maksimal / Hidrologi dan Hidrolika
14. Konfirmasi Kesesuaian Kegiatan Pemanfaatan Ruang
15. Izin Lokasi / Izin Tetangga
16. Dokumen/Persyaratan Lainnya

Daftar ini adalah referensi awal persyaratan aktif, bukan hardcoded permanen.

## Fleksibilitas Persyaratan

Master Persyaratan harus mendukung:

- Tambah Persyaratan
- Edit Persyaratan
- Hapus / Nonaktifkan Persyaratan
- Ubah Susunan / Atur Urutan
- Tambah Persyaratan Khusus pada detail permohonan
- Upload File per item persyaratan
- Catatan Verifikator
- Riwayat perubahan / audit trail

Tombol UI boleh memakai label "Hapus", tetapi konsep sistem tetap nonaktif/soft delete. Persyaratan yang pernah dipakai pada permohonan lama harus tetap tersimpan dalam snapshot.

## Snapshot Checklist

Setiap permohonan Peil Banjir menyimpan snapshot persyaratan yang berlaku saat permohonan dibuat.

Snapshot minimal:

- nama persyaratan saat itu;
- nomor urut saat itu;
- sifat persyaratan saat itu;
- kategori persyaratan saat itu;
- status per item;
- file per item;
- catatan verifikator;
- riwayat upload/perubahan jika tersedia.

Perubahan Master Persyaratan hanya berlaku untuk permohonan baru dan export PDF berikutnya.

## Export PDF Persyaratan

Sediakan konsep tombol:

- Export PDF Persyaratan
- Download Persyaratan PDF

PDF menggunakan daftar persyaratan aktif/latest dan susunan terbaru dari Master Persyaratan Aktif. Judul PDF:

```text
Persyaratan Rekomendasi Peil Banjir
```

PDF wajib memuat catatan:

```text
Dinas PU Bidang SDA menerbitkan rekomendasi teknis peil banjir, bukan izin bangunan.
```

Tahap dokumen ini belum menambah dependency PDF, endpoint, atau logic export baru.

## Role Khusus Konseptual

- `admin_peil_banjir` / Admin Peil Banjir: administrasi layanan, persyaratan, dokumen, verifikasi, export PDF, arsip.
- `tim_teknis_peil_banjir` / Tim Teknis Peil Banjir: survey, koordinat, review hidrologi/hidrolika, catatan teknis, dan bahan rekomendasi.

Role ini belum dipaksakan ke RBAC runtime, Prisma, migration, database, atau seed.

## Desktop UI

- Gunakan layout dua area bila perlu: list/filter di kiri dan detail drawer di kanan.
- Gunakan tabel untuk data banyak.
- Gunakan badge status dan ringkasan card.
- Gunakan search dan filter tahun anggaran/status/role bila relevan.

## Mobile UI

- Gunakan card list.
- Filter dibuat collapsible.
- Detail ditampilkan sebagai bottom sheet/drawer.
- Aksi utama dibuat jelas dan tidak memenuhi layar.

## Permission

- Semua data mengikuti role + assignment aktif.
- Pimpinan dan Auditor read-only.
- User nonaktif tidak dapat membuat, mengubah, atau approve data.
- Semua approval harus masuk audit log.
- Admin Peil Banjir dan Tim Teknis Peil Banjir masih konsep sampai tahap PB-RBAC.1.

## Empty State

Tampilkan pesan informatif:
```text
Belum ada data untuk filter ini.
Silakan ubah filter atau tambah data sesuai kewenangan Anda.
```

## Performance

- Pagination wajib.
- Lazy loading untuk detail.
- Jangan load semua file/foto sekaligus.
- Gunakan thumbnail untuk gambar.
