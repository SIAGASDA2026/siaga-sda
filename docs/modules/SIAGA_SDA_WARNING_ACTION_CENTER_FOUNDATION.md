# SIAGA-SDA Pusat Peringatan & Tindak Lanjut - Foundation

## 1. Ringkasan Eksekutif

Pusat Peringatan & Tindak Lanjut adalah sub-modul lintas sistem SIAGA-SDA untuk mengelola pengingat, kelalaian, keterlambatan, kesalahan, klarifikasi, perbaikan, eskalasi, bukti, dan riwayat tindak lanjut.

Modul ini tidak dibuat sebagai tab/menu utama baru karena menu utama SIAGA-SDA sudah final berjumlah 11:

1. Dashboard
2. Peta Monitoring
3. Survey Investigasi
4. Paket Pekerjaan
5. Approval Center
6. Surat Masuk & Keluar
7. Administrasi
8. Peil Banjir
9. Asset SDA
10. Audit Log
11. Pengaturan

Posisi modul ini adalah sub-modul lintas sistem yang diakses dari Dashboard/Warning Center, notification bell, Approval Center, detail Paket Pekerjaan, Surat Masuk & Keluar, Peil Banjir, Asset SDA, Audit Log, dan Halo SIAGA-SDA pada tahap lanjutan jika aman.

Batas tahap ini:

- dokumen-only;
- tidak mengubah runtime/source code;
- tidak membuat route/menu baru;
- tidak mengubah RBAC runtime;
- tidak membuat Prisma model, migration, API, atau database;
- tidak mengubah Dashboard, Halo, Login, Approval, Sidebar, atau MobileNav.

Kesimpulan: desain fondasi siap menjadi acuan tahap UI shell/entry point ringan, tetapi implementasi runtime harus menunggu tahap berikutnya yang eksplisit dan tetap tidak boleh membuat menu utama baru.

## 2. Definisi Modul

Pusat Peringatan & Tindak Lanjut adalah modul internal lintas sistem untuk membantu kontrol pekerjaan dan administrasi SDA.

Ruang lingkup konseptual:

- pengingat;
- kelalaian;
- keterlambatan;
- kesalahan input/proses;
- klarifikasi;
- perbaikan;
- teguran internal;
- draft surat teguran resmi;
- eskalasi;
- bukti;
- riwayat tindak lanjut.

Modul ini bukan modul hukuman otomatis. Sistem hanya mendeteksi, mengingatkan, menyiapkan bahan, mencatat klarifikasi, mencatat bukti, dan membantu eskalasi sesuai kewenangan.

## 3. Prinsip Bukan Aplikasi Teguran

SIAGA-SDA tetap aplikasi monitoring, analisis, gerak cepat, dan administrasi SDA. Pusat Peringatan & Tindak Lanjut memperkuat kontrol pekerjaan, bukan menjadi aplikasi pencari kesalahan.

Prinsip UI:

- gunakan istilah yang netral dan operasional;
- hindari label keras pada tampilan awal;
- pisahkan peringatan sistem dari keputusan formal;
- jangan menyatakan user bersalah;
- jangan menjadikan "Teguran" sebagai judul utama;
- draft surat hanya bahan bantu, bukan dokumen resmi.

Label yang direkomendasikan:

- Peringatan & Tindak Lanjut
- Butuh Tindak Lanjut
- Perlu Klarifikasi
- Risiko Keterlambatan
- Menunggu Perbaikan
- Perlu Verifikasi
- Dieskalasikan

Label yang perlu dihindari sebagai judul utama:

- Teguran
- Pelanggaran
- Hukuman
- Kesalahan User

## 4. Entry Point Lintas Sistem

