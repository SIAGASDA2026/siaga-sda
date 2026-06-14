# SIAGA-SDA Dashboard Command Center - Tahap 4B

## Informasi Dokumen

- Tanggal: 15 Juni 2026
- Sifat tahap: konsep visual dan mapping informasi, tanpa implementasi source code
- Dashboard aktif: `/dashboard`
- File dashboard aktif: `src/app/(dashboard)/dashboard/page.tsx`
- Audit acuan: `docs/audit/SIAGA_SDA_DASHBOARD_VISUAL_AUDIT_TAHAP_4A.md`
- Commit login final acuan: `ebfd77c finalisasi halaman login siaga sda`
- Referensi visual: `docs/assets/1. Dashboard web.png` dan `docs/assets/1. Dashboard mobile.png`

## 1. Ringkasan Tujuan

Dashboard SIAGA-SDA diarahkan menjadi **Command Center SDA** yang ringkas untuk pengambilan keputusan cepat. Dashboard bukan tempat menampilkan seluruh detail setiap modul.

Dashboard harus membantu user menjawab pertanyaan berikut dalam beberapa detik:

1. Apa yang paling perlu diperhatikan hari ini?
2. Paket mana yang kritis atau mengalami deviasi?
3. Approval apa yang menunggu tindakan user?
4. Bagaimana progres fisik dibandingkan progres keuangan?
5. Apa tugas berikutnya sesuai role dan assignment aktif?
6. Ke modul mana user harus masuk untuk menindaklanjuti informasi?

Prinsip utama:

- desktop mengutamakan ringkasan prioritas yang diusahakan muat dalam satu viewport;
- detail tetap tersedia melalui drill-down, tab detail, atau modul asal;
- mobile boleh scroll vertikal dan menyusun ulang prioritas;
- seluruh angka/card yang memiliki sumber data harus clickable;
- seluruh data harus mengikuti role dan assignment;
- data resmi, demo, simulasi, dan insight lokal harus dibedakan secara tegas;
- peta interaktif besar tetap berada di Peta Monitoring.

## 2. Prinsip Layout Desktop

### 2.1 Struktur Prioritas

| Tingkat | Area | Tujuan |
|---|---|---|
| P0 | Alert kritis dan approval yang memerlukan tindakan | Memicu tindakan segera |
| P1 | KPI utama dan progres | Memberikan gambaran kondisi saat ini |
| P2 | Command Brief dan Quick Action | Mengarahkan pekerjaan user |
| P3 | Aktivitas terbaru dan shortcut modul | Memberi konteks dan akses lanjutan |
| P4 | Rekap lengkap per modul | Dipindahkan ke drill-down/modul asal |

### 2.2 Header Compact

Header compact menampilkan:

- judul `Dashboard Command Center`;
- role aktif dan label role final;
- scope assignment aktif, misalnya jumlah paket/sub kegiatan yang dapat dilihat;
- tahun anggaran/filter utama;
- badge sumber data;
- waktu pembaruan terakhir;
- tombol filter lanjutan yang collapsible;
- notifikasi yang sudah scoped.

Header tidak boleh menampilkan uraian role yang panjang secara default. Detail role dan permission dapat dibuka melalui disclosure/tooltip.

### 2.3 KPI Prioritas

KPI desktop disusun dalam grid ringkas. Maksimal enam KPI utama tampil sekaligus:

1. Total Paket Aktif
2. Progres Fisik
3. Progres Keuangan
4. Deviasi/Risiko
5. Approval Menunggu
6. Survey Belum Ditindaklanjuti

Aturan KPI:

- nilai menggunakan data scoped;
- label ringkas dan mudah dipindai;
- status warna konsisten;
- tren/perbandingan hanya ditampilkan jika sumber datanya valid;
- setiap KPI clickable menuju modul asal dengan filter aktif;
- KPI yang tidak relevan untuk role disembunyikan atau diganti dengan KPI role-specific.

### 2.4 Panel Command Brief

Panel Command Brief adalah daftar prioritas singkat, bukan pengulangan seluruh KPI.

Isi maksimal:

