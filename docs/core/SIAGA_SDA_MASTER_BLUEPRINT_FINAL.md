<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA MASTER BLUEPRINT FINAL

## Sistem Informasi, Analisis, Gerak Cepat dan Administrasi Sumber Daya Air  
### Command Center SDA  
### Dinas Pekerjaan Umum Bidang Sumber Daya Air Kota Dumai

---

# 1. STATUS PROJECT

Project ini adalah **SIAGA-SDA**.

SIAGA-SDA adalah sistem aktif yang sedang dikembangkan bertahap sebagai aplikasi Command Center SDA.

Codex wajib memahami:

- jangan melakukan penggantian nama aplikasi;
- jangan mengganti nama aplikasi;
- jangan mengubah role yang sudah disepakati;
- jangan mengubah workflow yang sudah disepakati;
- jangan mengubah struktur menu utama tanpa instruksi;
- jangan mengubah database besar tanpa instruksi eksplisit;
- jangan membuat fitur baru di luar perintah;
- jangan memperbaiki hal di luar scope tanpa izin;
- jika menemukan masalah di luar scope, laporkan saja.

---

# 2. CATATAN AUDIT DAN MAPPING

Blueprint ini adalah arah pengembangan SIAGA-SDA, bukan bukti bahwa semua role, tabel, route, field, atau modul sudah tersedia di kode.

Sebelum coding, Codex wajib:

1. audit sistem aktual;
2. mapping role aktual dengan role final;
3. mapping menu aktual dengan menu final;
4. mapping route aktual dengan route yang akan dipakai;
5. mapping tabel/schema aktual dengan kebutuhan blueprint;
6. melaporkan perbedaan sebelum mengubah file besar.

Jika ada perbedaan antara blueprint dan sistem aktual:

- jangan langsung membuat ulang;
- jangan langsung menghapus;
- jangan langsung mengganti database;
- gunakan struktur yang sudah ada jika masih layak;
- laporkan risiko dan minta konfirmasi.

---

# 3. IDENTITAS SISTEM

Nama aplikasi:

```text
SIAGA-SDA
```

Kepanjangan:

```text
Sistem Informasi, Analisis, Gerak Cepat dan Administrasi Sumber Daya Air
```

Tagline:

```text
Command Center SDA
```

Instansi:

```text
Dinas Pekerjaan Umum
Bidang Sumber Daya Air
Kota Dumai
```

Footer aplikasi:

```text
SIAGA-SDA
©2026 Budi Legawan, ST
All Rights Reserved
```

---

# 4. PRINSIP UTAMA SISTEM

SIAGA-SDA adalah aplikasi:

- command center SDA;
- monitoring pekerjaan;
- monitoring peta;
- monitoring survey investigasi;
- monitoring asset SDA;
- monitoring operasional pintu air dan rumah pompa;
- pengelolaan surat masuk dan keluar;
- pengelolaan administrasi;
- pengelolaan approval;
- pengelolaan peil banjir;
- audit log;
- laporan dan rekap.

Prinsip sistem:

```text
Satu data, satu lokasi, satu riwayat, banyak tampilan sesuai role.
```

Semua data harus dapat dilacak dari:

- Dashboard;
- Peta Monitoring;
- tab asal;
- tab tujuan;
- Laporan;
- Audit Log.

---

# 5. MENU UTAMA FINAL

Menu utama SIAGA-SDA adalah:

```text
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
```

Catatan penting:

- jangan tambah tab utama baru tanpa instruksi;
- jangan hapus tab utama final tanpa instruksi;
- jangan membuat tab Master Data sebagai menu utama;
- Master Data diletakkan di Pengaturan;
- Operasional SDA diletakkan sebagai sub-tab di Asset SDA;
- Notulen & Tindak Lanjut Rapat diletakkan sebagai sub-fitur di Surat Masuk & Keluar;
- Warning Center diletakkan sebagai panel Dashboard dan icon notifikasi;
- Laporan awalnya diletakkan sebagai export/rekap dari Dashboard.

---

# 6. ROLE FINAL SIAGA-SDA

Role final yang digunakan:

