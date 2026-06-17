# SIAGA-SDA Tahap 5B - Mapping Workflow Inti Tanpa Ubah Schema

Tanggal: 18 Juni 2026  
Commit acuan terakhir: `818a011 feat: audit workflow inti siaga sda tahap 5a`  
Branch: `master`  
Dashboard aktif: `/dashboard`  
Dokumen acuan utama: `docs/audit/SIAGA_SDA_TAHAP_5A_AUDIT_WORKFLOW_INTI.md`

## A. Ringkasan Tujuan 5B

Tahap 5B membuat mapping workflow resmi SIAGA-SDA untuk hubungan:

`Surat Masuk & Keluar -> Survey Investigasi -> Paket Pekerjaan -> Approval Center -> Dashboard -> Audit Log`

Tahap ini hanya menyiapkan dokumentasi mapping, konstanta/helper frontend yang aman, empty state yang jujur, dan UI ringan. Tidak ada perubahan Prisma schema, migration, database, Auth besar, RBAC besar, login, atau modal Dashboard 4D.2.

## B. Status Acuan Terakhir

- Commit acuan: `818a011 feat: audit workflow inti siaga sda tahap 5a`.
- Login final/locked dan tidak disentuh.
- Modal Dashboard 4D.2 final dan tidak disentuh.
- Tahap 5A selesai:
  - dokumen audit workflow inti sudah dibuat;
  - `/surat` tidak lagi diarahkan ke `/pengumuman`;
  - Audit Log mengenali action approval formal;
  - Prisma schema, migration, dependency, Auth besar, RBAC besar tidak disentuh.

## C. File yang Dibaca

- `AGENTS.md`
- `docs/audit/SIAGA_SDA_TAHAP_5A_AUDIT_WORKFLOW_INTI.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/lib/navigation.ts`
- `src/lib/dashboard-scope.ts`
- `src/lib/approval-workflow.ts`
- `src/store/useAppStore.ts`
- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/proyek/page.tsx`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `src/app/(dashboard)/approval/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`
- `src/components/modules/ModuleLandingPage.tsx`

## D. Backup yang Dibuat

Backup dibuat di:

`backup/backup-workflow-mapping-5b-before-change/`

File yang dibackup:

- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/audit-log/page.tsx`

## E. File yang Diubah

- `src/lib/workflow-mapping.ts` - file baru helper/konstanta mapping frontend.
- `src/app/(dashboard)/surat/page.tsx` - UI ringan peta alur surat dan tombol route resmi.
- `src/app/(dashboard)/survey/page.tsx` - label status tampilan SIAGA-SDA dan peta tindak lanjut konseptual.
- `src/app/(dashboard)/audit-log/page.tsx` - metadata action workflow final disambungkan ke Audit Log UI.
- `docs/audit/SIAGA_SDA_TAHAP_5B_MAPPING_WORKFLOW_INTI.md` - dokumen mapping ini.

## F. Mapping Status Surat Masuk & Keluar

| Status Tampilan | Makna Workflow | Catatan Implementasi |
|---|---|---|
| Draft | Surat belum masuk workflow resmi | Belum ada tabel resmi pada tahap 5B |
| Surat Masuk | Surat/usulan diterima | Perlu entity surat resmi pada 5C |
| Dibaca | Surat dibuka/direview petugas berwenang | Audit action target: `SURAT_READ` |
| Disposisi Kabid | Surat didisposisi ke role/unit tujuan | Audit action target: `SURAT_DISPOSISI` |
| Perlu Survey | Surat perlu cek lapangan | Target route: `/survey` |
| Perlu Paket | Surat menjadi kandidat paket | Target route: `/proyek` |
| Perlu Approval | Tindak lanjut perlu persetujuan formal | Target route: `/approval` |
| Diteruskan ke Peil Banjir | Surat terkait elevasi/peil | Target route: `/peil` |
| Ditindaklanjuti | Surat sudah punya tindak lanjut aktif | Jangan hilangkan relasi surat asal |
| Selesai | Tindak lanjut selesai | Masuk rekap dashboard/audit |
| Arsip | Surat diarsipkan | Audit action target: `SURAT_ARCHIVE` |
| Ditolak | Surat tidak dilanjutkan | Perlu catatan alasan |