| Entry point | Fungsi |
| --- | --- |
| Dashboard / Warning Center | Menampilkan ringkasan prioritas, paket kritis, approval pending, masalah open, dan risiko yang perlu ditindaklanjuti. Route aktual Dashboard memiliki tab `warning` konseptual dan link ke `/proyek`, `/approval`, dan `/masalah`. |
| Notification bell / Topbar | Menampilkan notifikasi scoped seperti approval pending, masalah kritis, paket kritis, dan deviasi warning. Topbar aktual sudah mengarah ke `/approval`, `/masalah`, dan `/proyek` dengan query sumber. |
| Approval Center | Menjadi entry point untuk approval melewati SLA, revisi yang belum dijawab, dan item formal yang perlu keputusan. |
| Detail Paket Pekerjaan | Menjadi entry point untuk deviasi, jadwal terlambat, masalah open, dokumen kurang, laporan belum masuk, dan bukti tindak lanjut. Route aktual paket adalah `/proyek` dan detail `/proyek/[id]`. |
| Detail Surat Masuk & Keluar | Menjadi entry point untuk surat belum dibaca, belum didisposisi, belum ditindaklanjuti, perlu survey, perlu paket, perlu peil, perlu approval, atau perlu arsip. Route aktual `/surat` masih peta workflow tanpa database resmi. |
| Detail Peil Banjir | Menjadi entry point untuk permohonan Peil yang belum verifikasi administrasi, belum survey, belum review teknis, atau belum approval. Route aktual `/peil` masih shell/persiapan. |
| Detail Asset SDA | Menjadi entry point untuk asset kritis, status operasi tidak normal, laporan operasi belum masuk, atau kebutuhan perbaikan asset. Route aktual `/asset` masih shell/persiapan. |
| Audit Log | Menjadi entry point pemeriksaan riwayat status, klarifikasi, eskalasi, bukti, dan siapa melakukan aksi. |
| Halo SIAGA-SDA tahap lanjutan | Dapat menjelaskan risiko, menyarankan tindak lanjut, dan membantu draft klarifikasi/draft surat. Halo tetap mode panduan lokal dan tidak boleh membuka data lintas assignment. |

Tidak ada entry point yang berbentuk menu utama baru.

## 5. Jenis Peringatan

Klasifikasi awal Pusat Peringatan & Tindak Lanjut:

| Jenis | Modul sumber | Contoh trigger konseptual |
| --- | --- | --- |
| Keterlambatan paket pekerjaan | Paket Pekerjaan | Tanggal selesai mendekat/terlewati, progress fisik rendah, jadwal tidak terisi. |
| Deviasi fisik/keuangan | Paket Pekerjaan, Dashboard | Progress fisik tertinggal, deviasi negatif besar, health `warning` atau `kritis`. |
| Dokumen administrasi belum lengkap | Administrasi, Paket | Kontrak, RAB, laporan, PHO/FHO, pembayaran, atau dokumen wajib belum tersedia. |
| Approval melewati SLA | Approval Center | Item pending terlalu lama, revisi tidak dijawab, approver belum bertindak. |
| Surat masuk belum ditindaklanjuti | Surat Masuk & Keluar | Surat belum dibaca, belum disposisi, belum masuk Survey/Paket/Peil/Approval/Arsip. |
| Hasil survey belum diproses | Survey Investigasi | Survey submitted belum direview atau belum ditindaklanjuti. |
| Peil Banjir belum cek teknis | Peil Banjir | Persyaratan belum diverifikasi, survey belum dilakukan, review hidrologi/hidrolika belum selesai. |
| Asset SDA kondisi kritis | Asset SDA | Kondisi asset kritis, operasi tidak normal, laporan asset belum ada. |
| Dokumentasi lapangan kurang | Paket, Survey, Asset | Foto, GPS, catatan, atau bukti pekerjaan belum lengkap. |
| Klarifikasi belum dijawab | Semua modul terkait | User/role terkait belum memberi jawaban dalam batas waktu. |
| Tindak lanjut melewati batas waktu | Semua modul terkait | Status tetap menunggu setelah due date. |
| Koreksi data / data tidak sinkron | Dashboard, Paket, Approval, Halo | Angka atau status berbeda antar modul, sumber data belum jelas. |

## 6. Status Tindak Lanjut

Status konseptual:

| Status | Makna |
| --- | --- |
| Baru | Peringatan baru dibuat oleh sistem/rule/entry point. |
| Dibaca | User terkait sudah membuka peringatan. |
| Perlu Klarifikasi | Diperlukan jawaban atau penjelasan dari pihak terkait. |
| Menunggu Tindak Lanjut | Pihak terkait harus melakukan aksi lanjutan. |
| Dalam Perbaikan | Aksi koreksi/perbaikan sedang berjalan. |
| Menunggu Verifikasi | Tindak lanjut sudah dikirim dan menunggu pemeriksaan role berwenang. |
| Selesai | Tindak lanjut disetujui selesai. |
| Dieskalasikan | Kasus dinaikkan ke role/pejabat berwenang. |
| Ditutup | Kasus ditutup dengan catatan akhir dan audit trail. |

