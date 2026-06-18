# SIAGA-SDA GLOBAL CLICKABLE NAVIGATION & AUTO FILTER RULE

## Sistem Informasi, Analisis, Gerak Cepat dan Administrasi Sumber Daya Air
### Command Center SDA
### Dinas Pekerjaan Umum Bidang Sumber Daya Air Kota Dumai

---

# 1. TUJUAN DOKUMEN

Dokumen ini menjadi aturan global untuk seluruh UI SIAGA-SDA agar semua data yang tampil tidak hanya menjadi tampilan statis, tetapi dapat diklik, diarahkan ke tab asal, dan otomatis memfilter data sesuai klasifikasi yang dipilih.

Aturan ini wajib dibaca oleh Codex/AI coding agent sebelum mengubah:

- Dashboard
- Peta Monitoring
- Survey Investigasi
- Paket Pekerjaan
- Approval Center
- Surat Masuk & Keluar
- Administrasi
- Peil Banjir
- Asset SDA
- Audit Log
- Pengaturan
- Warning Center
- Notifikasi
- Laporan/Rekap

---

# 2. STATUS PROJECT

Project ini adalah **SIAGA-SDA**.

Jangan melakukan penggantian nama aplikasi.  
Jangan membuat ulang sistem.  
Jangan mengubah role, workflow, database, routing, auth, atau menu utama tanpa instruksi eksplisit.

Dokumen ini adalah aturan tambahan yang melengkapi:

```text
/docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md
/docs/design/SIAGA_SDA_DESIGN_SYSTEM.md
/AGENTS.md
```

---

# 3. PRINSIP UTAMA

Semua elemen data di SIAGA-SDA yang memiliki sumber data, relasi data, atau klasifikasi data harus dapat diklik.

Saat diklik, sistem harus:

1. mengarahkan user ke tab asal data;
2. mengaktifkan filter otomatis sesuai data yang diklik;
3. membuka detail langsung jika data hanya satu item;
4. menampilkan daftar dengan filter aktif jika data lebih dari satu;
5. menampilkan breadcrumb/keterangan asal klik;
6. menyediakan tombol reset filter;
7. menyediakan tombol kembali ke halaman sebelumnya;
8. tetap mengikuti role-based dan assignment-based access;
9. mencatat aktivitas penting ke Audit Log jika diperlukan;
10. tidak membuka halaman kosong.

---

# 4. ELEMEN YANG WAJIB CLICKABLE

Elemen berikut wajib clickable jika memiliki sumber data:

```text
angka rekap Dashboard
card statistik
badge status
nama paket
nama survey
nama surat
nama asset
nama peil banjir
nama user jika relevan
item approval
item warning
item notifikasi
marker peta
dokumen terkait
riwayat aktivitas
relasi antar data
hasil laporan/rekap
tabel data
grafik rekap
timeline aktivitas
```

---

# 5. ATURAN UMUM AUTO FILTER

Setiap klik harus membawa parameter filter yang jelas.

Contoh parameter:

```text
module
source_module
target_module
status
category
jenis_paket
sub_jenis_paket
metode_pengadaan
program_id
kegiatan_id
sub_kegiatan_id
kecamatan_id
kelurahan_id
package_id
survey_id
letter_id
asset_id
peil_id
approval_status
approver_role
warning_type
date_range
```

Jika sistem sudah memiliki nama parameter berbeda, Codex wajib melakukan mapping ke struktur aktual. Jangan membuat parameter baru secara sembarangan sebelum audit.

---

# 6. CONTOH ATURAN DI DASHBOARD

## 6.1 Klik Rekap Paket Fisik

Contoh:

```text
Dashboard → klik “Paket Fisik Tender Sub Kegiatan A”
```

Harus membuka:

```text
Tab: Paket Pekerjaan
Filter aktif:
- jenis_paket = Fisik
- metode_pengadaan = Tender
- sub_kegiatan = Sub Kegiatan A
```

Jika hasilnya banyak, tampilkan daftar paket terfilter.

Jika hanya satu paket, boleh langsung buka detail paket.

---

## 6.2 Klik Rekap Paket Rutin

Contoh:

```text
Dashboard → klik “Rutin Sub Kegiatan B - 8 Paket”
```

Harus membuka:

```text
Tab: Paket Pekerjaan
Filter aktif:
- jenis_paket = Rutin
- sub_kegiatan = Sub Kegiatan B
```

---

## 6.3 Klik Rekap Konsultan

