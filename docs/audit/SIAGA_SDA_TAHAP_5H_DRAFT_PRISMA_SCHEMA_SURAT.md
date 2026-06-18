# SIAGA-SDA Tahap 5H - Draft Prisma Schema Surat dalam Dokumen

Tanggal: 18 Juni 2026  
Commit acuan: `407e009 feat: tambah adapter source-origin frontend tahap 5g`  
Status: draft schema dalam dokumen, belum apply, belum migration

## A. Ringkasan Tujuan 5H

Tahap 5H membuat draft Prisma schema untuk modul Surat Masuk & Keluar serta source-origin Paket berdasarkan review 5F dan adapter frontend 5G. Draft ini hanya ditulis di dokumen Markdown sebagai bahan review sebelum keputusan migration.

Tahap ini tidak mengubah `prisma/schema.prisma`, tidak membuat migration, tidak mengubah database, tidak menjalankan `prisma generate`, tidak membuat API Surat resmi, dan tidak membuat form Surat resmi.

## B. Status Acuan

- Commit acuan: `407e009 feat: tambah adapter source-origin frontend tahap 5g`.
- Tahap 5A sampai 5G sudah selesai.
- Login final/locked dan tidak disentuh.
- Modal Dashboard 4D.2 final dan tidak disentuh.
- Dashboard visual 4D.2 tidak diubah.
- Schema Prisma asli belum boleh diubah.
- Endpoint Approval GET/read-only tetap tidak disentuh.
- Adapter source-origin 5G masih frontend-only dan belum membaca database/API.

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
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `src/lib/source-origin-adapter.ts`
- `src/lib/workflow-mapping.ts`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/lib/approval-workflow.ts`
- `src/store/useAppStore.ts`
- `prisma/schema.prisma` sebagai referensi read-only

## D. Backup yang Dibuat

Backup dibuat di:

`backup/backup-draft-prisma-schema-5h-before-change/`

Isi backup:

- `schema.prisma`
- `SIAGA_SDA_TAHAP_5F_REVIEW_SCHEMA_SURAT_DAN_RISIKO.md`
- `SIAGA_SDA_TAHAP_5G_FRONTEND_ADAPTER_SOURCE_ORIGIN.md`

Dokumen 5H belum ada sebelum tahap ini, sehingga tidak ada file target lama yang dibackup.

## E. File yang Dibuat/Diubah

Dibuat:

- `docs/audit/SIAGA_SDA_TAHAP_5H_DRAFT_PRISMA_SCHEMA_SURAT.md`

Tidak ada file runtime, schema Prisma asli, migration, API, Auth, RBAC, login, Dashboard, atau dependency yang diubah.

## F. Prinsip Draft Schema

Prinsip yang wajib dipertahankan jika draft ini suatu saat masuk ke tahap migration:

1. Schema hanya ditulis di dokumen, belum apply ke `prisma/schema.prisma`.
2. Belum ada migration dan belum ada perubahan database.
3. Tidak mengganggu compatibility `admin_sub_kegiatan` / `ADMINISTRASI_KONTRAK`.
4. Tidak memaksa approval Surat non-paket karena `Approval` aktual masih wajib `paketId`.
5. Tidak memaksa `SurveyBaru` tanpa paket karena `SurveyBaru` aktual masih wajib `paketId`.
6. Tidak membuat relasi palsu Surat -> Survey/Paket/Approval.
7. Mendukung Audit Log lewat `entityType` dan `entityId`.
8. Mendukung assignment scope user melalui `assignedToRole`, `assignedToUserId`, `subKegiatanId`, dan relasi lanjutan.
9. Mendukung Dashboard scoped lewat summary resmi di tahap API nanti.
10. Tidak menghitung data konseptual 5C sebagai data resmi.

## G. Draft Enum yang Diusulkan

```prisma
enum SuratJenis {
  MASUK
  KELUAR
  INTERNAL
}