## 7. Tingkat Risiko

Level risiko konseptual:

| Level | Fungsi |
| --- | --- |
| Info | Informasi atau pengingat ringan. |
| Rendah | Perlu dipantau, belum menghambat workflow utama. |
| Sedang | Perlu tindak lanjut agar tidak menjadi hambatan. |
| Tinggi | Berpotensi mengganggu jadwal, approval, atau layanan. |
| Kritis | Membutuhkan perhatian cepat dari role berwenang. |

Level risiko bukan hukuman. Level ini hanya prioritas penanganan dan urutan kerja.

## 8. Alur Kerja Konseptual

Alur konseptual:

1. Sistem mendeteksi potensi masalah dari modul sumber.
2. Notifikasi/peringatan dibuat sebagai kasus tindak lanjut.
3. User terkait menerima atau melihat peringatan sesuai role dan assignment.
4. User membaca peringatan.
5. User memberi klarifikasi, bukti, atau tindak lanjut.
6. Atasan atau role berwenang memverifikasi.
7. Jika diperlukan, sistem menyiapkan bahan atau draft surat klarifikasi/teguran.
8. Draft direview pejabat berwenang sebelum menjadi dokumen resmi.
9. Jika tindak lanjut diterima, status menjadi Selesai atau Ditutup.
10. Semua perubahan status, komentar, bukti, dan eskalasi tercatat di Audit Log.

## 9. Kewenangan Teguran dan Eskalasi

Sistem tidak otomatis menerbitkan teguran resmi.

Kewenangan konseptual:

| Objek | Pejabat/role berwenang |
| --- | --- |
| Internal ASN/staf | Atasan langsung/Kabid sesuai struktur. |
| Penyedia/kontrak | PPK atau Pejabat Penandatangan Kontrak sesuai dokumen kontrak. |
| Pejabat struktural | Pimpinan/PA/KPA sesuai kewenangan organisasi. |
| Pemeriksaan khusus | APIP/Inspektorat bila masuk ranah pemeriksaan. |

Draft surat hanya bahan bantu. Surat resmi tetap membutuhkan review, nomor, tanda tangan, dan prosedur administrasi yang sah.

## 10. Struktur Data Konseptual

Tahap ini tidak membuat Prisma model.

Field konseptual:

- `id` peringatan;
- `kodeReferensi`;
- `jenisPeringatan`;
- `sumberModul`;
- `sumberData`;
- `objekTerkait`;
- `roleTerkait`;
- `userTerkait`;
- `assignmentScope`;
- `tingkatRisiko`;
- `statusTindakLanjut`;
- `batasWaktu`;
- `deskripsi`;
- `rekomendasiTindakan`;
- `buktiPendukung`;
- `klarifikasi`;
- `riwayatKomentar`;
- `riwayatStatus`;
- `draftSurat`;
- `statusData`: demo/persiapan/resmi;
- `auditTrail`.

Catatan implementasi lanjutan:

- field polymorphic seperti `sumberModul`, `sumberData`, dan `objekTerkait` wajib dijaga dengan server-side guard;
- data konseptual tidak boleh dihitung sebagai data resmi Dashboard;
- bukti dan draft surat harus membedakan status "draft" dan "resmi".

## 11. Relasi Dengan Tab Utama

| Tab utama | Relasi Peringatan & Tindak Lanjut |
| --- | --- |
| Dashboard | Ringkasan peringatan, prioritas hari ini, warning aktif, dan shortcut ke modul sumber. |
| Peta Monitoring | Warning berbasis lokasi: paket, survey, asset, peil, dan pasang surut. |
| Survey Investigasi | Survey belum diproses, rekomendasi belum ditindaklanjuti, klarifikasi survey. |
| Paket Pekerjaan | Deviasi, keterlambatan, laporan kurang, dokumen kurang, masalah open, bukti tindak lanjut. |
| Approval Center | Approval pending, minta revisi, penolakan, komentar, SLA approval. |
| Surat Masuk & Keluar | Surat belum dibaca, disposisi pending, tindak lanjut surat, draft surat resmi. |
| Administrasi | Kontrak, pembayaran, SPM, jaminan, dokumen administrasi kurang lengkap. |
| Peil Banjir | Verifikasi administrasi, survey teknis, review hidrologi/hidrolika, approval rekomendasi. |
| Asset SDA | Asset kritis, operasi tidak normal, laporan mandor, perbaikan asset. |
| Audit Log | Riwayat status, komentar, bukti, eskalasi, dan penutupan kasus. |
| Pengaturan | Master SLA, kategori peringatan, template draft, permission, dan parameter sistem pada tahap lanjutan. |