Contoh:

```text
Dashboard → klik “Konsultan Perencanaan PL”
```

Harus membuka:

```text
Tab: Paket Pekerjaan
Filter aktif:
- jenis_paket = Konsultan
- sub_jenis_paket = Konsultan Perencanaan
- metode_pengadaan = Pengadaan Langsung
```

Contoh lain:

```text
Dashboard → klik “Konsultan Pengawasan Tender”
```

Harus membuka:

```text
Tab: Paket Pekerjaan
Filter aktif:
- jenis_paket = Konsultan
- sub_jenis_paket = Konsultan Pengawasan
- metode_pengadaan = Tender
```

---

## 6.4 Klik Rekap Survey

Contoh:

```text
Dashboard → klik “Survey Ditindaklanjuti”
```

Harus membuka:

```text
Tab: Survey Investigasi
Filter aktif:
- status = Ditindaklanjuti
```

Contoh:

```text
Dashboard → klik “Survey Genangan/Banjir”
```

Harus membuka:

```text
Tab: Survey Investigasi
Filter aktif:
- kategori_masalah = Genangan/Banjir
```

---

## 6.5 Klik Rekap Surat

Contoh:

```text
Dashboard → klik “Surat Aduan Banjir”
```

Harus membuka:

```text
Tab: Surat Masuk & Keluar
Filter aktif:
- kategori_surat = Aduan Warga / Aduan Banjir
```

Contoh:

```text
Dashboard → klik “Undangan Rapat Belum Ditindaklanjuti”
```

Harus membuka:

```text
Tab: Surat Masuk & Keluar
Filter aktif:
- kategori_surat = Undangan Rapat
- status_tindak_lanjut = Belum Ditindaklanjuti
```

---

## 6.6 Klik Rekap Approval

Contoh:

```text
Dashboard → klik “Approval Menunggu PPK”
```

Harus membuka:

```text
Tab: Approval Center
Filter aktif:
- approver_role = PPK
- approval_status = Pending / Menunggu
```

Contoh:

```text
Dashboard → klik “Approval Perlu Revisi”
```

Harus membuka:

```text
Tab: Approval Center
Filter aktif:
- approval_status = Perlu Revisi
```

---

## 6.7 Klik Rekap Administrasi

Contoh:

```text
Dashboard → klik “Dokumen Kontrak Belum Lengkap”
```

Harus membuka:

```text
Tab: Administrasi
Filter aktif:
- document_type = Kontrak/SPK
- completeness_status = Belum Lengkap
```

---

## 6.8 Klik Rekap Peil Banjir

Peil Banjir adalah rekap layanan permohonan rekomendasi teknis peil banjir. Rekap ini bukan sekadar monitoring tinggi muka air, banjir, atau rob.

Contoh:

```text
Dashboard → klik “Peil Menunggu PPK”
```

Harus membuka:

```text
Tab: Peil Banjir
Filter aktif:
- status = Menunggu PPK
```

Contoh:

```text
Dashboard → klik “Rekomendasi Peil Terbit”
```

Harus membuka:

```text
Tab: Peil Banjir
Filter aktif:
- status = Surat Rekomendasi Terbit
```

---

## 6.9 Klik Rekap Asset SDA

Contoh:

```text
Dashboard → klik “Asset Kritis”
```

Harus membuka:

```text
Tab: Asset SDA
Filter aktif:
- status_asset = Kritis
```

Contoh:

```text
Dashboard → klik “Pintu Air”
```

Harus membuka:

```text
Tab: Asset SDA
Filter aktif:
- jenis_asset = Pintu Air
```

---

## 6.10 Klik Rekap Operasional SDA

Contoh:

```text
Dashboard → klik “Laporan Mandor Belum Masuk”
```

Harus membuka:

```text
Tab: Asset SDA
Sub-tab: Operasional SDA
Filter aktif:
- report_status = Belum Masuk
- tanggal = hari ini
```

---

## 6.11 Klik Rekap Pasang Surut

Contoh:

```text
Dashboard → klik “Status Pasang Surut Siaga”
```

Harus membuka:

```text
Tab: Peta Monitoring atau Asset SDA/Operasional SDA sesuai konteks
Filter aktif:
- warning_type = Pasang Surut
- warning_status = Siaga
```

---

## 6.12 Klik Rekap Audit Log

Contoh:

```text
Dashboard → klik “Login Gagal Hari Ini”
```

Harus membuka:

```text
Tab: Audit Log
Filter aktif:
- activity_type = Login Gagal
- date = hari ini
```

---

# 7. ATURAN DI PETA MONITORING

Peta Monitoring adalah pusat spasial SIAGA-SDA.

Marker peta wajib clickable.

Saat marker diklik:

1. tampilkan drawer/detail panel;
2. tampilkan data utama;
3. tampilkan relasi data;
4. tampilkan tombol menuju tab asal;
5. jika data terkait banyak, tampilkan daftar relasi;
6. jangan membuat marker bertumpuk jika data berada pada lokasi yang sama.

---

## 7.1 Klik Marker Paket

```text
Peta Monitoring → klik marker Paket
```

Harus membuka drawer berisi:

- nama paket;
- jenis paket;
- sub kegiatan;
- metode pengadaan;
- progress;
- deviasi;
- PPK;
- PPTK;
- Direksi Teknis jika paket fisik;
- kontraktor/konsultan;
- dokumen terkait;
- approval terkait;
- survey asal jika ada;
- surat asal jika ada;
- asset terkait jika ada.

Tombol:

```text
Buka Detail Paket
```

Mengarahkan ke:

```text
Tab: Paket Pekerjaan
Filter/detail:
- package_id = paket yang diklik
```

---

## 7.2 Klik Marker Survey

```text
Peta Monitoring → klik marker Survey Investigasi
```

Tombol:

```text
Buka Detail Survey
```

Mengarahkan ke:

```text
Tab: Survey Investigasi
Filter/detail:
- survey_id = survey yang diklik
```

---

## 7.3 Klik Marker Asset

```text
Peta Monitoring → klik marker Asset SDA
```

Tombol:

```text
Buka Detail Asset
Catat Operasi
Lihat Riwayat Operasi
```

Mengarahkan ke:

```text
Tab: Asset SDA
Filter/detail:
- asset_id = asset yang diklik
```

Jika klik Catat Operasi:

```text
Tab: Asset SDA
Sub-tab: Operasional SDA
Filter/detail:
- asset_id = asset yang diklik
```

---

## 7.4 Klik Marker Peil Banjir

Marker Peil Banjir mewakili lokasi permohonan rekomendasi, lokasi survey, atau titik koordinat teknis yang terkait proses rekomendasi peil banjir. Jika konteksnya hanya pasang surut/tinggi muka air umum, gunakan layer Pasang Surut atau Operasional SDA, bukan definisi utama Peil Banjir.

```text
Peta Monitoring → klik marker Peil Banjir
```

Tombol:

```text
Buka Detail Permohonan Peil
```

Mengarahkan ke:

```text
Tab: Peil Banjir
Filter/detail:
- peil_id = permohonan/lokasi peil yang diklik
```

---

## 7.5 Marker Gabungan

Jika satu lokasi memiliki:

- surat masuk;
- survey;
- paket;
- asset;
- peil;
- warning;

maka tampilkan satu marker utama dengan drawer berlapis.

Drawer harus menampilkan:

```text
Relasi Lokasi Ini:
- Surat terkait
- Survey terkait
- Paket terkait
- Asset terkait
- Peil terkait
- Warning terkait
```

Masing-masing item relasi harus clickable ke tab asal.

---

# 8. ATURAN DI SURVEY INVESTIGASI

Semua item survey wajib clickable.

Klik nama survey harus membuka detail survey.

Klik status survey harus membuka daftar dengan filter status yang sama.

Klik “Ditindaklanjuti” harus menampilkan relasi tindak lanjut.

Contoh:

```text
Survey Investigasi → klik Paket Terkait
```

Mengarahkan ke:

```text
Tab: Paket Pekerjaan
Filter/detail:
- package_id = paket terkait
```

Survey yang ditindaklanjuti tidak boleh hilang dari tab Survey.

---

# 9. ATURAN DI PAKET PEKERJAAN

Semua nama paket wajib clickable.

Klik nama paket membuka detail paket.

Dalam detail paket, semua relasi wajib clickable:

- surat asal;
- survey asal;
- administrasi;
- approval;
- laporan;
- peta lokasi;
- asset terkait;
- PHO/FHO;
- dokumen.

Contoh:

```text
Paket Detail → klik Survey Asal
```

Mengarahkan ke:

```text
Tab: Survey Investigasi
Detail:
- survey_id = survey asal
```

---

# 10. ATURAN DI APPROVAL CENTER

Setiap item approval wajib clickable.

