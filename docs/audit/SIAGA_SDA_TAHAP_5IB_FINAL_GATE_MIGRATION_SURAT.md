# SIAGA-SDA Tahap 5I-B - Final Gate Migration Schema Surat

Tanggal: 18 Juni 2026  
Commit acuan: `5a1dfa0 docs: revisi draft schema apply-ready tahap 5ha`  
Status: final gate sebelum migration, tanpa perubahan schema, tanpa migration

## A. Ringkasan Tujuan 5I-B

Tahap 5I-B adalah final gate sebelum keputusan migration schema Surat. Dokumen ini menilai apakah patch apply-ready 5H-A cukup aman untuk masuk tahap 5I migration, sekaligus menetapkan batas migration agar tidak melebar ke Auth, RBAC, Approval, Survey, Dashboard, API Surat, atau form Surat resmi.

Tahap ini hanya membuat dokumen final gate. `prisma/schema.prisma` asli tidak diubah, migration tidak dibuat, database tidak disentuh, dan Prisma generate/migrate/db push tidak dijalankan.

## B. Status Acuan

- Commit acuan: `5a1dfa0 docs: revisi draft schema apply-ready tahap 5ha`.
- Tahap 5A sampai 5H-A sudah selesai.
- Schema Prisma asli belum diubah.
- Migration belum dijalankan.
- Database belum disentuh.
- Login final/locked tidak disentuh.
- Modal Dashboard 4D.2 final tidak disentuh.
- Endpoint Approval GET/read-only tidak disentuh.