- tiga pekerjaan prioritas hari ini;
- tiga paket bermasalah/kritis;
- approval yang perlu tindakan user;
- warning data jika sumber masih demo/simulasi;
- SLA atau tenggat terdekat jika tersedia.

Setiap item wajib memiliki:

- label sumber;
- status/tingkat prioritas;
- waktu/tenggat;
- tujuan klik yang jelas;
- scope yang sudah tervalidasi.

### 2.5 Panel Progres

Panel progres menampilkan:

- progres fisik vs progres keuangan;
- deviasi;
- target vs realisasi jika tersedia;
- ringkasan paket Fisik, Konsultan, dan Rutin;
- status kesehatan paket.

Visual yang disarankan:

- satu chart utama fisik vs keuangan;
- tiga mini-summary untuk Fisik/Konsultan/Rutin;
- tidak menampilkan lebih dari satu chart besar dalam viewport utama;
- detail per sub kegiatan dibuka melalui drill-down ke Paket Pekerjaan.

### 2.6 Panel Risiko dan Approval

Panel ini menggabungkan informasi yang saat ini tersebar pada `Approval & Risiko` dan `Warning Center`.

Isi:

- paket kritis;
- approval tertunda;
- masalah lapangan open;
- warning SDA aktif yang datanya resmi;
- tombol menuju Approval Center atau modul asal.

Panel harus membedakan:

- perlu tindakan user;
- perlu perhatian;
- hanya informasi.

### 2.7 Panel Aktivitas Singkat

Aktivitas terbaru menampilkan maksimal lima item yang sudah scoped.

Aturan:

- role terbatas hanya melihat aktivitas assignment-nya;
- pimpinan/auditor mengikuti kebijakan read-only dan scope yang disetujui;
- aktivitas yang tidak memiliki relasi scope yang dapat dibuktikan tidak ditampilkan;
- item clickable hanya jika user berhak membuka sumbernya;
- detail lengkap diarahkan ke Audit Log.

### 2.8 Quick Action Role-Aware

Quick Action menampilkan maksimal empat aksi utama sesuai role dan permission.

Aturan:

- hanya menampilkan aksi yang dapat dilakukan user;
- aksi baca dan aksi tulis dibedakan;
- jangan menampilkan tombol input kepada role read-only;
- badge menggunakan data scoped;
- jika role belum mempunyai mapping final, gunakan permission existing secara konservatif.

### 2.9 Shortcut Peta Monitoring

Dashboard tidak menampilkan peta interaktif besar.

Shortcut Peta Monitoring berupa card ringkas yang memuat:

- jumlah lokasi/marker yang dapat diakses;
- jumlah warning lokasi jika sumber resmi tersedia;
- label cakupan wilayah;
- tombol `Buka Peta Monitoring`;
- tujuan `/peta` dengan filter scope yang sesuai.

Preview gambar statis atau ilustrasi ringan boleh digunakan, tetapi tidak boleh dianggap sebagai peta realtime.

## 3. Prinsip Layout Mobile

Mobile menggunakan satu kolom dan boleh scroll vertikal.

Urutan prioritas:

1. Status role dan scope.
2. Alert/approval yang perlu tindakan.
3. KPI prioritas dalam grid dua kolom atau carousel yang aksesibel.
4. Quick Action role-aware.
5. Progres ringkas.
6. Aktivitas terbaru.
7. Shortcut ke modul.
8. Rekap tambahan dalam accordion.

Aturan mobile:

- tidak memaksa seluruh dashboard masuk satu layar;
- tidak menggunakan tabel lebar untuk ringkasan utama;
- filter aktif tampil sebagai chip;
- detail dibuka melalui accordion, drawer, atau modul asal;
- CTA utama mudah disentuh;
- tidak ada overflow horizontal;
- bottom navigation tetap aman;
- informasi sekunder tidak boleh mengalahkan alert prioritas.

## 4. Mapping Tab Dashboard Lama

Source code belum diubah. Mapping berikut adalah rekomendasi konseptual untuk tahap implementasi berikutnya.