## 12. Role dan Akses

Matriks konseptual. Tidak ada role runtime baru yang diaktifkan pada tahap ini.

| Role | Lihat peringatan | Klarifikasi | Tindak lanjut | Verifikasi | Eskalasi | Lihat draft surat | Buat/ubah draft | Tutup peringatan | Catatan pembatasan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `super_admin` | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Akses teknis penuh, tetap perlu audit log. |
| `admin` / admin_sistem / admin_bidang | Ya | Ya | Ya | Terbatas | Terbatas | Ya | Terbatas | Terbatas | Mengikuti scope bidang/operasional yang disetujui. |
| `admin_sub_kegiatan` | Ya sesuai sub kegiatan | Ya | Ya | Terbatas | Ke PPK/Kabid | Ya jika terkait paket | Draft administratif terbatas | Terbatas | Tidak boleh global lintas sub kegiatan. |
| `kabid` / kepala_bidang | Ya sesuai bidang | Ya | Arahan | Ya | Ke pimpinan | Ya | Review/arah kebijakan | Ya | Bukan pengganti PPK untuk kontrak. |
| `pimpinan` | Ya read-only luas | Catatan arahan | Arahan | Ya read-only/keputusan strategis | Ya | Ya | Review bila berwenang | Terbatas | Tidak menjadi aktor teknis harian. |
| `ppk` | Ya sesuai paket | Ya | Ya | Ya | Ke Kabid/Pimpinan | Ya | Ya untuk kontrak/penyedia | Ya | Kunci untuk penyedia/kontrak. |
| `pptk` | Ya sesuai paket | Ya | Ya | Ya awal | Ke PPK | Ya jika terkait | Draft teknis terbatas | Terbatas | Pemeriksaan teknis awal. |
| `direksi_teknis` | Ya sesuai paket | Ya | Ya teknis | Verifikasi teknis | Ke PPTK/PPK | Terbatas | Tidak default | Terbatas | Tidak mengeluarkan teguran resmi. |
| `pejabat_pengadaan` | Ya sesuai pengadaan | Ya | Ya pengadaan | Terbatas | Ke PPK | Terbatas | Terbatas | Terbatas | Hanya proses pengadaan yang relevan. |
| `pphp` | Ya sesuai pemeriksaan | Ya | Ya pemeriksaan | Ya pemeriksaan | Ke PPK | Terbatas | Tidak default | Terbatas | Fokus PHO/FHO/pemeriksaan hasil. |
| `tim_perencanaan` | Ya sesuai assignment | Ya | Ya perencanaan | Tidak default | Ke PPTK/PPK | Tidak default | Tidak | Tidak | Tidak melihat kasus sensitif lintas assignment. |
| `tim_survey` | Ya sesuai survey | Ya | Ya survey | Tidak default | Ke PPTK/PPK | Tidak default | Tidak | Tidak | Fokus bukti lapangan/survey. |
| `tim_pengawasan` | Ya sesuai assignment | Ya | Ya pengawasan | Verifikasi teknis terbatas | Ke Direksi/PPTK | Terbatas | Tidak default | Terbatas | Tidak menutup kasus formal sendiri. |
| `konsultan_perencana` | Ya sesuai kontrak | Ya | Ya perencanaan | Tidak default | Ke PPK/PPTK | Tidak default | Tidak | Tidak | Eksternal, hanya paket terkait. |
| `konsultan_pengawasan` | Ya sesuai kontrak | Ya | Ya pengawasan | Terbatas | Ke Direksi/PPTK/PPK | Tidak default | Tidak | Tidak | Eksternal, hanya paket terkait. |
| `kontraktor` | Ya hanya paketnya | Ya | Ya untuk kewajiban penyedia | Tidak | Ke PPK/PPTK via klarifikasi | Dapat melihat draft terkait dirinya bila dibuka resmi | Tidak | Tidak | Tidak boleh lihat peringatan penyedia lain. |
| `auditor` | Ya read-only sesuai audit scope | Catatan audit bila fitur tersedia | Tidak | Tidak | Rekomendasi audit | Ya read-only | Tidak | Tidak | Tidak ada aksi tulis. |