enum SuratStatus {
  DRAFT
  RECEIVED
  READ
  DISPOSITION
  NEED_SURVEY
  NEED_PACKAGE
  NEED_APPROVAL
  FORWARDED_TO_PEIL
  IN_PROGRESS
  COMPLETED
  ARCHIVED
  REJECTED
}

enum SuratKategori {
  UNDANGAN_RAPAT
  USULAN_WARGA
  LAPORAN_BANJIR
  DRAINASE
  NORMALISASI
  PEIL_BANJIR
  PEKERJAAN_RUTIN
  PAKET_PEKERJAAN
  ADMINISTRASI_UMUM
  LAINNYA
}

enum SuratPrioritas {
  RENDAH
  NORMAL
  TINGGI
  KRITIS
}

enum SuratSifat {
  BIASA
  PENTING
  RAHASIA
  SEGERA
}

enum SuratDispositionStatus {
  SENT
  READ
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum SuratFollowUpType {
  SURVEY
  PACKAGE
  PEIL
  APPROVAL
  ARSIP
  DASHBOARD_RECAP
  AUDIT_LOG
  LAINNYA
}

enum SuratFollowUpStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
  REJECTED
}

enum PackageOriginModule {
  SURAT
  SURVEY
  INPUT_LANGSUNG
  PROGRAM_RUTIN
  PAKET_TAHUN_BERJALAN
  LAINNYA
}