| Tab lama | Rekomendasi | Penempatan konseptual | Catatan |
|---|---|---|---|
| Ringkasan | Tetap | Landing Command Center | Menjadi tampilan utama desktop/mobile |
| Monitoring | Gabung/ringkas | Panel Progres + shortcut Peta | Detail monitoring tetap di `/peta` dan `/proyek` |
| Survey | Jadikan shortcut/rekap ringkas | KPI + shortcut `/survey` | Jangan menduplikasi modul Survey |
| Paket | Jadikan drill-down | Panel Progres + `/proyek` | Rekap Fisik/Konsultan/Rutin tetap penting |
| Approval & Risiko | Gabung | Panel Risiko dan Approval | Menjadi salah satu panel prioritas |
| Surat | Jadikan shortcut/rekap ringkas | Shortcut `/surat` | Hanya tampil jika data resmi tersedia |
| Peil Banjir | Jadikan shortcut/rekap ringkas | Shortcut `/peil` | Jangan diarahkan sementara ke Peta jika route Peil tersedia |
| Asset SDA | Jadikan shortcut/rekap ringkas | Shortcut `/asset` | Ringkasan kondisi asset bila data resmi tersedia |
| Operasional | Turunkan prioritas | Subfitur Asset SDA | Belum layak menjadi panel utama sampai route/sub-tab final tersedia |
| Pasang Surut | Turunkan prioritas bersyarat | Warning SDA/shortcut Peta | Saat ini simulasi; wajib badge simulasi |
| Warning Center | Gabung | Panel Risiko dan Approval | Hindari duplikasi alert |
| Waktu & Salat | Turunkan prioritas | Utility opsional | Bukan informasi keputusan utama dashboard |
| Aktivitas | Tetap ringkas | Panel Aktivitas Singkat | Detail lengkap ke Audit Log |
| AI Analisis | Turunkan prioritas/lock | Insight lokal terpisah | Belum layak sebagai analisis resmi/auditable |

### Tab yang Disarankan Tetap Terlihat

- Ringkasan
- Risiko & Approval
- Aktivitas

### Tab yang Disarankan Menjadi Drill-down atau Shortcut

- Monitoring
- Survey
- Paket
- Surat
- Peil Banjir
- Asset SDA
- Operasional
- Pasang Surut

### Tab yang Disarankan Digabung

- Approval & Risiko + Warning Center
- Monitoring + ringkasan Paket pada Panel Progres

### Tab yang Belum Layak Menjadi Informasi Resmi

- Pasang Surut, selama sumber masih simulasi
- AI Analisis, selama masih rule-based lokal
- panel Surat/Peil/Asset/Operasional, selama masih static/persiapan

## 5. Mapping Menu Utama

Semua card dashboard harus menuju menu utama atau subfitur yang tepat. Query di bawah adalah mapping ideal dan harus diaudit terhadap parser filter aktual sebelum implementasi.

| Card/rekap dashboard | Route tujuan | Query/filter ideal | Role/permission minimum | Status |
|---|---|---|---|---|
| Total Paket Aktif | `/proyek` | `tahun`, `status=aktif` | `view_projects` | Perlu auto-filter |
| Paket Fisik | `/proyek` | `tahun`, `jenis_paket=fisik` | `view_projects` | Perlu auto-filter |
| Paket Konsultan | `/proyek` | `tahun`, `jenis_paket=konsultan`, `sub_jenis_paket` opsional | `view_projects` | Perlu auto-filter |
| Paket Rutin | `/proyek` | `tahun`, `jenis_paket=rutin` | `view_projects` | Perlu auto-filter |
| Progres Fisik | `/proyek` | `tahun`, `sort=progress_fisik` | `view_projects` | Perlu auto-filter |
| Progres Keuangan | `/serapan-anggaran` | `tahun`, `scope` | `view_keuangan` | Route siap, filter perlu audit |
| Deviasi/Paket Kritis | `/proyek` | `tahun`, `health=kritis` atau `deviasi_status=kritis` | `view_projects` | Perlu auto-filter |
| Approval Menunggu | `/approval` | `tahun`, `approval_status=pending` | `view_approval` | Perlu auto-filter |
| Survey Belum Ditindaklanjuti | `/survey` | `tahun`, `status=belum-ditindaklanjuti` | `view_survey` | Tujuan perlu diperbaiki |
| Surat Penting/Belum Ditindaklanjuti | `/surat` | `kategori_surat`, `status_tindak_lanjut` | `view_announcements` sementara | Modul sementara/permission luas |
| Administrasi Belum Lengkap | `/administrasi` | `document_type`, `completeness_status` | `view_contracts` sementara | Perlu auto-filter |
| Peil Menunggu | `/peil` | `status` | `view_map` sementara | Route siap, permission luas |
| Asset Kritis/Offline | `/asset` | `status_asset` | `view_map` sementara | Route siap, permission luas |
| Operasional SDA | `/asset` | `subtab=operasional`, `status` | Belum final | Modul/sub-tab belum final |
| Warning Pasang Surut | `/peta` atau `/asset` | `warning_type=pasang_surut`, `warning_status` | `view_map` | Sumber masih simulasi |
| Aktivitas Terbaru | `/audit-log` | `activity_type`, `date_range`, `entity_id` | `view_audit_log` | Harus scoped |
| Pengaturan | `/pengaturan` | Tidak perlu | `view_settings` | Siap |