## 13. Permission Kandidat

Tidak diimplementasikan pada tahap ini.

| Permission kandidat | Rekomendasi tahap awal | Catatan |
| --- | --- | --- |
| `view_warning_center` | Cocok untuk tahap awal | Baca ringkasan warning sesuai role. |
| `view_warning_own_scope` | Cocok untuk tahap awal | Baca warning hanya sesuai assignment. |
| `manage_warning_followup` | Cocok setelah UI tindak lanjut ada | Untuk klarifikasi dan tindak lanjut. |
| `verify_warning_followup` | Tahap menengah | Untuk PPTK/PPK/Kabid sesuai workflow. |
| `escalate_warning` | Tahap menengah | Perlu audit trail kuat. |
| `create_warning_draft_letter` | Ditunda | Risiko dokumen dianggap resmi. |
| `approve_warning_draft_letter` | Ditunda | Perlu workflow surat/pejabat berwenang. |
| `close_warning_case` | Tahap menengah | Harus dibatasi role berwenang. |
| `view_warning_audit_history` | Cocok untuk tahap awal read-only | Auditor/pimpinan bisa dipertimbangkan sesuai scope. |

Permission awal yang paling aman untuk dirancang dulu:

- `view_warning_center`;
- `view_warning_own_scope`;
- `manage_warning_followup`;
- `view_warning_audit_history`.

Permission yang harus ditunda:

- `create_warning_draft_letter`;
- `approve_warning_draft_letter`;
- `close_warning_case` jika belum ada server-side guard.

## 14. Rekomendasi UI/UX

Konsep tampilan tanpa implementasi:

- card ringkasan di Dashboard: "Peringatan & Tindak Lanjut";
- badge kecil di notification bell;
- modal/detail dari objek terkait, bukan halaman utama baru;
- panel di detail Paket untuk deviasi, masalah, dokumen, dan bukti;
- panel di Surat untuk disposisi/tindak lanjut;
- panel di Peil untuk verifikasi, survey, review, dan approval;
- panel di Asset untuk kondisi kritis dan operasi;
- filter status/risiko/modul pada UI internal bila detail case diperlukan;
- timeline tindak lanjut;
- area bukti dan klarifikasi;
- tombol draft surat hanya untuk role berwenang dan harus berlabel "Draft".

Aturan UI:

- jangan buat menu utama;
- jangan buat sidebar item baru;
- jangan memakai istilah "Teguran" sebagai judul utama;
- istilah utama: "Peringatan & Tindak Lanjut";
- data demo/persiapan wajib diberi label;
- setiap elemen clickable harus kembali ke modul sumber yang benar.

## 15. Integrasi Dengan Halo SIAGA-SDA

Integrasi Halo adalah tahap lanjutan, bukan tahap ini.

Halo boleh:

- menjelaskan arti risiko;
- menyarankan tindak lanjut;
- membantu menyusun draf klarifikasi;
- membantu menyusun bahan draft surat;
- membedakan tugas pribadi, peringatan sistem, dan monitoring paket.

Halo tidak boleh:

- menyatakan user bersalah;
- membuka data lintas assignment;
- membuat keputusan formal;
- menerbitkan teguran resmi;
- mengubah data warning;
- mengirim notifikasi resmi tanpa backend/audit;
- mengalahkan RBAC atau guard modul sumber.

Halo tetap mengikuti final lock: mode panduan lokal, belum membaca misi resmi, dan belum melakukan perubahan data.

## 16. Risiko Teknis

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Data dummy dianggap resmi | Pimpinan/user salah membaca status | Semua data demo/persiapan diberi label tegas. |
| Peringatan muncul lintas assignment | Kebocoran informasi sensitif | Server-side guard dan scope wajib pada implementasi. |
| Role tidak berwenang melihat kasus sensitif | Risiko reputasi dan audit | Permission dan assignment scope harus diuji per role. |
| Sistem dianggap otomatis menegur | Salah persepsi fungsi aplikasi | UI memakai istilah netral dan draft tidak dianggap resmi. |
| Draft surat dianggap surat resmi | Risiko administrasi | Label "Draft", perlu review pejabat, dan tidak punya nomor resmi otomatis. |
| Peringatan dobel dari beberapa modul | Noise dan kebingungan | Dedup berdasarkan sumber modul, objek terkait, jenis, dan periode. |
| Status paket tidak sinkron dengan Halo/Dashboard | Pengambilan keputusan salah | DATA-CONSISTENCY.1 perlu sinkronisasi status lintas modul. |
| Client-side hiding tidak cukup aman | User bisa bypass UI | API/server guard wajib pada tahap implementasi. |
| Audit log tidak lengkap | Sulit ditelusuri | Semua perubahan status, komentar, bukti, dan eskalasi wajib audit. |
| Role konseptual dipaksakan terlalu cepat | Lockout atau akses salah | Role baru dibahas saja, belum diaktifkan runtime. |

