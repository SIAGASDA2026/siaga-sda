<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Shift System

> Dokumen acuan SIAGA-SDA 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Prinsip

Kehadiran petugas dicatat oleh mandor melalui laporan shift. Tidak menggunakan foto absensi.

## Master Data Petugas

Field:
- id
- nama lengkap
- nomor HP jika ada
- jenis petugas
- tim
- status aktif/nonaktif
- created_by

## Shift Log

Field:
- tanggal
- shift
- asset/lokasi
- mandor
- anggota
- status kehadiran
- catatan
- GPS mandor
- laporan

## Status Kehadiran

```text
HADIR
IZIN
SAKIT
CUTI
ALPA
```

## Larangan

- Jangan mengetik nama petugas bebas.
- Jangan pakai foto absensi.
- Jangan hapus petugas yang punya histori.