## G. Mapping Kategori Surat

| Kategori | Contoh Data | Tujuan Tindak Lanjut Umum |
|---|---|---|
| Undangan rapat | Undangan koordinasi teknis | Notulen/tindak lanjut, arsip, dashboard |
| Usulan warga | Permohonan normalisasi/drainase | Survey, paket, surat balasan |
| Laporan banjir | Laporan genangan/banjir | Peil, survey, operasional |
| Drainase | Aduan/perbaikan drainase | Survey, paket rutin/fisik |
| Normalisasi | Permohonan normalisasi kanal/sungai | Survey, paket, peta monitoring |
| Peil banjir | Permohonan pengukuran peil | Peil Banjir, Surat Keluar, arsip |
| Pekerjaan rutin | Usulan pemeliharaan rutin | Paket rutin, administrasi |
| Paket pekerjaan | Surat terkait paket berjalan | Paket, approval, administrasi |
| Administrasi umum | Surat administratif | Administrasi, arsip |

## H. Mapping Tindak Lanjut Surat

| Alur | Route Tujuan | Status Target | Audit Target |
|---|---|---|---|
| Surat -> Survey Investigasi | `/survey` | Perlu Survey / Ditindaklanjuti | `SURAT_TINDAK_LANJUT`, `CREATE_SURVEY` |
| Surat -> Paket Pekerjaan | `/proyek` | Perlu Paket / Ditindaklanjuti | `SURAT_TINDAK_LANJUT`, `PROJECT_CREATE` |
| Surat -> Peil Banjir | `/peil` | Diteruskan ke Peil Banjir | `SURAT_TINDAK_LANJUT` |
| Surat -> Approval Center | `/approval` | Perlu Approval | `SURAT_TINDAK_LANJUT`, approval action |
| Surat -> Arsip | `/surat` | Arsip | `SURAT_ARCHIVE` |
| Surat -> Dashboard/Rekap | `/dashboard` | Rekap scoped | tidak menulis audit langsung |
| Surat -> Audit Log | `/audit-log` | Read-only audit | tidak menulis audit langsung |

## I. Mapping Status Survey Investigasi

Status internal tetap aman dipertahankan:

- `draft`
- `submitted`
- `approved`
- `rejected`

Label tampilan SIAGA-SDA:

| Status Internal | Label Tampilan | Makna Workflow |
|---|---|---|
| `draft` | Draft Survey | Belum dikirim sebagai rekomendasi |
| `submitted` | Menunggu Tindak Lanjut | Survey sudah masuk dan menunggu pemeriksaan |
| `approved` | Direkomendasikan | Survey layak ditindaklanjuti |
| `rejected` | Ditolak | Survey tidak dilanjutkan atau perlu arsip |

Catatan istilah:

- `Menjadi Paket` dicatat sebagai status transisi konseptual ketika survey menghasilkan paket pekerjaan.
- Istilah ini tidak menggantikan status umum `Ditindaklanjuti`.
- Tahap 5B tidak mengubah status internal/API.

## J. Mapping Tindak Lanjut Survey

| Alur | Route Tujuan | Status Tampilan | Audit Target |
|---|---|---|---|
| Survey -> Paket Pekerjaan | `/proyek` | Menjadi Paket / Ditindaklanjuti | `SURVEY_RECOMMEND_TO_PACKAGE`, `PROJECT_CREATE` |
| Survey -> Approval Center | `/approval` | Perlu Approval | `SURVEY_RECOMMEND_TO_APPROVAL` |
| Survey -> Arsip | `/survey` | Arsip | `UPDATE_SURVEY` |
| Survey -> Dashboard/Rekap | `/dashboard` | Rekap survey scoped | tidak menulis audit langsung |
| Survey -> Audit Log | `/audit-log` | Read-only audit | tidak menulis audit langsung |

## K. Mapping Paket Pekerjaan

Sumber asal paket:

1. Surat Masuk.
2. Survey Investigasi.
3. Input langsung admin/PPK/PPTK.
4. Program rutin.
5. Paket tahun berjalan.

Tujuan lanjutan:

1. Approval Center.
2. Administrasi.
3. Dokumen.
4. Dokumentasi Foto.
5. Laporan.
6. Audit Log.
7. Dashboard.

Status tahap 5B:

- Paket belum memiliki field asal formal di tipe frontend yang diaudit.
- Detail paket sudah memiliki tab Survey, RAB, Laporan, Pengawasan, Masalah, dan Chat.
- Tombol kembali dari detail/subtab sudah tersedia.
- Source-origin package mapping belum dipaksakan agar tidak membuat relasi palsu.

Empty state yang direkomendasikan untuk 5C:

`Sumber asal paket belum terhubung secara formal.`

## L. Mapping Approval Center

Aturan final:

- Approval Center tetap menjadi pusat persetujuan formal.
- Approval tidak boleh ditulis otomatis dari GET/polling.
- Tombol aksi tetap berdasarkan `canAct`.
- Role read-only seperti `pimpinan` dan `auditor` tidak boleh melihat aksi tulis.
- Dashboard, Topbar, Sidebar, MobileNav memakai summary formal read-only.

Status approval:

1. Pending.
2. Approved.
3. Revision Requested.
4. Rejected.
5. Commented.

## M. Mapping Dashboard

Aturan:

- Card/KPI Dashboard harus menuju modul sumber data yang benar.
- Jika modul tujuan belum resmi, modul tujuan harus menampilkan status persiapan yang jujur.
- Jangan tampilkan angka palsu tanpa label demo/simulasi.
- Jangan mengubah modal Dashboard 4D.2 pada tahap ini.

Mapping route utama:

| Elemen Dashboard | Route Tujuan | Status 5B |
|---|---|---|
| Approval Pending | `/approval?approval_status=pending&source_module=dashboard` | Siap |
| Survey Pending | `/survey?status=belum-ditindaklanjuti&source_module=dashboard` | Siap dengan label tampilan baru |
| Paket Kritis | `/proyek?health=kritis&source_module=dashboard` | Siap |
| Surat | `/surat` | Modul persiapan, empty state jujur |
| Peil Banjir | `/peil` | Modul persiapan/route tersedia |
| Asset SDA | `/asset` | Modul persiapan/route tersedia |
| Peta Monitoring | `/peta` | Route tersedia |

## N. Mapping Audit Log Action Final

Action final minimal:

| Action | Label UI | Status 5B |
|---|---|---|
| `SURAT_CREATE` | Surat Dibuat | Disiapkan sebagai metadata UI |
| `SURAT_READ` | Surat Dibaca | Disiapkan sebagai metadata UI |
| `SURAT_DISPOSISI` | Disposisi Surat | Disiapkan sebagai metadata UI |
| `SURAT_TINDAK_LANJUT` | Tindak Lanjut Surat | Disiapkan sebagai metadata UI |
| `SURAT_ARCHIVE` | Surat Diarsipkan | Disiapkan sebagai metadata UI |
| `CREATE_SURVEY` | Input Survey | Sudah ada |
| `UPDATE_SURVEY` | Edit Survey | Sudah ada |
| `DELETE_SURVEY` | Hapus Survey | Sudah ada |
| `SURVEY_RECOMMEND_TO_PACKAGE` | Survey ke Paket | Disiapkan sebagai metadata UI |
| `SURVEY_RECOMMEND_TO_APPROVAL` | Survey ke Approval | Disiapkan sebagai metadata UI |
| `PROJECT_CREATE` | Paket Dibuat | Disiapkan sebagai metadata UI |
| `PROJECT_UPDATE` | Paket Diubah | Disiapkan sebagai metadata UI |
| `PROJECT_STATUS_UPDATE` | Status Paket Diubah | Disiapkan sebagai metadata UI |
| `PROJECT_ADD_DOCUMENT` | Dokumen Paket Ditambah | Disiapkan sebagai metadata UI |
| `PROJECT_ADD_PHOTO` | Foto Paket Ditambah | Disiapkan sebagai metadata UI |
| `APPROVAL_APPROVE` | Approval Disetujui | Sudah ada |
| `APPROVAL_REJECT` | Approval Ditolak | Sudah ada |
| `APPROVAL_REQUEST_REVISION` | Approval Minta Revisi | Sudah ada |
| `APPROVAL_COMMENT` | Catatan Approval | Sudah ada |