```text
SUPER_ADMIN
ADMIN_SISTEM
ADMIN_SDA
ADMIN_SUB_KEGIATAN
ADMIN_SURAT
ADMIN_PEIL
PIMPINAN
KEPALA_BIDANG
PPK
PPTK
DIREKSI_TEKNIS
TIM_SURVEY
TIM_PERENCANA_RUTIN
TIM_PENGAWAS_RUTIN
PEJABAT_PENGADAAN
KONSULTAN_PERENCANA
KONSULTAN_PENGAWAS
KONTRAKTOR
PPHP
AUDITOR
MANDOR_OPERASIONAL_SDA
MANDOR_REHAB_DRAINASE
```

---

# 7. ROLE YANG DIHAPUS / TIDAK DIGUNAKAN

Role berikut **tidak digunakan lagi**:

```text
ADMIN_SUB_KEGIATAN
```

Alasan:

```text
Tugas Admin Sub Kegiatan sudah digantikan oleh ADMIN_SUB_KEGIATAN.
```

Codex dilarang:

- membuat ulang role ADMIN_SUB_KEGIATAN;
- menggunakan ADMIN_SUB_KEGIATAN pada permission baru;
- menampilkan ADMIN_SUB_KEGIATAN di UI;
- membuat menu khusus Admin Sub Kegiatan;
- membuat assignment baru berbasis ADMIN_SUB_KEGIATAN.

Jika di kode masih ditemukan referensi ADMIN_SUB_KEGIATAN, jangan langsung hapus sembarangan. Lakukan mapping bertahap ke:

```text
ADMIN_SUB_KEGIATAN
```

dan laporkan file yang terdampak.

---

# 8. TUGAS ROLE UTAMA

## 8.1 SUPER_ADMIN

SUPER_ADMIN adalah pengendali utama sistem.

Tugas:

- mengatur sistem;
- mengatur user;
- mengatur role;
- mengatur assignment;
- mengatur permission;
- mengatur master data;
- mengatur backup;
- melihat Audit Log;
- melihat seluruh data;
- mengelola Pengaturan.

## 8.2 ADMIN_SISTEM

ADMIN_SISTEM membantu pengelolaan teknis aplikasi.

Tugas:

- membuat akun;
- reset password;
- mengaktifkan/nonaktifkan akun;
- memeriksa error;
- memeriksa status sistem;
- memeriksa backup;
- membantu permission;
- memantau Audit Log sesuai izin.

## 8.3 ADMIN_SDA

ADMIN_SDA adalah admin operasional bidang SDA.

Tugas:

- membantu memastikan semua data bidang SDA tertata;
- membantu koordinasi data antar tab;
- membantu rekap;
- membantu pemantauan Dashboard;
- membantu pengelolaan awal data jika diberi izin.

ADMIN_SDA bukan pengganti PPK, PPTK, atau Kepala Bidang.

## 8.4 ADMIN_SUB_KEGIATAN

ADMIN_SUB_KEGIATAN adalah admin utama pengelola administrasi berdasarkan sub kegiatan.

Tugas:

- mengelola data paket pada sub kegiatan yang ditugaskan;
- memastikan paket masuk ke sub kegiatan yang benar;
- mengelola dokumen administrasi paket pada sub kegiatan;
- membantu input kontrak/SPK;
- membantu input addendum;
- membantu input SPM/pembayaran;
- membantu arsip dokumen;
- membantu rekap sub kegiatan;
- menghubungkan paket dengan program/kegiatan/sub kegiatan;
- memastikan dokumen lengkap sesuai paket.

Akses ADMIN_SUB_KEGIATAN dibatasi berdasarkan assignment aktif.

## 8.5 ADMIN_SURAT

ADMIN_SURAT mengelola Surat Masuk & Keluar.

Tugas:

- input surat masuk;
- input surat keluar;
- upload dokumen surat;
- mengelola kategori surat;
- mencatat disposisi;
- menghubungkan surat ke survey, peil, paket, atau notulen;
- mengarsipkan surat;
- membuat rekap surat.

## 8.6 ADMIN_PEIL

ADMIN_PEIL mengelola administrasi Peil Banjir.