## 6. Mapping Clickable Navigation

### 6.1 Aturan Umum

Setiap klik dari dashboard wajib membawa:

- `source_module=dashboard`;
- filter yang relevan;
- breadcrumb/konteks asal klik;
- tombol `Reset Filter`;
- tombol `Kembali`;
- validasi role dan assignment;
- detail langsung jika hanya satu data dan user berhak.

Nama query final harus mengikuti parser filter aktual. Jangan membuat parameter baru sebelum audit implementasi.

### 6.2 Perbaikan Mapping Konseptual

| Temuan saat ini | Mapping yang benar | Status implementasi |
|---|---|---|
| Survey Belum Ditindaklanjuti menuju `/proyek` | `/survey?status=belum-ditindaklanjuti&source_module=dashboard` | Belum diterapkan |
| Surat menuju `/pengumuman` | `/surat` dengan filter kategori/status | Belum diterapkan |
| Peil Banjir menuju `/peta` | `/peil` untuk rekap/detail Peil; `/peta` hanya untuk konteks lokasi | Belum diterapkan |
| Asset SDA menuju `/peta` | `/asset` untuk rekap/detail Asset; `/peta` hanya untuk konteks lokasi | Belum diterapkan |
| Operasional menuju `/chat` | `/asset?subtab=operasional` atau route operasional final | Belum tersedia/final |
| Paket Kritis mengirim query tetapi `/proyek` belum membaca | `/proyek` harus membaca initial filter `tahun` dan `health/deviasi` | Belum diterapkan |
| Approval Pending mengirim query tetapi `/approval` belum membaca | `/approval` harus membaca initial filter tahun/status/role | Belum diterapkan |

### 6.3 Filter Ideal per Modul

| Modul | Filter dashboard yang perlu didukung |
|---|---|
| Paket Pekerjaan | `tahun`, `status`, `health`, `deviasi_status`, `jenis_paket`, `sub_jenis_paket`, `metode_pengadaan`, `sub_kegiatan_id`, `masalah` |
| Survey Investigasi | `tahun`, `status`, `kategori_masalah`, `survey_id`, `sub_kegiatan_id` |
| Approval Center | `tahun`, `approval_status`, `approver_role`, `entity_type`, `approval_id` |
| Surat Masuk & Keluar | `kategori_surat`, `status_tindak_lanjut`, `letter_id`, `date_range` |
| Administrasi | `document_type`, `completeness_status`, `package_id`, `approval_status` |
| Peil Banjir | `status`, `peil_id`, `date_range` |
| Asset SDA | `jenis_asset`, `status_asset`, `asset_id`, `subtab=operasional` |
| Audit Log | `activity_type`, `entity_type`, `entity_id`, `date_range` |
| Peta Monitoring | `layer`, `warning_type`, `warning_status`, `package_id`, `asset_id`, `survey_id`, `peil_id` |

## 7. Data Source Badge

### 7.1 Jenis Badge

