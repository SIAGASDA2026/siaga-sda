# SIAGA-SDA Tahap 5F - Review Schema Surat dan Risiko

## A. Ringkasan Tujuan 5F

Tahap 5F mereview proposal data model Surat Masuk & Keluar dari Tahap 5E sebelum masuk ke draft schema berikutnya. Fokus tahap ini adalah memilih arah desain yang aman untuk workflow Surat -> Survey -> Paket -> Approval -> Dashboard -> Audit Log tanpa mengubah Prisma schema, tanpa migration, dan tanpa membuat API atau form Surat resmi.

Hasil 5F adalah dokumen review teknis, matriks keputusan, matriks risiko, serta rekomendasi entity dan relasi yang layak dibawa ke tahap draft schema dokumen.

## B. Status Acuan

- Commit acuan: `f78d055 docs: tambah proposal data model surat tahap 5e`.
- Tahap 5A sampai 5E sudah selesai.
- Login final/locked dan tidak disentuh.
- Modal Dashboard 4D.2 final dan tidak disentuh.
- Prisma schema belum boleh diubah.
- Migration dan perubahan database belum boleh dilakukan.
- Endpoint Approval GET/read-only tetap stabil dan tidak disentuh.

## C. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/audit/SIAGA_SDA_TAHAP_5A_AUDIT_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5B_MAPPING_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5C_UI_DETAIL_WORKFLOW_SURAT.md`
- `docs/audit/SIAGA_SDA_TAHAP_5D_SOURCE_ORIGIN_PAKET_TRACEABILITY.md`
- `docs/audit/SIAGA_SDA_TAHAP_5E_PROPOSAL_DATA_MODEL_SURAT.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `src/lib/workflow-mapping.ts`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/lib/approval-workflow.ts`
- `src/store/useAppStore.ts`
- `prisma/schema.prisma`
- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/proyek/page.tsx`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `src/app/(dashboard)/approval/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`

## D. Backup yang Dibuat

Backup dibuat di:

`backup/backup-schema-review-5f-before-change/`

Isi backup:

- `SIAGA_SDA_TAHAP_5E_PROPOSAL_DATA_MODEL_SURAT.md`
- `schema.prisma`
- `workflow-mapping.ts`

## E. File yang Dibuat/Diubah

Dibuat:

- `docs/audit/SIAGA_SDA_TAHAP_5F_REVIEW_SCHEMA_SURAT_DAN_RISIKO.md`

Tidak ada source code runtime, Prisma schema, migration, login, Auth, RBAC, endpoint, atau Dashboard yang diubah.

## F. Review Proposal Entity 5E

### Surat

Entity `Surat` layak menjadi entity utama pada draft schema berikutnya. Field dasar seperti nomor surat, tanggal surat, tanggal terima, asal surat, perihal, ringkasan, kategori, status, prioritas, jenis surat, tahun, bidang, sub kegiatan, created_by, assigned_to_role, assigned_to_user_id, archived_at, completed_at, created_at, dan updated_at relevan untuk workflow pemerintah.

Catatan review:

- `linked_survey_id`, `linked_project_id`, `linked_approval_id`, dan `linked_peil_id` sebaiknya tidak menjadi satu-satunya cara relasi.
- Surat dapat punya lebih dari satu tindak lanjut, sehingga relasi langsung tunggal berisiko membatasi alur.
- Field direct link boleh dipertimbangkan sebagai cache/shortcut read model nanti, tetapi sumber kebenaran relasi sebaiknya tetap lewat entity tindak lanjut.

### SuratDisposition

`SuratDisposition` layak dibuat terpisah. Disposisi adalah tindakan administratif penting dan perlu riwayat append-only.

Catatan review:

- `from_user_id`, `from_role`, `to_user_id`, `to_role`, instruksi, catatan, status, due_date, created_at, read_at, completed_at sudah sesuai.
- `from_role` dan `to_role` perlu menyimpan snapshot string/enum saat aksi terjadi agar audit tetap valid walaupun role user berubah.
- Disposisi tidak boleh hanya ditaruh sebagai field terakhir di `Surat` karena riwayat disposisi bisa berlapis.

### SuratFollowUp

`SuratFollowUp` direkomendasikan sebagai relasi tindak lanjut resmi tahap awal.

Catatan review:

- Cocok untuk menghubungkan Surat ke Survey, Paket, Peil, Approval, Arsip, Dashboard summary, dan Audit Log.
- Perlu menyimpan `follow_up_type`, `target_module`, `target_id`, `target_route`, `status`, `created_by`, `note`, `created_at`, dan `completed_at`.
- Untuk fleksibilitas lintas modul jangka panjang, desain ini bisa dikembangkan menjadi `WorkflowLink`, tetapi belum perlu dipaksakan pada migrasi pertama.

### SuratAttachment

`SuratAttachment` layak sebagai entity terpisah jika lampiran surat memiliki kebutuhan metadata berbeda dari dokumen paket.

Catatan review:

- `Document` existing wajib `paketId`, sehingga tidak cocok langsung untuk lampiran Surat sebelum Surat menjadi Paket.
- `SuratAttachment` dapat menyimpan file surat masuk/keluar, scan PDF, foto lampiran, atau bukti administrasi non-paket.
- Integrasi dengan storage dapat disiapkan lewat `file_url` atau `storage_key`, tetapi belum diimplementasikan pada tahap ini.

### SuratComment / SuratNote

`SuratComment` atau `SuratNote` layak jika catatan perlu dipisah dari disposisi formal.

Rekomendasi:

- Gunakan append-only untuk catatan audit penting.
- Jika edit catatan diperlukan, simpan perubahan sebagai revisi baru atau audit `beforeData/afterData`.
- Hindari model catatan yang bisa diedit diam-diam tanpa audit.

## G. Keputusan Desain yang Direkomendasikan

### 1. Apakah SuratFollowUp cukup sebagai relasi tindak lanjut

Ya, untuk tahap awal. `SuratFollowUp` cukup sebagai relasi formal Surat ke modul tujuan selama menyimpan `target_module`, `target_id`, `target_route`, status, actor, dan waktu.

### 2. Apakah perlu WorkflowLink generik

Belum perlu untuk migrasi pertama. `WorkflowLink` generik berguna nanti jika relasi lintas modul makin banyak, misalnya Survey -> Asset, Asset -> Operasional, Peil -> Warning, atau Peta -> Surat. Untuk Surat tahap awal, `SuratFollowUp` lebih jelas dan lebih mudah diaudit.

### 3. Apakah PackageOrigin lebih aman daripada field source_origin tunggal

Ya. `PackageOrigin` atau `ProjectOrigin` lebih aman karena satu paket bisa berasal dari banyak sumber: Surat Masuk, Survey Investigasi, input langsung PPK/PPTK, program rutin, dan paket tahun berjalan. Field tunggal `source_origin_module/source_origin_id` hanya aman jika aturan bisnis memastikan satu paket hanya punya satu asal, dan kondisi itu belum terbukti.

### 4. Apakah linked_project_id / linked_survey_id tetap perlu di Surat

Tidak direkomendasikan sebagai sumber kebenaran utama. Relasi utama sebaiknya lewat `SuratFollowUp`. Field `linked_*` boleh dipertimbangkan sebagai denormalized shortcut jika dibutuhkan performa summary, tetapi harus jelas sebagai cache/read model dan harus konsisten dengan follow-up.

### 5. Apakah SuratAttachment dipisah dari Document existing

Direkomendasikan dipisah. `Document` existing bersifat paket-sentris dan wajib `paketId`. Lampiran Surat bisa ada sebelum paket terbentuk, sehingga memaksa `Document` akan menciptakan relasi palsu.

### 6. Apakah SuratComment perlu append-only atau editable

Rekomendasi append-only. Untuk sistem pemerintah dan audit trail, catatan yang memengaruhi disposisi/tindak lanjut harus tidak hilang. Jika fitur edit dibutuhkan, edit harus tercatat sebagai catatan baru atau audit terpisah.

## H. Review Risiko Approval

Kondisi aktual:

- Approval saat ini package-centric.
- `Approval` wajib `paketId`.
- `ApprovalEntityType` belum memiliki `SURAT`.
- `listApprovalsForSession()` dan `getApprovalSummaryForSession()` membaca approval berdasarkan scope paket.
- `syncPendingApprovalsForVisiblePakets()` adalah operasi tulis dan sudah diberi catatan agar tidak dipanggil dari GET/polling.

Risiko jika memaksa approval Surat non-paket:

- `Approval` tidak bisa dibuat tanpa `paketId`.
- Scope assignment approval akan tidak jelas karena filter approval saat ini lewat relasi paket.
- Badge Approval Center bisa kembali tidak konsisten jika surat formal dihitung di luar source-of-truth saat ini.
- Menambah `SURAT` ke `ApprovalEntityType` tanpa desain subject/scope akan membuat approval terlihat sah tetapi tidak punya guard yang lengkap.

Rekomendasi aman:

1. Tahap awal: approval Surat hanya masuk Approval Center setelah Surat ditindaklanjuti menjadi Paket atau entity paket-sentris.
2. Tahap lanjutan: desain `ApprovalSubject` generik jika Approval Center harus mendukung Surat non-paket.
3. Alternatif migration khusus: tambah `SURAT` ke `ApprovalEntityType` hanya setelah `Approval` mendukung nullable `paketId` atau subject polymorphic dengan guard scope yang jelas.

## I. Review Risiko Survey

Kondisi aktual:

- `SurveyBaru` wajib `paketId`.
- UI `/survey` membaca filter dashboard seperti `status`, `survey_id`, `sub_kegiatan_id`, `tahun`, dan `source_module`.
- Status Survey tetap memakai status internal dan label tampilan dari `workflow-mapping.ts`.

Risiko jika Surat langsung membuat Survey tanpa Paket:

- Schema saat ini tidak memungkinkan Survey mandiri tanpa paket.
- Memaksa Surat -> Survey dengan paket dummy akan menciptakan data palsu dan mengacaukan rekap paket.
- Assignment scope Survey saat ini mengikuti paket/proyek, bukan asal Surat.

Opsi aman:

1. Survey tetap melekat ke Paket pada tahap schema awal.
2. Buat entity `SurveyRequest` atau `SurveyInvestigation` mandiri jika Surat perlu memicu survey sebelum paket ada.
3. Longgarkan `paketId` hanya setelah desain migration, scope, dan dashboard summary disetujui eksplisit.

Rekomendasi: untuk draft schema berikutnya, jangan langsung ubah `SurveyBaru.paketId`. Catat kebutuhan `SurveyRequest` sebagai kandidat entity lanjutan.

## J. Review Risiko Paket / Source-Origin

Kondisi aktual:

- `Paket` belum memiliki source-origin formal.
- Detail paket sudah menampilkan panel konseptual "Jejak Asal Paket / Source-Origin" dengan empty state jujur.
- `PACKAGE_SOURCE_ORIGIN_OPTIONS` dan `PACKAGE_TRACEABILITY_TARGETS` hanya metadata frontend, bukan relasi database.

Risiko field tunggal:

- Paket bisa berasal dari Surat dan Survey sekaligus.
- Program rutin atau input langsung admin dapat berjalan paralel dengan rekomendasi survey.
- Field tunggal akan menyulitkan histori ketika sumber asal berubah atau ada sumber tambahan.

Rekomendasi:

- Gunakan `PackageOrigin` atau `ProjectOrigin` sebagai tabel relasi.
- Simpan `origin_module`, `origin_id`, `origin_label`, `origin_status`, `created_by`, `created_at`, dan catatan.
- Jangan tampilkan asal spesifik di UI sampai data resmi tersedia.

## K. Review Role / Permission

Kondisi aktual:

- `admin_surat` belum aktif di `src/lib/roles.ts`; alias masih `null`.
- `/surat` masih menggunakan compatibility permission `view_announcements`.
- `Permission` di `src/lib/rbac.ts` belum memiliki permission Surat khusus.
- Role database Prisma belum memiliki `ADMIN_SURAT`.

Permission usulan tetap relevan, tetapi belum boleh diaktifkan:

- `view_surat`
- `create_surat`
- `update_surat`
- `dispose_surat`
- `followup_surat`
- `archive_surat`
- `view_all_surat`
- `view_assigned_surat`

Risiko jika RBAC diubah terlalu cepat:

- Menu Surat bisa hilang dari role yang sekarang masih perlu akses compatibility.
- Role `admin_surat` terlihat aktif di UI tetapi tidak ada padanan aman di database.
- Assignment scope belum siap sehingga data Surat bisa terbuka terlalu luas.

Rekomendasi:

- Siapkan permission dalam dokumen 5H, tetapi jangan aktifkan runtime sampai schema, seed/role DB, middleware, dan page guard siap.
- Tetap pertahankan compatibility `/surat` sementara sampai migration dan RBAC disetujui.

## L. Review Assignment Scope

Surat harus mengikuti scope user, bukan global by default.

Prinsip scope yang direkomendasikan:

- Surat terkait `sub_kegiatan_id` mengikuti scope sub kegiatan/paket.
- Surat terkait Paket mengikuti assignment paket.
- Surat yang belum punya target tetap hanya terlihat oleh role pengelola Surat, Kabid/Admin Bidang sesuai kewenangan, atau user yang ditugaskan.
- Pimpinan dan Auditor read-only.
- Admin Surat/Admin Bidang bisa lebih luas, tetapi tetap harus dibatasi aturan bidang/tahun jika tersedia.
- Role lapangan hanya melihat Surat yang ditugaskan atau yang terkait paket/survey dalam scope.

Risiko utama adalah membuka semua surat ke semua role karena `/surat` saat ini memakai `view_announcements`. Ini harus ditutup pada tahap implementasi RBAC Surat resmi, bukan pada tahap dokumen 5F.

## M. Review Audit Log

Action minimal Surat yang perlu disiapkan:

- `SURAT_CREATE`
- `SURAT_READ`
- `SURAT_DISPOSISI`
- `SURAT_TINDAK_LANJUT`
- `SURAT_ARCHIVE`
- `SURAT_REJECT`
- `SURAT_COMPLETE`
- `SURAT_ATTACHMENT_ADD`
- `SURAT_COMMENT`

Catatan audit:

- `beforeData` dan `afterData` perlu jelas untuk perubahan status, disposisi, follow-up, dan archive.
- `actor role` perlu snapshot pada waktu aksi.
- Disposisi dan follow-up wajib tercatat karena memengaruhi keputusan tindak lanjut.
- UI konseptual 5C tidak boleh membuat audit palsu.
- `AuditLog` existing sudah memiliki `entityType`, `entityId`, `beforeData`, `afterData`, `userRole`, dan index yang cukup sebagai titik integrasi awal.

## N. Review Dashboard Summary

Summary Surat di Dashboard nanti harus scoped dan tidak mengambil angka konseptual dari 5C.

Kemungkinan summary resmi:

- Surat masuk bulan ini.
- Surat perlu disposisi.
- Surat perlu survey.
- Surat perlu approval.
- Tindak lanjut belum selesai.
- Arsip selesai.

Rekomendasi teknis:

- Buat endpoint summary read-only pada tahap API resmi, misalnya `GET /api/surat/summary`.
- Summary harus menggunakan session, permission, dan assignment scope.
- Data demo/simulasi wajib diberi label.
- Jangan mencampur workflow konseptual 5C sebagai angka resmi.

## O. Matriks Keputusan Desain

| Isu desain | Opsi A | Opsi B | Rekomendasi | Alasan | Risiko jika salah pilih |
|---|---|---|---|---|---|
| Relasi tindak lanjut Surat | `SuratFollowUp` khusus Surat | `WorkflowLink` generik lintas modul | Mulai dengan `SuratFollowUp` | Lebih jelas, kecil, mudah diaudit untuk tahap pertama | `WorkflowLink` terlalu dini bisa overgeneric dan sulit dijaga |
| Paket source-origin | Field tunggal di `Paket` | Tabel `PackageOrigin` | `PackageOrigin` | Paket bisa punya banyak asal | Field tunggal membuat relasi historis hilang |
| Link langsung di `Surat` | `linked_project_id`, `linked_survey_id` sebagai utama | Relasi lewat follow-up | Follow-up sebagai utama | Satu surat bisa banyak tindak lanjut | Link tunggal membuat workflow bercabang sulit |
| Lampiran Surat | Pakai `Document` existing | Buat `SuratAttachment` | `SuratAttachment` | `Document` wajib paketId | Memaksa paket palsu atau data lampiran hilang |
| Komentar Surat | Editable note | Append-only note/comment | Append-only | Lebih aman untuk audit pemerintah | Riwayat keputusan bisa berubah diam-diam |
| Approval Surat | Pakai Approval existing langsung | Tunggu Approval subject generik / setelah Paket | Jangan paksa sekarang | Approval wajib paketId dan scope paket | Approval non-paket bisa bocor scope |
| Survey dari Surat | Langsung ke `SurveyBaru` tanpa Paket | Buat `SurveyRequest` mandiri nanti | Tunda, desain `SurveyRequest` | `SurveyBaru` wajib paketId | Survey dummy/paket palsu |
| Permission Surat | Aktifkan sekarang | Siapkan proposal dulu | Proposal dulu | Role/DB belum siap | Menu/akses rusak atau terlalu luas |

## P. Matriks Risiko

| Risiko | Dampak | Kemungkinan | Mitigasi | Tahap penyelesaian |
|---|---|---:|---|---|
| Approval Surat dipaksa ke model package-centric | Badge approval dan scope rusak | Tinggi | Jangan tambah `SURAT` sebelum subject/scope disetujui | 5H/5I |
| Survey mandiri dipaksa ke `SurveyBaru` | Paket dummy dan rekap salah | Tinggi | Desain `SurveyRequest` atau tunda perubahan paketId | 5H |
| Source-origin paket hanya field tunggal | Traceability bercabang hilang | Tinggi | Gunakan `PackageOrigin` | 5H/5I |
| `/surat` tetap `view_announcements` terlalu lama | Akses Surat terlalu luas | Sedang | Buat permission Surat resmi setelah schema siap | 5J/5K |
| Admin Surat diaktifkan sebelum role DB siap | RBAC tidak konsisten | Sedang | Siapkan role/seed/mapping dalam tahap khusus | 5I/5J |
| Data konseptual 5C dihitung sebagai resmi | Dashboard menyesatkan | Sedang | Summary resmi hanya dari tabel Surat, label demo/simulasi | 5L |
| Audit log tidak lengkap | Sulit audit disposisi/tindak lanjut | Tinggi | Wajib log status, disposisi, follow-up, attachment, comment | 5J |
| Migration terlalu cepat | Risiko rusak data lama | Sedang | Draft schema dokumen dulu, review eksplisit sebelum apply | 5H/5I |
| Compatibility `ADMINISTRASI_KONTRAK` rusak | Administrasi existing terganggu | Sedang | Jangan ubah role existing saat schema Surat | 5I |
| Prisma EPERM Windows saat build | Validasi build lokal gagal non-source | Sedang | Catat sebagai environment, jangan ubah schema/dependency | Setiap validasi |

## Q. Rekomendasi Final 5F

Entity yang layak masuk draft schema 5H:

- `Surat`
- `SuratDisposition`
- `SuratFollowUp`
- `SuratAttachment`
- `SuratComment` atau `SuratNote`
- `PackageOrigin` atau `ProjectOrigin`

Entity/relasi yang perlu ditunda:

- `WorkflowLink` generik lintas semua modul.
- Approval `SURAT` langsung pada `ApprovalEntityType`.
- Perubahan `SurveyBaru.paketId` menjadi nullable.
- Aktivasi role `ADMIN_SURAT` runtime/database.

Relasi yang aman:

- Surat -> Disposition sebagai one-to-many.
- Surat -> FollowUp sebagai one-to-many.
- Surat -> Attachment sebagai one-to-many.
- Surat -> Comment/Note sebagai one-to-many append-only.
- PackageOrigin -> Paket sebagai many-to-one dan origin polymorphic by module/id.

Relasi yang berbahaya jika dipaksa sekarang:

- Surat -> Approval langsung tanpa Paket atau Approval subject generik.
- Surat -> SurveyBaru langsung tanpa Paket.
- Paket -> source_origin tunggal sebagai satu-satunya asal data.
- Dashboard summary Surat dari data konseptual.

Permission yang perlu disiapkan tetapi belum diaktifkan:

- `view_surat`
- `create_surat`
- `update_surat`
- `dispose_surat`
- `followup_surat`
- `archive_surat`
- `view_all_surat`
- `view_assigned_surat`

Keputusan utama: tahap berikutnya sebaiknya tidak langsung migration. Buat dulu adapter/frontend source-origin tanpa migration atau draft schema dokumen 5H yang lebih presisi, lalu minta persetujuan eksplisit sebelum `prisma migrate`.

## R. Rencana Tahap Lanjutan

1. Tahap 5G: frontend adapter source-origin tanpa migration.
2. Tahap 5H: draft Prisma schema dalam dokumen, belum apply.
3. Tahap 5I: migration hanya setelah persetujuan eksplisit user.
4. Tahap 5J: API Surat resmi.
5. Tahap 5K: form Surat resmi.
6. Tahap 5L: Dashboard summary Surat scoped.

## Validasi

Validasi yang perlu dijalankan setelah dokumen dibuat:

- `git diff --check`
- `npx.cmd tsc --noEmit`

`npm run build` tidak wajib untuk 5F karena tahap ini dokumen/review. Jika build dijalankan dan gagal karena Prisma `EPERM`/query engine terkunci di Windows, itu harus dicatat sebagai kendala environment lokal, bukan alasan mengubah schema atau dependency.

## Hal yang Tidak Disentuh

- Halaman login.
- Modal Dashboard 4D.2.
- Dashboard visual 4D.2.
- Prisma schema.
- Migration.
- Database.
- Auth, NextAuth, middleware.
- RBAC besar dan role besar.
- Endpoint Approval GET/read-only.
- API Surat resmi.
- Form Surat resmi.
- `package.json` dan dependency.

## Masalah yang Ditunda

- Aktivasi permission Surat resmi.
- Aktivasi role `admin_surat`.
- Draft schema formal model Surat.
- Desain Approval subject generik.
- Desain Survey mandiri sebelum Paket.
- Endpoint summary Surat scoped.
- API dan form Surat resmi.

## Saran Commit Message

`docs: review schema surat dan risiko tahap 5f`