Tugas:

- input permohonan peil;
- verifikasi kelengkapan dokumen;
- upload dokumen;
- menghubungkan permohonan dengan surat masuk;
- membuat draft rekomendasi;
- mengarsipkan dokumen peil;
- memantau status peil.

Approval teknis tetap mengikuti PPTK/PPK sesuai workflow.

## 8.7 PIMPINAN

PIMPINAN bersifat read-only.

PIMPINAN dapat melihat:

- Dashboard;
- Peta Monitoring;
- rekap paket;
- rekap survey;
- rekap surat;
- rekap peil;
- rekap asset;
- warning;
- laporan.

PIMPINAN tidak boleh edit data, upload dokumen, approve teknis, atau hapus data.

## 8.8 KEPALA_BIDANG

KEPALA_BIDANG dapat:

- memantau Dashboard;
- melihat Peta Monitoring;
- melihat paket bidang;
- melihat survey investigasi;
- memberi disposisi;
- memberi persetujuan/tanggapan pada level bidang jika workflow mengatur demikian;
- melihat rekap bidang.

Seseorang dapat memiliki role Kepala Bidang sekaligus PPK jika memang ditugaskan. Sistem harus mendukung multi-role.

## 8.9 PPK

PPK berperan sebagai pengambil keputusan dan approval utama sesuai assignment.

PPK dapat:

- melihat paket yang ditugaskan;
- menyetujui dokumen;
- memantau progress;
- memantau deviasi;
- memeriksa survey;
- memeriksa administrasi;
- menyetujui peil jika masuk kewenangannya;
- melihat laporan;
- memberi catatan.

## 8.10 PPTK

PPTK berperan memeriksa teknis awal dan membantu PPK.

PPTK dapat:

- memeriksa survey;
- memeriksa laporan;
- memeriksa dokumen;
- memeriksa peil;
- memeriksa progress;
- memberi catatan/revisi;
- mengusulkan approval ke PPK.

## 8.11 DIREKSI_TEKNIS

DIREKSI_TEKNIS wajib tetap ada untuk paket fisik.

DIREKSI_TEKNIS berperan:

- memeriksa pekerjaan fisik;
- memeriksa laporan teknis;
- memeriksa deviasi;
- memberi catatan lapangan;
- mendukung pemeriksaan PHO/FHO;
- berkoordinasi dengan konsultan pengawas dan PPTK.

Codex dilarang menghapus Direksi Teknis dari workflow paket fisik.

## 8.12 TIM_SURVEY

TIM_SURVEY bertugas:

- melakukan survey investigasi;
- input data lapangan;
- input foto;
- input koordinat;
- memberi catatan kondisi;
- memberi rekomendasi awal;
- menghubungkan survey ke surat/paket/asset jika diberi izin.

## 8.13 TIM_PERENCANA_RUTIN

TIM_PERENCANA_RUTIN bertugas:

- survey teknis pekerjaan rutin;
- membuat rekomendasi teknis;
- membuat solusi;
- membuat RAB rutin jika diperlukan;
- membuat gambar sederhana/teknis jika diperlukan;
- menyiapkan data awal pekerjaan rutin.

## 8.14 TIM_PENGAWAS_RUTIN

TIM_PENGAWAS_RUTIN bertugas:

- mengawasi pekerjaan rutin;
- memeriksa laporan pelaksana;
- memantau progress;
- memberi catatan lapangan;
- membantu PPTK/PPK dalam pengawasan rutin.

## 8.15 PEJABAT_PENGADAAN

PEJABAT_PENGADAAN bertugas pada proses pengadaan yang sesuai kewenangannya.

Dapat terlibat pada:

- paket rutin;
- pengadaan langsung;
- proses penunjukan penyedia;
- pencatatan hasil pengadaan jika diperlukan.

## 8.16 KONSULTAN_PERENCANA

KONSULTAN_PERENCANA bertugas menghasilkan dokumen perencanaan:

- survey teknis;
- gambar rencana;
- RAB;
- HPS;
- BOQ;
- spesifikasi teknis;
- perhitungan teknis;
- laporan perencanaan.

