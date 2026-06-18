# SIAGA-SDA Tahap 5E - Proposal Data Model Surat & Relasi Tanpa Migration

Tanggal: 18 Juni 2026  
Commit acuan: `7d40139 feat: tambah traceability paket tahap 5d`  
Branch: `master`  
Status tahap: dokumentasi proposal, tanpa perubahan Prisma schema/migration/database

## A. Ringkasan Tujuan 5E

Tahap 5E menyusun proposal data model resmi Surat Masuk & Keluar serta relasinya ke Survey Investigasi, Paket Pekerjaan, Peil Banjir, Approval Center, Dashboard, dan Audit Log.

Tahap ini hanya menghasilkan dokumen desain data. Tidak ada perubahan schema, migration, database, API Surat resmi, form input Surat resmi, Auth, RBAC besar, role besar, endpoint Approval, login, atau visual Dashboard 4D.2.

## B. Status Acuan

- Commit acuan: `7d40139`.
- Tahap 5A selesai: audit workflow inti.
- Tahap 5B selesai: mapping workflow inti dan helper `src/lib/workflow-mapping.ts`.
- Tahap 5C selesai: UI workflow Surat tanpa database.
- Tahap 5D selesai: source-origin Paket dan traceability view tanpa database.
- Login final/locked dan tidak disentuh.
- Modal Dashboard 4D.2 final dan tidak disentuh.
- Prisma schema belum boleh diubah.
- Endpoint Approval GET/read-only harus tetap read-only.

