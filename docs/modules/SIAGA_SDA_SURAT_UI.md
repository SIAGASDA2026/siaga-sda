<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Surat Masuk & Keluar UI

> Dokumen acuan SIAGA-SDA 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Deskripsi

Tetap satu tab Surat Masuk & Keluar, namun kategori dan workflow berbeda.

## Fitur Wajib

- Input surat
- Disposisi
- Relasi survey/paket/peil
- Kategori Permohonan Rekomendasi Peil Banjir
- Aksi Buat Proses Peil Banjir
- Undangan rapat
- Tindak lanjut
- Arsip

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

---

# UPDATE FINAL SURAT MASUK & KELUAR

Notulen & Tindak Lanjut Rapat adalah sub-fitur di detail surat undangan rapat, bukan tab utama.

Surat dapat ditindaklanjuti ke:
- Survey Investigasi
- Peil Banjir sebagai proses permohonan rekomendasi teknis peil banjir
- Paket Pekerjaan
- Surat Keluar
- Notulen & Tindak Lanjut Rapat
- Arsip

Untuk Peil Banjir, Surat Masuk & Keluar menjadi pintu awal administrasi resmi:

```text
Surat permohonan diterima
-> Kategori: Permohonan Rekomendasi Peil Banjir
-> Aksi: Buat Proses Peil Banjir
-> Status: Diteruskan ke Peil Banjir
-> Proses teknis di Peil Banjir
-> Surat rekomendasi final diarsipkan sebagai Surat Keluar
```

Dinas PU Bidang SDA menerbitkan rekomendasi teknis peil banjir, bukan izin bangunan.