| Jenis sumber | Label wajib | Warna/ikon | Aturan |
|---|---|---|---|
| Database/resmi | `Data Resmi` atau `Database` | Hijau/biru dengan ikon verifikasi | Boleh digunakan untuk KPI dan keputusan |
| Demo | `Data Demo` | Amber dengan ikon info | Tidak boleh tampil sebagai capaian resmi |
| Simulasi | `Simulasi` | Ungu/amber dengan ikon flask/info | Tidak boleh memicu keputusan operasional resmi |
| Insight lokal/rule-based | `Insight Lokal` | Biru muda/abu dengan ikon analisis | Harus menjelaskan bukan rekomendasi resmi |

### 7.2 Aturan Penempatan

- badge global sumber data tampil di Header Compact;
- panel yang mempunyai sumber berbeda harus memiliki badge lokal;
- warning sumber data tidak boleh tersembunyi dalam tooltip saja;
- angka demo/simulasi tidak boleh dicampur ke agregat resmi;
- waktu pembaruan dan sumber data ditampilkan jika tersedia;
- insight lokal tidak boleh memakai label `AI Resmi` atau bahasa yang memberi kesan keputusan final.

## 8. Role-Aware Dashboard

Mapping berikut menggunakan role frontend existing dan alias final yang sudah terdokumentasi. Seluruh data tetap mengikuti assignment scope.

| Role/alias final | Fokus dashboard | KPI/panel prioritas | Quick Action yang sesuai | Batas utama |
|---|---|---|---|---|
| `super_admin` | Kesehatan sistem dan seluruh modul | Data source, warning sistem, audit, seluruh agregat | Pengaturan, Audit Log, Paket, Approval | Aksi tetap harus auditable |
| `admin`, `admin_sistem`, `admin_bidang` | Kelengkapan data bidang dan operasional sistem | Paket, kelengkapan data, approval, surat/asset jika tersedia | Kelola Paket, Pengguna, Pengaturan, Audit | Alias admin masih luas |
| `admin_sub_kegiatan` | Paket/sub kegiatan yang ditugaskan | Kelengkapan dokumen, kontrak, progres, masalah | Paket, Administrasi, Dokumen, Kontrak | Scope sub kegiatan belum sepenuhnya formal |
| `kabid`, `kepala_bidang` | Pengendalian bidang | Deviasi, approval, progres, risiko, surat penting | Approval, Risiko, Peta, ringkasan bidang | Read/approve sesuai permission |
| `pimpinan` | Keputusan strategis read-only | KPI strategis, risiko, serapan, warning | Risiko, Serapan, Peta, ringkasan | Tidak menampilkan aksi tulis |
| `ppk` | Keputusan paket/kontrak | Paket kritis, approval, progres, kontrak | Approval, Paket, Laporan, Dokumen | Scope existing termasuk read-all core |
| `pptk` | Pelaksanaan teknis paket | Paket ditugaskan, laporan, masalah, progres | Laporan, Masalah, Paket, Peta | Hanya assignment aktif |
| `direksi_teknis` | Monitoring teknis | Deviasi, catatan pengawasan, masalah teknis | Catatan, Masalah, Laporan, Peta | Hanya paket ditugaskan |
| `pejabat_pengadaan` | Tahap pengadaan | Paket pengadaan, RAB, kontrak awal | Paket, RAB, Kontrak, Dokumen | Tidak perlu seluruh alert operasional |
| `pphp` | Pemeriksaan hasil pekerjaan | Paket akhir, dokumen, approval/serah terima | Approval, Dokumen, Laporan, Masalah | Sesuai paket pemeriksaan |
| `tim_perencanaan`, `tim_perencana_rutin` | Perencanaan dan RAB | Survey, RAB, paket perencanaan | Survey, RAB, Dokumen, Peta | Alias ke `tim_perencanaan` |
| `tim_survey` | Investigasi lapangan | Survey pending, lokasi, tindak lanjut | Input Survey, Survey Pending, Peta | Hanya assignment/scope survey |
| `tim_pengawasan`, `tim_pengawas_rutin` | Pengawasan lapangan | Paket berjalan, deviasi, masalah, laporan | Laporan, Masalah, Paket, Peta | Alias ke `tim_pengawasan` |
| `konsultan_perencana` | Paket perencanaan | Survey, RAB, dokumen perencanaan | Survey, RAB, Dokumen, Paket | Hanya paket terkait |
| `konsultan_pengawasan` | Paket pengawasan | Progres, deviasi, masalah, laporan | Laporan, Masalah, Paket, Peta | Hanya paket terkait |
| `kontraktor` | Pelaksanaan paket | Laporan, masalah, progres paket sendiri | Laporan, Dokumen, Chat, Paket | Tidak melihat data paket lain |
| `auditor` | Kepatuhan dan jejak audit read-only | Audit, dokumen, deviasi, kelengkapan | Audit Log, Dokumen, Laporan | Tidak menampilkan aksi tulis |

