# SIAGA-SDA Tahap 5H-A - Apply-Ready Draft Schema Surat

Tanggal: 18 Juni 2026  
Commit acuan: `30b5347 docs: review manual draft schema tahap 5ia`  
Status: patch schema apply-ready dalam dokumen, belum apply, belum migration

## A. Ringkasan Tujuan 5H-A

Tahap 5H-A merevisi draft schema 5H menjadi patch Prisma yang lebih siap di-apply pada tahap migration berikutnya, berdasarkan review manual 5I-A. Output tahap ini tetap hanya dokumen Markdown. `prisma/schema.prisma` asli tidak diubah, migration tidak dibuat, database tidak disentuh, dan Prisma generate/migrate/db push tidak dijalankan.

Fokus revisi:

1. Menambahkan back relation eksplisit untuk model existing.
2. Menetapkan strategi source-origin paket yang aman.
3. Menghindari unique constraint nomor surat yang terlalu cepat.
4. Mengatasi risiko unique nullable `originId`.
5. Menjaga Approval, Survey, Document, RBAC, login, dan Dashboard tetap tidak berubah.

## B. Status Acuan

- Commit acuan: `30b5347 docs: review manual draft schema tahap 5ia`.
- Tahap 5A sampai 5I-A sudah selesai.
- Schema Prisma asli belum boleh diubah.
- Migration belum boleh dijalankan.
- Login final/locked tetap tidak disentuh.
- Modal Dashboard 4D.2 final tetap tidak disentuh.
- Endpoint Approval GET/read-only tetap tidak disentuh.
- Data konseptual 5C tetap tidak boleh dihitung sebagai data resmi Dashboard.

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
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `src/lib/source-origin-adapter.ts`
- `src/lib/workflow-mapping.ts`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/lib/approval-workflow.ts`
- `prisma/schema.prisma` sebagai referensi read-only

## D. Backup yang Dibuat

Backup dibuat di:

`backup/backup-apply-ready-draft-schema-5ha-before-change/`

Isi backup:

- `schema.prisma`
- `SIAGA_SDA_TAHAP_5H_DRAFT_PRISMA_SCHEMA_SURAT.md`
- `SIAGA_SDA_TAHAP_5IA_REVIEW_MANUAL_DRAFT_SCHEMA.md`

Dokumen 5H-A belum ada sebelum tahap ini, sehingga tidak ada file target lama yang dibackup.

## E. File yang Dibuat/Diubah

Dibuat:

- `docs/audit/SIAGA_SDA_TAHAP_5HA_APPLY_READY_DRAFT_SCHEMA.md`

Tidak ada file runtime, schema Prisma asli, migration, database, Auth, RBAC, login, Dashboard, endpoint Approval, atau dependency yang diubah.

## F. Perbaikan dari 5H Berdasarkan 5I-A

Revisi apply-ready dari draft 5H:

1. Menambahkan back relation eksplisit di `User`, `Paket`, dan `SubKegiatan`.
2. Mengganti rekomendasi nama source-origin dari `PackageOrigin` menjadi `PaketOrigin` agar konsisten dengan model aktual `Paket`.
3. Mengganti unique origin nullable dari `@@unique([paketId, originModule, originId])` menjadi `originKey String` non-null dengan `@@unique([paketId, originModule, originKey])`.
4. Menghapus rekomendasi unique ketat `@@unique([nomorSurat, tahun, jenis])` pada tahap pertama.
5. Memakai index untuk nomor surat, tahun, jenis, dan asal surat sampai aturan arsip resmi dikunci.
6. Tetap tidak menambahkan `ApprovalEntityType.SURAT`.
7. Tetap tidak mengubah `SurveyBaru.paketId`.
8. Tetap tidak memakai `Document` existing untuk `SuratAttachment` karena `Document` masih wajib `paketId`.
9. Tetap tidak menambahkan role/permission Surat runtime.

## G. Keputusan Nama Model Source-Origin

Opsi yang dievaluasi:

| Opsi | Kelebihan | Risiko |
|---|---|---|
| `PackageOrigin` | Selaras dengan istilah teknis Inggris dan adapter 5G yang memakai package-origin secara konseptual | Campur bahasa dengan model aktual `Paket`; back relation di `Paket` menjadi kurang natural |
| `PaketOrigin` | Konsisten dengan schema aktual dan istilah domain lokal; langsung jelas bahwa relasinya ke model `Paket` | Nama tidak sepenuhnya Inggris, tetapi schema ini memang sudah memakai `Paket`, `SubKegiatan`, dan istilah lokal |

Rekomendasi final: gunakan `PaketOrigin`.

Alasan teknis:

- Model aktif di schema adalah `Paket`, bukan `Project`.
- Relasi source-origin akan memakai `paketId`.
- Back relation di `Paket` lebih jelas sebagai `origins PaketOrigin[]`.
- Konsistensi schema lebih penting daripada mempertahankan nama Inggris pada entity baru.

## H. Strategi Unique Nomor Surat

Opsi yang dievaluasi:

| Opsi | Review | Risiko |
|---|---|---|
| `@@unique([nomorSurat, tahun, jenis])` | Rapi untuk arsip internal | Surat masuk dari instansi berbeda dapat memakai nomor sama dalam tahun yang sama |
| `@@unique([nomorSurat, tahun, jenis, asalSurat])` | Lebih longgar | `asalSurat` opsional dan variasi penulisan instansi bisa membuat constraint tidak stabil |
| Tanpa unique DB pada tahap pertama | Paling aman sebelum aturan arsip resmi final | Duplikasi perlu dicegah di service layer saat API resmi dibuat |

Rekomendasi final tahap pertama: gunakan index, bukan unique DB.

Patch apply-ready memakai:

```prisma
@@index([nomorSurat])
@@index([nomorSurat, tahun, jenis, asalSurat])
```

Catatan implementasi API nanti:

- Service layer wajib melakukan normalisasi `nomorSurat` dan `asalSurat`.
- Jika aturan arsip resmi sudah final, unique dapat ditambahkan pada migration berikutnya.
- Untuk surat keluar/internal yang nomornya dikendalikan internal, unique per jenis/tahun dapat diterapkan lebih ketat pada tahap khusus.

## I. Strategi Unique Origin

Masalah 5I-A:

- `originId` nullable membuat unique constraint tidak selalu mencegah duplikasi.
- Origin konseptual seperti input langsung atau program rutin dapat tidak memiliki `originId`.

Rekomendasi final: tambahkan `originKey String` non-null.

Contoh `originKey` yang dibuat di service layer:

- `surat:<suratId>`
- `survey:<surveyId>`
- `input_langsung:<paketId>`
- `program_rutin:<tahun>:<subKegiatanId>`
- `paket_tahun_berjalan:<tahun>:<paketId>`

Patch apply-ready memakai:

```prisma
originKey String
@@unique([paketId, originModule, originKey])
```

Dengan strategi ini, `originId` tetap opsional untuk trace ke entity formal, tetapi unique tetap stabil karena `originKey` selalu ada.

## J. Apply-Ready Enum Block

Blok enum berikut adalah draft apply-ready dalam dokumen. Belum boleh disalin ke `prisma/schema.prisma` tanpa persetujuan migration eksplisit.

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
  PERMOHONAN_DATA
  INSTRUKSI_PIMPINAN
  SURAT_INTERNAL
  SURAT_EKSTERNAL
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

enum PaketOriginModule {
  SURAT
  SURVEY
  INPUT_LANGSUNG
  PROGRAM_RUTIN
  PAKET_TAHUN_BERJALAN
  LAINNYA
}

enum PaketOriginStatus {
  FORMAL
  PENDING
  DITINDAKLANJUTI
  SELESAI
  ARSIP
  DITOLAK
}
```

