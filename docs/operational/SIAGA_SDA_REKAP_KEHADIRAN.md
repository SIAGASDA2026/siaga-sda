# SIAGA-SDA Rekap Kehadiran

> Dokumen acuan SIAGA-SDA / SIMONPRO 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Tujuan

Sistem dapat mengekspor rekap kehadiran bulanan untuk petugas dan mandor.

## Output Export

- Excel
- PDF

## Isi Rekap Bulanan

- seluruh petugas
- seluruh mandor
- hadir
- izin
- sakit
- cuti
- alpa
- total hari tugas

## Prinsip Data

Rekap berdasarkan `worker_id`, bukan teks nama. Ini penting agar tidak rusak saat ada nama yang sama atau perubahan ejaan nama.

## Filter

- Bulan
- Tahun
- Jenis petugas
- Tim
- Asset/lokasi
- Mandor