### Role yang Belum Boleh Dipaksakan

Role berikut belum memiliki union/session/permission/assignment final yang aman:

- `admin_surat`
- `admin_peil_banjir`
- `admin_asset`
- `mandor_operasional_sda`
- `mandor_pintu_air`
- `petugas_pintu_air`
- `mandor_rehabilitasi_drainase`

Aturan:

- jangan memberi alias ke role luas hanya agar dashboard tampil;
- tampilkan dashboard khusus hanya setelah role extension, permission, assignment, dan workflow disetujui;
- sampai tahap tersebut selesai, kebutuhan mereka hanya dicatat sebagai rancangan.

## 9. Risiko Scope Topbar dan Badge

Sebelum implementasi visual besar, diperlukan tahap teknis khusus untuk memastikan:

1. Topbar menghitung notifikasi hanya dari project/data yang scoped.
2. Badge Sidebar dan MobileNav memakai helper assignment scope yang sama.
3. Audit log tidak menampilkan aktivitas lintas assignment.
4. Aktivitas dashboard hanya clickable jika user berhak membuka data asal.
5. Modul non-paket tidak menampilkan data di luar akses role.
6. Badge approval, masalah, surat, asset, dan warning tidak memakai agregat global tanpa guard.
7. Role read-only tidak menerima quick action tulis.

Tahap 4B hanya mencatat risiko ini dan tidak memperbaiki source code.

## 10. Wireframe Tekstual Desktop

Target area ringkasan utama desktop:

```text
+----------------------------------------------------------------------------------+
| HEADER COMPACT                                                                   |
| Dashboard Command Center | Role + Scope | Tahun | Data Source | Last Update      |
+----------------------------------------------------------------------------------+
| KPI 1       | KPI 2       | KPI 3       | KPI 4       | KPI 5       | KPI 6       |
| Paket Aktif | Fisik       | Keuangan    | Deviasi     | Approval    | Survey       |
+---------------------------+----------------------------+---------------------------+
| COMMAND BRIEF             | PROGRESS PANEL             | RISK & APPROVAL           |
| Prioritas hari ini        | Fisik vs Keuangan          | Kritis / Pending / Open   |
| Max 3-5 item              | Fisik/Konsultan/Rutin      | Max 3-5 item              |
+---------------------------+----------------------------+---------------------------+
| QUICK ACTION ROLE-AWARE   | RECENT ACTIVITY SCOPED     | SHORTCUT PETA MONITORING  |
| Max 4 action              | Max 5 aktivitas            | Ringkasan lokasi + CTA    |
+----------------------------------------------------------------------------------+
```

### Proporsi Prioritas Desktop

- Header Compact: 8-10% tinggi konten.
- KPI Row: 15-18%.
- Command Brief/Progress/Risk: 45-50%.
- Quick Action/Activity/Peta: 25-30%.

Jika tinggi viewport tidak cukup, area bawah boleh berada sedikit di bawah fold. Informasi P0 dan P1 tetap harus terlihat terlebih dahulu.

### Arah Visual

- background soft gray/putih kebiruan;
- card putih dengan border biru lembut;
- navy untuk hierarki utama;
- cyan/tosca sebagai aksen informasi;
- hijau untuk aman/selesai;
- amber untuk perhatian;
- merah hanya untuk kritis;
- shadow lembut;
- radius konsisten;
- tidak memakai neon/gaming style;
- kepadatan informasi dijaga dengan tipografi 12-16 px yang terbaca.