## C. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/audit/SIAGA_SDA_TAHAP_5A_AUDIT_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5B_MAPPING_WORKFLOW_INTI.md`
- `docs/audit/SIAGA_SDA_TAHAP_5C_UI_DETAIL_WORKFLOW_SURAT.md`
- `docs/audit/SIAGA_SDA_TAHAP_5D_SOURCE_ORIGIN_PAKET_TRACEABILITY.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `src/lib/workflow-mapping.ts`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/lib/approval-workflow.ts`
- `src/store/useAppStore.ts`
- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/proyek/page.tsx`
- `src/app/(dashboard)/approval/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`
- `prisma/schema.prisma`

## D. Backup yang Dibuat

Backup dibuat di:

`backup/backup-surat-data-model-proposal-5e-before-change/`

File backup:

- `src/lib/workflow-mapping.ts` sebagai referensi helper mapping.
- `prisma/schema.prisma` sebagai `schema.prisma.readonly-reference`.

Dokumen 5E belum ada sebelum tahap ini, sehingga tidak ada dokumen lama yang perlu dibackup.

## E. File yang Diubah/Dibuat

Dibuat:

- `docs/audit/SIAGA_SDA_TAHAP_5E_PROPOSAL_DATA_MODEL_SURAT.md`

Tidak ada source code runtime yang diubah. `prisma/schema.prisma` hanya dibaca dan disalin sebagai referensi backup, tidak diedit.

## F. Prinsip Desain Data

Prinsip wajib untuk implementasi Surat tahap lanjutan:

1. Tidak merusak data lama dan tidak menghapus model existing.
2. Tidak mengubah compatibility `admin_sub_kegiatan` / `ADMINISTRASI_KONTRAK` secara mendadak.
3. Mendukung assignment scope user, bukan hanya role global.
4. Mendukung Audit Log untuk seluruh perubahan status penting.
5. Mendukung Approval Center formal tanpa side effect GET.
6. Mendukung Dashboard scoped dan tidak menampilkan angka palsu.
7. Mendukung UI desktop/mobile yang sudah disiapkan di 5C.
8. Tidak membuat data dummy sebagai data resmi.
9. Tidak membuat relasi palsu Surat/Survey/Paket/Peil sebelum field resmi tersedia.
10. Menjaga Surat yang sudah ditindaklanjuti tetap dapat ditelusuri dari tab asal, tab tujuan, Dashboard, dan Audit Log.

## G. Kondisi Schema Aktual yang Relevan

Temuan dari `prisma/schema.prisma`:

- Belum ada model `Surat`, `SuratDisposition`, `SuratFollowUp`, `SuratAttachment`, atau `SuratComment`.
- `Role` database belum memiliki `ADMIN_SURAT`.
- `ApprovalEntityType` belum memiliki entity `SURAT`.
- `AuditLog` sudah memiliki `entityType` dan `entityId`, sehingga bisa menjadi titik relasi audit generik untuk Surat nanti.
- `Paket` sudah menjadi pusat pekerjaan dan memiliki relasi ke `SurveyBaru`, `Approval`, `Document`, `AuditLog`, dan assignment.
- `SurveyBaru` saat ini wajib terkait `paketId`, sehingga asal Survey dari Surat belum bisa direpresentasikan secara formal tanpa perubahan model lanjutan.
- `Approval` saat ini wajib terkait `paketId`, sehingga approval Surat murni perlu desain tambahan sebelum migration.

Implikasi:

- Implementasi Surat resmi tidak boleh langsung memaksa relasi ke model existing tanpa desain.
- Relasi lintas modul sebaiknya dirancang generik dan audit-safe sebelum migration.

## H. Proposal Entity Utama

Entity yang direkomendasikan:

1. `Surat` sebagai data induk Surat Masuk, Surat Keluar, dan Surat Internal.
2. `SuratDisposition` sebagai riwayat disposisi role/user.
3. `SuratFollowUp` sebagai relasi tindak lanjut ke modul tujuan.
4. `SuratAttachment` sebagai lampiran file/dokumen surat.
5. `SuratComment` atau `SuratNote` sebagai catatan internal.
6. Relasi ke `AuditLog` existing melalui `entityType = "surat"` dan `entityId = surat.id`.
7. Relasi ke `Approval` existing hanya setelah strategi entity approval Surat disetujui.
8. Relasi ke `Paket` existing melalui `linked_project_id` atau tabel relasi source-origin.
9. Relasi ke `SurveyBaru` atau model survey lanjutan melalui origin formal.
10. Relasi ke Peil Banjir nanti setelah modul Peil siap secara data.

## I. Proposal Field Model `Surat`

Field minimal yang direkomendasikan:

| Field | Tipe Konsep | Catatan |
|---|---|---|
| `id` | String/cuid | Primary key. |
| `nomor_surat` | String | Nomor surat resmi, idealnya unik per tahun/jenis bila aturan arsip menetapkan. |
| `tanggal_surat` | DateTime | Tanggal yang tercantum pada surat. |
| `tanggal_terima` | DateTime? | Wajib untuk surat masuk, opsional untuk surat keluar/internal. |
| `asal_surat` | String? | Instansi/warga/unit asal. |
| `perihal` | String | Judul/perihal utama. |
| `ringkasan` | String? | Ringkasan isi agar dashboard tidak membaca lampiran penuh. |
| `kategori` | enum | Mengikuti proposal kategori Surat. |
| `status` | enum | Mengikuti proposal status Surat. |
| `prioritas` | enum/string | Normal, penting, segera, kritis. |
| `sifat_surat` | enum/string | Biasa, penting, rahasia jika dibutuhkan. |
| `jenis_surat` | enum | `MASUK`, `KELUAR`, `INTERNAL`. |
| `tahun` | Int | Untuk filter arsip dan dashboard. |
| `bidang` | String? | Default Bidang SDA bila sistem multi-bidang nanti. |
| `sub_kegiatan_id` | String? | Relevan bila surat terkait sub kegiatan. |
| `created_by` | String | User pembuat/pencatat surat. |
| `assigned_to_role` | String? | Role tujuan disposisi aktif. |
| `assigned_to_user_id` | String? | User tujuan disposisi aktif. |
| `current_disposition_id` | String? | Disposisi aktif terakhir. |
| `linked_survey_id` | String? | Relasi formal ke survey jika sudah tersedia. |
| `linked_project_id` | String? | Relasi formal ke paket/project jika sudah tersedia. |
| `linked_approval_id` | String? | Relasi ke Approval formal jika desain approval Surat disetujui. |
| `linked_peil_id` | String? | Relasi masa depan ke Peil Banjir. |
| `archived_at` | DateTime? | Terisi saat arsip. |
| `completed_at` | DateTime? | Terisi saat tindak lanjut selesai. |
| `created_at` | DateTime | Timestamp pembuatan record. |
| `updated_at` | DateTime | Timestamp perubahan terakhir. |

Catatan desain:

- Jangan menampilkan `linked_*` sebagai data resmi jika nilainya belum berasal dari database.
- Jika relasi banyak-ke-banyak dibutuhkan, field `linked_*` tunggal harus diganti atau dilengkapi tabel relasi.

## J. Proposal Status Surat

Status enum yang direkomendasikan:

| Status | Label UI | Makna |
|---|---|---|
| `DRAFT` | Draft | Surat belum masuk workflow resmi. |
| `RECEIVED` | Surat Masuk | Surat diterima/dicatat. |
| `READ` | Dibaca | Surat sudah dibaca petugas berwenang. |
| `DISPOSITION` | Disposisi Kabid | Surat sedang/selesai didisposisi. |
| `NEED_SURVEY` | Perlu Survey | Membutuhkan Survey Investigasi. |
| `NEED_PACKAGE` | Perlu Paket | Menjadi kandidat Paket Pekerjaan. |
| `NEED_APPROVAL` | Perlu Approval | Membutuhkan Approval Center. |
| `FORWARDED_TO_PEIL` | Diteruskan ke Peil Banjir | Terkait permohonan/rekap Peil. |
| `IN_PROGRESS` | Ditindaklanjuti | Ada tindak lanjut aktif. |
| `COMPLETED` | Selesai | Semua tindak lanjut selesai. |
| `ARCHIVED` | Arsip | Tidak aktif, tetap tersimpan. |
| `REJECTED` | Ditolak | Tidak dilanjutkan dengan alasan tercatat. |

## K. Proposal Kategori Surat

Kategori enum yang direkomendasikan:

| Kategori | Label UI |
|---|---|
| `UNDANGAN_RAPAT` | Undangan rapat |
| `USULAN_WARGA` | Usulan warga |
| `LAPORAN_BANJIR` | Laporan banjir |
| `DRAINASE` | Drainase |
| `NORMALISASI` | Normalisasi |
| `PEIL_BANJIR` | Peil banjir |
| `PEKERJAAN_RUTIN` | Pekerjaan rutin |
| `PAKET_PEKERJAAN` | Paket pekerjaan |
| `ADMINISTRASI_UMUM` | Administrasi umum |

Catatan:

- Blueprint juga menyebut kategori seperti Permohonan Data, Instruksi Pimpinan, Surat Internal, Surat Eksternal, dan Lainnya.
- Pada review 5F perlu diputuskan apakah kategori 5E mengikuti daftar prompt 5E secara ketat atau menggabungkan daftar blueprint agar tidak kehilangan kebutuhan operasional.

## L. Proposal `SuratDisposition`

Field yang direkomendasikan:

| Field | Catatan |
|---|---|
| `id` | Primary key. |
| `surat_id` | Relasi wajib ke `Surat`. |
| `from_user_id` | User pemberi disposisi. |
| `from_role` | Snapshot role pemberi disposisi. |
| `to_user_id` | User tujuan jika spesifik. |
| `to_role` | Role tujuan jika disposisi berbasis role. |
| `instruksi` | Instruksi tindak lanjut. |
| `catatan` | Catatan tambahan. |
| `status` | Pending, read, completed, returned, archived. |
| `due_date` | SLA disposisi bila ada. |
| `created_at` | Waktu dibuat. |
| `read_at` | Waktu dibaca penerima. |
| `completed_at` | Waktu selesai. |

Rekomendasi:

- Simpan `from_role` dan `to_role` sebagai snapshot agar audit tetap valid meski role user berubah.
- Disposisi sebaiknya punya histori append-only, bukan hanya update field tunggal.

## M. Proposal `SuratFollowUp`

Field yang direkomendasikan:

| Field | Catatan |
|---|---|
| `id` | Primary key. |
| `surat_id` | Relasi wajib ke `Surat`. |
| `follow_up_type` | Survey, Paket, Peil, Approval, Arsip, Surat Keluar, Notulen. |
| `target_module` | `survey`, `proyek`, `peil`, `approval`, `surat`, `audit-log`. |
| `target_id` | ID record tujuan jika sudah dibuat. |
| `target_route` | Route UI aman, misalnya `/survey?survey_id=...`. |
| `status` | Pending, in_progress, completed, archived, rejected. |
| `created_by` | User pembuat tindak lanjut. |
| `note` | Catatan tindak lanjut. |
| `created_at` | Waktu dibuat. |
| `completed_at` | Waktu selesai. |

Rekomendasi:

- Gunakan `target_module` + `target_id` agar satu Surat bisa punya banyak tindak lanjut.
- Jangan hanya memakai `linked_survey_id` tunggal jika surat bisa bercabang ke lebih dari satu modul.

## N. Proposal `SuratAttachment`

Field yang direkomendasikan:

| Field | Catatan |
|---|---|
| `id` | Primary key. |
| `surat_id` | Relasi wajib ke `Surat`. |
| `file_name` | Nama file asli/label arsip. |
| `file_url` atau `storage_key` | Disarankan `storage_key` untuk storage resmi, `file_url` bisa jadi derived. |
| `mime_type` | Validasi tipe file. |
| `file_size` | Validasi ukuran. |
| `uploaded_by` | User uploader. |
| `uploaded_at` | Waktu upload. |

Rekomendasi:

- Storage resmi harus divalidasi pada tahap API/upload, bukan pada 5E.
- Jangan menyimpan file binary di database.

## O. Proposal `SuratComment` / `SuratNote`

Field yang direkomendasikan:

| Field | Catatan |
|---|---|
| `id` | Primary key. |
| `surat_id` | Relasi wajib ke `Surat`. |
| `user_id` | User pembuat catatan. |
| `role` | Snapshot role. |
| `note` | Isi catatan. |
| `created_at` | Waktu dibuat. |
| `updated_at` | Waktu diubah jika edit catatan diizinkan. |

Rekomendasi:

- Jika catatan bersifat audit formal, gunakan append-only dan hindari edit.
- Jika edit diizinkan, simpan Audit Log perubahan catatan.

## P. Relasi ke Survey

Prinsip:

- Surat dapat menjadi asal Survey Investigasi.
- Survey harus bisa menyimpan asal dari Surat secara formal pada tahap lanjutan.
- Tahap 5E tidak mengubah model `SurveyBaru`.

Opsi aman:

1. Tambah field origin pada Survey nanti:
   - `origin_module`
   - `origin_id`
   - `origin_label`
   - `origin_route`

2. Buat tabel relasi terpisah:
   - `WorkflowLink`
   - atau `SuratFollowUp` dengan `target_module = "survey"` dan `target_id = survey.id`

Rekomendasi awal:

- Pakai `SuratFollowUp` untuk hubungan Surat -> Survey.
- Pertimbangkan field origin di Survey hanya jika satu Survey pasti punya satu sumber utama.

## Q. Relasi ke Paket

Prinsip:

- Paket dapat berasal dari Surat atau Survey.
- Source-origin Paket perlu desain hati-hati agar tidak membuat relasi palsu.
- Tahap 5E tidak mengubah model `Paket` atau `Proyek`.

Opsi aman:

1. Tambah field source-origin nanti:
   - `source_origin_module`
   - `source_origin_id`
   - `source_origin_label`

2. Buat tabel relasi:
   - `ProjectOrigin` atau `PackageOrigin`
   - field: `paket_id`, `origin_module`, `origin_id`, `origin_status`, `created_by`, `created_at`

Rekomendasi awal:

- Untuk fleksibilitas audit, `PackageOrigin` lebih aman daripada field tunggal karena paket bisa berasal dari beberapa sumber: surat, survey, program rutin, dan input langsung.
- Detail paket boleh membaca source-origin hanya setelah data resmi tersedia.

## R. Relasi ke Approval

Prinsip:

- Approval Center tetap pusat persetujuan formal.
- Approval GET harus tetap read-only.
- Tahap 5E tidak mengubah workflow approval.

Kondisi aktual:

- `Approval` wajib memiliki `paketId`.
- `ApprovalEntityType` belum memiliki `SURAT`.
- Approval formal saat ini cocok untuk item yang terkait Paket.

Opsi aman:

1. Jika approval Surat selalu terkait paket, gunakan `Approval` existing setelah Surat terhubung ke Paket.
2. Jika approval Surat berdiri sendiri, perlu desain lanjutan:
   - tambah `SURAT` ke `ApprovalEntityType`;
   - atau buat `ApprovalSubject` generik;
   - atau longgarkan dependensi `paketId` dengan desain migration yang sangat hati-hati.

Rekomendasi awal:

- Jangan menambah approval Surat formal sebelum desain 5F disetujui.
- `linked_approval_id` pada `Surat` hanya dipakai bila Approval benar-benar dibuat oleh aksi POST eksplisit, bukan GET/polling.

## S. Relasi ke Dashboard

Dashboard hanya boleh membaca summary scoped.

Summary Surat yang direkomendasikan:

- Surat masuk bulan ini.
- Surat perlu disposisi.
- Surat perlu survey.
- Surat perlu approval.
- Tindak lanjut belum selesai.
- Arsip selesai.

Aturan:

- Agregat harus mengikuti assignment scope user.
- Pimpinan/Auditor read-only.
- Role tanpa akses Surat tidak melihat detail Surat.
- Angka demo/fallback harus diberi label jelas.
- Jangan tampilkan angka resmi dari data konseptual 5C.

## T. Relasi ke Audit Log

Action minimal yang direkomendasikan:

| Action | Kapan Ditulis |
|---|---|
| `SURAT_CREATE` | Surat dibuat/dicatat. |
| `SURAT_READ` | Surat dibaca role/user berwenang bila perlu audit baca. |
| `SURAT_DISPOSISI` | Disposisi dibuat/dikirim. |
| `SURAT_TINDAK_LANJUT` | Follow-up dibuat ke modul tujuan. |
| `SURAT_ARCHIVE` | Surat diarsipkan. |
| `SURAT_REJECT` | Surat ditolak/tidak dilanjutkan. |
| `SURAT_COMPLETE` | Tindak lanjut Surat selesai. |
| `SURAT_ATTACHMENT_ADD` | Lampiran ditambahkan. |
| `SURAT_COMMENT` | Catatan/komentar ditambahkan. |

Rekomendasi metadata Audit Log:

- `entityType = "surat"`
- `entityId = surat.id`
- `afterData.status`
- `afterData.target_module`
- `afterData.target_id`
- `userRole` snapshot.

## U. Proposal Permission

Permission yang diusulkan untuk tahap lanjut, belum diaktifkan pada 5E:

| Permission | Makna |
|---|---|
| `view_surat` | Melihat Surat sesuai scope. |
| `create_surat` | Membuat/mencatat Surat. |
| `update_surat` | Mengubah metadata Surat. |
| `dispose_surat` | Membuat disposisi. |
| `followup_surat` | Membuat tindak lanjut ke modul tujuan. |
| `archive_surat` | Mengarsipkan Surat. |
| `delete_surat` | Menghapus Surat, sebaiknya sangat dibatasi atau dihindari. |
| `view_all_surat` | Melihat semua Surat lintas assignment. |
| `view_assigned_surat` | Melihat Surat yang ditugaskan. |

Catatan:

- Tahap 5E tidak mengubah `src/lib/rbac.ts`.
- `/surat` saat ini masih memakai compatibility `view_announcements`; ini harus dipisah pada tahap role/permission khusus.

## V. Proposal Role

Role yang perlu dipetakan tanpa aktivasi pada 5E:

| Role | Akses Konsep |
|---|---|
| `admin_surat` | Input, edit, disposisi administratif, arsip, lampiran, rekap Surat. |
| `admin_bidang` | Monitoring dan koordinasi bidang; bisa membantu tindak lanjut sesuai izin. |
| `kabid` | Disposisi Kabid dan monitoring status tindak lanjut. |
| `ppk` | Melihat Surat terkait paket/approval kewenangannya. |
| `pptk` | Melihat/menindaklanjuti Surat teknis sesuai assignment. |
| `tim_survey` | Melihat Surat yang ditugaskan menjadi Survey. |
| `tim_perencanaan` | Melihat Surat terkait perencanaan/survey/RAB sesuai assignment. |
| `admin_sub_kegiatan` | Melihat Surat terkait sub kegiatan/paket yang ditugaskan. |
| `pimpinan` | Read-only summary dan detail sesuai kebijakan. |
| `auditor` | Read-only untuk audit trail dan kelengkapan dokumen. |

Catatan:

- Jangan memberi permission luas ke Tim Perencana hanya untuk membuka badge/angka.
- Jangan mengaktifkan `admin_surat` sebelum role database dan RBAC disetujui.

## W. Proposal Index

Index yang direkomendasikan untuk model Surat:

- `nomor_surat`
- `tahun`
- `kategori`
- `status`
- `tanggal_terima`
- `assigned_to_role`
- `assigned_to_user_id`
- `linked_project_id`
- `linked_survey_id`
- `linked_approval_id`

Index tambahan untuk tabel turunan:

- `SuratDisposition(surat_id, created_at)`
- `SuratDisposition(to_user_id, status)`
- `SuratDisposition(to_role, status)`
- `SuratFollowUp(surat_id, status)`
- `SuratFollowUp(target_module, target_id)`
- `SuratAttachment(surat_id, uploaded_at)`
- `SuratComment(surat_id, created_at)`

## X. Risiko Teknis

Risiko utama:

1. Bentrok role/RBAC jika `admin_surat` diaktifkan tanpa mapping database dan frontend.
2. Assignment scope tidak tepat sehingga Surat lintas bidang/sub kegiatan terlihat ke role terbatas.
3. Relasi palsu jika UI mengklaim Surat sudah terhubung ke Survey/Paket sebelum field resmi ada.
4. Data dummy/konseptual dianggap data resmi bila badge tidak jelas.
5. Approval side effect muncul kembali jika sync tulis dipanggil dari GET/polling.
6. Audit Log tidak lengkap jika perubahan status Surat tidak mencatat actor, role, before/after.
7. Migration terlalu cepat dapat mengunci desain yang belum matang.
8. Compatibility `admin_sub_kegiatan` / `ADMINISTRASI_KONTRAK` bisa terganggu jika role enum diubah sembarangan.
9. Build Prisma di Windows masih berisiko gagal `EPERM` jika query engine terkunci proses lokal.
10. `Approval` existing masih package-centric; approval Surat non-paket perlu desain khusus.

## Y. Rencana Tahap Lanjutan

Tahapan yang direkomendasikan:

1. 5F - Review proposal schema dan risiko bersama user.
2. 5G - Implementasi frontend adapter source-origin yang membaca data bila kelak tersedia, tetap tanpa migration.
3. 5H - Draft Prisma schema dalam dokumen, belum apply.
4. 5I - Migration hanya jika user memberi persetujuan eksplisit.
5. 5J - API Surat resmi dengan auth, validation, assignment scope, dan Audit Log.
6. 5K - Form Surat resmi dan upload lampiran.
7. 5L - Dashboard summary Surat scoped.

## Z. Validasi

Validasi Tahap 5E:

- `git diff --check`: akan dijalankan setelah dokumen dibuat.
- `npx tsc --noEmit`: akan dijalankan setelah dokumen dibuat.
- `npm run build`: opsional; bila gagal karena Prisma `EPERM`, dicatat sebagai kendala environment lokal.

## Saran Commit Message

`docs: tambah proposal data model surat tahap 5e`