## C. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/audit/SIAGA_SDA_TAHAP_5A_AUDIT_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5B_MAPPING_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5C_UI_DETAIL_WORKFLOW_SURAT.md`
- `docs/audit/SIAGA_SDA_TAHAP_5D_SOURCE_ORIGIN_PAKET_TRACEABILITY.md`
- `docs/audit/SIAGA_SDA_TAHAP_5E_PROPOSAL_DATA_MODEL_SURAT.md`
- `docs/audit/SIAGA_SDA_TAHAP_5F_REVIEW_SCHEMA_SURAT_DAN_RISIKO.md`
- `docs/audit/SIAGA_SDA_TAHAP_5G_FRONTEND_ADAPTER_SOURCE_ORIGIN.md`
- `docs/audit/SIAGA_SDA_TAHAP_5H_DRAFT_PRISMA_SCHEMA_SURAT.md`
- `docs/audit/SIAGA_SDA_TAHAP_5IA_REVIEW_MANUAL_DRAFT_SCHEMA.md`
- `docs/audit/SIAGA_SDA_TAHAP_5HA_APPLY_READY_DRAFT_SCHEMA.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `prisma/schema.prisma` sebagai referensi read-only

## D. Backup yang Dibuat

Backup dibuat di:

`backup/backup-final-gate-migration-5ib-before-change/`

Isi backup:

- `schema.prisma`
- `SIAGA_SDA_TAHAP_5HA_APPLY_READY_DRAFT_SCHEMA.md`
- `SIAGA_SDA_TAHAP_5IA_REVIEW_MANUAL_DRAFT_SCHEMA.md`
- `SIAGA_SDA_TAHAP_5H_DRAFT_PRISMA_SCHEMA_SURAT.md`

Dokumen 5I-B belum ada sebelum tahap ini, sehingga tidak ada file target lama yang dibackup.

## E. File yang Dibuat/Diubah

Dibuat:

- `docs/audit/SIAGA_SDA_TAHAP_5IB_FINAL_GATE_MIGRATION_SURAT.md`

Tidak ada file runtime, schema Prisma asli, migration, database, Auth, RBAC, login, Dashboard, endpoint Approval, atau dependency yang diubah.

## F. Review Final Patch 5H-A

| Item Patch 5H-A | Status Gate | Catatan Final |
|---|---|---|
| Enum `SuratJenis` | Layak masuk migration 5I | Tidak bentrok dengan enum existing. |
| Enum `SuratStatus` | Layak masuk migration 5I | Status mendukung workflow 5B/5C dan belum mengubah API. |
| Enum `SuratKategori` | Layak masuk migration 5I | Sudah diperluas dengan kebutuhan blueprint seperti permohonan data dan instruksi pimpinan. |
| Enum `SuratPrioritas` | Layak masuk migration 5I | Default `NORMAL` aman. |
| Enum `SuratSifat` | Layak masuk migration 5I | `RAHASIA` butuh guard API/UI nanti, bukan blocker schema. |
| Enum `SuratDispositionStatus` | Layak masuk migration 5I | Mendukung disposisi append-only. |
| Enum `SuratFollowUpType` | Layak masuk migration 5I | `APPROVAL` tetap metadata, bukan Approval Center non-paket. |
| Enum `SuratFollowUpStatus` | Layak masuk migration 5I | Tidak bentrok dengan enum existing. |
| Enum `PaketOriginModule` | Layak masuk migration 5I | Selaras dengan model aktual `Paket`. |
| Enum `PaketOriginStatus` | Layak masuk migration 5I | Mendukung adapter source-origin 5G. |
| Model `Surat` | Layak masuk migration 5I | Unique nomor surat tidak dipaksa; memakai index dulu. |
| Model `SuratDisposition` | Layak masuk migration 5I | Relation name eksplisit ke `User` sudah disiapkan. |
| Model `SuratFollowUp` | Layak masuk migration 5I | Polymorphic target wajib dijaga service layer nanti. |
| Model `SuratAttachment` | Layak masuk migration 5I | Dipisah dari `Document` karena `Document` wajib `paketId`. |
| Model `SuratComment` | Layak masuk migration 5I | Append-only direkomendasikan di API. |
| Model `PaketOrigin` | Layak masuk migration 5I | `originKey` non-null mengatasi unique nullable. |
| Back relation `User` | Wajib masuk migration 5I | Dibutuhkan agar `prisma validate` lulus. |
| Back relation `Paket` | Wajib masuk migration 5I | `origins PaketOrigin[] @relation("PaketOrigins")`. |
| Back relation `SubKegiatan` | Wajib masuk migration 5I | `suratMasukKeluar Surat[] @relation("SuratSubKegiatan")`. |

Kesimpulan review final: patch 5H-A cukup matang sebagai kandidat migration schema dasar, dengan syarat migration 5I dibatasi ketat hanya pada item yang diizinkan di bawah.

## G. Syarat Wajib Sebelum Migration

Syarat wajib sebelum tahap 5I boleh berjalan:

1. Ada persetujuan eksplisit user untuk mengubah `prisma/schema.prisma`.
2. Backup database dibuat sebelum migration.
3. Backup `prisma/schema.prisma` dibuat sebelum patch.
4. Database copy/staging digunakan jika tersedia.
5. Tidak ada perubahan bersamaan pada Auth, RBAC, login, Dashboard, atau endpoint Approval.
6. Migration hanya schema dasar Surat dan `PaketOrigin`.
7. Tidak menambah `ADMIN_SURAT`.
8. Tidak menambah `ApprovalEntityType.SURAT`.
9. Tidak mengubah `SurveyBaru.paketId`.
10. Tidak mengubah model `Document`.
11. Tidak mengubah endpoint Approval GET/read-only.
12. Tidak mengubah `package.json` atau dependency.
13. Tidak membuat API Surat resmi di tahap migration schema dasar.
14. Tidak membuat form Surat resmi di tahap migration schema dasar.
15. Tidak menjalankan migration ke database utama sebelum SQL migration direview.

## H. Daftar yang Boleh Masuk Migration 5I Jika Disetujui

Item yang boleh masuk migration 5I:

1. `enum SuratJenis`
2. `enum SuratStatus`
3. `enum SuratKategori`
4. `enum SuratPrioritas`
5. `enum SuratSifat`
6. `enum SuratDispositionStatus`
7. `enum SuratFollowUpType`
8. `enum SuratFollowUpStatus`
9. `enum PaketOriginModule`
10. `enum PaketOriginStatus`
11. `model Surat`
12. `model SuratDisposition`
13. `model SuratFollowUp`
14. `model SuratAttachment`
15. `model SuratComment`
16. `model PaketOrigin`
17. Back relation di `User`:
    - `createdSurat`
    - `assignedSurat`
    - `suratDispositionsFrom`
    - `suratDispositionsTo`
    - `createdSuratFollowUps`
    - `uploadedSuratAttachments`
    - `suratComments`
    - `createdPaketOrigins`
18. Back relation di `Paket`:
    - `origins`
19. Back relation di `SubKegiatan`:
    - `suratMasukKeluar`

## I. Daftar yang Tidak Boleh Masuk Migration 5I

Item berikut tidak boleh masuk migration 5I:

1. `ADMIN_SURAT` pada enum `Role`.
2. Permission runtime Surat.
3. `ApprovalEntityType.SURAT`.
4. `ApprovalSubject` generik.
5. Entity `SurveyRequest` mandiri.
6. Perubahan `SurveyBaru.paketId` menjadi nullable.
7. Perubahan model `Document`.
8. API Surat resmi.
9. Form Surat resmi.
10. Dashboard summary Surat.
11. Seed role/permission.
12. Perubahan Auth/NextAuth/middleware.
13. Perubahan RBAC besar.
14. Perubahan login.
15. Perubahan modal Dashboard 4D.2.
16. Perubahan visual Dashboard 4D.2.
17. Perubahan endpoint Approval GET/read-only.
18. Perubahan `package.json` atau dependency.

## J. Matriks Risiko Final

| Risiko | Dampak | Kemungkinan | Mitigasi | Keputusan Gate |
|---|---|---:|---|---|
| `prisma validate` gagal | Migration tertahan sebelum DB berubah | Sedang | Tambahkan back relation eksplisit dan jalankan validate sebelum migration | Masuk checklist 5I, bukan blocker gate |
| Migration gagal karena relation naming | Schema tidak bisa diapply | Sedang | Gunakan relation name dari 5H-A secara presisi | Masuk checklist 5I |
| Data lama terdampak | Gangguan data produksi | Rendah-sedang | Migration hanya menambah enum/model/relasi baru; tetap wajib backup DB | Gate lanjut hanya dengan backup |
| Role/RBAC belum siap | Menu/API Surat belum aman | Tinggi | Jangan aktifkan role/permission di 5I | Wajib ditunda |
| Nomor surat duplikat | Constraint terlalu ketat bisa menolak data valid | Sedang | Pakai index dulu, bukan unique DB | Risiko terkendali |
| `originKey` salah dibentuk service layer | Duplikasi/traceability tidak konsisten | Sedang | API nanti wajib punya helper pembentuk `originKey` | Ditunda ke API 5J |
| `PaketOrigin` belum dipakai API | Model baru belum terlihat di UI resmi | Tinggi | Ini wajar; migration schema dasar mendahului API | Bukan blocker |
| UI menampilkan data sebelum resmi | User mengira data konseptual resmi | Sedang | Tetap empty state sampai API/database resmi tersedia | Wajib dijaga di 5J/5L |
| Prisma EPERM Windows | Validasi/build lokal gagal non-source | Sedang | Hentikan proses pengunci Prisma engine jika build/migrate perlu dijalankan | Catat sebagai environment |
| Rollback database | Rollback sulit setelah migration produksi | Sedang | Backup DB, review SQL, pakai staging/copy jika ada | Gate lanjut hanya dengan backup |

## K. Checklist Teknis Jika User Menyetujui Migration

Checklist tahap 5I jika user menyetujui migration:

- [ ] `git status` clean.
- [ ] Backup database.
- [ ] Backup `prisma/schema.prisma`.
- [ ] Copy patch schema 5H-A secara hati-hati.
- [ ] Tambahkan enum dan model yang diizinkan saja.
- [ ] Tambahkan back relation di `User`, `Paket`, dan `SubKegiatan`.
- [ ] Jalankan `npx.cmd prisma format`.
- [ ] Jalankan `npx.cmd prisma validate`.
- [ ] Jalankan `npx.cmd tsc --noEmit`.
- [ ] Jalankan `git diff --check`.
- [ ] Buat migration dengan nama jelas hanya jika validate aman.
- [ ] Review file migration SQL.
- [ ] Jangan apply ke database utama jika belum backup.
- [ ] Laporkan diff schema.
- [ ] Laporkan risiko.
- [ ] Jangan commit sebelum review user.

## L. Rekomendasi Final

Rekomendasi 5I-B: **Layak lanjut ke tahap 5I migration dengan syarat eksplisit dan backup database.**

Keputusan ini bukan izin otomatis untuk menjalankan migration. Migration hanya boleh dilakukan setelah user secara eksplisit meminta tahap 5I migration dan menyetujui perubahan `prisma/schema.prisma`.

Alasan rekomendasi:

1. Patch 5H-A sudah memperbaiki back relation yang sebelumnya kurang.
2. Nama `PaketOrigin` sudah selaras dengan model aktual `Paket`.
3. Strategi `originKey` mengatasi risiko unique `originId` nullable.
4. Nomor surat tidak dikunci unique terlalu cepat.
5. Batas migration 5I sudah jelas dan tidak membawa RBAC, Approval, Survey, Document, API, form, login, atau Dashboard.

## M. Rekomendasi Perintah yang Tidak Boleh Dijalankan pada 5I-B

Perintah/tindakan berikut tidak boleh dijalankan pada tahap 5I-B:

- `prisma migrate`
- `prisma db push`
- `prisma generate`
- `npm install`
- `git reset`
- `git clean`
- hapus folder/file
- migration database
- perubahan `prisma/schema.prisma`

## N. Hal yang Tidak Disentuh

- `prisma/schema.prisma`
- folder migration
- database
- Prisma generate/migrate/db push
- Auth / NextAuth / middleware
- RBAC besar dan role besar
- role `admin_surat`
- endpoint Approval GET/read-only
- API Surat resmi
- form Surat resmi
- halaman login
- modal Dashboard 4D.2
- Dashboard visual 4D.2
- `package.json` dan dependency
- file runtime aplikasi

## O. Cara Rollback Tahap 5I-B

Karena tahap ini hanya menambah dokumen, rollback cukup dengan menghapus:

`docs/audit/SIAGA_SDA_TAHAP_5IB_FINAL_GATE_MIGRATION_SURAT.md`

Backup referensi tersedia di:

`backup/backup-final-gate-migration-5ib-before-change/`

Tidak ada perubahan database, schema, runtime, atau dependency yang perlu di-rollback.

## P. Saran Commit Message

`docs: final gate migration surat tahap 5ib`

## Validasi

Validasi yang wajib dijalankan setelah dokumen dibuat:

- `git diff --check`
- `npx.cmd tsc --noEmit`

`npm run build` tidak wajib karena tahap ini dokumen/review. `prisma generate`, `prisma migrate`, dan `prisma db push` sengaja tidak dijalankan.