Catatan: `SuratKategori` diperluas agar mendekati blueprint dan workflow 5C tanpa membuat data resmi baru.

## K. Apply-Ready Model Surat

```prisma
model Surat {
  id                   String         @id @default(cuid())
  nomorSurat           String
  tanggalSurat         DateTime
  tanggalTerima        DateTime?
  asalSurat            String?
  perihal              String
  ringkasan            String?
  jenis                SuratJenis     @default(MASUK)
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

  createdBy      User             @relation("SuratCreatedBy", fields: [createdById], references: [id])
  assignedToUser User?            @relation("SuratAssignedToUser", fields: [assignedToUserId], references: [id], onDelete: SetNull)
  subKegiatan    SubKegiatan?     @relation("SuratSubKegiatan", fields: [subKegiatanId], references: [id], onDelete: SetNull)
  dispositions   SuratDisposition[] @relation("SuratDispositions")
  followUps      SuratFollowUp[]    @relation("SuratFollowUps")
  attachments    SuratAttachment[]  @relation("SuratAttachments")
  comments       SuratComment[]     @relation("SuratComments")

  @@index([nomorSurat])
  @@index([nomorSurat, tahun, jenis, asalSurat])
  @@index([tahun, status])
  @@index([kategori, status])
  @@index([tanggalTerima])
  @@index([assignedToRole, status])
  @@index([assignedToUserId, status])
  @@index([subKegiatanId])
}
```

