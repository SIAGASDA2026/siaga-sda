# SIAGA-SDA Tahap 5A - Audit Workflow Inti

Tanggal audit: 18 Juni 2026  
Commit acuan: `79c3e68 feat: finalisasi modal dashboard tahap 4d2`  
Route dashboard aktif: `/dashboard`  
File dashboard aktif: `src/app/(dashboard)/dashboard/page.tsx`

## 1. Ringkasan Tujuan

Tahap 5A mengaudit hubungan workflow inti SIAGA-SDA agar data antar tab dapat ditelusuri, clickable, role-aware, dan tidak menampilkan angka atau aksi yang menyesatkan.

Area audit:

1. Surat Masuk & Keluar.
2. Survey Investigasi.
3. Paket Pekerjaan.
4. Approval Center.
5. Dashboard.
6. Audit Log.

Tahap ini bukan redesign visual, bukan perubahan login, bukan perubahan Auth/RBAC besar, bukan perubahan database, dan bukan perubahan Prisma schema.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/lib/navigation.ts`
- `src/lib/dashboard-scope.ts`
- `src/lib/approval-workflow.ts`
- `src/store/useAppStore.ts`
- `src/components/modules/ModuleLandingPage.tsx`
- `src/components/navigation/SubfeatureEntryPoints.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/proyek/page.tsx`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `src/app/(dashboard)/approval/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`
- `src/app/api/projects/[id]/records/[kind]/route.ts`
- `src/app/api/projects/[id]/records/[kind]/[recordId]/route.ts`

## 3. Backup

Backup dibuat di:

`backup/backup-workflow-inti-5a-before-change/`

File yang dibackup:

- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`

Dokumen audit 5A belum ada sebelum tahap ini, sehingga tidak ada backup dokumen lama.

## 4. File yang Diubah

- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`
- `docs/audit/SIAGA_SDA_TAHAP_5A_AUDIT_WORKFLOW_INTI.md`

## 5. Peta Alur Workflow Inti

| Tab Asal | Status Awal | Aksi User | Role yang Boleh | Tab Tujuan | Status Akhir | Rekap Dashboard | Titik Audit Log |
|---|---|---|---|---|---|---|---|
| Surat Masuk & Keluar | Surat/usulan masuk | Disposisi atau tindak lanjut | Admin surat/admin bidang/kabid/role terkait setelah role final tersedia | Survey, Paket, Peil, Approval, Arsip | Ditindaklanjuti, Selesai, Arsip | Rekap surat, tindak lanjut, warning | Surat dibuat, dibaca, disposisi, tindak lanjut |
| Survey Investigasi | Draft/submitted | Simpan survey, upload dokumentasi, rekomendasi | Tim Survey, Tim Perencanaan, Admin, PPK/PPTK sesuai scope | Paket, Approval, Arsip | Perlu ditindaklanjuti, Ditolak/Arsip, Paket, Perlu Approval | Survey pending dan status tindak lanjut | `CREATE_SURVEY`, `UPDATE_SURVEY`, `DELETE_SURVEY` |
| Paket Pekerjaan | Paket aktif/draft | Update progress, dokumen, laporan, RAB, masalah | Admin, Admin Sub Kegiatan, PPK, PPTK, Direksi Teknis, Pengawas, Kontraktor sesuai scope | Approval, Administrasi, Dokumen, Audit Log | Aktif, Selesai, Bermasalah, Kritis | Paket aktif, progres, deviasi, masalah | `CREATE_*`, `UPDATE_*`, `DELETE_*` record proyek |
| Approval Center | Pending | Setujui, Minta Revisi, Tolak, Komentar | Role approver sesuai workflow dan `canAct` | Tab asal data | Approved, Revision Requested, Rejected | Approval Pending memakai summary formal | `APPROVAL_APPROVE`, `APPROVAL_REJECT`, `APPROVAL_REQUEST_REVISION`, `APPROVAL_COMMENT` |
| Dashboard | Ringkasan scoped | Klik KPI/card/shortcut | Role dengan akses modul tujuan | Modul sumber data | Filter aktif dari dashboard | Command Center | Audit mengikuti modul tujuan |
| Audit Log | Log tersedia | Filter, pencarian, review | Role `view_audit_log` | Detail aktivitas jika tersedia | Read-only | Ringkasan audit jika ada | Tidak menulis audit baru |

## 6. Audit Surat Masuk & Keluar

Status aktual:

- Route `/surat` tersedia.
- Halaman masih menggunakan `ModuleLandingPage`.
- Belum ada tabel/API surat resmi pada source yang diaudit.
- Permission sementara `/surat` masih memakai `view_announcements`.
- Kartu rekap menampilkan `0` dan sudah menyatakan tabel surat resmi belum ada.

Masalah ditemukan:

- Tombol utama sebelumnya mengarah ke `/pengumuman` dengan label `Buka Pengumuman Lama`. Ini berisiko membuat user menganggap Pengumuman sebagai workflow surat resmi.
- Role final seperti `admin_surat` belum tersedia sebagai role aktif frontend/database pada tahap ini.
- Relasi resmi `origin_module`, `target_module`, `linked_origin_id`, `status`, dan `tindak_lanjut` belum tersedia untuk surat.

Perbaikan ringan 5A:

- Tombol utama di `/surat` diubah menjadi `Kembali ke Dashboard`.
- Ditambahkan empty/status workflow yang jujur bahwa modul surat masih persiapan dan tidak boleh diarahkan ke Pengumuman lama.

Rekomendasi 5B:

- Buat mapping data surat resmi sebelum implementasi: kategori, status, disposisi, tindak lanjut, relasi ke Survey/Paket/Peil/Approval, dan audit log.
- Jangan memakai `/pengumuman` sebagai pengganti Surat Masuk & Keluar.

## 7. Audit Survey Investigasi

Status aktual:

- Route `/survey` tersedia dan membaca data dari project scoped.
- Assignment scope menggunakan `getScopedProjects`.
- Query dari dashboard didukung untuk `status`, `tahun`, `sub_kegiatan_id`, `survey_id`, dan `source_module`.
- Query `status=belum-ditindaklanjuti` dipetakan ke status teknis `submitted`.
- Filter aktif ditampilkan sebagai chip dan memiliki Reset Filter.
- Aksi create survey hanya tampil jika user memiliki permission `create_survey`.
- Dokumentasi foto survey sudah memakai viewer dokumentasi.
- API record survey mencatat audit `CREATE_SURVEY`, `UPDATE_SURVEY`, dan `DELETE_SURVEY`.

Masalah ditemukan:

- Status workflow masih bercampur antara istilah teknis `draft/submitted/approved/rejected` dan istilah final SIAGA-SDA.
- Belum ada relasi eksplisit dari surat/usulan masuk ke survey.
- Rekomendasi survey menuju paket/approval masih belum menjadi workflow formal penuh.

Rekomendasi 5B:

- Standarkan status tampilan menjadi istilah SIAGA-SDA tanpa menghapus status teknis internal.
- Tambahkan relasi asal survey secara bertahap setelah struktur data disetujui.

## 8. Audit Paket Pekerjaan

Status aktual:

- Route `/proyek` menjadi Paket Pekerjaan.
- Query auto-filter dari dashboard sudah didukung untuk `tahun`, `status`, `health`, `deviasi_status`, `jenis_paket`, `sub_jenis_paket`, `metode_pengadaan`, `sub_kegiatan_id`, `masalah`, dan `source_module`.
- Paket difilter dengan assignment scope.
- Detail paket `/proyek/[id]` memiliki tombol kembali dari konteks dashboard/paket dan sub-tab detail.
- Record proyek seperti laporan, RAB, dokumen, masalah, dan chat ditangani lewat API record yang mencatat audit.

Masalah ditemukan:

- Traceability dari surat atau survey ke paket belum formal di tipe data frontend.
- Paket bisa ditelusuri ke dokumen/foto/laporan internal, tetapi asal workflow lintas modul masih perlu relasi eksplisit.
- Beberapa subfitur lama masih berdiri sebagai route lama dan perlu entry point yang lebih jelas pada tahap lanjutan.

Rekomendasi 5B:

- Tambahkan mapping relasi asal paket tanpa langsung mengubah schema.
- Buat dokumen field relasi minimal sebelum implementasi database.

## 9. Audit Approval Center

Status aktual:

- Approval Center tetap menjadi pusat persetujuan formal.
- `GET /api/approval` sudah dipisahkan dari side effect sync tulis pada tahap sebelumnya.
- Halaman `/approval` polling read-only 15 detik dan hanya saat tab visible.
- Query filter dashboard didukung: `approval_status`, `status`, `entity_type`, `tahun`, `approver_role`, `approval_id`, dan `source_module`.
- Tombol `Setujui`, `Minta Revisi`, dan `Tolak` hanya tampil jika `item.canAct === true` dan status masih pending.
- Backend tetap menjaga aksi lewat helper approval workflow.
- Audit log backend mencatat `APPROVAL_APPROVE`, `APPROVAL_REJECT`, `APPROVAL_REQUEST_REVISION`, dan `APPROVAL_COMMENT`.

Masalah ditemukan:

- UI Audit Log belum memiliki label khusus untuk action approval tersebut.

Perbaikan ringan 5A:

- Ditambahkan metadata label Audit Log untuk aksi approval agar tidak tampil sebagai action mentah/default.

Rekomendasi 5B:

- Pertahankan Approval Center sebagai source-of-truth approval formal.
- Jangan mengaktifkan kembali sync tulis otomatis dari GET/polling.

## 10. Audit Dashboard

Status aktual:

- Dashboard aktif berada di `/dashboard`.
- Dashboard Command Center 4D.2 tetap dipertahankan.
- Modal Dashboard 4D.2 tidak diubah pada Tahap 5A.
- KPI dan shortcut utama menggunakan route yang sesuai:
  - Approval Pending ke `/approval?approval_status=pending&source_module=dashboard`.
  - Survey pending ke `/survey?status=belum-ditindaklanjuti&source_module=dashboard`.
  - Paket kritis ke `/proyek?health=kritis&source_module=dashboard`.
  - Surat ke `/surat`.
  - Peil ke `/peil`.
  - Asset ke `/asset`.
  - Peta ke `/peta`.
- Approval Pending menggunakan summary formal hasil tahap 4C.3.

Masalah ditemukan:

- Dashboard dapat mengarah ke modul persiapan seperti Surat/Peil/Asset, sehingga modul tujuan harus jujur menampilkan status persiapan jika data resmi belum ada.
- Beberapa angka simulasi/demo tetap harus dipisahkan dari data database resmi.

Rekomendasi 5B:

- Audit setiap item command center terhadap modul tujuan setelah workflow Surat/Peil/Asset diperkuat.
- Jangan mengembalikan navigasi lama yang sudah disembunyikan.

## 11. Audit Log

Status aktual:

- Route `/audit-log` tersedia dan gated oleh permission `view_audit_log`.
- Store dan API record proyek mencatat aktivitas utama.
- Approval workflow mencatat aksi approval lewat `logAudit`.

Perbaikan ringan 5A:

- Audit Log UI sekarang mengenali action approval:
  - `APPROVAL_APPROVE`
  - `APPROVAL_REJECT`
  - `APPROVAL_REQUEST_REVISION`
  - `APPROVAL_COMMENT`

Masalah tersisa:

- Titik audit Surat belum lengkap karena modul surat resmi belum diimplementasikan.
- Beberapa audit dari API bisa baru terlihat setelah refresh/bootstrap data, tergantung mekanisme store.

Rekomendasi 5B:

- Tetapkan daftar action audit final per workflow sebelum memperluas modul Surat/Survey/Paket.

## 12. Role yang Dijaga

Role existing tidak diubah.

Role/alias yang harus dipertahankan secara konsep:

- `admin_bidang` / `admin`
- `admin_sub_kegiatan`
- `kabid`
- `pimpinan`
- `ppk`
- `pptk`
- `direksi_teknis`
- `tim_perencanaan`
- `tim_pengawasan`
- `konsultan_perencana`
- `konsultan_pengawasan`
- `pejabat_pengadaan`
- `auditor`

Role target berikut belum dipaksakan pada tahap ini:

- `admin_surat`
- `admin_peil_banjir`
- `mandor_pintu_air`
- `petugas_pintu_air`
- `mandor_rehabilitasi_drainase`

## 13. Bug Ringan yang Diperbaiki

1. Route Surat tidak lagi diarahkan ke Pengumuman lama.
2. Halaman Surat menampilkan status persiapan workflow secara jujur.
3. Audit Log menampilkan label jelas untuk aksi approval formal.

## 14. Masalah Besar Ditunda ke Tahap 5B

1. Implementasi workflow Surat resmi, termasuk status, disposisi, relasi, dan audit.
2. Standarisasi status Survey ke istilah final SIAGA-SDA.
3. Relasi lintas modul formal dari Surat/Survey ke Paket/Approval.
4. Mapping titik audit final lintas workflow.
5. Role extension untuk admin surat/peil/asset/mandor tanpa mengubah Prisma secara mendadak.
6. Sinkronisasi UI real-time agar Audit Log langsung mencerminkan action API tanpa menunggu bootstrap penuh.

## 15. Hal yang Tidak Disentuh

- Halaman login.
- Komponen login.
- Auth / NextAuth.
- Middleware.
- RBAC besar.
- Role besar.
- Prisma schema.
- Migration.
- Database.
- `package.json`.
- Dependency.
- Endpoint Approval.
- Endpoint Bootstrap.
- Standar modal Dashboard 4D.2.
- Dashboard visual 4D.2.

## 16. Cara Rollback

Rollback perubahan Tahap 5A dapat dilakukan dengan mengembalikan file dari:

`backup/backup-workflow-inti-5a-before-change/`

File source yang perlu dipulihkan jika ingin rollback penuh:

- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`

Dokumen audit baru dapat dihapus hanya jika user menginstruksikan eksplisit.

## 17. Hasil Validasi

- `npm run lint`: gagal karena script `lint` tidak tersedia di `package.json`.
- `npx tsc --noEmit`: lulus.
- `npm run build`: gagal sebelum `next build` karena `prisma generate` terkena `EPERM` saat rename `query_engine-windows.dll.node`; indikasi file Prisma engine terkunci oleh proses/environment lokal.
- `git diff --check`: lulus.
