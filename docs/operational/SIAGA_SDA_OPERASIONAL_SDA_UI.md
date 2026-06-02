<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Operasional SDA UI

> Dokumen acuan SIAGA-SDA 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Fungsi

Mengelola operasi pintu air, rumah pompa, rehabilitasi drainase, shift petugas, laporan operasi, dan chat operasional.

## Role

- MANDOR_OPERASIONAL_SDA
- MANDOR_REHAB_DRAINASE
- Petugas biasa sebagai master data, bukan wajib akun login.

## Fitur

- Peta asset operasional.
- Operasi pintu air.
- Operasi rumah pompa.
- Shift & petugas.
- Laporan operasi.
- Chat operasional.
- Respon warning pasang surut/banjir.

## Prinsip Petugas

Mandor memilih anggota dari master data petugas. Jangan mengetik nama bebas setiap hari.

---

# UPDATE FINAL OPERASIONAL SDA

Operasional SDA adalah sub-tab di Asset SDA pada tahap awal.

Pintu air dan rumah pompa menjadi satu kesatuan operasional.
Mandor wajib login dan memilih petugas dari master data.
Petugas biasa tidak wajib login.
Foto absensi dihapus.
