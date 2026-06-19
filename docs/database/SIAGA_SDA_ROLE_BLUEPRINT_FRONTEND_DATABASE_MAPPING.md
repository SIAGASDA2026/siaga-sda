# SIAGA-SDA Role Blueprint, Frontend, dan Database Mapping

Tanggal: 19 Juni 2026
Tahap: DOCS-CLEANUP.1
Commit acuan: `36f9b9a docs: desain fondasi pusat peringatan tindak lanjut`

## 1. Tujuan

Dokumen ini menjadi rujukan tunggal untuk membaca tiga lapis role SIAGA-SDA:

1. Blueprint konseptual di dokumentasi.
2. Role runtime frontend/TypeScript.
3. Enum role Prisma/database yang saat ini aktif.

Dokumen ini tidak mengubah RBAC runtime, Prisma schema, database, middleware, seed, menu, atau permission.

## 2. Prinsip

- Blueprint adalah target konseptual.
- Frontend runtime adalah role yang dipakai komponen, navigasi, dan permission helper.
- Database saat ini masih memakai enum Prisma existing.
- Perbedaan nama dijembatani oleh mapper, terutama `src/lib/db-mappers.ts` dan `src/lib/roles.ts`.
- Role yang belum ada di Prisma tidak boleh disimpan ke database sebelum tahap schema/migration khusus.
- `ADMIN_KEGIATAN` adalah role lama yang tidak digunakan lagi.
- `ADMIN_SUB_KEGIATAN` adalah role konseptual aktif, tetapi database masih memakai compatibility enum `ADMINISTRASI_KONTRAK`.

## 3. Mapping 3 Lapis

| Blueprint final | Frontend runtime | Prisma/database saat ini | Status | Catatan |
|---|---|---|---|---|
| `SUPER_ADMIN` | `super_admin` | `SUPER_ADMIN` | Aktif | Role sistem tertinggi. |
| `ADMIN_SISTEM` | `admin` | `ADMIN` | Digabung | Runtime menggabungkan admin sistem/admin bidang/admin SDA ke `admin`. |
| `ADMIN_SDA` | `admin` | `ADMIN` | Digabung | Alias konseptual ke admin umum runtime. |
| `ADMIN_BIDANG` | `admin` | `ADMIN` | Alias operasional/kompatibilitas | Konsep admin bidang; belum menjadi role final enum terpisah. |
| `ADMIN_SUB_KEGIATAN` | `admin_sub_kegiatan` | `ADMINISTRASI_KONTRAK` | Aktif dengan compatibility | Jangan samakan dengan `ADMIN_KEGIATAN`. |
| `ADMIN_SURAT` | Belum aktif | Tidak ada | Pending | Tidak boleh diaktifkan tanpa tahap RBAC/Prisma khusus. |
| `ADMIN_PEIL` / `ADMIN_PEIL_BANJIR` | `admin_peil_banjir` | Tidak ada | Frontend pending Prisma | Diblokir dari penyimpanan user sampai migration disetujui. |
| `ADMIN_ASSET` | Belum aktif | Tidak ada | Pending | Belum boleh dipaksakan ke runtime. |
| `PIMPINAN` | `pimpinan` | `PIMPINAN` / `KEPALA_DINAS` | Aktif | Read-only. `KEPALA_DINAS` dimapping ke `pimpinan`. |
| `KEPALA_BIDANG` | `kabid` | `KABID` | Aktif | Alias konseptual kepala bidang. |
| `PPK` | `ppk` | `PPK` | Aktif | Paket/approval sesuai scope. |
| `PPTK` | `pptk` | `PPTK` | Aktif | Paket/administrasi sesuai scope. |
| `DIREKSI_TEKNIS` | `direksi_teknis` | `DIREKSI_TEKNIS` | Aktif | Jangan dihapus dari paket fisik. |
| `PEJABAT_PENGADAAN` | `pejabat_pengadaan` | `PEJABAT_PENGADAAN` | Aktif | Pengadaan sesuai scope. |
| `PPHP` | `pphp` | `PPHP` | Aktif | Pemeriksaan hasil pekerjaan. |
| `TIM_SURVEY` | `tim_survey` | `TIM_SURVEYOR` | Aktif dengan mapping | Nama Prisma masih `TIM_SURVEYOR`. |
| `TIM_PERENCANA_RUTIN` / `TIM_PERENCANAAN` | `tim_perencanaan` | `TIM_PERENCANA` | Aktif dengan mapping | Untuk pekerjaan rutin/perencanaan. |
| `TIM_PENGAWAS_RUTIN` / `TIM_PENGAWASAN` | `tim_pengawasan` | `TIM_PENGAWAS` | Aktif dengan mapping | Untuk pengawasan rutin. |
| `KONSULTAN_PERENCANA` | `konsultan_perencana` | `KONSULTAN_PERENCANA` | Aktif | Scope paket terkait. |
| `KONSULTAN_PENGAWAS` | `konsultan_pengawasan` | `KONSULTAN_PENGAWAS` | Aktif dengan mapping | Runtime memakai `konsultan_pengawasan`. |
| `KONTRAKTOR` | `kontraktor` | `KONTRAKTOR` | Aktif | Scope paket sendiri. |
| `AUDITOR` | `auditor` | `AUDITOR` | Aktif | Read-only. |
| `TIM_TEKNIS_PEIL_BANJIR` | `tim_teknis_peil_banjir` | Tidak ada | Frontend pending Prisma | Diblokir dari penyimpanan user sampai migration disetujui. |
| `MANDOR_OPERASIONAL_SDA` | Belum aktif | Tidak ada | Pending | Jangan aktifkan tanpa tahap khusus. |
| `MANDOR_PINTU_AIR` | Belum aktif | Tidak ada | Pending | Jangan aktifkan tanpa tahap khusus. |
| `PETUGAS_PINTU_AIR` | Belum aktif | Tidak ada | Pending | Petugas biasa tidak wajib login. |
| `MANDOR_REHAB_DRAINASE` / `MANDOR_REHABILITASI_DRAINASE` | Belum aktif | Tidak ada | Pending | Jangan aktifkan tanpa tahap khusus. |
| `ADMIN_KEGIATAN` | Tidak digunakan | Tidak ada | Dihapus | Role lama. Mapping bertahap ke `ADMIN_SUB_KEGIATAN` bila masih ditemukan referensi historis. |