enum PackageOriginStatus {
  FORMAL
  PENDING
  DITINDAKLANJUTI
  SELESAI
  ARSIP
  DITOLAK
}
```

Catatan: draft enum di atas belum boleh dimasukkan ke schema aktual tanpa review enum existing dan dampak generated Prisma Client.

## H. Draft Model Surat

Draft model utama Surat:

```prisma
model Surat {
  id                   String         @id @default(cuid())
  nomorSurat           String
  tanggalSurat         DateTime
  tanggalTerima        DateTime?
  asalSurat            String?
  perihal              String
  ringkasan            String?
  jenis                SuratJenis
  kategori             SuratKategori
  status               SuratStatus    @default(RECEIVED)
  prioritas            SuratPrioritas @default(NORMAL)
  sifat                SuratSifat     @default(BIASA)
  tahun                Int
  bidang               String?        @default("SDA")
  subKegiatanId        String?
  createdById          String
  assignedToRole       String?
  assignedToUserId     String?
  currentDispositionId String?
  archivedAt           DateTime?
  completedAt          DateTime?
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt

  createdBy      User            @relation("SuratCreatedBy", fields: [createdById], references: [id])
  assignedToUser User?           @relation("SuratAssignedToUser", fields: [assignedToUserId], references: [id])
  subKegiatan    SubKegiatan?    @relation(fields: [subKegiatanId], references: [id])
  dispositions   SuratDisposition[]
  followUps      SuratFollowUp[]
  attachments    SuratAttachment[]
  comments       SuratComment[]

  @@unique([nomorSurat, tahun, jenis])
  @@index([tahun, status])
  @@index([kategori, status])
  @@index([tanggalTerima])
  @@index([assignedToRole, status])
  @@index([assignedToUserId, status])
  @@index([subKegiatanId])
}
```

Catatan apply nanti:

- `assignedToRole` disarankan `String?` pada draft pertama agar tidak memaksa perubahan enum `Role`.
- Jika relation ke `User` dan `SubKegiatan` di-apply, back relation di model existing perlu diberi nama eksplisit agar `prisma validate` lulus.
- `currentDispositionId` sengaja scalar dulu. FK ke `SuratDisposition` bisa ditambahkan setelah relasi satu-surat-banyak-disposisi stabil.

## I. Draft Model SuratDisposition

```prisma
model SuratDisposition {
  id          String                  @id @default(cuid())
  suratId     String
  fromUserId  String
  fromRole    String
  toUserId    String?
  toRole      String?
  instruksi   String
  catatan     String?
  status      SuratDispositionStatus @default(SENT)
  dueDate     DateTime?
  createdAt   DateTime                @default(now())
  readAt      DateTime?
  completedAt DateTime?

  surat    Surat @relation(fields: [suratId], references: [id], onDelete: Cascade)
  fromUser User  @relation("SuratDispositionFromUser", fields: [fromUserId], references: [id])
  toUser   User? @relation("SuratDispositionToUser", fields: [toUserId], references: [id])

  @@index([suratId, createdAt])
  @@index([toUserId, status])
  @@index([toRole, status])
  @@index([dueDate])
}
```

Alasan:

- Disposisi perlu riwayat append-only.
- `fromRole` dan `toRole` menyimpan snapshot role saat aksi, bukan hanya mengikuti role user terkini.
- Disposisi tidak disimpan sebagai satu field terakhir di `Surat` karena disposisi bisa berlapis.

## J. Draft Model SuratFollowUp

```prisma
model SuratFollowUp {
  id           String               @id @default(cuid())
  suratId      String
  followUpType SuratFollowUpType
  targetModule String
  targetId     String?
  targetRoute  String?
  status       SuratFollowUpStatus @default(PENDING)
  createdById  String
  note         String?
  createdAt    DateTime             @default(now())
  completedAt  DateTime?

  surat     Surat @relation(fields: [suratId], references: [id], onDelete: Cascade)
  createdBy User  @relation("SuratFollowUpCreatedBy", fields: [createdById], references: [id])

  @@index([suratId, status])
  @@index([targetModule, targetId])
  @@index([createdById])
  @@index([createdAt])
}
```

Alasan:

- `SuratFollowUp` cukup sebagai relasi tindak lanjut tahap awal.
- `targetModule` dan `targetId` bersifat polymorphic dan wajib dijaga oleh aplikasi.
- Ini lebih aman daripada field tunggal `linkedProjectId` atau `linkedSurveyId` sebagai source-of-truth utama.

## K. Draft Model SuratAttachment

```prisma
model SuratAttachment {
  id           String   @id @default(cuid())
  suratId      String
  fileName     String
  storageKey   String
  fileUrl      String?
  mimeType     String
  fileSize     Int?
  uploadedById String
  uploadedAt   DateTime @default(now())

  surat      Surat @relation(fields: [suratId], references: [id], onDelete: Cascade)
  uploadedBy User  @relation("SuratAttachmentUploadedBy", fields: [uploadedById], references: [id])

  @@index([suratId, uploadedAt])
  @@index([uploadedById])
  @@index([mimeType])
}
```

Catatan:

- `storageKey` lebih aman sebagai referensi utama storage.
- `fileUrl` boleh opsional/derived karena URL bisa berubah sesuai provider.
- `Document` existing tidak dipakai untuk lampiran Surat karena model aktual wajib `paketId`.

## L. Draft Model SuratComment / SuratNote

Rekomendasi nama: `SuratComment`.

```prisma
model SuratComment {
  id        String   @id @default(cuid())
  suratId   String
  userId    String
  role      String
  note      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  surat Surat @relation(fields: [suratId], references: [id], onDelete: Cascade)
  user  User  @relation("SuratCommentUser", fields: [userId], references: [id])

  @@index([suratId, createdAt])
  @@index([userId])
}
```

Rekomendasi audit:

- Catatan surat yang memengaruhi keputusan sebaiknya append-only.
- Jika edit comment tetap dibutuhkan, setiap edit harus mencatat `beforeData` dan `afterData` di Audit Log.
- Untuk fase pertama, lebih aman tidak menyediakan delete permanen catatan.

## M. Draft Model PackageOrigin / ProjectOrigin

Nama yang direkomendasikan untuk schema aktual saat ini: `PackageOrigin`, karena model aktif adalah `Paket`.

```prisma
model PackageOrigin {
  id           String              @id @default(cuid())
  paketId      String
  originModule PackageOriginModule
  originId     String?
  originLabel  String
  originStatus PackageOriginStatus @default(FORMAL)
  originRoute  String?
  createdById  String?
  note         String?
  createdAt    DateTime            @default(now())

  paket     Paket @relation(fields: [paketId], references: [id], onDelete: Cascade)
  createdBy User? @relation("PackageOriginCreatedBy", fields: [createdById], references: [id])

  @@index([paketId])
  @@index([originModule, originId])
  @@index([createdAt])
  @@unique([paketId, originModule, originId])
}
```

Catatan risiko:

- `originId` polymorphic tidak punya FK ke semua modul.
- Unique constraint dengan `originId` nullable perlu diuji di PostgreSQL. Jika banyak origin konseptual tanpa `originId`, gunakan `originKey` non-null atau pindahkan unique constraint ke level aplikasi.
- Jika nanti model bisnis memakai `ProjectOrigin`, nama harus disesuaikan dengan model aktual. Saat ini `Paket` lebih tepat daripada `Proyek` untuk package-centric workflow.

## N. Relasi ke Model Existing

### User

Relasi yang diusulkan:

- `Surat.createdById -> User.id`
- `Surat.assignedToUserId -> User.id`
- `SuratDisposition.fromUserId -> User.id`
- `SuratDisposition.toUserId -> User.id`
- `SuratFollowUp.createdById -> User.id`
- `SuratAttachment.uploadedById -> User.id`
- `SuratComment.userId -> User.id`
- `PackageOrigin.createdById -> User.id`

Jika schema ini di-apply, model `User` perlu back relation bernama eksplisit agar Prisma relation naming tidak bentrok.

### Paket

Relasi source-origin yang aman:

- `PackageOrigin.paketId -> Paket.id`

Tidak disarankan menambah field tunggal `sourceOriginModule/sourceOriginId` di `Paket` karena satu paket dapat punya lebih dari satu asal.

### AuditLog

Relasi ke AuditLog tidak perlu FK wajib pada draft awal. Gunakan pola existing:

- `entityType = "surat"` dan `entityId = Surat.id`
- `entityType = "surat_disposition"` dan `entityId = SuratDisposition.id`
- `entityType = "surat_follow_up"` dan `entityId = SuratFollowUp.id`
- `entityType = "package_origin"` dan `entityId = PackageOrigin.id`

Ini selaras dengan `AuditLog` aktual yang sudah memiliki `entityType`, `entityId`, `beforeData`, `afterData`, dan `userRole`.

### Approval

Approval tidak langsung dipaksa.

Alasan:

- Model `Approval` aktual wajib `paketId`.
- `ApprovalEntityType` belum memiliki `SURAT`.
- Scope Approval saat ini mengikuti Paket.
- Menambah approval Surat non-paket tanpa subject/scope generik berisiko membocorkan data atau membuat badge tidak konsisten.

### SurveyBaru

`SurveyBaru` tidak langsung diubah.

Alasan:

- Model `SurveyBaru` aktual wajib `paketId`.
- Surat -> Survey mandiri belum aman tanpa desain `SurveyRequest` atau perubahan scope.
- Jangan membuat paket dummy hanya agar survey dari Surat dapat tersimpan.

### Document

`Document` existing tidak dipakai untuk `SuratAttachment`.

Alasan:

- Model `Document` aktual wajib `paketId`.
- Lampiran Surat bisa ada sebelum paket terbentuk.
- Memaksa `Document` akan menciptakan relasi paket palsu.

## O. Index dan Unique Constraint

Rekomendasi index/constraint:

| Model | Index / Constraint | Alasan |
|---|---|---|
| `Surat` | `@@unique([nomorSurat, tahun, jenis])` | Mencegah duplikasi nomor dalam tahun dan jenis surat |
| `Surat` | `@@index([tahun, status])` | Summary dan filter tahunan |
| `Surat` | `@@index([kategori, status])` | Rekap kategori dan status |
| `Surat` | `@@index([tanggalTerima])` | Urutan surat masuk |
| `Surat` | `@@index([assignedToRole, status])` | Inbox role |
| `Surat` | `@@index([assignedToUserId, status])` | Inbox user |
| `SuratDisposition` | `@@index([suratId, createdAt])` | Timeline disposisi |
| `SuratDisposition` | `@@index([toUserId, status])` | Inbox user penerima |
| `SuratDisposition` | `@@index([toRole, status])` | Inbox role penerima |
| `SuratFollowUp` | `@@index([suratId, status])` | Riwayat tindak lanjut Surat |
| `SuratFollowUp` | `@@index([targetModule, targetId])` | Traceability ke modul tujuan |
| `PackageOrigin` | `@@index([paketId])` | Daftar asal paket |
| `PackageOrigin` | `@@index([originModule, originId])` | Trace balik asal data |
| `PackageOrigin` | `@@unique([paketId, originModule, originId])` | Mencegah origin formal ganda, dengan catatan nullable risk |
| `SuratAttachment` | `@@index([suratId, uploadedAt])` | Galeri/lampiran per surat |
| `SuratComment` | `@@index([suratId, createdAt])` | Timeline catatan |

Catatan: aturan unique nomor surat harus menyesuaikan aturan arsip resmi Dinas. Jika nomor surat masuk dari instansi luar bisa berulang, unique dapat dipindahkan ke kombinasi lain seperti `nomorSurat + tanggalSurat + asalSurat + jenis`.

## P. Draft Audit Action

Action audit yang perlu disiapkan pada tahap API resmi:

- `SURAT_CREATE`
- `SURAT_READ`
- `SURAT_DISPOSISI`
- `SURAT_TINDAK_LANJUT`
- `SURAT_ARCHIVE`
- `SURAT_REJECT`
- `SURAT_COMPLETE`
- `SURAT_ATTACHMENT_ADD`
- `SURAT_COMMENT`
- `PACKAGE_ORIGIN_ADD`
- `PACKAGE_ORIGIN_REMOVE` jika nanti diperlukan

Ketentuan audit:

- `beforeData` dan `afterData` wajib untuk perubahan status, disposisi, follow-up, arsip, dan reject.
- `userRole` wajib snapshot saat aksi.
- Audit tidak boleh dibuat dari UI konseptual 5C.
- Audit `PACKAGE_ORIGIN_REMOVE` harus sangat dibatasi karena mengubah traceability.

## Q. Hal yang Sengaja Tidak Dimasukkan ke Draft Pertama

Hal berikut sengaja tidak dimasukkan ke draft schema pertama:

1. `ApprovalEntityType.SURAT`.
2. `ApprovalSubject` generik.
3. Entity `SurveyRequest` mandiri.
4. Perubahan `SurveyBaru.paketId` menjadi nullable.
5. Aktivasi role `ADMIN_SURAT` di enum `Role`.
6. Permission runtime Surat seperti `view_surat` atau `create_surat`.
7. Route/API/form Surat resmi.
8. Perubahan Dashboard summary Surat.
9. Perubahan endpoint Approval GET/read-only.
10. Perubahan compatibility `/surat` yang saat ini masih memakai permission existing.

Alasan: semua item di atas butuh review migration, seed, RBAC, middleware/page guard, dan dampak API sebelum aman diterapkan.

## R. Risiko Schema

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Nama model Paket/Project tidak cocok | Migration gagal atau relasi salah | Gunakan model aktual `Paket` sebagai acuan pertama |
| Enum `Role` database diubah sembarangan | Auth/RBAC dan seed bisa rusak | Simpan role surat sebagai string snapshot dulu |
| `PackageOrigin.originId` polymorphic tanpa FK | Integrity bergantung aplikasi | Validasi target module/id di service layer API |
| `SuratFollowUp.targetId` polymorphic | Relasi lintas modul tidak dijaga DB | Guard aplikasi dan Audit Log wajib jelas |
| Unique nomor surat terlalu ketat | Surat dari luar bisa bentrok | Review aturan arsip resmi sebelum migration |
| Back relation User/Paket tidak lengkap | `prisma validate` gagal | Tambahkan relation name eksplisit pada tahap apply |
| Approval Surat dipaksa terlalu cepat | Scope approval rusak | Jangan tambah `SURAT` sebelum Approval subject/scope siap |
| Survey Surat dipaksa ke `SurveyBaru` | Paket dummy dan rekap salah | Tunda `SurveyRequest` atau desain survey mandiri |
| Migration langsung ke DB produksi | Risiko data lama | Wajib backup DB dan uji staging/copy |
| Prisma EPERM Windows | Build lokal gagal non-source | Catat sebagai environment, jangan ubah dependency/schema |

## S. Checklist Sebelum Migration 5I

Migration hanya boleh masuk tahap 5I jika user menyetujui eksplisit. Checklist sebelum migration:

1. User menyetujui eksplisit untuk mengubah Prisma schema.
2. Backup database.
3. Backup `prisma/schema.prisma`.
4. Review nama model aktual di schema: `Paket`, `User`, `SubKegiatan`, `AuditLog`, `Approval`, `SurveyBaru`, `Document`.
5. Review enum existing, terutama `Role`, `ApprovalStatus`, dan `ApprovalEntityType`.
6. Review relation naming dan back relation di `User`, `Paket`, dan `SubKegiatan`.
7. Review seed role/permission.
8. Review dampak API Surat, Paket, Approval, Audit Log, dan Dashboard.
9. Review rollback plan.
10. Jalankan `prisma format` pada tahap migration nanti.
11. Jalankan `npx prisma validate` pada tahap migration nanti.
12. Jalankan `npx tsc --noEmit`.
13. Jalankan `git diff --check`.
14. Jalankan build hanya jika environment Prisma tidak terkunci.

## T. Rekomendasi Tahap Lanjut

Rekomendasi setelah 5H:

1. `5I-A`: review manual draft schema oleh user sebelum apply.
2. `5I`: migration hanya jika user memberi persetujuan eksplisit.
3. `5J`: API Surat resmi setelah schema aman.
4. `5K`: Form Surat resmi.
5. `5L`: Dashboard summary Surat scoped dari data resmi.

Jika user belum menyetujui migration, lanjutkan hanya pada review dokumen atau adapter frontend yang tetap tidak mengubah database.

## Validasi

Validasi yang wajib dijalankan setelah dokumen dibuat:

- `git diff --check`
- `npx.cmd tsc --noEmit`

`npm run build` tidak wajib untuk 5H karena tahap ini hanya dokumen. `prisma generate`, `prisma migrate`, dan `prisma db push` sengaja tidak dijalankan.

## Hal yang Tidak Disentuh

- `prisma/schema.prisma`
- Folder migration
- Database
- Prisma generate/migrate/db push
- API Surat resmi
- Form Surat resmi
- Auth / NextAuth / middleware
- RBAC besar dan role besar
- Role `admin_surat`
- Endpoint Approval GET/read-only
- Halaman login
- Modal Dashboard 4D.2
- Dashboard visual 4D.2
- `package.json` dan dependency

## Masalah yang Ditunda

- Review manual draft schema sebelum migration.
- Keputusan apakah `PackageOrigin` cukup atau perlu `ProjectOrigin` juga.
- Keputusan unique nomor surat mengikuti aturan arsip resmi.
- Desain `SurveyRequest` mandiri jika Surat perlu survey sebelum paket.
- Desain `ApprovalSubject` generik jika Surat non-paket perlu approval.
- Aktivasi permission Surat resmi.
- API dan form Surat resmi.
- Dashboard summary Surat scoped.

## Cara Rollback

Karena tahap ini hanya menambah dokumen, rollback cukup dengan menghapus:

`docs/audit/SIAGA_SDA_TAHAP_5H_DRAFT_PRISMA_SCHEMA_SURAT.md`

Jika perlu membandingkan referensi awal, backup tersedia di:

`backup/backup-draft-prisma-schema-5h-before-change/`

Tidak ada perubahan database atau schema yang perlu di-rollback.

## Saran Commit Message

`docs: tambah draft prisma schema surat tahap 5h`
