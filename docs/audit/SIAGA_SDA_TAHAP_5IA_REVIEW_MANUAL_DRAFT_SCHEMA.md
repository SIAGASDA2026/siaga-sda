# SIAGA-SDA Tahap 5I-A - Review Manual Draft Schema Sebelum Migration

Tanggal: 18 Juni 2026  
Commit acuan: `2877176 docs: tambah draft prisma schema surat tahap 5h`  
Status: review manual dokumen, tanpa perubahan schema, tanpa migration

## A. Ringkasan Tujuan 5I-A

Tahap 5I-A mereview manual draft schema Surat pada dokumen 5H terhadap `prisma/schema.prisma` aktual sebelum ada keputusan migration. Fokus review adalah kecocokan nama model, relasi, enum, index, risiko constraint, dan kesiapan migration.

Tahap ini hanya menghasilkan dokumen review manual. Tidak ada perubahan schema Prisma asli, migration, database, API Surat resmi, form Surat resmi, Auth, RBAC, endpoint Approval, login, atau Dashboard.

## B. Status Acuan

- Commit acuan: `2877176 docs: tambah draft prisma schema surat tahap 5h`.
- Tahap 5A sampai 5H sudah selesai.
- Schema Prisma asli belum boleh diubah.
- Migration belum boleh dijalankan.
- `prisma generate`, `prisma migrate`, dan `prisma db push` tidak boleh dijalankan.
- Login final/locked tetap tidak disentuh.
- Modal Dashboard 4D.2 final tetap tidak disentuh.