## 4. Role Pending Prisma

Role berikut boleh muncul sebagai konsep atau frontend terbatas, tetapi belum boleh disimpan sebagai enum database:

- `admin_peil_banjir`
- `tim_teknis_peil_banjir`

Role berikut belum boleh diaktifkan di runtime/database:

- `admin_surat`
- `admin_asset`
- `mandor_operasional_sda`
- `mandor_pintu_air`
- `petugas_pintu_air`
- `mandor_rehabilitasi_drainase`

## 5. Mapper yang Harus Dijaga

File acuan runtime:

- `src/lib/roles.ts`
- `src/lib/db-mappers.ts`
- `src/lib/rbac.ts`
- `src/types/index.ts`
- `src/app/(dashboard)/pengguna/page.tsx`
- `prisma/schema.prisma`

Setiap perubahan role pada masa depan harus mengecek seluruh file di atas secara bersamaan. Jangan menambah role hanya pada satu lapis.

## 6. Risiko

- Role terlihat di UI tetapi gagal disimpan karena tidak ada enum Prisma.
- Role ada di blueprint tetapi tidak punya permission runtime.
- Role database dimapping ke role frontend yang salah.
- Role read-only mendapat tombol aksi karena guard UI tidak konsisten.
- `ADMIN_SUB_KEGIATAN` keliru dianggap role lama yang dihapus.

## 7. Rekomendasi

1. Gunakan dokumen ini sebelum menambah atau mengubah role.
2. Jangan migrasikan role pending tanpa tahap RBAC/Prisma khusus.
3. Pertahankan guard `PENDING_PRISMA_ROLES` sampai schema database siap.
4. Saat migration role disetujui, update blueprint, runtime, mapper, Prisma enum, seed, dan dokumentasi dalam satu tahap terkendali.