Catatan apply:

- `assignedToRole` tetap `String?` agar tidak mengubah enum `Role` dan tidak mengaktifkan `ADMIN_SURAT`.
- `currentDispositionId` tetap scalar opsional dulu. Jangan buat FK siklik ke `SuratDisposition` pada migration pertama.
- Relasi direct `linkedSurveyId`, `linkedProjectId`, `linkedApprovalId`, dan `linkedPeilId` tidak dipakai sebagai source-of-truth. Relasi tindak lanjut memakai `SuratFollowUp`.
- Unique nomor surat tidak dipasang pada migration pertama.

## L. Apply-Ready Model SuratDisposition

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

  surat    Surat @relation("SuratDispositions", fields: [suratId], references: [id], onDelete: Cascade)
  fromUser User  @relation("SuratDispositionFromUser", fields: [fromUserId], references: [id])
  toUser   User? @relation("SuratDispositionToUser", fields: [toUserId], references: [id], onDelete: SetNull)

  @@index([suratId, createdAt])
  @@index([fromUserId])
  @@index([toUserId, status])
  @@index([toRole, status])
  @@index([dueDate])
}
```

Catatan apply:

- `fromRole` dan `toRole` adalah snapshot role saat disposisi, bukan relasi enum role.
- Riwayat disposisi bersifat append-only secara workflow.
- Delete Surat harus sangat dibatasi di API karena cascade akan menghapus riwayat disposisi.

## M. Apply-Ready Model SuratFollowUp

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

  surat     Surat @relation("SuratFollowUps", fields: [suratId], references: [id], onDelete: Cascade)
  createdBy User  @relation("SuratFollowUpCreatedBy", fields: [createdById], references: [id])

  @@index([suratId, status])
  @@index([targetModule, targetId])
  @@index([createdById])
  @@index([createdAt])
}
```

Catatan apply:

- `targetModule` dan `targetId` polymorphic sehingga wajib dijaga di service layer.
- `followUpType APPROVAL` tetap hanya metadata tindak lanjut. Ini tidak berarti Approval Surat non-paket sudah didukung.
- Guard aplikasi wajib memastikan `targetRoute` hanya route resmi.

