# SIAGA-SDA Storage Rules

> Dokumen acuan SIAGA-SDA / SIMONPRO 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Prinsip Storage

Semua foto dan dokumen disimpan terstruktur, aman, dan mudah diaudit.

## Folder Storage Disarankan

```text
/storage
├── packages/{package_id}/
├── surveys/{survey_id}/
├── letters/{letter_id}/
├── peil/{peil_id}/
├── assets/{asset_id}/
├── operations/{operation_id}/
├── reports/{report_id}/
└── users/{user_id}/
```

## Kategori File

- Foto Operasional
- Foto Penting
- Dokumen Resmi

## Kompres Foto

Workflow:
```text
Kamera HP
→ user ambil foto
→ frontend compress
→ generate thumbnail
→ upload ke storage
→ metadata disimpan ke file_objects
```

## Metadata Wajib

- original_size
- compressed_size
- compression_ratio
- thumbnail_url
- file_category
- uploaded_by
- uploaded_at

## Larangan

- Jangan upload foto asli berukuran besar tanpa kompres.
- Jangan menyimpan file tanpa entity_type dan entity_id.
- Jangan memakai nama file asal tanpa sanitasi.
- Jangan memakai folder acak yang sulit diaudit.
