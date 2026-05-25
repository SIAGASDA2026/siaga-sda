# SIAGA-SDA Permission System

> Dokumen acuan SIAGA-SDA / SIMONPRO 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Prinsip Permission

1. Permission berbasis role + assignment aktif.
2. User boleh memiliki banyak role.
3. Role tidak boleh hardcode di UI saja.
4. Akses data harus difilter dari backend/RLS.
5. Assignment punya start_date, end_date, status.
6. Histori assignment tidak boleh hilang.

## Scope Assignment

Contoh scope:
- GLOBAL
- PROGRAM
- KEGIATAN
- SUB_KEGIATAN
- PACKAGE
- ASSET
- PEIL
- SURAT

## Contoh Logika Akses

```text
User PPK dapat melihat/meng-approve paket sesuai assignment PPK aktif.
User PPTK dapat melihat paket di kegiatan/sub kegiatan yang ditugaskan.
Direksi Teknis hanya melihat paket fisik yang ditugaskan.
Kontraktor hanya melihat paket miliknya.
Pimpinan hanya read-only dashboard dan monitoring.
Auditor hanya read-only dan audit trail.
```

## Permission Action

Gunakan action granular:
- view
- create
- update
- approve
- reject
- request_revision
- upload
- export
- archive
- manage_assignment
- manage_user
