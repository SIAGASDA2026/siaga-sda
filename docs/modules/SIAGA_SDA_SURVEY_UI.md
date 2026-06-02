<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Survey Investigasi UI

> Dokumen acuan SIAGA-SDA 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Deskripsi

Survey Investigasi mencatat masalah lapangan dan tindak lanjut. Gunakan istilah Ditindaklanjuti, bukan Ditindaklanjuti.

## Fitur Wajib

- Form survey
- Kategori masalah
- Lokasi/koordinat
- Urgensi
- Rekomendasi awal
- Tindak lanjut
- Riwayat status

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

# UPDATE FINAL SURVEY INVESTIGASI

Gunakan istilah “Ditindaklanjuti”, bukan “Menjadi Paket”.

Survey tidak boleh hilang setelah ditindaklanjuti. Status berubah dan relasi ditampilkan.

Tindak lanjut survey:
- Dibuat Paket Rutin
- Dibuat Paket Fisik
- Perbaikan Langsung
- Surat Balasan
- Koordinasi OPD
- Usulan Tahun Berikutnya
- Tidak Dilanjutkan
- Arsip