## 11. Wireframe Tekstual Mobile

```text
[HEADER SCOPE]
Role aktif | Scope assignment | Data source | Filter

[ALERT PRIORITY]
Approval / paket kritis / warning yang perlu tindakan

[KPI GRID 2 KOLOM]
Paket Aktif | Deviasi
Approval    | Survey
Fisik       | Keuangan

[QUICK ACTION]
2-4 tombol role-aware

[PROGRESS RINGKAS]
Fisik vs Keuangan + Fisik/Konsultan/Rutin

[RECENT ACTIVITY]
Maksimal 5 aktivitas scoped

[SHORTCUT MODUL]
Peta Monitoring / Paket / Approval / modul relevan

[REKAP TAMBAHAN - ACCORDION]
Surat / Peil / Asset / Operasional / Pasang Surut / Audit
```

Aturan:

- alert prioritas muncul sebelum rekap umum;
- KPI menggunakan card compact yang tetap mudah dibaca;
- accordion hanya memuat ringkasan dan tombol menuju modul;
- bottom navigation tidak tertutup konten;
- detail panjang tetap dibuka di modul asal.

## 12. Rekomendasi Tahap 4C

### Rekomendasi Final

Tahap 4C sebaiknya menjadi **perbaikan teknis scope Topbar/badge dan clickable navigation/auto-filter terlebih dahulu**, sebelum implementasi visual Command Center.

### Alasan

1. Topbar dan badge belum terbukti memakai scope yang identik dengan dashboard.
2. Beberapa card dashboard menuju modul yang kurang tepat.
3. `/proyek` dan `/approval` belum membaca query auto-filter dari dashboard.
4. Modul non-paket masih memakai permission yang cukup luas.
5. Redesign visual yang dibangun sebelum fondasi klik/scope benar berisiko memperindah kebocoran agregat atau navigasi yang salah.

### Scope Tahap 4C yang Disarankan

1. Satukan helper scoped aggregate untuk dashboard, Topbar, Sidebar, dan MobileNav.
2. Audit notifikasi dan badge per role/assignment.
3. Perbaiki mapping tujuan card Survey, Surat, Peil, Asset, dan Operasional.
4. Terapkan pembacaan query auto-filter secara bertahap pada `/proyek`, `/survey`, dan `/approval`.
5. Pastikan breadcrumb, Reset Filter, dan Kembali tersedia.
6. Validasi role luas, role terbatas, pimpinan, dan auditor.
7. Jangan mengubah visual besar pada tahap teknis tersebut.

Setelah Tahap 4C lulus, implementasi visual Command Center dapat dilakukan pada Tahap 4D secara bertahap.

## 13. Hal yang Tidak Disentuh

Tahap 4B tidak mengubah:

- source code aplikasi;
- halaman atau komponen login;
- asset login;
- Auth/NextAuth;
- middleware;
- RBAC/role/permission;
- Prisma/database/migration;
- package/dependency;
- route;
- shared navigation;
- dashboard aktif;
- data dummy/demo;
- tab atau komponen dashboard.

## 14. Backup

File target belum ada sebelum Tahap 4B. Tidak ada source code atau dokumen existing yang diubah, sehingga backup file tidak diperlukan.

Folder backup yang ditetapkan jika target sudah ada:

```text
backup/backup-dashboard-command-center-4b-before-change
```

## 15. Kesimpulan

Dashboard Command Center SIAGA-SDA harus menjadi ringkasan keputusan yang role-aware dan assignment-scoped, bukan salinan seluruh modul. Desktop dapat diarahkan ke ringkasan satu viewport secara realistis, sedangkan mobile harus tetap scroll vertikal.

Fondasi visual baru belum boleh diimplementasikan sebelum risiko scope Topbar/badge dan clickable navigation/auto-filter ditutup. Tahap 4C teknis direkomendasikan sebagai langkah berikutnya, kemudian implementasi visual dilakukan bertahap pada Tahap 4D.
