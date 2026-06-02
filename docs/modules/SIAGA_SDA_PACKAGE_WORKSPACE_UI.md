<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Package Workspace UI

> Dokumen acuan SIAGA-SDA 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Deskripsi

1 paket = 1 ruang kerja. Semua proses paket ditampilkan dalam detail paket.

## Fitur Wajib

- Informasi Paket
- Perencanaan
- Pengadaan
- Kontrak
- Pra-Konstruksi
- Pelaksanaan
- Laporan
- Pembayaran
- PHO/FHO
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

# UPDATE FINAL PAKET PEKERJAAN

Jenis paket final:
- Fisik
- Konsultan
- Rutin

Sub jenis konsultan:
- Konsultan Perencanaan
- Konsultan Pengawasan

Metode pengadaan:
- Pengadaan Langsung
- Tender/Lelang

Direksi Teknis wajib tetap ada pada paket fisik.
ADMIN_SUB_KEGIATAN menjadi admin administrasi paket berdasarkan assignment sub kegiatan.