## N. Apply-Ready Model SuratAttachment

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

  surat      Surat @relation("SuratAttachments", fields: [suratId], references: [id], onDelete: Cascade)
  uploadedBy User  @relation("SuratAttachmentUploadedBy", fields: [uploadedById], references: [id])

  @@index([suratId, uploadedAt])
  @@index([uploadedById])
  @@index([mimeType])
}
```

Catatan apply:

- `storageKey` menjadi referensi utama storage.
- `fileUrl` opsional karena URL dapat berubah atau dibuat dinamis.
- `Document` existing tidak dipakai karena masih paket-centric dan wajib `paketId`.
- Validasi MIME, ukuran file, dan permission upload harus diterapkan di API resmi, bukan hanya schema.

## O. Apply-Ready Model SuratComment

```prisma
model SuratComment {
  id        String   @id @default(cuid())
  suratId   String
  userId    String
  role      String
  note      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  surat Surat @relation("SuratComments", fields: [suratId], references: [id], onDelete: Cascade)
  user  User  @relation("SuratCommentUser", fields: [userId], references: [id])

  @@index([suratId, createdAt])
  @@index([userId])
}
```

Catatan apply:

- Rekomendasi workflow tetap append-only.
- Jika `updatedAt` dipakai untuk edit comment, API wajib mencatat audit `beforeData` dan `afterData`.
- Delete permanen catatan sebaiknya tidak disediakan pada API tahap awal.

## P. Apply-Ready Model PaketOrigin

```prisma
model PaketOrigin {
  id           String            @id @default(cuid())
  paketId      String
  originModule PaketOriginModule
  originKey    String
  originId     String?
  originLabel  String
  originStatus PaketOriginStatus @default(FORMAL)
  originRoute  String?
  createdById  String?
  note         String?
  createdAt    DateTime          @default(now())

  paket     Paket @relation("PaketOrigins", fields: [paketId], references: [id], onDelete: Cascade)
  createdBy User? @relation("PaketOriginCreatedBy", fields: [createdById], references: [id], onDelete: SetNull)

  @@index([paketId])
  @@index([originModule, originId])
  @@index([originModule, originKey])
  @@index([createdAt])
  @@unique([paketId, originModule, originKey])
}
```

Catatan apply:

- `originKey` wajib dibuat konsisten oleh service layer.
- `originId` tetap opsional untuk origin konseptual atau origin yang belum punya entity formal.
- `originRoute` wajib divalidasi agar tidak membuat link palsu.
- `PaketOrigin` tidak boleh digunakan untuk menampilkan asal spesifik sebelum data formal benar-benar tersedia.

## Q. Back Relation yang Harus Ditambahkan di Model Existing Jika 5I Disetujui

Patch relation berikut harus ditambahkan di model existing saat migration disetujui. Ini hanya contoh dokumen, belum apply.

### User

```prisma
createdSurat              Surat[]            @relation("SuratCreatedBy")
assignedSurat             Surat[]            @relation("SuratAssignedToUser")
suratDispositionsFrom     SuratDisposition[] @relation("SuratDispositionFromUser")
suratDispositionsTo       SuratDisposition[] @relation("SuratDispositionToUser")
createdSuratFollowUps     SuratFollowUp[]    @relation("SuratFollowUpCreatedBy")
uploadedSuratAttachments  SuratAttachment[]  @relation("SuratAttachmentUploadedBy")
suratComments             SuratComment[]     @relation("SuratCommentUser")
createdPaketOrigins       PaketOrigin[]      @relation("PaketOriginCreatedBy")
```

### Paket

```prisma
origins PaketOrigin[] @relation("PaketOrigins")
```

### SubKegiatan

```prisma
suratMasukKeluar Surat[] @relation("SuratSubKegiatan")
```

Catatan apply:

- Penempatan field back relation harus mengikuti area relasi existing agar schema tetap mudah dibaca.
- Setelah disalin ke schema pada tahap migration, jalankan `prisma format` dan `prisma validate`.

## R. Hal yang Tetap Tidak Boleh Masuk Apply-Ready Tahap Pertama

Item berikut tetap tidak boleh dimasukkan ke migration schema dasar:

1. `ApprovalEntityType.SURAT`.
2. `ApprovalSubject` generik.
3. Entity `SurveyRequest` mandiri.
4. Perubahan `SurveyBaru.paketId` menjadi nullable.
5. `ADMIN_SURAT` pada enum `Role`.
6. Permission runtime Surat.
7. API Surat resmi.
8. Form Surat resmi.
9. Dashboard summary Surat resmi.
10. Perubahan endpoint Approval GET/read-only.
11. Perubahan seed role/permission.
12. Perubahan compatibility `ADMINISTRASI_KONTRAK`.

Alasan: semua item tersebut berdampak ke generated Prisma Client, Auth/RBAC, assignment scope, seed, API, Dashboard, dan workflow Approval.

## S. Checklist Apply 5I Jika Nanti Disetujui

Migration hanya boleh dilakukan jika user memberi persetujuan eksplisit. Checklist wajib:

- [ ] User memberi persetujuan eksplisit untuk mengubah `prisma/schema.prisma`.
- [ ] Backup database.
- [ ] Backup `prisma/schema.prisma`.
- [ ] Copy patch schema dari dokumen 5H-A secara hati-hati.
- [ ] Tambahkan enum baru.
- [ ] Tambahkan model baru: `Surat`, `SuratDisposition`, `SuratFollowUp`, `SuratAttachment`, `SuratComment`, `PaketOrigin`.
- [ ] Tambahkan back relation di `User`, `Paket`, dan `SubKegiatan`.
- [ ] Jangan tambah `ApprovalEntityType.SURAT` pada migration pertama.
- [ ] Jangan ubah `SurveyBaru.paketId` pada migration pertama.
- [ ] Jangan ubah `Document`.
- [ ] Jangan ubah enum `Role`.
- [ ] Jalankan `npx.cmd prisma format`.
- [ ] Jalankan `npx.cmd prisma validate`.
- [ ] Jalankan `npx.cmd tsc --noEmit`.
- [ ] Jalankan `git diff --check`.
- [ ] Buat migration hanya jika validate aman.
- [ ] Review hasil SQL migration sebelum apply ke database utama.
- [ ] Jangan ubah seed/role/admin_surat pada migration schema dasar kecuali ada tahap khusus.

## T. Risiko Tersisa

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Role/permission Surat belum aktif | UI/API Surat resmi belum bisa dipakai penuh | Tahap RBAC Surat khusus setelah schema aman |
| API Surat belum ada | Model tidak langsung dipakai aplikasi | Tahap 5J setelah migration disetujui |
| Storage upload belum ada | Lampiran belum bisa dipakai resmi | Desain API upload dan storage validation terpisah |
| Dashboard summary belum ada | Dashboard tidak boleh menampilkan angka Surat resmi | Buat endpoint summary scoped setelah data resmi ada |
| Approval Surat non-paket belum ada | Surat tidak bisa approval formal langsung | Approval Surat hanya setelah menjadi paket atau desain ApprovalSubject generik nanti |
| Survey mandiri belum ada | Surat tidak bisa langsung membuat `SurveyBaru` tanpa paket | Desain `SurveyRequest` nanti jika dibutuhkan |
| `originKey` bergantung service layer | Duplikasi bisa terjadi jika service salah membentuk key | Buat helper server-side origin key sebelum API PaketOrigin resmi |
| Migration tetap berisiko | Data lama dapat terdampak | Backup database dan uji staging/copy wajib |

## U. Rekomendasi Final

Rekomendasi 5H-A: **apply-ready draft cukup untuk masuk tahap 5I migration hanya jika user memberi persetujuan eksplisit dan backup database tersedia.**

Alasan:

1. Draft sudah diselaraskan dengan model aktual `Paket`, `User`, dan `SubKegiatan`.
2. Back relation yang dibutuhkan Prisma sudah disiapkan.
3. Strategi `originKey` mengatasi risiko unique nullable.
4. Nomor surat tidak dikunci unique terlalu cepat.
5. Scope berbahaya seperti Approval Surat non-paket, Survey mandiri, role `ADMIN_SURAT`, dan permission runtime tetap ditunda.

Jika belum ada persetujuan migration, tahap berikutnya sebaiknya tetap berupa review manual atau persiapan non-schema.

## Validasi

Validasi yang wajib dijalankan setelah dokumen dibuat:

- `git diff --check`
- `npx.cmd tsc --noEmit`

`npm run build` tidak wajib karena tahap 5H-A hanya dokumen/review. `prisma generate`, `prisma migrate`, dan `prisma db push` sengaja tidak dijalankan.

## Hal yang Tidak Disentuh

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

## Cara Rollback

Karena tahap ini hanya menambah dokumen, rollback cukup dengan menghapus:

`docs/audit/SIAGA_SDA_TAHAP_5HA_APPLY_READY_DRAFT_SCHEMA.md`

Backup referensi tersedia di:

`backup/backup-apply-ready-draft-schema-5ha-before-change/`

Tidak ada perubahan database, schema, runtime, atau dependency yang perlu di-rollback.

## Saran Commit Message

`docs: revisi draft schema apply-ready tahap 5ha`