## 8.17 KONSULTAN_PENGAWAS

KONSULTAN_PENGAWAS bertugas mengawasi paket fisik:

- laporan pengawasan;
- pemeriksaan progres;
- pemeriksaan deviasi;
- rekomendasi teknis;
- dokumentasi lapangan;
- mendukung PHO/FHO.

## 8.18 KONTRAKTOR

KONTRAKTOR dapat:

- melihat paket yang ditugaskan;
- upload laporan;
- upload dokumen;
- melihat revisi;
- menindaklanjuti catatan;
- melihat status approval terkait paketnya.

KONTRAKTOR tidak boleh melihat paket kontraktor lain.

## 8.19 PPHP

PPHP bertugas dalam pemeriksaan hasil pekerjaan.

PPHP terkait:

- PHO;
- FHO;
- checklist hasil pekerjaan;
- punch list;
- berita acara pemeriksaan;
- rekomendasi serah terima.

## 8.20 AUDITOR

AUDITOR bersifat read-only.

AUDITOR dapat melihat:

- Audit Log;
- dokumen;
- riwayat approval;
- riwayat perubahan data;
- rekap laporan.

AUDITOR tidak boleh mengubah data.

## 8.21 MANDOR_OPERASIONAL_SDA

MANDOR_OPERASIONAL_SDA bertugas pada operasional pintu air dan rumah pompa.

Tugas:

- input shift;
- memilih petugas dari master data;
- mencatat pintu air buka/tutup;
- mencatat pompa hidup/mati;
- input laporan operasi;
- upload foto kondisi;
- merespons warning pasang surut;
- melihat asset yang ditugaskan.

Petugas biasa tidak wajib memiliki akun.

## 8.22 MANDOR_REHAB_DRAINASE

MANDOR_REHAB_DRAINASE bertugas pada rehabilitasi/pemeliharaan drainase.

Tugas:

- input tim;
- memilih petugas dari master data;
- mencatat kehadiran;
- input laporan pekerjaan;
- upload foto kondisi;
- membuat rekap lapangan.

---

# 9. STRUKTUR DATA PROGRAM DAN SUB KEGIATAN

Struktur data:

```text
Program
→ Kegiatan
→ Sub Kegiatan
→ Paket
```

Program, Kegiatan, dan Sub Kegiatan bukan menu utama.

Fungsinya:

- pengelompokan;
- filter;
- relasi paket;
- rekap dashboard;
- pembatas assignment;
- pembatas akses ADMIN_SUB_KEGIATAN.

---

# 10. DASHBOARD

Dashboard adalah pusat rekap seluruh modul.

Dashboard harus menampilkan:

- rekap paket fisik;
- rekap paket rutin;
- rekap paket konsultan;
- rekap survey investigasi;
- rekap surat masuk/keluar;
- rekap approval;
- rekap administrasi;
- rekap peil banjir;
- rekap asset SDA;
- rekap operasional SDA;
- rekap pasang surut;
- rekap audit log;
- warning aktif.

Dashboard tidak boleh memuat peta interaktif besar.

Dashboard cukup menampilkan:

- peta ringkas;
- ringkasan lokasi;
- tombol Buka Peta Monitoring.

Peta besar hanya berada di menu Peta Monitoring.

---

# 11. REKAP PAKET DI DASHBOARD

Dashboard harus mengelompokkan paket berdasarkan data yang sudah diinput oleh user berwenang.

## 11.1 Paket Fisik

Dikelompokkan berdasarkan:

- sub kegiatan;
- metode pengadaan;
- status;
- progress;
- deviasi.

Contoh:

```text
Rutin Sub Kegiatan A - total x paket
Rutin Sub Kegiatan B - total x paket
PL Sub Kegiatan A - total x paket
PL Sub Kegiatan B - total x paket
Tender Sub Kegiatan A - total x paket
Tender Sub Kegiatan B - total x paket
```

## 11.2 Paket Konsultan

Rekap konsultan:

```text
Konsultan Perencanaan PL - total x paket
Konsultan Perencanaan Tender - total x paket
Konsultan Pengawasan PL - total x paket
Konsultan Pengawasan Tender - total x paket
```

