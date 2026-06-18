# SIAGA-SDA RBAC-A - Matriks Tugas, Hak Akses, Assignment Scope, dan Risiko Role

Tanggal: 18 Juni 2026  
Commit acuan: `cff1c97 docs: final gate migration surat tahap 5ib`  
Status tahap: dokumen konsep dan spesifikasi setelah 5I-B, belum implementasi runtime

## A. Ringkasan Tujuan RBAC-A

Tahap RBAC-A menyusun matriks tugas role, hak akses, assignment scope, risiko akses, konsep Tugas Saya, dan empty assignment untuk SIAGA-SDA.

Dokumen ini menjadi acuan sebelum perubahan runtime RBAC, permission, schema, migration, atau UI tugas dilakukan. Fokusnya adalah memastikan setiap role memiliki batas tugas, batas data, risiko, dan pengalaman pengguna yang jelas.

## B. Status Acuan

- Commit acuan: `cff1c97 docs: final gate migration surat tahap 5ib`.
- Tahap 5I-B sudah selesai.
- RBAC-UX-A dikerjakan setelah 5I-B sebagai tahap konsep sebelum migration.
- Belum migration.
- Belum mengubah Prisma schema.
- Belum mengubah database.
- Belum mengubah RBAC runtime.
- Schema Prisma asli tetap belum diubah.
- Belum mengubah role runtime.
- Belum mengaktifkan permission baru.
- Belum mengaktifkan `admin_surat`.
- Login final/locked tidak disentuh.
- Modal Dashboard 4D.2 tidak disentuh.
- Dashboard visual runtime tidak diubah.

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
- `docs/audit/SIAGA_SDA_TAHAP_5HA_APPLY_READY_DRAFT_SCHEMA.md`
- `docs/audit/SIAGA_SDA_TAHAP_5IB_FINAL_GATE_MIGRATION_SURAT.md`
- `docs/audit/SIAGA_SDA_ROLE_PERMISSION_MENU_TAHAP_3B.md`
- `docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/lib/navigation.ts`
- `src/store/useAppStore.ts`
- `src/types/index.ts`
- `prisma/schema.prisma` sebagai referensi baca saja

## D. Backup yang Dibuat

Backup dibuat di:

`backup/backup-rbac-ux-role-task-appreciation-before-change/`

Isi backup:

- `AGENTS.md`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/lib/navigation.ts`
- `docs/audit/SIAGA_SDA_TAHAP_5HA_APPLY_READY_DRAFT_SCHEMA.md`
- `docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md`
- `docs/audit/SIAGA_SDA_ROLE_PERMISSION_MENU_TAHAP_3B.md`

## E. File yang Dibuat/Diubah

Dibuat:

- `docs/audit/SIAGA_SDA_RBAC_A_MATRIKS_TUGAS_HAK_AKSES_ROLE.md`

Tidak ada source code runtime, Prisma schema, migration, Auth, middleware, RBAC runtime, role runtime, endpoint, login, atau Dashboard runtime yang diubah.

## F. Prinsip Akses

- User hanya melihat data sesuai assignment scope.
- Pimpinan dan auditor bersifat read-only sesuai izin.
- Admin dan super admin bisa memiliki cakupan lebih luas, tetapi semua aksi penting tetap harus tercatat.
- Kontraktor dan konsultan hanya melihat paket, dokumen, foto, laporan, dan approval yang ditugaskan.
- NIP ASN tidak boleh terbuka sembarangan kepada pihak eksternal.
- Data dummy, demo, simulasi, atau konseptual tidak boleh tampil sebagai data resmi.
- Jangan membuka semua data hanya karena user aktif tetapi belum punya tugas.
- Assignment kosong bukan error sistem dan bukan alasan menampilkan data role lain.
- Perubahan hak akses harus masuk Audit Log pada tahap implementasi.

## G. Struktur Fitur yang Disarankan

- `Dashboard > Tugas Saya`
- `Dashboard > Tugas Selesai`
- `Dashboard > Langkah Berikutnya`
- `Dashboard > Riwayat Apresiasi`
- `Pengaturan > Hak & Akses`
- `Pengaturan > Role & Permission Matrix`
- `Pengaturan > Assignment Scope`
- `Audit Log > Riwayat perubahan akses dan aksi`

## H. Penempatan Menu

- Tidak perlu menambah tab utama baru.
- Hak & Akses ditempatkan di Pengaturan.
- Role & Permission Matrix ditempatkan di Pengaturan.
- Assignment Scope ditempatkan di Pengaturan.
- Tugas Saya ditempatkan di Dashboard.
- Riwayat Tugas Selesai ditempatkan di Dashboard.
- Riwayat Apresiasi ditempatkan di Dashboard sebagai UX-friendly history.
- Riwayat formal perubahan akses dan aksi tetap berada di Audit Log.

## I. Matriks Role Aktif dan Alias Konsep

Catatan status aktual:

- Role frontend aktif saat dokumen ini dibuat masih mengikuti union role di `src/types/index.ts`.
- Beberapa role final blueprint masih berupa alias konsep dan belum boleh dianggap aktif runtime.
- `admin_sistem` dan `admin_bidang` pada tahap ini masih dipetakan konseptual ke cakupan `admin`.
- `kepala_bidang` dipetakan konseptual ke `kabid`.
- `tim_perencana_rutin` dipetakan konseptual ke `tim_perencanaan`.
- `tim_pengawas_rutin` dipetakan konseptual ke `tim_pengawasan`.

| Role | Fungsi utama | Tugas utama | Modul/menu yang boleh dilihat | Aksi yang boleh dilakukan | Scope data | Tugas selesai jika | Tugas berikutnya setelah selesai | Risiko jika tugas terlewat | Data identitas yang boleh ditampilkan | Catatan keamanan |
|---|---|---|---|---|---|---|---|---|---|---|
| `super_admin` | Pengelola tertinggi sistem | Menjaga konfigurasi, user, role, assignment, dan audit akses | Semua menu sesuai kebutuhan administrasi | Kelola user, assignment, konfigurasi, review audit, koreksi data dengan jejak audit | Global lintas tahun dan modul | Konfigurasi dan assignment valid serta tercatat | Review audit berkala dan backup | Salah konfigurasi membuka data lintas role | Nama, role, unit; NIP internal jika perlu administratif | Semua aksi wajib audit, gunakan least privilege walau akses luas |
| `admin` | Admin sistem/bidang sementara | Operasional sistem dan dukungan bidang | Dashboard, paket, survey, approval, surat persiapan, administrasi, pengaturan terbatas | Kelola data sesuai permission existing, bantu assignment, monitoring | Luas sesuai kebijakan admin aktif | Data operasional tersinkron dan assignment tidak kosong | Serahkan tindak lanjut ke role teknis | Admin terlalu luas bisa melewati scope | Nama, role, unit; NIP internal sesuai izin | Harus dipisahkan nanti menjadi admin sistem/admin bidang bila schema siap |
| `admin_sistem` | Konsep admin teknis sistem | Kelola user, konfigurasi, role, backup, parameter | Pengaturan, Audit Log, Dashboard teknis | Kelola akses sistem, bukan substansi pekerjaan | Global administratif | Hak akses dan konfigurasi valid | Monitoring perubahan akses | Campur tangan data teknis lapangan tanpa kebutuhan | Identitas internal sesuai izin admin sistem | Belum role runtime terpisah; jangan aktifkan tanpa tahap RBAC |
| `admin_bidang` | Konsep admin bidang SDA | Mengelola data bidang dan penugasan operasional | Dashboard, surat, survey, paket, approval, peil, asset sesuai scope bidang | Input/validasi data bidang, disposisi administratif, bantu tindak lanjut | Scope bidang/SDA | Data bidang siap ditindaklanjuti role teknis | Distribusi tugas ke Kabid/PPK/PPTK/tim | Semua tugas terkumpul di admin dan bottleneck | Nama, NIP, role, unit internal | Belum role runtime terpisah; jangan membuka semua data otomatis |
| `admin_sub_kegiatan` | Administrasi sub kegiatan/paket | Kelola administrasi kontrak, dokumen, pembayaran, arsip paket | Paket, Administrasi, Approval, Dashboard scoped, Audit Log jika izin | Upload/ubah dokumen administrasi, update status administrasi, siapkan berkas approval | Sub kegiatan/paket yang ditugaskan | Dokumen administrasi lengkap dan siap approval | PPK/PPTK/Approval review | Compatibility `ADMINISTRASI_KONTRAK` rusak jika role diubah sembarangan | Nama, NIP, role, sub kegiatan | Pertahankan compatibility database existing |
| `kabid` | Kepala Bidang operasional | Review prioritas, disposisi, monitoring risiko | Dashboard, surat, survey, paket, approval, peta, audit sesuai izin | Review, disposisi konseptual, memberi arahan, approval jika menjadi approver | Bidang dan assignment kewenangan | Arahan/tindak lanjut tercatat | PPK/PPTK/tim teknis melaksanakan | Tugas strategis tertunda dan risiko lapangan tidak ditangani | Nama, NIP, role, unit | Jangan beri aksi teknis tulis yang bukan kewenangan |
| `kepala_bidang` | Alias konsep Kabid | Sama dengan `kabid` | Sama dengan `kabid` | Sama dengan `kabid` | Sama dengan `kabid` | Keputusan bidang tercatat | Role pelaksana menerima tugas | Duplikasi role menyebabkan konflik hak akses | Nama, NIP, role, unit | Gunakan `kabid` runtime sampai role final siap |
| `pimpinan` | Pengambil keputusan read-only | Melihat ringkasan, risiko, approval, dan progres | Dashboard, Peta, Paket, Approval, Audit sesuai izin read-only | Membaca, memfilter, membuka detail; tidak mengubah data operasional | Luas sesuai kebijakan pimpinan, tetap read-only | Informasi prioritas terbaca dan keputusan eksternal dapat dibuat | Kabid/PPK menindaklanjuti | Tidak melihat risiko kritis tepat waktu | Nama, NIP, role, unit | Jangan tampilkan tombol tulis/approve jika tidak punya `canAct` |
| `ppk` | Penanggung jawab paket/kontrak | Mengelola paket, progres, administrasi, risiko, approval | Paket, Approval, Administrasi, Survey terkait, Dashboard, Audit scoped | Review, approve sesuai workflow, minta revisi, update status sesuai izin | Paket/sub kegiatan yang ditugaskan | Paket dan dokumen siap lanjut atau selesai | PPTK/Direksi/Konsultan/Kontraktor bergerak | Keputusan terlambat berdampak deviasi dan pembayaran | Nama, NIP, role, paket | Approval harus formal dan tidak dibuat dari GET/polling |
| `pptk` | Pengendali teknis kegiatan | Memastikan kegiatan berjalan dan dokumen teknis lengkap | Paket, Survey, Administrasi, Approval, Dashboard scoped | Update/review progres, dokumen, tindak lanjut teknis | Paket/sub kegiatan yang ditugaskan | Progress dan dokumen teknis tervalidasi | PPK atau Approval meninjau | Data lapangan tidak siap untuk keputusan | Nama, NIP, role, paket/sub kegiatan | Jangan melihat paket di luar assignment |
| `direksi_teknis` | Pengawas teknis paket fisik | Validasi pekerjaan lapangan, progres fisik, dokumentasi | Paket, Pengawasan, Foto, Masalah, Dashboard scoped | Review progres, catatan pengawasan, verifikasi teknis sesuai izin | Paket fisik yang ditugaskan | Catatan dan verifikasi lapangan lengkap | PPK/PPTK/Konsultan menindaklanjuti | Progres palsu atau deviasi tidak terdeteksi | Nama, NIP, role, paket | Direksi Teknis tidak boleh dihapus dari paket fisik |
| `pejabat_pengadaan` | Proses pengadaan | Menyiapkan/monitor proses pengadaan paket | Paket, Administrasi pengadaan, Dashboard scoped | Update tahap pengadaan sesuai izin, catatan dokumen | Paket pengadaan yang ditugaskan | Status pengadaan jelas dan dokumen lengkap | PPK/PPTK atau penyedia melanjutkan | Paket terlambat kontrak | Nama, NIP, role | Hindari akses dokumen paket yang bukan prosesnya |
| `pphp` | Pemeriksa hasil pekerjaan | Pemeriksaan hasil, serah terima, rekomendasi terima/tolak | Paket, Dokumen, Approval jika izin, Dashboard scoped | Review hasil, catatan pemeriksaan, rekomendasi | Paket yang ditugaskan | Hasil pemeriksaan tercatat | PPK memproses tindak lanjut | PHO/FHO tidak siap audit | Nama, NIP, role | Read/write hanya pada paket pemeriksaan |
| `tim_perencanaan` | Perencanaan rutin/survey teknis | Menyusun rencana, rekomendasi teknis, kebutuhan paket | Survey, Paket terkait, Dokumen perencanaan, Dashboard scoped | Input/review perencanaan sesuai izin | Survey/paket yang ditugaskan | Rekomendasi teknis lengkap | PPK/PPTK/Kabid review | Rencana tidak siap menjadi pekerjaan | Nama, NIP, role | Jangan tampilkan approval formal jika tidak punya akses |
| `tim_perencana_rutin` | Alias konsep tim perencanaan rutin | Sama dengan `tim_perencanaan` untuk paket rutin | Survey, Paket rutin, Dokumen perencanaan | Input/review rencana rutin | Rutin yang ditugaskan | Rencana rutin siap ditindaklanjuti | Pejabat pengadaan/PPK review | Paket rutin tidak siap | Nama, NIP, role | Gunakan `tim_perencanaan` runtime sampai role final siap |
| `tim_survey` | Pelaksana survey investigasi | Melakukan survey lapangan, foto, titik lokasi, rekomendasi | Survey, Peta, Paket terkait jika ada, Dashboard scoped | Buat/update survey, upload foto, submit rekomendasi | Survey/area/paket yang ditugaskan | Survey disubmit dengan bukti | Kabid/PPK/PPTK menindaklanjuti | Aduan/surat tidak punya dasar teknis | Nama, NIP, role | Tidak boleh melihat survey luar assignment |
| `tim_pengawasan` | Pengawasan rutin/lapangan | Mengawasi progres, masalah, foto, laporan | Paket, Pengawasan, Masalah, Foto, Dashboard scoped | Input laporan, update masalah, unggah bukti | Paket yang ditugaskan | Laporan pengawasan lengkap | PPK/PPTK/Direksi review | Masalah lapangan terlambat naik | Nama, NIP, role | Jangan beri akses administrasi kontrak luas |
| `tim_pengawas_rutin` | Alias konsep tim pengawasan rutin | Pengawasan paket rutin dan operasional terkait | Paket rutin, Asset/Operasional nanti, Laporan | Input laporan rutin sesuai scope | Rutin/asset yang ditugaskan | Laporan rutin lengkap | Mandor/PPK/PPTK menindaklanjuti | Operasional tidak termonitor | Nama, NIP, role | Gunakan `tim_pengawasan` runtime sampai role final siap |
| `konsultan_perencana` | Konsultan perencanaan | Menyusun dokumen/rencana teknis sesuai kontrak | Paket konsultan, Dokumen, Survey terkait, Dashboard scoped | Upload dokumen, revisi, komentar teknis sesuai izin | Paket konsultan yang ditugaskan | Dokumen perencanaan diterima/review | PPK/PPTK memberi approval/revisi | Dokumen perencanaan tidak siap tender/paket | Nama personel, perusahaan, posisi, role | Tidak melihat NIP ASN lain kecuali perlu resmi |
| `konsultan_pengawasan` | Konsultan pengawasan | Mengawasi pekerjaan fisik, laporan, foto, catatan teknis | Paket fisik terkait, Pengawasan, Foto, Dokumen | Upload laporan, foto, catatan, rekomendasi teknis | Paket yang ditugaskan | Laporan pengawasan diterima | PPK/PPTK/Direksi review | Deviasi fisik tidak tercatat | Nama personel, perusahaan, posisi, role | Tidak melihat paket konsultan/pengawas lain |
| `kontraktor` | Penyedia pekerjaan | Melaporkan progres, dokumen, foto, tindak lanjut revisi | Paket sendiri, Dokumen sendiri, Foto, Masalah terkait | Upload laporan/foto/dokumen, tanggapi revisi sesuai izin | Paket kontrak yang ditugaskan | Laporan/dokumen terkirim dan diterima | Pengawas/PPK/PPTK review | Kontraktor lain bisa melihat data kompetitif | Nama personel, perusahaan, posisi, paket | Tidak boleh melihat NIP ASN lain atau paket kontraktor lain |
| `auditor` | Pemeriksa read-only | Meninjau audit log, paket, dokumen, approval, histori | Audit Log, Dashboard, Paket, Approval sesuai izin | Membaca, filter, ekspor jika disediakan; tidak mengubah data | Scope audit yang diberikan | Bukti dan riwayat dapat ditelusuri | Catatan audit/rekomendasi di luar sistem atau modul khusus | Auditor tidak read-only dapat mengubah bukti | Nama, role audit; NIP jika ASN internal | Semua akses audit harus tercatat dan read-only |

## J. Role yang Belum Boleh Dipaksakan

Role berikut adalah role masa depan atau butuh tahap khusus. Tahap RBAC-A tidak mengaktifkan role ini, tidak mengubah schema, dan tidak mengubah RBAC runtime.

| Role masa depan | Status | Kebutuhan sebelum aktif | Risiko jika dipaksakan sekarang |
|---|---|---|---|
| `admin_surat` | Belum diaktifkan | Schema Surat, permission Surat, route/API Surat resmi, assignment surat | User bisa mengelola surat tanpa guard resmi |
| `admin_peil_banjir` | Belum diaktifkan | Model Peil, assignment Peil, permission Peil | Data peil bisa terbuka tanpa scope |
| `admin_asset` | Belum diaktifkan | Model Asset final, operasional SDA, permission Asset | Asset/operasional lintas lokasi bisa terbuka |
| `mandor_operasional_sda` | Belum diaktifkan | Model operasional, assignment asset/lokasi, master petugas | Mandor melihat operasi lokasi lain |
| `mandor_pintu_air` | Belum diaktifkan | Asset pintu air, histori operasi, assignment pintu air | Operasi pintu air tidak punya guard lokasi |
| `petugas_pintu_air` | Belum diaktifkan | Kebijakan final petugas biasa; blueprint menyatakan petugas biasa tidak wajib login | Membuat kewajiban login yang tidak sesuai keputusan |
| `mandor_rehabilitasi_drainase` | Belum diaktifkan | Model pekerjaan rutin/operasional drainase dan assignment | Laporan drainase lintas area terbuka |

Catatan konsep:

- Role ini boleh disiapkan dalam spesifikasi tugas masa depan.
- Jangan mengubah `src/lib/roles.ts`, `src/lib/rbac.ts`, enum Prisma, atau seed user untuk role ini pada tahap RBAC-A.
- Aktivasi harus melalui tahap RBAC runtime khusus, dengan audit dan migrasi jika diperlukan.

## K. Identitas User yang Ditampilkan

### ASN/Internal

Identitas yang boleh tampil sesuai izin:

- Nama lengkap.
- NIP.
- Role SIAGA-SDA.
- Unit/Bidang jika tersedia.

Aturan:

- User boleh melihat identitas dirinya sendiri.
- Admin bidang/admin sistem boleh melihat identitas sesuai izin.
- Auditor boleh melihat read-only sesuai mandat audit.
- NIP tidak ditampilkan ke pihak eksternal tanpa kebutuhan resmi.
- NIP tidak tampil pada area publik, balloon eksternal, atau halaman yang dapat diakses kontraktor/konsultan.

### Konsultan/Kontraktor/Pihak Eksternal

Identitas yang boleh tampil:

- Nama personel.
- Nama perusahaan.
- Posisi di perusahaan.
- Role/penugasan di SIAGA-SDA.

Aturan:

- Eksternal hanya melihat data paket/dokumen/foto yang ditugaskan.
- Eksternal tidak melihat NIP ASN lain kecuali ada kebutuhan formal yang disetujui.
- Identitas perusahaan tidak boleh digunakan sebagai pengganti assignment paket.

## L. Matriks Tugas per Workflow

| Workflow | Role pemilik tugas | Role pendukung | Trigger tugas muncul | Tugas selesai jika | Langkah berikutnya | Risiko jika terlewat | Apresiasi yang cocok |
|---|---|---|---|---|---|---|---|
| Surat Masuk & Keluar | Admin bidang, Kabid; `admin_surat` nanti | PPK, PPTK, Tim Survey, Admin Sub Kegiatan | Surat/usulan masuk, disposisi, tindak lanjut | Status surat jelas: ditindaklanjuti, selesai, arsip, atau ditolak | Survey/Paket/Peil/Approval/Audit Log | Surat hilang, aduan tidak diproses, tidak traceable | "Surat berhasil dipetakan ke tindak lanjut." |
| Survey Investigasi | Tim Survey, Tim Perencanaan | Kabid, PPK, PPTK | Surat/adukan/laporan lapangan butuh cek | Survey lengkap dengan foto, lokasi, rekomendasi, status | Review Kabid/PPK/PPTK, paket, approval, arsip | Keputusan tidak punya bukti teknis | "Survey berhasil dikirim untuk tindak lanjut." |
| Paket Pekerjaan | PPK, PPTK | Direksi Teknis, Admin Sub Kegiatan, Konsultan, Kontraktor, PPHP | Paket dibuat atau ditugaskan | Progres, dokumen, masalah, dan status paket lengkap | Approval, administrasi, laporan, audit | Deviasi tidak terdeteksi, pembayaran/dokumen tertunda | "Paket berhasil diperbarui dan siap direview." |
| Approval Center | Role approver sesuai `canAct` | Pemohon, PPK/PPTK/Kabid, Admin Sub Kegiatan | Item approval pending | Approved, revision requested, rejected, atau commented | Kembali ke tab asal dan update status | Approval tertunda, badge tidak konsisten | "Keputusan approval berhasil dicatat." |
| Administrasi | Admin Sub Kegiatan | PPK, PPTK, Pejabat Pengadaan, Kontraktor | Dokumen kontrak/pembayaran/jaminan perlu diproses | Dokumen lengkap, valid, dan siap approval/arsip | Approval, paket, laporan | Kontrak/pembayaran tidak siap audit | "Dokumen administrasi berhasil disiapkan." |
| Peil Banjir | Admin Peil nanti, Tim teknis | Kabid, PPK/PPTK, mandor/petugas nanti | Laporan banjir, pengukuran muka air, surat peil | Data peil tercatat dengan waktu/lokasi/status | Dashboard, peta, surat, audit | Peringatan air tidak terpantau | "Data peil berhasil dicatat." |
| Asset SDA | Admin Asset nanti, Tim Pengawasan | Mandor operasional nanti, PPK/PPTK | Asset dibuat/diinspeksi/dioperasikan | Kondisi, status, foto, dan histori operasi tercatat | Operasional, survey, paket rutin, audit | Asset kritis tidak tertangani | "Status asset berhasil diperbarui." |
| Audit Log | Auditor, Super Admin | Admin Sistem, Pimpinan read-only | Aksi penting terjadi | Log dapat dicari, difilter, dan ditelusuri | Temuan audit atau review akses | Perubahan akses/data tidak bisa dibuktikan | Balloon tidak menggantikan audit; cukup "Aksi tercatat." |
| Dashboard | Semua role sesuai izin | Semua modul sumber | Data scoped tersedia atau tugas baru masuk | Ringkasan dan Tugas Saya sesuai scope | Buka modul sumber dengan filter | User melewatkan prioritas | "Tugas prioritas berhasil diselesaikan." |

## M. Empty Assignment State

Kondisi:

- Admin sudah membuat user.
- User sudah login atau membuka akun.
- User belum memiliki tugas/assignment aktif.

Pesan wajib:

> "Selamat datang di SIAGA-SDA. Akun Anda sudah aktif, tetapi saat ini belum ada tugas yang diberikan kepada Anda. Tugas baru akan muncul di menu Tugas Saya setelah admin atau pejabat berwenang memberikan penugasan."

Untuk ASN/internal, tampilkan:

- Nama lengkap.
- NIP.
- Role.

Untuk eksternal, tampilkan:

- Nama personel.
- Perusahaan.
- Posisi.
- Role SIAGA-SDA.

Aturan:

- Empty assignment bukan error.
- Empty assignment bukan forbidden.
- Jangan tampilkan data di luar scope.
- Jangan tampilkan data dummy.
- Jangan menampilkan paket, surat, survey, asset, peil, approval, atau dokumen milik user lain.
- Beri arahan hubungi Admin Bidang, PPK, PPTK, Kabid, atau petugas berwenang sesuai konteks.
- Tampilkan status: `Belum Ada Tugas`.

## N. Risiko RBAC

| Risiko | Dampak | Mitigasi | Role terdampak | Tahap penyelesaian |
|---|---|---|---|---|
| User melihat data di luar scope | Kebocoran data dan temuan audit | Gunakan assignment scope di semua query, badge, dashboard, dan detail | Semua role terbatas | Tahap RBAC runtime |
| User aktif tetapi tidak punya tugas | Bingung atau mengira sistem rusak | Empty assignment state dan Tugas Saya kosong secara jujur | Semua role assignment-based | UX-A dan RBAC runtime |
| Role eksternal melihat NIP ASN | Kebocoran identitas internal | Masking NIP untuk eksternal dan filter identitas | Konsultan, kontraktor | UX identity policy |
| Kontraktor melihat paket kontraktor lain | Kebocoran data kontrak | Scope paket berdasarkan assignment penyedia | Kontraktor | RBAC runtime |
| Pimpinan tidak sengaja bisa edit | Data berubah tanpa otoritas | Read-only guard dan sembunyikan aksi tulis | Pimpinan | RBAC runtime |
| Auditor tidak read-only | Bukti audit bisa berubah | Read-only guard dan audit akses | Auditor | RBAC runtime |
| `admin_sub_kegiatan` terganggu compatibility `ADMINISTRASI_KONTRAK` | User existing kehilangan akses | Pertahankan mapper dan uji role compatibility | Admin Sub Kegiatan | Tahap schema/RBAC |
| Data dummy dianggap resmi | Keputusan berbasis data palsu | Badge Demo/Simulasi/Persiapan wajib | Semua role | UX/data source |
| Hak akses berubah tanpa Audit Log | Tidak ada bukti perubahan akses | Log perubahan role/assignment | Admin, Super Admin | Audit Log runtime |
| Tugas terlewat karena tidak ada notifikasi | SLA/tindak lanjut tertunda | Tugas Saya, badge, notifikasi scoped | Semua role operasional | UX-A dan notifikasi |
| Balloon sukses muncul padahal aksi gagal | User mengira data tersimpan | Balloon hanya setelah response sukses dan rollback pada error | Semua role | UX-A implementation |

## O. Rekomendasi Implementasi Nanti

- Implementasi RBAC runtime dilakukan pada tahap khusus setelah matriks ini disetujui.
- Implementasi UI Tugas Saya dilakukan pada tahap UX-A atau tahap dashboard khusus.
- Jangan mengubah database sebelum migration disetujui eksplisit.
- Jangan mengaktifkan role baru tanpa audit schema, session, mapper, seed, dan permission.
- Semua perubahan akses wajib masuk Audit Log.
- Semua agregat Dashboard harus mengikuti assignment scope.
- Semua tombol yang tampak clickable harus menuju route yang benar atau disabled dengan alasan jelas.
- Tugas selesai harus menghasilkan status yang bisa ditelusuri di modul asal, Dashboard, dan Audit Log.
- Riwayat apresiasi boleh UX-friendly, tetapi Audit Log tetap sumber formal.
