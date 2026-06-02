<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA System Architecture

> Dokumen acuan SIAGA-SDA 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.



## Instruksi Wajib untuk Codex

1. Project ini adalah SIAGA-SDA, sistem aktif yang sedang dikembangkan bertahap.
2. Jangan rebuild total dan jangan menghapus sistem lama tanpa audit.
3. Semua perubahan database wajib melalui migration Supabase.
4. Semua UI wajib responsive untuk laptop/desktop dan mobile/phone.
5. Jangan hardcode role, permission, status, atau assignment.
6. Semua aksi penting wajib tercatat ke audit log.
7. Data lama harus dipertahankan sejauh mungkin.
8. Setelah perubahan, jalankan build, lint/typecheck, dan cek tampilan desktop + mobile.


## Tujuan Arsitektur

SIAGA-SDA dirancang sebagai **Smart Government Command Center SDA** untuk monitoring proyek, survey, surat, peil banjir, aset SDA, operasional lapangan, pasang surut, approval, audit, dan administrasi.

## Prinsip Arsitektur

1. **Frontend responsive** untuk desktop dan mobile.
2. **Backend API terstruktur** untuk auth, role, package, survey, map, approval, report, storage.
3. **Supabase/PostgreSQL** sebagai database utama.
4. **Supabase Storage** untuk dokumen dan foto.
5. **Migration-first** untuk perubahan schema.
6. **Assignment-based access** untuk keamanan akses.
7. **Audit log** untuk semua aksi penting.
8. **Pagination dan lazy loading** agar aplikasi tidak berat.
9. **Peta Monitoring** hanya lengkap di menu Peta Monitoring, bukan di dashboard.

## Lapisan Sistem

```text
UI Layer
├── Login/Auth
├── Dashboard Ringan
├── Peta Monitoring
├── Survey Investigasi
├── Paket Pekerjaan
├── Approval Center
├── Surat
├── Peil
├── Asset
├── Operasional
└── Audit/Report

API Layer
├── Auth API
├── Role/Permission API
├── Assignment API
├── Package API
├── Survey API
├── Map API
├── Approval API
├── Storage API
├── Report Export API
└── Audit API

Data Layer
├── Supabase Auth / Custom Auth Binding
├── PostgreSQL Tables
├── Row Level Security
├── Storage Buckets
└── Database Functions / Views
```

## Integrasi Data Utama

```text
PROGRAM → KEGIATAN → SUB_KEGIATAN → PAKET
SURVEY → TINDAK LANJUT → PAKET / SURAT / ARSIP
SURAT → DISPOSISI → SURVEY / RAPAT / PEIL / PAKET
ASSET → OPERASIONAL → SHIFT → REKAP KEHADIRAN
PAKET → LAPORAN → APPROVAL → PEMBAYARAN → PHO/FHO
```

## Performance Rules

1. Jangan load semua data sekaligus.
2. Gunakan pagination.
3. Gunakan lazy loading.
4. Marker peta gunakan clustering.
5. Foto wajib dikompres dan thumbnail digunakan di list.
6. Dashboard hanya ringkasan ringan.
7. Query difilter berdasarkan assignment aktif.
