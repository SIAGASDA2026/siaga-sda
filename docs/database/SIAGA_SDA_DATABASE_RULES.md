<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Database Rules

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


## Prinsip Database

1. Assignment-based.
2. Multi-role.
3. Audit-ready.
4. Scalable multi tahun.
5. Tidak hard delete.
6. Migration bertahap.
7. Indexed query.
8. Pagination.
9. Lazy loading.
10. RLS/permission harus mengikuti role + assignment aktif.

## Status Data

Gunakan status:
```text
AKTIF
NONAKTIF
ARSIP
```

Untuk approval gunakan status:
```text
DRAFT
MENUNGGU_REVIEW
MENUNGGU_APPROVAL
DISETUJUI
MINTA_REVISI
DITOLAK
SELESAI
ARSIP
```

## Index Penting

Tambahkan index untuk:
- package_id
- survey_id
- letter_id
- peil_id
- asset_id
- activity_id
- status
- created_at
- assigned_user_id
- role_code
- fiscal_year
- coordinates/GIS bila dipakai

## Hard Delete

Dilarang hard delete untuk:
- user/personel
- role assignment
- paket
- survey
- surat
- dokumen
- approval
- audit log
- asset
- laporan
