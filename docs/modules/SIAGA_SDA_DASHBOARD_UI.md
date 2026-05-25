# SIAGA-SDA Dashboard UI

> Dokumen acuan SIAGA-SDA / SIMONPRO 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Deskripsi

Dashboard adalah ringkasan cepat dan ringan. Tidak boleh memuat peta interaktif besar.

## Fitur Wajib

- Total Paket Aktif
- Paket Deviasi/Kritis
- Approval Pending
- Survey Belum Ditindaklanjuti
- Surat Masuk Penting
- Warning Center
- Tombol Buka Peta Monitoring

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