---

# 12. PETA MONITORING

Peta Monitoring adalah jantung aplikasi.

Peta Monitoring harus memuat layer:

```text
Paket Pekerjaan
Survey Investigasi
Asset SDA
Operasional SDA
Peil Banjir
Pasang Surut
Surat Masuk terkait lokasi
Deviasi/Warning
```

Aturan:

- jangan membuat marker bertumpuk;
- gunakan konsep 1 lokasi = 1 marker utama jika data saling terkait;
- detail marker harus menampilkan relasi data;
- tombol detail harus membuka tab asal.

---

# 13. SURVEY INVESTIGASI

Survey Investigasi dapat berasal dari:

- Surat Masuk;
- Peta Monitoring;
- Instruksi Pimpinan;
- Laporan Mandor;
- Temuan Tim Survey;
- Asset Bermasalah.

Istilah final:

```text
Ditindaklanjuti
```

Dilarang menggunakan istilah:

```text
Ditindaklanjuti
```

Tindak lanjut survey:

```text
Dibuat Paket Rutin
Dibuat Paket Fisik
Perbaikan Langsung
Surat Balasan
Koordinasi OPD
Usulan Tahun Berikutnya
Tidak Dilanjutkan
Arsip
```

Survey yang sudah ditindaklanjuti tidak boleh hilang dari tab Survey.

Statusnya berubah dan relasinya ditampilkan.

---

# 14. PAKET PEKERJAAN

Jenis paket final:

```text
Fisik
Konsultan
Rutin
```

Sub jenis konsultan:

```text
Konsultan Perencanaan
Konsultan Pengawasan
```

Metode pengadaan:

```text
Pengadaan Langsung
Tender / Lelang
```

Paket Fisik wajib mendukung:

```text
PPK
PPTK
Direksi Teknis
Konsultan Pengawas jika ada
Kontraktor
PPHP
```

Paket Rutin mendukung:

```text
Tim Perencana Rutin
Tim Pengawas Rutin
Pejabat Pengadaan
Kontraktor/Pelaksana
PPTK
PPK
ADMIN_SUB_KEGIATAN
```

Paket Konsultan mendukung:

```text
Konsultan Perencana
Konsultan Pengawas
PPTK
PPK
ADMIN_SUB_KEGIATAN
```

---

# 15. APPROVAL CENTER

Approval Center adalah pusat persetujuan.

Data masuk dari:

```text
Survey Investigasi
Paket Pekerjaan
Administrasi
Peil Banjir
Surat Keluar
Laporan
PHO/FHO
Operasional SDA jika diperlukan
```

Setelah diproses, hasil approval harus kembali ke tab asal.

Aksi:

```text
Setujui
Minta Revisi
Tolak
Catatan
```

Semua approval wajib masuk Audit Log.

---

# 16. SURAT MASUK & KELUAR

Kategori surat:

```text
Undangan Rapat
Aduan Warga
Permohonan Drainase
Permohonan Normalisasi
Permohonan Peil
Permohonan Data
Instruksi Pimpinan
Surat Internal
Surat Eksternal
Lainnya
```

Tindak lanjut surat:

```text
Survey Investigasi
Peil Banjir
Paket Pekerjaan
Surat Keluar
Notulen & Tindak Lanjut Rapat
Arsip
```

Untuk undangan rapat, tambahkan sub-fitur:

```text
Notulen & Tindak Lanjut Rapat
```

Jangan membuat Notulen sebagai tab utama.

---

# 17. ADMINISTRASI

Administrasi mengelola:

```text
Kontrak/SPK
Addendum
SPM
Pembayaran
Jaminan
Dokumen administrasi
Arsip paket
```

Administrasi dikelola oleh:

```text
ADMIN_SUB_KEGIATAN
```

bukan ADMIN_SUB_KEGIATAN.

Administrasi harus terhubung ke:

```text
Paket Pekerjaan
Approval Center
Dashboard
Laporan
Audit Log
```

---

# 18. PEIL BANJIR

Alur Peil Banjir:

```text
Permohonan
→ Verifikasi dokumen
→ Survey
→ Pemeriksaan PPTK
→ Approval PPK
→ Surat rekomendasi
→ Surat Keluar
→ Arsip
```

Peil Banjir terhubung ke:

```text
Surat Masuk
Survey
Peta Monitoring
Approval Center
Surat Keluar
Dashboard
Laporan
Audit Log
```

---

# 19. ASSET SDA

Jenis asset:

```text
Pintu Air
Rumah Pompa
Pompa Mobile
Drainase Utama
Kanal
Tanggul
Pos Duga Air
Bangunan Operasi
```

Setiap asset memiliki:

```text
Kode asset
Nama asset
Jenis asset
Lokasi
Koordinat
Kondisi
Status operasional
Foto
Dokumen
Histori operasi
QR Code
```

Operasional SDA diletakkan sebagai sub-tab Asset SDA.

---

# 20. OPERASIONAL SDA

Operasional SDA mencakup:

```text
Operasi pintu air
Operasi rumah pompa
Laporan mandor
Shift
Petugas
Status pompa
Status pintu air
Foto kondisi lapangan
Rekap bulanan
```

Keputusan final:

```text
Foto absensi dihapus.
Petugas biasa tidak wajib login.
Mandor wajib login.
Mandor memilih petugas dari master data.
```

---

# 21. PASANG SURUT

Pasang surut ditampilkan di:

```text
Login
Dashboard
Peta Monitoring
Asset SDA
Operasional SDA
```

Menampilkan:

```text
Tinggi muka air
Tren naik/turun
3 jam sebelum
Saat ini
3 jam sesudah
Countdown
Status aman/waspada/siaga/kritis
Peringatan untuk mandor
```

---

# 22. LOGIN

Login menggunakan:

```text
Email / NIP / Username
Password
```

Dilarang:

```text
Google Login
Microsoft Login
Social Login
Dropdown pilih role di login
```

Login menampilkan:

```text
Logo SIAGA-SDA
Nama SIAGA-SDA
Kepanjangan SIAGA-SDA
Command Center SDA
Dinas Pekerjaan Umum Bidang Sumber Daya Air Kota Dumai
Widget pasang surut
Waktu salat
Status sistem
Footer final
```

---

# 23. PENGATURAN

Pengaturan hanya untuk role yang berwenang.

Untuk Super Admin/Admin Sistem:

```text
User management
Role management
Assignment
Kategori surat
Kategori survey
Kategori asset
Jenis paket
Metode pengadaan
SLA
Template dokumen
Backup
Notifikasi
Parameter pasang surut
Storage
QR asset
Master data
```

Untuk user biasa:

```text
Profil akun
Ubah password
Notifikasi pribadi
Preferensi tampilan
```

Master Data tidak boleh menjadi tab utama.

Master Data berada di Pengaturan.

---

# 24. AUDIT LOG

Audit Log mencatat:

```text
Login
Login gagal
Upload dokumen
Approval
Revisi
Perubahan data
Perubahan role
Perubahan assignment
Akses ditolak
Scan QR asset
Laporan mandor
Perubahan status survey
Perubahan status paket
Perubahan status asset
```

Audit Log hanya tampil untuk role berwenang.

---

# 25. ROLE-BASED MENU

Menu yang bukan kewenangan user harus disembunyikan.

Jika user membuka URL tanpa izin, tampilkan:

```text
Akses Dibatasi
```

Jika user punya role tapi belum ada assignment aktif, tampilkan:

```text
Belum Ada Penugasan Aktif
```

Pimpinan dan Auditor read-only.

---

# 26. ALUR DATA ANTAR TAB

Setiap data harus memiliki:

```text
origin_module
target_module
linked_origin_id
status
tindak_lanjut
rekap_akhir
```

Contoh alur:

```text
Surat Masuk
→ Survey / Peil / Paket / Surat Keluar / Arsip
→ Dashboard + Laporan + Audit Log
```

```text
Survey Investigasi
→ Paket / Operasional / Surat Keluar / Arsip
→ Dashboard + Peta + Laporan + Audit Log
```

```text
Paket Pekerjaan
→ Administrasi + Approval + Laporan
→ Dashboard + Peta + Audit Log
```

