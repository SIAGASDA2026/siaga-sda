<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Admin Peil Banjir UI

> Dokumen acuan SIAGA-SDA 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Role

```text
admin_peil_banjir
```

## Tujuan Halaman

Halaman ini menjadi ruang kerja konseptual Admin Peil Banjir sesuai assignment aktif, bukan akses global sembarangan.

Catatan tahap PB-DOC.1:

- role `admin_peil_banjir` masih konsep;
- belum dipaksakan ke RBAC runtime;
- belum mengubah Prisma, migration, database, seed, atau permission runtime.

## Hak Akses Utama

- Input permohonan dari Surat Masuk
- Upload berkas awal/gabungan
- Verifikasi Persyaratan Administrasi
- Mengelola checklist persyaratan
- Tambah/edit/nonaktifkan persyaratan jika berwenang
- Ubah susunan persyaratan jika berwenang
- Upload dokumen per item persyaratan
- Catatan verifikator
- Export PDF Persyaratan jika berwenang
- Mengarsipkan surat rekomendasi final
- Menghubungkan permohonan dengan Surat Masuk dan Surat Keluar

## Tidak Boleh

- Approve final peil jika bukan PPK
- Menerbitkan izin bangunan
- Menghapus permanen persyaratan yang sudah menjadi snapshot permohonan lama
- Mengubah data di luar assignment aktif

## Role Teknis Terkait

```text
tim_teknis_peil_banjir
```

Tim Teknis Peil Banjir menangani survey lokasi, titik koordinat, review hidrologi/hidrolika, catatan teknis, dokumentasi lapangan, dan bahan rekomendasi.

## Persyaratan Administrasi

Gunakan label netral seperti:

- Persyaratan Administrasi
- Master Persyaratan Peil Banjir
- Template Persyaratan Aktif
- Daftar Persyaratan Aktif
- Persyaratan Rekomendasi Peil Banjir

Jangan gunakan label tahun pada UI utama atau export PDF.

Perubahan Master Persyaratan hanya berlaku untuk permohonan baru. Permohonan lama tetap memakai snapshot checklist yang berlaku saat permohonan dibuat.

## Komponen UI Desktop

- Header role dan ringkasan assignment aktif.
- Kartu statistik ringkas.
- Daftar tugas/pending item.
- Filter tahun anggaran, kegiatan, paket, status.
- Tabel desktop dengan action jelas.
- Detail drawer untuk melihat data tanpa pindah konteks.
- Section Master Persyaratan untuk admin berwenang.
- Tombol Export PDF Persyaratan.

## Komponen UI Mobile

- Header ringkas.
- Card list pengganti tabel.
- Filter collapsible.
- Tombol aksi utama sticky di bawah bila diperlukan.
- Font dan padding disesuaikan agar tidak boros ruang.
- Checklist persyaratan tampil sebagai card per item agar mudah diverifikasi di lapangan.

## Audit Log

Semua aksi create/update/approval/upload/catatan wajib masuk audit log dengan:
- actor_user_id
- action
- entity_type
- entity_id
- old_data
- new_data
- created_at