Klik item approval membuka detail approval.

Di detail approval harus ada tombol:

```text
Buka Data Asal
```

Tombol tersebut mengarah ke tab asal data:

- Survey Investigasi;
- Paket Pekerjaan;
- Administrasi;
- Peil Banjir;
- Surat Keluar;
- Laporan;
- PHO/FHO;
- Operasional SDA jika diperlukan.

Setelah approval diproses, status harus kembali ke tab asal.

---

# 11. ATURAN DI SURAT MASUK & KELUAR

Semua nomor surat, perihal surat, kategori surat, dan status tindak lanjut wajib clickable.

Relasi wajib clickable:

- survey terkait;
- peil terkait;
- paket terkait;
- surat keluar terkait;
- notulen rapat;
- tindak lanjut rapat;
- arsip.

Contoh:

```text
Surat Detail → klik Survey Terkait
```

Mengarahkan ke:

```text
Tab: Survey Investigasi
Detail:
- survey_id = survey terkait
```

Untuk undangan rapat:

```text
Surat Detail → klik Notulen & Tindak Lanjut Rapat
```

Membuka panel notulen pada detail surat, bukan tab utama baru.

---

# 12. ATURAN DI ADMINISTRASI

Semua dokumen, status dokumen, paket terkait, dan approval terkait wajib clickable.

Contoh:

```text
Administrasi → klik Paket Terkait
```

Mengarahkan ke:

```text
Tab: Paket Pekerjaan
Detail:
- package_id = paket terkait
```

Contoh:

```text
Administrasi → klik Approval Dokumen
```

Mengarahkan ke:

```text
Tab: Approval Center
Detail:
- approval_id = approval terkait
```

---

# 13. ATURAN DI PEIL BANJIR

Semua permohonan rekomendasi peil banjir wajib clickable.

Peil Banjir dalam SIAGA-SDA mengelola permohonan rekomendasi teknis peil banjir dari Surat Masuk sampai rekomendasi terbit. Dinas PU Bidang SDA menerbitkan rekomendasi teknis peil banjir, bukan izin bangunan.

Relasi wajib clickable:

- surat masuk asal;
- survey;
- approval;
- surat rekomendasi;
- peta lokasi;
- dokumen.
- persyaratan administrasi jika sudah tersedia;
- catatan teknis jika sudah tersedia.

Contoh:

```text
Peil Banjir → klik Surat Rekomendasi
```

Mengarahkan ke:

```text
Tab: Surat Masuk & Keluar
Filter/detail:
- surat_keluar_id = surat rekomendasi
```

Contoh lain:

```text
Peil Banjir â†’ klik Surat Masuk Asal
```

Mengarahkan ke:

```text
Tab: Surat Masuk & Keluar
Filter/detail:
- surat_id = surat permohonan asal
```

---

# 14. ATURAN DI ASSET SDA

Semua asset wajib clickable.

Klik asset membuka detail asset.

Relasi wajib clickable:

- peta lokasi;
- QR Code;
- histori operasi;
- laporan mandor;
- survey terkait;
- paket rutin terkait;
- dokumen asset;
- warning terkait.

Contoh:

```text
Asset Detail → klik Laporan Operasi Terakhir
```

Mengarahkan ke:

```text
Tab: Asset SDA
Sub-tab: Operasional SDA
Detail:
- operation_report_id = laporan terkait
```

---

# 15. ATURAN DI AUDIT LOG

Audit Log harus bisa mengantar user ke data asal jika user berwenang.

Contoh:

```text
Audit Log → klik aktivitas “Paket diubah”
```

Mengarahkan ke:

```text
Tab: Paket Pekerjaan
Detail:
- package_id = data terkait
```

Jika user tidak punya izin, tampilkan:

```text
Akses Dibatasi
```

---

# 16. ATURAN DI NOTIFIKASI DAN WARNING CENTER

Semua warning dan notifikasi wajib clickable.

Contoh:

```text
Klik warning “Paket Deviasi > 10%”
```

Mengarahkan ke:

```text
Tab: Paket Pekerjaan
Filter:
- deviasi_status = Kritis
```

Contoh:

```text
Klik warning “Asset Offline”
```

Mengarahkan ke:

```text
Tab: Asset SDA
Filter:
- status_asset = Offline
```

Contoh:

```text
Klik warning “Pasang Surut Siaga”
```

Mengarahkan ke:

```text
Tab: Peta Monitoring / Operasional SDA
Filter:
- warning_type = Pasang Surut
- warning_status = Siaga
```

---

# 17. ATURAN BREADCRUMB DAN RESET FILTER

Setiap hasil auto navigation wajib menampilkan konteks.

Contoh breadcrumb:

```text
Dashboard → Paket Fisik → Tender → Sub Kegiatan A
```

atau:

```text
Peta Monitoring → Marker Paket → Detail Paket
```

Wajib ada tombol:

```text
Reset Filter
Kembali
```

Jika user datang dari Dashboard, tombol kembali mengarah ke Dashboard.

Jika user datang dari Peta Monitoring, tombol kembali mengarah ke Peta Monitoring.

---

# 18. ATURAN ROLE DAN ASSIGNMENT

Clickable navigation tetap harus mengikuti akses user.

Jika user klik data yang bukan kewenangannya:

```text
Akses Dibatasi

Halaman ini hanya dapat diakses oleh user yang memiliki role dan penugasan aktif sesuai kewenangan.
Silakan hubungi Admin Sistem jika akses ini diperlukan.
```

Jika user punya role tapi belum ada assignment:

```text
Belum Ada Penugasan Aktif

Anda memiliki role terkait, tetapi belum ditugaskan ke data/kegiatan/paket tersebut.
```

Jangan menampilkan data sensitif hanya karena item bisa diklik.

---

# 19. ATURAN MOBILE

Di mobile, clickable navigation tetap wajib berjalan.

Aturan mobile:

- gunakan card compact;
- hindari tabel besar;
- gunakan accordion;
- filter aktif ditampilkan sebagai chip;
- tombol reset filter mudah terlihat;
- tombol kembali mudah terlihat;
- jangan memuat data terlalu banyak sekaligus;
- gunakan pagination atau infinite scroll yang ringan.

---

# 20. ATURAN UNTUK CODEX

Codex wajib:

1. audit route dan filter aktual sebelum implementasi;
2. gunakan route yang sudah ada jika masih layak;
3. jangan membuat route ganda;
4. jangan membuat parameter filter sembarangan;
5. jangan mengubah role atau permission tanpa instruksi;
6. jangan mengubah database besar tanpa instruksi;
7. jangan membuat data dummy permanen;
8. jangan menghapus data lama;
9. pastikan semua clickable tetap responsive desktop/mobile;
10. laporkan file yang diubah.

Jika sistem aktual belum memiliki filter yang dibutuhkan, Codex harus:

1. laporkan filter yang belum ada;
2. usulkan mapping;
3. minta konfirmasi sebelum membuat perubahan besar.

---

# 21. PROMPT KHUSUS UNTUK CODEX

Gunakan prompt ini saat ingin menerapkan aturan clickable navigation:

```text
Baca dan patuhi:

/AGENTS.md
/docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md
/docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md

Tugas:
Terapkan Global Clickable Navigation & Auto Filter Rule pada modul yang saya sebutkan.

Jangan langsung mengubah semua modul.
Kerjakan hanya modul yang diminta.

Aturan:
1. Semua elemen data yang punya sumber data harus clickable.
2. Saat diklik, arahkan ke tab asal data.
3. Aktifkan filter otomatis sesuai klasifikasi data yang diklik.
4. Jika data tunggal, buka detail langsung.
5. Jika data banyak, tampilkan daftar dengan filter aktif.
6. Tampilkan breadcrumb asal klik.
7. Sediakan tombol Reset Filter.
8. Sediakan tombol Kembali.
9. Tetap ikuti role-based dan assignment-based access.
10. Jika user tidak punya izin, tampilkan Akses Dibatasi.
11. Jangan ubah role.
12. Jangan ubah workflow.
13. Jangan ubah database besar tanpa instruksi.
14. Jangan ubah routing besar tanpa audit.
15. Jangan menambah fitur di luar scope.

Sebelum coding:
Audit route, komponen, dan filter yang sudah ada.
Laporkan mapping yang akan dipakai.

Setelah selesai:
Laporkan file yang berubah, risiko, hasil build/lint/typecheck, dan bagian yang perlu dicek manual.
```

---

# 22. CATATAN FINAL

Aturan ini wajib diterapkan bertahap.

Prioritas penerapan:

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
11. Warning Center/Notifikasi
12. Laporan/Rekap
```

Jangan menerapkan ke semua modul sekaligus jika sistem belum siap.

Gunakan audit dan mapping terlebih dahulu.