Catatan:

- Tahap 5B hanya menambahkan metadata UI untuk action final.
- Mekanisme `logAudit` tidak diubah.

## O. Mapping Role yang Boleh Melakukan Aksi

Role besar tidak diubah.

| Role Konsep | Frontend Existing | Aksi Konsep |
|---|---|---|
| `admin_bidang` | `admin` | Kelola data bidang, surat, survey, paket, monitoring, user bidang |
| `admin_sub_kegiatan` | `admin_sub_kegiatan` | Kelola paket, administrasi, dokumen, kontrak, rekap sub kegiatan |
| `kabid` | `kabid` | Monitoring bidang, disposisi/approval sesuai kewenangan |
| `pimpinan` | `pimpinan` | Read-only dashboard, approval status, risiko, ringkasan strategis |
| `ppk` | `ppk` | Paket, approval, RAB, laporan, masalah, dokumen |
| `pptk` | `pptk` | Paket, laporan lapangan, monitoring, masalah |
| `direksi_teknis` | `direksi_teknis` | Monitoring teknis, progres, laporan, masalah |
| `tim_perencanaan` | `tim_perencanaan` | Survey, RAB/gambar, rekomendasi perencanaan |
| `tim_pengawasan` | `tim_pengawasan` | Laporan, masalah, progres, pengawasan |
| `konsultan_perencana` | `konsultan_perencana` | Survey/perencanaan dan dokumen perencanaan |
| `konsultan_pengawasan` | `konsultan_pengawasan` | Laporan pengawasan, progres, masalah |
| `pejabat_pengadaan` | `pejabat_pengadaan` | Paket pengadaan dan dokumen tender/PL |
| `admin_surat` | belum tersedia | Perlu role extension |
| `admin_peil_banjir` | belum tersedia | Perlu role extension |
| `mandor_pintu_air` | belum tersedia | Perlu role extension dan assignment asset |
| `petugas_pintu_air` | belum tersedia | Petugas biasa belum wajib login |
| `mandor_rehabilitasi_drainase` | belum tersedia | Perlu role extension dan assignment operasional |
| `auditor` | `auditor` | Read-only audit trail, dokumen, dashboard, laporan |

## P. Masalah yang Belum Diimplementasikan

1. Belum ada entity/data resmi Surat Masuk & Keluar.
2. Belum ada relasi formal Surat -> Survey/Paket/Peil/Approval.
3. Belum ada field source-origin paket yang aman untuk ditampilkan sebagai data resmi.
4. Status Survey final belum menjadi workflow penuh, baru label tampilan.
5. Action audit Surat belum ditulis backend karena modul Surat resmi belum ada.
6. Role `admin_surat`, `admin_peil_banjir`, mandor, dan petugas belum tersedia sebagai role aktif.
7. Permission `/surat` masih memakai `view_announcements` sebagai compatibility sementara.
8. Paket detail belum menampilkan source-origin agar tidak membuat relasi palsu.

## Q. Rekomendasi Tahap 5C

Tahap 5C sebaiknya tetap tanpa schema dulu jika belum ada keputusan database, dengan fokus:

1. Membuat UI detail workflow Surat sebagai mock traceability jujur tanpa data resmi palsu.
2. Menambahkan source-origin empty state pada detail paket setelah posisi UI disetujui.
3. Membuat adapter frontend untuk membaca metadata asal jika kelak tersedia dari database.
4. Memfinalkan daftar action audit workflow sebelum backend Surat dibuat.
5. Menyusun proposal schema Surat/relasi dalam dokumen terpisah sebelum Prisma migration.
6. Memisahkan permission Surat dari `view_announcements` hanya setelah role extension disetujui.

## R. Validasi

- `git diff --check`: lulus.
- `npx tsc --noEmit`: lulus.
- `npm run build`: gagal sebelum `next build` karena `prisma generate` terkena `EPERM` saat rename `query_engine-windows.dll.node`; indikasi Prisma engine terkunci oleh proses/environment lokal.
- `npm run lint`: gagal karena script `lint` tidak tersedia di `package.json`.
