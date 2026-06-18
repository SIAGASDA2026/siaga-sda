# SIAGA-SDA PB-DOC.1 - Finalisasi Konsep Peil Banjir

## 1. Ringkasan

Tahap PB-DOC.1 mengunci konsep Peil Banjir sebagai layanan permohonan dan penerbitan rekomendasi teknis peil banjir dari pihak ketiga, bukan sekadar monitoring tinggi muka air, banjir, rob, atau genangan.

Dinas PU Bidang SDA menerbitkan rekomendasi teknis peil banjir, bukan izin bangunan.

## 2. File yang Diaudit

Audit dilakukan dengan pencarian istilah:

```text
Peil Banjir, peil banjir, peil, banjir, rob, tinggi muka air, rekomendasi peil, permohonan rekomendasi, hidrologi, hidrolika, surat permohonan, persyaratan, master persyaratan, export PDF, admin_peil_banjir, tim_teknis_peil_banjir
```

File aktif yang diperiksa:

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/modules/SIAGA_SDA_PEIL_UI.md`
- `docs/modules/SIAGA_SDA_SURAT_UI.md`
- `docs/roles/SIAGA_SDA_ADMIN_PEIL_UI.md`
- `src/app/(dashboard)/peil/page.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/lib/workflow-mapping.ts`
- `src/lib/navigation.ts`
- `src/components/ai/ProjectAiAssistant.tsx`

## 3. Backup

Backup dibuat di:

```text
backup/backup-pb-doc-1-finalisasi-konsep-peil-banjir-before-change/
```

Backup mencakup file dokumen dan source copy yang diedit.

## 4. File yang Diubah atau Dibuat

Dibuat:

- `docs/core/SIAGA_SDA_PEIL_BANJIR_FINAL_CONCEPT.md`
- `docs/audit/SIAGA_SDA_PB_DOC_1_FINALISASI_KONSEP_PEIL_BANJIR.md`
- `backup/backup-pb-doc-1-finalisasi-konsep-peil-banjir-before-change/BACKUP_FILE_LIST.md`

Diubah:

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/modules/SIAGA_SDA_PEIL_UI.md`
- `docs/modules/SIAGA_SDA_SURAT_UI.md`
- `docs/roles/SIAGA_SDA_ADMIN_PEIL_UI.md`
- `src/app/(dashboard)/peil/page.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/lib/workflow-mapping.ts`
- `src/lib/navigation.ts`
- `src/components/ai/ProjectAiAssistant.tsx`

## 5. Konsep Final

Peil Banjir final:

```text
Surat Masuk & Keluar
-> Surat permohonan diterima dan diagendakan
-> Kategori: Permohonan Rekomendasi Peil Banjir
-> Aksi: Buat Proses Peil Banjir
-> Peil Banjir sebagai permohonan/kasus aktif
-> Verifikasi Administrasi
-> Survey Lapangan
-> Pengambilan Titik Koordinat
-> Review/Koreksi Hidrologi dan Hidrolika
-> Penyusunan Draft Rekomendasi
-> Review/Approval PPTK
-> Approval PPK
-> Tanda tangan Kadis
-> Surat Rekomendasi Terbit
-> Arsip Peil Banjir dan Surat Keluar
```

## 6. Persyaratan Administrasi

Persyaratan Administrasi bersifat fleksibel:

- tambah;
- edit;
- hapus/nonaktif secara aman;
- ubah susunan/atur urutan;
- wajib/opsional/kondisional/tidak berlaku;
- upload file per item;
- catatan verifikator;
- audit trail.

Perubahan Master Persyaratan hanya berlaku untuk permohonan baru. Permohonan lama memakai snapshot checklist yang berlaku saat permohonan dibuat.

## 7. Export PDF Persyaratan

Konsep export PDF:

- tombol `Export PDF Persyaratan` atau `Download Persyaratan PDF`;
- PDF mengambil daftar persyaratan aktif/latest;
- nomor urut mengikuti susunan terbaru;
- tidak memakai label tahun pada judul/template;
- memuat catatan bahwa Dinas PU Bidang SDA menerbitkan rekomendasi teknis peil banjir, bukan izin bangunan.

Tahap ini belum menambah dependency PDF, endpoint, schema, atau runtime export.

## 8. Role Khusus Peil Banjir

Role khusus konseptual:

- `admin_peil_banjir` / Admin Peil Banjir
- `tim_teknis_peil_banjir` / Tim Teknis Peil Banjir

Status:

- sudah dijelaskan secara konsep;
- belum dipaksakan ke RBAC runtime;
- belum diubah di Prisma;
- belum dibuat migration;
- belum dibuat seed.

## 9. Dokumen Historis yang Tidak Diedit

Sebagian dokumen audit lama yang menyebut Peil Banjir sebagai shell/persiapan tidak diubah agar riwayat audit tetap utuh.

Dokumen final `docs/core/SIAGA_SDA_PEIL_BANJIR_FINAL_CONCEPT.md` menjadi acuan koreksi terbaru untuk tahap berikutnya.

## 10. Hal yang Tidak Disentuh

- Login final.
- Auth, NextAuth, middleware.
- RBAC runtime, roles runtime, permissions runtime.
- Prisma schema, migration, database, seed.
- Package/dependency.
- Endpoint Approval, Dashboard, Surat, Paket.
- Modal Dashboard/Approval Center.
- Shared modal portal.
- Workflow approval runtime.
- Dashboard bootstrap dan sync-version.

## 11. Risiko Tersisa

- Database resmi Peil Banjir belum tersedia.
- Master Persyaratan, snapshot checklist, dan export PDF belum runtime.
- Role `admin_peil_banjir` dan `tim_teknis_peil_banjir` belum aktif di RBAC.
- Beberapa dokumen historis masih menyimpan konteks lama sebagai jejak audit.
- Implementasi data, API, export PDF, dan RBAC perlu tahap khusus.

## 12. Rekomendasi Tahap Berikutnya

1. PB-RBAC.1 - Review dan penambahan role runtime jika disetujui eksplisit.
2. PB-DATA.1 - Proposal schema Peil Banjir, Master Persyaratan, snapshot checklist, survey, dan dokumen.
3. PB-UI.1 - UI detail permohonan dan Master Persyaratan.
4. PB-PDF.1 - Implementasi export PDF setelah data master siap.
5. PB-API.1 - API Peil Banjir resmi setelah schema/RBAC aman.