```text
Asset SDA
→ Operasional / Survey / Paket Rutin
→ Peta + Laporan + Audit Log
```

Data asal tidak boleh hilang setelah ditindaklanjuti.

Statusnya berubah menjadi:

```text
Ditindaklanjuti
Selesai
Arsip
```

---

# 27. QR CODE ASSET

Setiap asset dapat memiliki QR Code.

QR Code berisi link ke detail asset.

QR Code tidak boleh berisi data rahasia.

Saat QR discan:

- jika user sudah login dan punya akses, buka detail asset;
- jika belum login, arahkan ke login lalu redirect;
- jika tidak punya izin, tampilkan Akses Dibatasi.

---

# 28. WARNING, SLA, DAN ESKALASI

Sistem perlu mendukung:

```text
Warning paket deviasi
Warning survey terlambat
Warning surat belum ditindaklanjuti
Warning approval terlambat
Warning asset kritis
Warning pasang tinggi
Warning laporan mandor belum masuk
```

Contoh eskalasi:

```text
PPTK → PPK → Kepala Bidang → Pimpinan
```

---

# 29. LAPORAN

Laporan awalnya tidak menjadi tab utama.

Laporan dimulai dari Dashboard sebagai tombol export.

Jenis laporan:

```text
Laporan paket
Laporan survey
Laporan surat
Laporan administrasi
Laporan peil
Laporan asset
Laporan operasional
Laporan kehadiran petugas
Laporan pasang surut
Laporan audit
```

Format:

```text
PDF
Excel
```

---

# 30. ATURAN KERJA CODEX

Codex wajib:

- membaca blueprint sebelum coding;
- mengerjakan hanya tugas yang diperintahkan;
- audit dan mapping sistem aktual sebelum coding;
- tidak mengubah role tanpa instruksi;
- tidak mengubah workflow tanpa instruksi;
- tidak membuat role ADMIN_SUB_KEGIATAN;
- tidak membuat ulang role yang sudah dihapus;
- tidak menambah menu utama tanpa instruksi;
- tidak membuat Master Data sebagai tab utama;
- tidak mengubah database besar tanpa instruksi;
- tidak membuat login Google/Microsoft;
- tidak membuat dropdown role di login;
- tidak mengganti istilah Ditindaklanjuti;
- tidak menghapus Direksi Teknis;
- tidak membuat petugas biasa wajib login;
- tidak membuat foto absensi;
- tidak membuat peta besar di Dashboard;
- tidak mengubah file di luar scope;
- jika menemukan masalah di luar scope, laporkan saja.

---

# 31. TAHAP UPDATE AMAN

Urutan update aman:

```text
1. Audit dokumentasi
2. Sinkronisasi role final
3. Hapus/mapping ADMIN_SUB_KEGIATAN ke ADMIN_SUB_KEGIATAN
4. Update menu role-based
5. Update Dashboard
6. Update Login
7. Update Layout
8. Update Peta Monitoring
9. Update Survey Investigasi
10. Update Paket Pekerjaan
11. Update Approval Center
12. Update Surat Masuk & Keluar
13. Update Administrasi
14. Update Peil Banjir
15. Update Asset SDA
16. Update Audit Log
17. Update Pengaturan
18. Final check responsive desktop/mobile
19. Build/lint/typecheck
20. Laporkan file yang berubah
```

---

# 32. CATATAN FINAL

SIAGA-SDA harus dikembangkan bertahap dan aman.

Fokus utama:

```text
Dashboard sebagai pusat rekap.
Peta Monitoring sebagai pusat lokasi.
Survey sebagai pusat verifikasi lapangan.
Paket sebagai pusat pekerjaan.
Approval sebagai pusat persetujuan.
Surat sebagai pusat administrasi masuk/keluar.
Asset sebagai pusat infrastruktur SDA.
Audit Log sebagai pusat jejak aktivitas.
```

ADMIN_SUB_KEGIATAN tidak digunakan lagi.

Semua tugas administrasi kegiatan/sub kegiatan dipusatkan ke:

```text
ADMIN_SUB_KEGIATAN
```