## C. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/core/SIAGA_SDA_REBRANDING_RULES.md`
- `docs/core/SIAGA_SDA_SYSTEM_ARCHITECTURE.md`
- `docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md`
- `docs/core/SIAGA_SDA_WORKFLOW_MASTER.md`
- `docs/audit/SIAGA_SDA_TAHAP_5A_AUDIT_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5B_MAPPING_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5C_UI_DETAIL_WORKFLOW_SURAT.md`
- `docs/audit/SIAGA_SDA_TAHAP_5D_SOURCE_ORIGIN_PAKET_TRACEABILITY.md`
- `docs/audit/SIAGA_SDA_TAHAP_5E_PROPOSAL_DATA_MODEL_SURAT.md`
- `docs/audit/SIAGA_SDA_TAHAP_5F_REVIEW_SCHEMA_SURAT_DAN_RISIKO.md`
- `docs/audit/SIAGA_SDA_TAHAP_5G_FRONTEND_ADAPTER_SOURCE_ORIGIN.md`
- `docs/audit/SIAGA_SDA_TAHAP_5H_DRAFT_PRISMA_SCHEMA_SURAT.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `prisma/schema.prisma` sebagai referensi read-only

## D. Backup yang Dibuat

Backup dibuat di:

`backup/backup-review-manual-schema-5ia-before-change/`

Isi backup:

- `schema.prisma`
- `SIAGA_SDA_TAHAP_5H_DRAFT_PRISMA_SCHEMA_SURAT.md`
- `SIAGA_SDA_TAHAP_5F_REVIEW_SCHEMA_SURAT_DAN_RISIKO.md`
- `SIAGA_SDA_TAHAP_5G_FRONTEND_ADAPTER_SOURCE_ORIGIN.md`

Dokumen 5I-A belum ada sebelum tahap ini, sehingga tidak ada backup dokumen lama.

## E. File yang Dibuat/Diubah

Dibuat:

- `docs/audit/SIAGA_SDA_TAHAP_5IA_REVIEW_MANUAL_DRAFT_SCHEMA.md`

Tidak ada file runtime, schema Prisma asli, migration, API, Auth, RBAC, login, Dashboard, atau dependency yang diubah.

## F. Review Kecocokan Draft dengan Schema Aktual

| Item | Kondisi Schema Aktual | Review 5I-A |
|---|---|---|
| Model paket aktif | Model aktif bernama `Paket` | Draft `PackageOrigin` yang memakai `paketId` sudah tepat. Jangan memakai `ProjectOrigin` sebagai nama utama untuk schema aktual. |
| `User.id` | `User.id String @id @default(cuid())` | Cocok untuk relasi `createdBy`, `assignedToUser`, disposisi, follow-up, attachment, comment, dan package origin. |
| `SubKegiatan.id` | `SubKegiatan.id String @id @default(cuid())` dan `Paket.subKegiatanId String` | Cocok untuk `Surat.subKegiatanId`, tetapi perlu back relation jika relation field diaktifkan. |
| Audit Log | `AuditLog` punya `entityType String?`, `entityId String?`, `beforeData Json?`, `afterData Json?`, `userRole String?` | Bisa dipakai untuk Surat via `entityType/entityId` tanpa FK wajib. Ini cocok untuk audit-safe tahap awal. |
| Approval | `Approval.paketId String` wajib dan `ApprovalEntityType` belum punya `SURAT` | Draft benar karena tidak memaksa approval Surat non-paket. |
| SurveyBaru | `SurveyBaru.paketId String` wajib | Draft benar karena tidak memaksa Surat langsung ke `SurveyBaru` tanpa paket. |
| Document | `Document.paketId String` wajib | Draft benar karena `SuratAttachment` dipisah dari `Document`. |
| Role | Enum `Role` belum punya `ADMIN_SURAT`; masih ada `ADMINISTRASI_KONTRAK` | Draft benar karena role Surat disimpan sebagai string snapshot dan tidak mengubah enum `Role`. |

Kesimpulan: draft 5H cocok dengan arsitektur aktual secara konsep, tetapi belum bisa di-copy langsung ke schema migration karena membutuhkan back relation eksplisit dan beberapa keputusan constraint.

## G. Review Draft Enum

| Enum Draft | Review | Catatan |
|---|---|---|
| `SuratJenis` | Layak | Nilai `MASUK`, `KELUAR`, `INTERNAL` cukup untuk tahap awal. |
| `SuratStatus` | Layak | Status mengikuti mapping 5B/5C dan tidak bentrok dengan enum existing. |
| `SuratKategori` | Layak dengan catatan | Daftar 5H mengikuti prompt 5E/5H, tetapi blueprint juga menyebut Permohonan Data, Instruksi Pimpinan, Surat Internal/Eksternal. Bisa ditambah sebelum migration jika user ingin cakupan lebih lengkap. |
| `SuratPrioritas` | Layak | Nilai `NORMAL` aman sebagai default. |
| `SuratSifat` | Layak | Nilai `RAHASIA` membutuhkan guard UI/API nanti. |
| `SuratDispositionStatus` | Layak | Perlu konsisten dengan UI inbox disposisi nanti. |
| `SuratFollowUpType` | Layak | `APPROVAL` tetap konseptual sampai approval Surat non-paket disetujui. |
| `SuratFollowUpStatus` | Layak | Cocok untuk status tindak lanjut tanpa mengubah modul tujuan. |
| `PackageOriginModule` | Layak dengan catatan | `INPUT_LANGSUNG`, `PROGRAM_RUTIN`, dan `PAKET_TAHUN_BERJALAN` bukan FK, sehingga butuh validasi aplikasi. |
| `PackageOriginStatus` | Layak | Cocok dengan adapter 5G dan empty state formal. |

Tidak ditemukan bentrok nama enum dengan schema aktual. Risiko utama bukan naming, melainkan dampak generated Prisma Client bila enum ditambahkan tanpa menyiapkan service/API.

## H. Review Draft Model

### Surat

Layak sebagai entity utama, dengan catatan:

- `createdById` wajib cocok dengan `User.id`.
- `assignedToUserId` opsional cocok dengan user assignment.
- `assignedToRole String?` sudah tepat untuk menghindari perubahan enum `Role`.
- `subKegiatanId` opsional cocok untuk assignment scope berbasis sub kegiatan.
- `currentDispositionId` sengaja scalar dan belum FK; ini aman untuk draft awal.
- `@@unique([nomorSurat, tahun, jenis])` perlu review aturan arsip resmi sebelum migration.

### SuratDisposition

Layak, dengan catatan:

- Relasi `fromUser` dan `toUser` membutuhkan back relation bernama eksplisit di `User`.
- `fromRole` dan `toRole` sebagai string snapshot sudah tepat.
- `onDelete: Cascade` dari Surat ke disposisi masuk akal, tetapi delete Surat nanti harus sangat dibatasi.

### SuratFollowUp

Layak sebagai relasi tindak lanjut awal, dengan catatan:

- `targetModule` dan `targetId` polymorphic; integrity tidak dijaga DB.
- Guard aplikasi wajib memvalidasi route dan akses modul tujuan.
- Ini tetap lebih aman daripada field tunggal `linkedSurveyId` / `linkedProjectId`.

### SuratAttachment

Layak, dengan catatan:

- `storageKey` sebaiknya menjadi referensi utama file.
- `fileUrl` opsional sebagai derived URL sudah tepat.
- Perlu aturan storage dan MIME validation di API resmi, bukan di schema saja.

### SuratComment

Layak, dengan catatan:

- Jika audit pemerintah ketat, comment sebaiknya append-only.
- `updatedAt` boleh ada, tetapi UI/API harus mencatat audit bila comment diedit.
- Delete permanen comment sebaiknya dihindari.

### PackageOrigin

Layak sebagai desain source-origin paket, dengan catatan penting:

- Nama `PackageOrigin` masih dapat diterima di kode, tetapi secara domain lokal model target adalah `Paket`. Alternatif nama `PaketOrigin` lebih konsisten dengan schema aktual. Jika ingin konsisten bahasa, revisi draft sebelum migration.
- `@@unique([paketId, originModule, originId])` berisiko karena `originId` nullable.
- Jika origin konseptual tanpa `originId` diperlukan, gunakan `originKey String` non-null atau pindahkan unique enforcement ke aplikasi.

## I. Review Relation Naming

Jika draft 5H kelak di-apply, model existing perlu back relation eksplisit. Tanpa ini, `prisma validate` berisiko gagal karena relation field tidak memiliki sisi kebalikan atau relation name bentrok.

### Relasi Surat ke User

Draft:

- `Surat.createdBy @relation("SuratCreatedBy")`
- `Surat.assignedToUser @relation("SuratAssignedToUser")`

Back relation yang perlu disiapkan di `User`:

```prisma
createdSurat  Surat[] @relation("SuratCreatedBy")
assignedSurat Surat[] @relation("SuratAssignedToUser")
```

### Relasi Surat ke SubKegiatan

Draft:

- `Surat.subKegiatan -> SubKegiatan`

Back relation yang perlu disiapkan:

```prisma
surat Surat[]
```

Jika relation name dipakai, beri nama eksplisit agar tidak bentrok dengan relasi lain.

### Relasi SuratDisposition ke User

Draft:

- `fromUser @relation("SuratDispositionFromUser")`
- `toUser @relation("SuratDispositionToUser")`

Back relation di `User`:

```prisma
suratDispositionsFrom SuratDisposition[] @relation("SuratDispositionFromUser")
suratDispositionsTo   SuratDisposition[] @relation("SuratDispositionToUser")
```

### Relasi SuratFollowUp ke User

Back relation di `User`:

```prisma
createdSuratFollowUps SuratFollowUp[] @relation("SuratFollowUpCreatedBy")
```

### Relasi SuratAttachment ke User

Back relation di `User`:

```prisma
uploadedSuratAttachments SuratAttachment[] @relation("SuratAttachmentUploadedBy")
```

### Relasi SuratComment ke User

Back relation di `User`:

```prisma
suratComments SuratComment[] @relation("SuratCommentUser")
```

### Relasi PackageOrigin ke Paket

Back relation di `Paket`:

```prisma
origins PackageOrigin[]
```

Jika nama model direvisi menjadi `PaketOrigin`, back relation menjadi:

```prisma
origins PaketOrigin[]
```

### Relasi PackageOrigin ke User

Back relation di `User`:

```prisma
createdPackageOrigins PackageOrigin[] @relation("PackageOriginCreatedBy")
```

Kesimpulan relation naming: draft 5H perlu diturunkan menjadi versi apply-ready yang mencantumkan back relation di model existing sebelum migration.

## J. Review Risiko Unique/Index

| Constraint / Index | Review | Risiko | Rekomendasi |
|---|---|---|---|
| `@@unique([nomorSurat, tahun, jenis])` | Secara arsip internal masuk akal | Surat dari luar dapat memakai nomor sama dalam tahun yang sama | Review aturan arsip resmi. Jika perlu tambah `asalSurat` atau gunakan unique aplikasi. |
| `@@index([tahun, status])` | Layak | Tidak ada risiko besar | Pertahankan untuk summary dashboard. |
| `@@index([kategori, status])` | Layak | Tidak ada risiko besar | Pertahankan untuk filter. |
| `@@index([assignedToRole, status])` | Layak | Role string harus konsisten | Normalisasi role label di service layer. |
| `@@index([assignedToUserId, status])` | Layak | Tidak ada risiko besar | Pertahankan untuk inbox user. |
| `@@index([targetModule, targetId])` | Layak | Polymorphic target tidak punya FK | Wajib validasi target di API. |
| `@@unique([paketId, originModule, originId])` | Perlu revisi sebelum migration | `originId` nullable dapat membuat duplikasi konseptual tergantung perilaku DB | Gunakan `originKey String` non-null atau enforce uniqueness di aplikasi. |
| Attachment/comment timeline indexes | Layak | Tidak ada risiko besar | Pertahankan. |

## K. Hal yang Belum Boleh Di-Apply

Hal berikut tetap belum boleh masuk schema/runtime pada 5I-A:

1. `ApprovalEntityType.SURAT`.
2. `ApprovalSubject` generik.
3. `SurveyRequest` mandiri.
4. Perubahan `SurveyBaru.paketId` menjadi nullable.
5. `ADMIN_SURAT` di enum `Role`.
6. Permission runtime Surat seperti `view_surat`, `create_surat`, `dispose_surat`.
7. API Surat resmi.
8. Form Surat resmi.
9. Dashboard summary Surat resmi.
10. Perubahan endpoint Approval GET/read-only.

Alasan: semua item tersebut berdampak ke Auth/RBAC, generated Prisma Client, API, assignment scope, seed, dan Dashboard. Perlu tahap khusus setelah schema dasar disetujui.

## L. Checklist Sebelum Migration 5I

Checklist wajib sebelum user menyetujui migration:

- [ ] Persetujuan eksplisit user untuk mengubah `prisma/schema.prisma`.
- [ ] Backup database.
- [ ] Backup `prisma/schema.prisma`.
- [ ] Revisi draft 5H menjadi versi apply-ready.
- [ ] Review relation name dan back relation di `User`, `Paket`, dan `SubKegiatan`.
- [ ] Putuskan nama final `PackageOrigin` vs `PaketOrigin`.
- [ ] Putuskan strategi unique nomor surat.
- [ ] Putuskan strategi `PackageOrigin` unique jika `originId` nullable.
- [ ] Review seed role/permission tanpa mengaktifkan `ADMIN_SURAT` mendadak.
- [ ] Review rollback plan.
- [ ] Review dampak Dashboard.
- [ ] Review dampak Approval.
- [ ] Review dampak Survey.
- [ ] Review dampak Paket.
- [ ] Review dampak Audit Log.
- [ ] Review storage lampiran Surat.
- [ ] Jalankan `prisma format` pada tahap migration nanti.
- [ ] Jalankan `prisma validate` pada tahap migration nanti.
- [ ] Jalankan `npx.cmd tsc --noEmit`.
- [ ] Jalankan `git diff --check`.

## M. Rekomendasi Final

Rekomendasi 5I-A: **Perlu revisi dokumen 5H dulu sebelum migration.**

Alasan:

1. Draft 5H sudah cocok secara konsep dengan schema aktual.
2. Namun draft belum apply-ready karena belum mencantumkan back relation yang dibutuhkan di `User`, `Paket`, dan `SubKegiatan`.
3. `PackageOrigin` perlu keputusan nama final dan strategi unique untuk `originId` nullable.
4. Unique nomor surat perlu review aturan arsip resmi sebelum dikunci menjadi constraint database.
5. Migration terlalu cepat akan membuat risiko validasi Prisma dan aturan bisnis masuk ke database sebelum matang.

Pilihan teknis yang paling aman:

1. Buat revisi 5H-A atau dokumen patch apply-ready schema.
2. Jangan menjalankan migration sampai user menyetujui eksplisit.
3. Setelah apply-ready review selesai, baru masuk 5I migration di database copy/staging.

## N. Risiko Utama Jika Migration Terlalu Cepat

1. `prisma validate` gagal karena missing opposite relation/back relation.
2. Nomor surat eksternal bentrok karena unique constraint terlalu ketat.
3. Duplikasi `PackageOrigin` tidak tertangani karena `originId` nullable.
4. Role Surat terlihat seolah siap padahal RBAC dan seed belum disiapkan.
5. Approval Surat non-paket dipaksa masuk ke workflow package-centric.
6. Survey dari Surat dipaksa ke `SurveyBaru` yang masih wajib paket.
7. Dashboard summary dapat menghitung data konseptual sebagai data resmi bila API belum jelas.
8. Storage lampiran belum punya validasi upload resmi.
9. Rollback sulit jika migration langsung diterapkan ke database utama tanpa backup.

## O. Hal yang Tidak Disentuh

- `prisma/schema.prisma`
- folder migration
- database
- Prisma generate/migrate/db push
- Auth / NextAuth / middleware
- RBAC besar dan role besar
- role `admin_surat`
- `package.json` dan dependency
- halaman login
- modal Dashboard 4D.2
- Dashboard visual 4D.2
- endpoint Approval GET/read-only
- API Surat resmi
- form Surat resmi
- file runtime aplikasi

## P. Rekomendasi Tahap Berikutnya

Rekomendasi tahap berikutnya:

1. Tahap 5H-A: revisi draft schema menjadi apply-ready patch dalam dokumen, tetap belum apply.
2. Tahap 5I: migration hanya setelah user memberi persetujuan eksplisit dan backup database tersedia.
3. Tahap 5J: API Surat resmi setelah schema aman.
4. Tahap 5K: Form Surat resmi.
5. Tahap 5L: Dashboard summary Surat scoped dari data resmi.

Jika user ingin menunda schema, lanjutkan ke frontend/API adapter non-schema yang tetap tidak menulis database.

## Validasi

Validasi yang wajib dijalankan setelah dokumen dibuat:

- `git diff --check`
- `npx.cmd tsc --noEmit`

`npm run build` tidak wajib karena tahap ini hanya dokumen/review. `prisma generate`, `prisma migrate`, dan `prisma db push` sengaja tidak dijalankan.

## Cara Rollback

Karena tahap ini hanya menambah dokumen, rollback cukup dengan menghapus:

`docs/audit/SIAGA_SDA_TAHAP_5IA_REVIEW_MANUAL_DRAFT_SCHEMA.md`

Backup referensi tersedia di:

`backup/backup-review-manual-schema-5ia-before-change/`

Tidak ada perubahan database, schema, runtime, atau dependency yang perlu di-rollback.

## Saran Commit Message

`docs: review manual draft schema tahap 5ia`
