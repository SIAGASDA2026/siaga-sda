# SIAGA-SDA External Audit Blueprint, RBAC, dan Role - Claude 20260619

Tanggal audit eksternal: 19 Juni 2026
Sumber: `C:\Users\User\Downloads\AUDIT_SIAGA_SDA_BLUEPRINT_RBAC_ROLE.md`
Tahap internalisasi: DOCS-CLEANUP.1

## 1. Ringkasan

Audit eksternal menilai konsistensi antara blueprint, dokumen, source runtime, dan Prisma schema SIAGA-SDA. Temuan utama adalah menu utama sudah konsisten, tetapi role memiliki tiga lapis penamaan yang berbeda dan blueprint memiliki dua kontradiksi internal.

Dokumen ini menyimpan ringkasan audit eksternal sebagai referensi internal. Tidak ada source runtime, Prisma schema, RBAC runtime, database, migration, API, login, dashboard, atau menu yang diubah oleh dokumen ini.

## 2. Temuan Positif

- Menu utama 11 item sesuai blueprint.
- Master Data tetap berada di Pengaturan, bukan menu utama.
- Operasional SDA tidak menjadi menu utama terpisah.
- Login tidak memakai social login dan tidak memiliki dropdown role.
- Route-level RBAC mengarahkan user tanpa izin ke akses dibatasi.
- Pimpinan dan Auditor dipertahankan sebagai read-only.
- Modul Surat, Peil, Asset, dan Operasional yang belum punya backend diberi label jujur sebagai persiapan/konseptual, bukan data resmi.
- Role Peil Banjir sudah disiapkan di frontend tetapi diblokir dari penyimpanan database sampai Prisma siap.

## 3. Temuan Utama

### 3.1 Tiga Lapis Role

Audit menemukan tiga lapis role yang tidak identik:

1. Blueprint konseptual.
2. Frontend runtime.
3. Prisma/database.

Contoh penting:

- `ADMIN_SUB_KEGIATAN` di blueprint/frontend masih dipetakan ke `ADMINISTRASI_KONTRAK` di Prisma.
- `TIM_SURVEY` di blueprint menjadi `tim_survey` di frontend dan `TIM_SURVEYOR` di Prisma.
- `ADMIN_SURAT`, `ADMIN_ASSET`, dan role mandor belum punya padanan database.
- `admin_peil_banjir` dan `tim_teknis_peil_banjir` sudah ada di frontend terbatas, tetapi belum ada di Prisma.

### 3.2 Kontradiksi Blueprint

Audit menemukan dua kontradiksi internal di `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`:

1. Bagian role yang dihapus menulis `ADMIN_SUB_KEGIATAN` sebagai role tidak digunakan lagi, padahal yang harus dihapus adalah `ADMIN_KEGIATAN`.
2. Bagian Survey Investigasi menulis istilah final `Ditindaklanjuti`, tetapi juga melarang istilah yang sama. Istilah yang dilarang seharusnya `Menjadi Paket`.

### 3.3 Gap yang Perlu Diverifikasi

- Assignment kosong perlu diverifikasi agar benar-benar mengarah ke halaman `Belum Ada Penugasan Aktif`.
- Beberapa API perlu audit lanjutan untuk memastikan scope assignment konsisten.
- Akses dokumen/chat untuk role teknis Peil Banjir perlu keputusan bisnis sebelum diaktifkan.

## 4. Rekomendasi Eksternal

1. Perbaiki dua kontradiksi blueprint sebelum tahap development lanjutan.
2. Buat satu dokumen mapping `Role Blueprint -> Role Frontend -> Role Database`.
3. Pertahankan label konseptual/demo untuk modul yang belum resmi punya backend.
4. Jangan aktifkan role pending database sebelum migration disetujui.
5. Jalankan validasi lokal setelah perubahan dokumentasi.

## 5. Tindak Lanjut DOCS-CLEANUP.1

Tindak lanjut yang dilakukan pada tahap ini:

- Blueprint diperbaiki hanya pada dua kontradiksi yang ditemukan.
- Dokumen mapping role 3 lapis dibuat di `docs/database/SIAGA_SDA_ROLE_BLUEPRINT_FRONTEND_DATABASE_MAPPING.md`.
- Audit cleanup dibuat di `docs/audit/SIAGA_SDA_DOCS_CLEANUP_1_BLUEPRINT_ROLE_MAPPING.md`.

## 6. Hal yang Tidak Diubah

- Runtime RBAC.
- Role TypeScript.
- Mapper database.
- Prisma schema.
- Database dan migration.
- Auth dan middleware.
- Login.
- Dashboard dan modal 4D.2.
- API Approval, Bootstrap, Sync Version.
- Sidebar, MobileNav, route, dan menu runtime.