## 17. Rekomendasi Tahap Berikutnya

Tahap kecil yang disarankan:

1. `WARNING-ACTION.2`: Permission dan route internal konseptual/dokumen.
2. `WARNING-ACTION.3`: UI shell Dashboard card + notification badge tanpa database.
3. `WARNING-ACTION.4`: Detail modal tindak lanjut dari Paket Pekerjaan.
4. `WARNING-ACTION.5`: Integrasi Audit Log.
5. `WARNING-ACTION.6`: Integrasi Halo secara terbatas.
6. `DATA-CONSISTENCY.1`: Sinkronisasi status Paket, Dashboard, dan Halo.
7. `GLOBAL-TAB-AUDIT.1`: Audit mendalam semua tab.

Catatan: jika tahap UI dimulai, tetap jangan membuat menu/sidebar item baru.

## 18. Checklist Validasi Dokumen

| Checklist | Status |
| --- | --- |
| Tidak ada source code berubah | Ya, tahap ini dokumen-only. |
| Tidak ada Prisma/migration berubah | Ya. |
| Tidak ada package/dependency berubah | Ya. |
| Tidak ada login runtime berubah | Ya. |
| Tidak ada dashboard/modal 4D.2 runtime berubah | Ya. |
| Tidak ada Halo runtime berubah | Ya. |
| Tidak ada menu utama baru | Ya. |
| Tidak ada role baru dipaksakan | Ya. |
| Dokumen baru tersimpan benar | `docs/modules/SIAGA_SDA_WARNING_ACTION_CENTER_FOUNDATION.md` |
| Konsisten dengan konsep SIAGA-SDA dan 11 menu utama | Ya. |

## 19. Audit Source Aktual yang Menjadi Acuan

Source hanya dibaca untuk mapping. Tidak ada source yang diubah.

Temuan ringkas:

- `src/lib/navigation.ts` sudah memakai 11 menu utama final. Tidak ada item utama untuk Pusat Peringatan.
- `src/lib/rbac.ts` belum memiliki permission warning granular.
- `src/app/(dashboard)/dashboard/page.tsx` sudah memiliki tab konseptual `warning` dan komponen `WarningCenterTab`.
- `src/components/layout/Topbar.tsx` sudah menghitung notifikasi approval, masalah, paket kritis, dan deviasi secara scoped.
- `src/components/layout/Sidebar.tsx` dan `src/components/layout/MobileNav.tsx` memakai `canAccessPage()` dan tidak perlu menu warning baru.
- `src/app/(dashboard)/proyek/page.tsx` adalah route Paket Pekerjaan aktual.
- `src/app/(dashboard)/approval/page.tsx` memakai approval formal dan detail modal.
- `src/app/(dashboard)/surat/page.tsx`, `src/app/(dashboard)/peil/page.tsx`, dan `src/app/(dashboard)/asset/page.tsx` masih berupa modul persiapan/shell konseptual.
- `src/app/(dashboard)/audit-log/page.tsx` sudah menjadi tempat baca audit dengan guard `view_audit_log`.
- `src/components/ai/ProjectAiAssistant.tsx` sudah menyebut konsep deviasi dan draft surat teguran, tetapi Halo tetap final lock dan tidak diubah.

## 20. Hal yang Tidak Disentuh

- `src/**`
- `prisma/**`
- `package.json`
- lockfile package
- middleware
- Auth/NextAuth
- RBAC runtime
- database/migration/seed
- Login final
- Dashboard final/modal 4D.2
- Halo SIAGA-SDA final lock
- Approval runtime
- API Approval/Bootstrap/Sync
- Sidebar/MobileNav
- route utama/menu utama

