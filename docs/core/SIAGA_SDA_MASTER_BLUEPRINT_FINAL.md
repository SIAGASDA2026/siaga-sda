# SIAGA-SDA / SIMONPRO — MASTER BLUEPRINT & CODEX GUIDE FINAL

> **Nama lama:** SIMONPRO  
> **Nama baru:** SIAGA-SDA  
> **Kepanjangan:** Sistem Informasi, Analisis, Gerak Cepat dan Administrasi Sumber Daya Air  
> **Tagline:** Command Center SDA  
> **Instansi:** Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> **Status dokumen:** Final hasil diskusi awal untuk acuan Codex  
> **Prinsip kerja:** SIAGA-SDA adalah rebranding dan pengembangan bertahap dari SIMONPRO, bukan project baru.

---

## 0. INSTRUKSI WAJIB UNTUK CODEX

Sebelum mengubah kode apa pun, Codex wajib memahami bahwa project ini adalah **SIMONPRO yang direbranding dan dikembangkan menjadi SIAGA-SDA**.

### 0.1 Aturan utama

1. **Jangan rebuild total.**
2. **Jangan menghapus sistem lama tanpa audit.**
3. **Jangan menganggap SIAGA-SDA sebagai project baru.**
4. **Pertahankan data lama SIMONPRO sejauh mungkin.**
5. **Lakukan refactor bertahap dan aman.**
6. **Semua perubahan database wajib menggunakan migration Supabase.**
7. **Semua fitur harus mobile dan desktop responsive.**
8. **Jangan hardcode role dan permission.**
9. **Semua akses harus berbasis role + assignment aktif.**
10. **User dapat memiliki banyak role.**
11. **User/personel tidak boleh dihapus permanen jika masih punya histori. Gunakan status NONAKTIF/ARSIP.**
12. **Semua aksi penting wajib masuk audit log.**
13. **Peta Monitoring adalah jantung aplikasi, tetapi Dashboard hanya menampilkan ringkasan ringan.**
14. **Foto absensi tidak digunakan.**
15. **Petugas lapangan biasa tidak wajib punya akun.**
16. **Mandor memilih anggota dari master data petugas, bukan mengetik nama bebas setiap hari.**
17. **Semua foto upload wajib dikompres otomatis sebelum disimpan.**
18. **Direksi Teknis wajib tetap ada pada workflow paket fisik.**
19. **Program/Kegiatan/Sub Kegiatan bukan menu utama, hanya relasi/filter data.**
20. **Ikuti design system dan visual referensi yang disimpan di `/docs/assets`.**

### 0.2 Prioritas pengerjaan

1. Stabilitas sistem lama SIMONPRO.
2. Kompatibilitas data lama.
3. Refactor bertahap.
4. Fitur baru.
5. Optimasi UI/UX.
6. Optimasi performa.

### 0.3 Setiap tahap coding wajib

Setelah menyelesaikan setiap tahap:

- Jalankan build.
- Jalankan lint/typecheck.
- Jalankan test jika tersedia.
- Cek tampilan desktop.
- Cek tampilan mobile.
- Laporkan file yang berubah.
- Laporkan migration database baru.
- Laporkan risiko/bagian yang belum selesai.

---

## 1. IDENTITAS DAN BRANDING SISTEM

### 1.1 Nama sistem

```text
SIAGA-SDA
Sistem Informasi, Analisis, Gerak Cepat dan Administrasi Sumber Daya Air
Command Center SDA
```

### 1.2 Instansi

```text
Dinas Pekerjaan Umum
Bidang Sumber Daya Air
Kota Dumai
```

### 1.3 Footer resmi

Gunakan footer:

```text
SIAGA-SDA
©2026 Budi Legawan, ST
All Rights Reserved
```

### 1.4 Logo resmi

Logo resmi memakai gambar yang sudah dipilih user, dengan karakter:

- tetesan air
- shield/perisai
- grafik monitoring
- gelombang/aliran air
- warna navy, biru, cyan, hijau

Makna logo:

- **Tetesan air:** pengelolaan sumber daya air, banjir, drainase, hidrologi.
- **Shield/perisai:** perlindungan, keamanan data, kontrol, pusat kendali.
- **Grafik naik:** monitoring, analisis, progres, data real-time.
- **Gelombang:** aliran air, konektivitas, gerak cepat.
- **Navy:** stabilitas, pemerintahan, profesionalitas.
- **Biru/cyan:** air, informasi, monitoring.
- **Hijau:** pembangunan, keberlanjutan, progres.

Logo dan visual referensi sebaiknya disimpan di:

```text
/docs/assets/logo-siaga-sda.png
/docs/assets/login-ui-desktop.png
/docs/assets/login-ui-mobile.png
/docs/assets/dashboard-ui-desktop.png
/docs/assets/dashboard-ui-mobile.png
/docs/assets/map-monitoring-desktop.png
/docs/assets/map-monitoring-mobile.png
/docs/assets/survey-ui-desktop.png
/docs/assets/survey-ui-mobile.png
/docs/assets/package-ui-desktop.png
/docs/assets/package-ui-mobile.png
/docs/assets/approval-center-desktop.png
/docs/assets/approval-center-mobile.png
```

---

## 2. DESIGN SYSTEM FINAL

### 2.1 Filosofi UI

SIAGA-SDA harus terasa seperti:

```text
Smart Government Command Center SDA
```

Bukan:

- aplikasi CRUD biasa
- aplikasi kasir
- aplikasi startup SaaS umum
- aplikasi gaming/neon
- ERP jadul
- dashboard terlalu ramai

Karakter UI:

- modern
- clean
- government enterprise
- command center
- map-centric
- mobile-first
- cepat dibaca
- ringan
- profesional
- konsisten

### 2.2 Warna utama

```css
--dark-navy: #0D2C54;
--primary-blue: #1976D2;
--cyan-info: #00ACC1;
--success-green: #43A047;
--warning-orange: #FFB300;
--danger-red: #E53935;
--main-bg: #F4F7FA;
--card-bg: #FFFFFF;
--soft-gray: #E9EEF5;
--text-primary: #1B2430;
--text-secondary: #5C6B7A;
--text-muted: #8A97A6;
```

### 2.3 Typography

Gunakan:

```css
font-family: Inter, system-ui, sans-serif;
```

Skala:

- H1: 40px / 700
- H2: 32px / 700
- H3: 24px / 600
- H4: 20px / 600
- Body Large: 16px / 500
- Body: 14px / 400
- Caption: 12px / 400

### 2.4 Spacing

Gunakan 4px scale:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64
```

### 2.5 Radius dan shadow

```css
--radius-card: 16px;
--radius-modal: 20px;
--radius-button: 12px;
--radius-small: 8px;

--shadow-card: 0 4px 12px rgba(13,44,84,0.08);
--shadow-floating: 0 8px 24px rgba(13,44,84,0.12);
```

### 2.6 Icon

Gunakan Lucide Icons, outline, konsisten.

Jangan pakai icon random campuran.

---

## 3. STRUKTUR MENU FINAL

Menu utama final:

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

### 3.1 Yang tidak dijadikan menu utama

Program/Kegiatan/Sub Kegiatan **tidak menjadi menu utama**.  
Data tersebut hanya menjadi relasi/filter pada paket dan administrasi.

### 3.2 Menu yang dihilangkan dari sidebar utama

- Master Data sebagai tab utama dihapus.
- Master data ditempatkan di dalam Pengaturan/Admin sesuai permission.

---

## 4. HIERARKI DATA

Struktur data dasar:

```text
PROGRAM
└── KEGIATAN
    └── SUB_KEGIATAN
        └── PAKET
```

Catatan:

- 1 program memiliki banyak kegiatan.
- 1 kegiatan memiliki banyak sub kegiatan.
- 1 sub kegiatan memiliki banyak paket.
- 1 kegiatan dapat memiliki 1 admin kegiatan.
- Admin kegiatan bertanggung jawab administrasi kegiatan/paket yang ditugaskan.

---

## 5. ROLE FINAL

Role utama final:

```text
SUPER_ADMIN
ADMIN_SISTEM
ADMIN_KEGIATAN
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

### 5.1 Prinsip role

- Jangan hardcode role.
- Gunakan role + assignment.
- User bisa punya lebih dari satu role.
- Contoh: Kepala Bidang bisa sekaligus PPK.
- Assignment punya masa berlaku.
- Assignment lama tetap disimpan untuk histori/audit.
- Jika PPK/PPTK pindah dinas, assignment lama diakhiri, assignment baru dibuat, histori tetap aman.

---

## 6. LOGIN, REGISTRASI, DAN USER MANAGEMENT

### 6.1 Login final

Login harus resmi, sederhana, audit-safe.

Field login:

```text
Username / Email / NIP
Password
[Masuk]
Lupa Password
Daftar Akun Eksternal
```

Tidak boleh ada:

- Login Google
- Login Microsoft
- Login sosial
- Role dropdown di login utama

Role ditentukan setelah login berdasarkan database/assignment, bukan dipilih manual di halaman login.

### 6.2 Tampilan login

Login harus menampilkan:

```text
SIAGA-SDA
Sistem Informasi, Analisis, Gerak Cepat dan Administrasi Sumber Daya Air
Command Center SDA

Dinas Pekerjaan Umum
Bidang Sumber Daya Air
Kota Dumai
```

Panel status:

```text
Server Online
Database Aktif
Peta Monitoring Aktif
Pasang Surut Terpantau
Peringatan SDA Normal
```

Footer:

```text
SIAGA-SDA
©2026 Budi Legawan, ST
All Rights Reserved
```

### 6.3 Registrasi eksternal

Untuk:

- kontraktor
- konsultan
- penyedia

Field:

- nama perusahaan
- nama PIC
- email
- nomor HP
- jenis perusahaan
- role permintaan
- dokumen legalitas opsional
- status verifikasi

Status:

```text
MENUNGGU_VERIFIKASI
AKTIF
DITOLAK
NONAKTIF
ARSIP
```

### 6.4 Internal dinas

Akun internal dapat:

- dibuat oleh admin
- atau self register lalu diverifikasi admin

Data internal:

- nama
- NIP
- jabatan
- SK/penugasan
- email
- no HP
- bidang
- role yang diminta/ditugaskan

### 6.5 Nonaktif dan arsip

User jangan dihapus permanen jika punya histori. Gunakan:

```text
AKTIF
NONAKTIF
ARSIP
```

---

## 7. DASHBOARD

### 7.1 Prinsip dashboard

Dashboard bukan Peta Monitoring penuh.

Dashboard adalah ringkasan cepat agar ringan.

Dashboard tidak boleh memuat peta interaktif besar.  
Jika perlu, tampilkan **Peta Monitoring Ringkas** berupa mini preview ringan/static summary card.

### 7.2 Isi dashboard

- Total Paket Aktif
- Paket Deviasi/Kritis
- Approval Pending
- Survey Belum Ditindaklanjuti
- Surat Masuk Penting
- Asset SDA Aktif
- Warning Center
- Ringkasan Pasang Surut
- Aktivitas Terbaru
- Akses Cepat
- Ringkasan Approval
- Ringkasan Asset SDA
- Tombol Buka Peta Monitoring

### 7.3 Dashboard Pimpinan

Pimpinan read-only.

Dashboard Pimpinan fokus:

- status kota
- warning utama
- paket kritis/deviasi
- survey belum ditindaklanjuti
- surat penting
- status asset
- pasang surut
- catatan ke PPK/Kabid

Pimpinan tidak boleh:

- edit
- upload
- approve

Pimpinan boleh:

- melihat
- memonitor
- mengirim catatan ke PPK/Kabid

---

## 8. PETA MONITORING

### 8.1 Prinsip

Peta Monitoring adalah jantung aplikasi.  
Peta Monitoring bukan hanya banjir, tetapi seluruh kegiatan SDA terintegrasi.

### 8.2 Layer Peta

Layer wajib:

```text
Paket Pekerjaan
Survey Investigasi
Asset SDA
Operasional SDA
Peil Banjir
Pasang Surut
Surat Masuk
Deviasi / Warning
```

### 8.3 Marker

Marker tidak boleh bertumpuk membingungkan.

Prinsip:

```text
1 lokasi = 1 marker utama aktif
```

Jika survey menjadi paket/ditindaklanjuti:

- marker survey tidak hilang dari histori
- di peta aktif marker dapat berubah menjadi marker paket/tindak lanjut
- detail marker menampilkan survey asal dan tindak lanjut terkait

### 8.4 Detail marker paket

Saat marker paket diklik, drawer menampilkan:

- nama paket
- jenis paket
- subkategori konsultan jika ada
- metode pengadaan
- lokasi
- status
- progress fisik
- deviasi
- nilai kontrak
- PPK
- PPTK
- Direksi Teknis untuk fisik
- Konsultan Pengawas jika ada
- Kontraktor
- dokumen upload
- tahap pekerjaan
- survey asal
- surat terkait
- asset terkait
- tombol Buka Detail Paket

### 8.5 Detail marker survey

- judul survey
- kategori masalah
- lokasi
- status
- tingkat urgensi
- tim survey
- rekomendasi awal
- surat terkait
- tindak lanjut
- tombol buka detail survey

### 8.6 Detail marker asset

- nama asset
- jenis asset
- kondisi
- status operasional
- mandor/tim
- laporan terakhir
- pasang surut terkait
- tombol buka detail asset

---

## 9. SURVEY INVESTIGASI

### 9.1 Fungsi

Survey Investigasi adalah menu utama untuk mencatat masalah lapangan, bukan hanya banjir.

Contoh kategori:

- banjir
- drainase kecil
- drainase tersumbat
- sedimentasi
- normalisasi
- tanggul rusak
- longsor
- genangan
- instruksi pimpinan
- aduan warga
- tindak lanjut surat

### 9.2 Role

- Tim Survey
- Tim Perencana Rutin
- PPTK
- PPK
- Kepala Bidang

### 9.3 Approval

Survey diapprove sesuai assignment.  
Sebelumnya disepakati final approval PPK, namun ada juga kebutuhan tanggapan/lanjutan oleh Kepala Bidang. Maka gunakan alur:

```text
Survey dibuat
→ Ditinjau teknis
→ Menunggu Tindak Lanjut
→ Tanggapan/Kebijakan Kabid jika dibutuhkan
→ Approval PPK jika menjadi pekerjaan/administrasi formal
→ Ditindaklanjuti
→ Selesai/Arsip
```

### 9.4 Istilah final

Jangan gunakan:

```text
Menjadi Paket
Jadikan Paket
Tindak Menjadi Paket
```

Gunakan:

```text
Ditindaklanjuti
Tindak Lanjuti
```

Karena tidak semua survey harus menjadi paket.

### 9.5 Jenis tindak lanjut

```text
DIBUAT_PAKET_RUTIN
PERBAIKAN_LANGSUNG
SURAT_BALASAN
KOORDINASI_OPD
USULAN_TAHUN_BERIKUTNYA
TIDAK_DILANJUTKAN
ARSIP
```

Jika dibuat paket, tampilkan paket terkait.

### 9.6 Field tindak lanjut

- follow_up_type
- follow_up_status
- linked_package_id
- linked_letter_id
- follow_up_note
- follow_up_by
- follow_up_at

---

## 10. JENIS PAKET

Jenis paket final hanya:

```text
FISIK
KONSULTAN
RUTIN
```

### 10.1 Subkategori konsultan

Untuk paket jenis KONSULTAN, subkategori:

```text
KONSULTAN_PERENCANAAN
KONSULTAN_PENGAWASAN
```

### 10.2 Metode pengadaan

Metode pengadaan terpisah dari jenis paket:

```text
PENGADAAN_LANGSUNG
LELANG
```

Jangan membuat jenis paket menjadi terlalu banyak.

---

## 11. PAKET PEKERJAAN

### 11.1 Prinsip

```text
1 paket = 1 ruang kerja
```

Semua proses paket ditampilkan dalam detail paket.

### 11.2 Section detail paket

1. Informasi Paket
2. Perencanaan
3. Pengadaan
4. Kontrak
5. Pra-Konstruksi
6. Pelaksanaan & Pengawasan
7. Laporan
8. Pembayaran & SPM
9. Addendum & CCO
10. PHO & FHO
11. Arsip & Audit Log

### 11.3 Paket Fisik

Role:

- PPK
- PPTK
- Direksi Teknis
- Konsultan Pengawas jika ada
- Kontraktor
- PPHP

Direksi Teknis wajib ada dalam workflow fisik dan tidak boleh terlupakan.

### 11.4 Paket Rutin

Workflow:

- Survey Investigasi
- Tim Perencana Rutin
- PPTK
- PPK
- Kepala Bidang jika perlu tanggapan kebijakan
- Pejabat Pengadaan
- Kontraktor/Penyedia
- Tim Pengawas Rutin

Paket rutin tidak wajib:

- Direksi Teknis
- Konsultan Pengawas

### 11.5 Konsultan Perencanaan

Output:

- survey awal
- gambar teknis
- shop drawing / gambar rencana
- RAB
- BOQ
- HPS
- AHSP jika diperlukan
- spek teknis umum
- spek teknis khusus
- KAK/TOR
- backup data
- perhitungan teknis
- dokumen final

Semua dokumen:

- upload
- versioning
- approval
- histori revisi

### 11.6 Konsultan Pengawasan

Tugas:

- mengawasi paket fisik
- laporan pengawasan
- pemeriksaan progres
- monitoring deviasi
- rekomendasi teknis

Harus dapat ditautkan ke satu atau beberapa paket fisik.

---

## 12. PRA-KONSTRUKSI

Mobilisasi dihapus.

PCM:

- boleh berkali-kali
- multi-record

Isi PCM:

- tanggal
- jenis PCM
- agenda
- notulen
- BA
- daftar hadir
- catatan
- dokumen upload

---

## 13. LAPORAN DAN PENGAWASAN

### 13.1 Paket rutin

```text
Kontraktor/Penyedia
→ Tim Pengawas Rutin
→ PPTK
→ PPK
```

### 13.2 Paket fisik

Jika ada Konsultan Pengawas:

```text
Kontraktor
→ Konsultan Pengawas
→ Direksi Teknis
→ PPTK
→ PPK
```

Jika tidak ada Konsultan Pengawas:

```text
Kontraktor
→ Direksi Teknis
→ PPTK
→ PPK
```

### 13.3 Jenis laporan

- Laporan Harian
- Laporan Mingguan
- Laporan Bulanan
- MC/Opname
- Dokumentasi lapangan

---

## 14. PHO, FHO, DAN PPHP

PPHP wajib ada dalam sistem.

Fitur:

- permohonan PHO
- pemeriksaan hasil pekerjaan
- checklist dokumen
- punch list
- BA PHO
- masa pemeliharaan
- permohonan FHO
- BA FHO
- pemeriksaan akhir

Role:

- Kontraktor mengajukan
- Konsultan Pengawas/Tim Pengawas Rutin memeriksa awal jika ada
- Direksi Teknis terlibat untuk fisik jika ditugaskan
- PPTK memeriksa
- PPHP memeriksa hasil pekerjaan
- PPK approve final

---

## 15. ADMINISTRASI

### 15.1 Admin Kegiatan

Konsep:

```text
1 kegiatan = 1 Admin Kegiatan
```

Admin Kegiatan bertanggung jawab pada:

- kontrak
- SPK/SPMK
- addendum
- SPM
- pembayaran
- arsip administrasi
- dokumen administrasi

Admin Kegiatan hanya mengelola kegiatan yang ditugaskan.

### 15.2 Kontrak

Data:

- nomor kontrak
- tanggal kontrak
- nilai kontrak
- masa pelaksanaan
- masa pemeliharaan
- penyedia
- jaminan pelaksanaan
- jaminan uang muka jika ada
- jaminan pemeliharaan
- dokumen kontrak

### 15.3 Addendum & CCO

Jenis:

- addendum waktu
- addendum nilai
- addendum volume
- addendum teknis
- CCO
- RAB final
- RAB CCO
- RAB kontrak
- RAB perencanaan

---

## 16. SURAT MASUK & KELUAR

### 16.1 Prinsip

Tetap 1 tab:

```text
Surat Masuk & Keluar
```

Tetapi kategori dan workflow berbeda.

### 16.2 Kategori surat

- Undangan Rapat
- Aduan Warga
- Permohonan Drainase
- Permohonan Normalisasi
- Permohonan Peil
- Instruksi Pimpinan
- Surat Internal
- Surat Eksternal
- Lainnya

### 16.3 Relasi surat

Surat dapat memiliki:

- linked_survey_id
- linked_package_id
- linked_peil_id
- linked_meeting_id

Tidak semua harus terisi.

### 16.4 Surat aduan/permohonan

Alur:

```text
Surat Masuk
→ Disposisi
→ Survey Investigasi
→ Tanggapan/Tindak Lanjut
→ Paket jika dibutuhkan
→ Selesai/Arsip
```

### 16.5 Surat undangan rapat

Alur:

```text
Surat masuk
→ dibaca admin
→ disposisi Kabid
→ peserta ditunjuk
→ rapat dilaksanakan
→ hasil rapat dicatat
→ tindak lanjut jika ada
→ selesai/arsip
```

Yang dicatat:

- tanggal rapat
- lokasi rapat
- peserta yang ditunjuk
- ringkasan rapat
- hasil rapat
- tindak lanjut
- deadline
- dokumen rapat
- daftar hadir
- notulen

Tidak semua undangan perlu approval formal.  
Lebih tepat statusnya: dibaca/disposisi/selesai.

---

## 17. PEIL BANJIR

### 17.1 Role

- Admin Peil
- Tim Survey
- Tim Perencana Rutin jika perlu
- PPTK
- PPK

### 17.2 Workflow

```text
Permohonan masuk
→ survey
→ pemeriksaan PPTK
→ approval PPK
→ surat rekomendasi
→ selesai/arsip
```

### 17.3 Field

- nama pemohon/perusahaan
- alamat perusahaan
- kontak
- lokasi
- koordinat
- kelurahan
- kecamatan
- tanggal survey
- elevasi peil rencana
- elevasi eksisting
- tinggi muka air
- elevasi banjir historis
- rekomendasi teknis
- status dokumen
- approval PPTK
- approval PPK
- surat rekomendasi

### 17.4 Dokumen

- surat permohonan
- dokumen perusahaan
- gambar/site plan
- foto lapangan
- hasil survey
- perhitungan elevasi
- rekomendasi teknis
- draft surat rekomendasi
- surat rekomendasi final
- dokumen pendukung

Terhubung ke Peta Monitoring.

---

## 18. ASSET SDA

### 18.1 Jenis asset

- Pintu Air
- Rumah Pompa
- Pompa Mobile
- Tanggul
- Drainase Utama
- Kanal
- Pintu Klep
- Bendung
- Kolam Retensi
- Pos Jaga
- Sensor Muka Air
- CCTV
- Genset
- Panel Listrik
- Bangunan Operasi

### 18.2 Prinsip

Asset SDA tidak perlu dipaksa terhubung ke Survey/Peil, tetapi tampil di Peta Monitoring dan bisa terkait operasional.

### 18.3 Submenu asset/operasional

- Peta Asset
- Operasi Pintu Air
- Operasi Rumah Pompa
- Shift & Petugas
- Laporan Operasi
- Chat Operasional

---

## 19. OPERASIONAL SDA

### 19.1 Pintu air dan rumah pompa

Pintu air dan rumah pompa adalah satu kesatuan operasional.

Role:

- Mandor Operasional SDA
- Petugas Pintu Air
- Petugas Rumah Pompa

### 19.2 Rehabilitasi drainase

Role tambahan:

- Mandor Rehab Drainase
- Petugas Rehab Drainase

### 19.3 Mandor

Mandor wajib punya akun.

Mandor bisa lebih dari satu.

Mandor bertugas:

- mengatur shift
- memilih anggota dari master data
- input laporan operasi
- input operasi pintu/pompa
- input pekerjaan rehab drainase
- upload foto kondisi jika perlu
- chat operasional
- respon warning pasang surut/banjir

### 19.4 Petugas biasa

Petugas biasa tidak wajib punya akun.

Petugas dibuat sebagai master data petugas, bukan akun login.

Mandor memilih petugas dari daftar, bukan mengetik manual.

---

## 20. KEHADIRAN PETUGAS DAN REKAP BULANAN

### 20.1 Prinsip

Tidak menggunakan foto absensi.

Kehadiran dicatat oleh mandor melalui laporan shift.

### 20.2 Master data petugas

Field:

- id
- nama lengkap
- nomor HP jika ada
- jenis petugas
- tim
- status aktif/nonaktif
- created_by

### 20.3 Shift log

Field:

- tanggal
- shift
- asset/lokasi
- mandor
- anggota
- status kehadiran
- catatan
- GPS mandor
- laporan

### 20.4 Status kehadiran

```text
HADIR
IZIN
SAKIT
CUTI
ALPA
```

### 20.5 Rekap

Sistem harus dapat export:

- Excel
- PDF

Rekap bulanan:

- seluruh petugas
- seluruh mandor
- hadir
- izin
- sakit
- cuti
- alpa
- total hari tugas

Rekap berdasarkan `worker_id`, bukan teks nama.

---

## 21. PASANG SURUT AIR LAUT

### 21.1 Fungsi

Tampil di Peta Monitoring dan Dashboard sebagai ringkasan.

### 21.2 Data

Gunakan:

- API/BMKG jika tersedia
- scheduler backend
- cache ke Supabase/database

Jangan fetch langsung dari frontend saat membuka peta.

### 21.3 Tampilan

- muka air saat ini
- tren naik/turun
- countdown
- prediksi pasang tertinggi
- prediksi surut terendah
- data 3 jam sebelum
- saat ini
- 3 jam sesudah
- status: aman/waspada/siaga/kritis

### 21.4 Warning

Status:

```text
AMAN
WASPADA
SIAGA
KRITIS
```

---

## 22. FOTO, FILE, DAN STORAGE

### 22.1 Prinsip

Semua foto harus dikompres otomatis sebelum upload.

Workflow:

```text
Kamera HP
→ user ambil foto
→ frontend compress
→ generate thumbnail
→ upload ke storage
```

### 22.2 Kategori file

- Foto Operasional
- Foto Penting
- Dokumen Resmi

### 22.3 Foto absensi

Foto absensi dihapus/tidak digunakan.

### 22.4 Metadata

Simpan:

- original_size
- compressed_size
- compression_ratio
- thumbnail_url
- file_category
- uploaded_by
- uploaded_at

---

## 23. APPROVAL CENTER

### 23.1 Fungsi

Approval Center menampilkan semua item pending sesuai role dan assignment.

### 23.2 Jenis item

- Survey Investigasi
- Laporan Harian/Mingguan/Bulanan
- Dokumen Konsultan
- Addendum
- SPM/Pembayaran
- PHO/FHO
- Peil Banjir
- Surat Keluar
- Dokumen Perencanaan

### 23.3 Aksi

- Setujui
- Minta Revisi
- Tolak
- Lihat Detail
- Catatan

### 23.4 Permission

- hanya role berwenang bisa approve
- Pimpinan read-only
- Auditor read-only
- user nonaktif tidak bisa approve

---

## 24. AUDIT LOG

Audit log adalah menu utama.

Catat:

- login
- logout
- failed login
- user dibuat
- user diverifikasi
- role diubah
- assignment dibuat/diubah
- survey dibuat/diapprove
- paket dibuat/diubah
- dokumen upload
- laporan dibuat/diapprove
- kontrak dibuat
- addendum dibuat
- SPM dibuat
- PHO/FHO
- surat masuk/keluar
- peil
- asset
- operasi SDA
- shift mandor
- catatan pimpinan
- perubahan threshold pasang surut

---

## 25. NOTIFIKASI

Belum dibahas sangat detail, tetapi sistem perlu menyiapkan notifikasi untuk:

- approval pending
- surat masuk penting
- survey kritis
- paket deviasi
- pasang surut waspada/siaga/kritis
- asset offline
- rumah pompa/pintu air perlu respon
- masa kontrak hampir selesai
- laporan belum masuk

Channel awal:

- in-app notification

Channel lanjutan opsional:

- email
- WhatsApp gateway
- push notification PWA

---

## 26. CHAT DAN CATATAN

### 26.1 Chat proyek

Chat per paket/proyek untuk koordinasi.

### 26.2 Chat operasional

Chat per asset/tim operasional untuk pintu air, rumah pompa, rehab drainase.

### 26.3 Catatan pimpinan

Pimpinan dapat memberi catatan ke PPK/Kabid, tetapi tidak approve.

---

## 27. MULTI TAHUN DAN ARSIP

### 27.1 Pergantian tahun

Data tahun lama tidak dihapus.

Gunakan filter tahun anggaran.

### 27.2 Proyek lintas tahun

Jika addendum waktu melewati tahun berikutnya:

- paket tetap aktif
- tahun anggaran asal tetap tercatat
- status lintas tahun/lanjutan
- histori tetap aman

### 27.3 PPK/PPTK pindah

Gunakan assignment history.

Assignment lama:

- end_date diisi
- status nonaktif

Assignment baru:

- dibuat untuk pengganti
- mulai tanggal tertentu

Histori approval lama tetap milik pejabat lama.

---

## 28. DATABASE PRINCIPLE

### 28.1 Prinsip utama

- assignment-based
- multi-role
- audit-ready
- scalable
- tidak hard delete
- migration bertahap
- indexed query
- pagination
- lazy loading

### 28.2 Index penting

Tambahkan index untuk:

- package_id
- survey_id
- letter_id
- peil_id
- asset_id
- activity_id
- status
- created_at
- assigned_user_id
- role_code
- fiscal_year
- coordinates jika GIS query

---

## 29. PERFORMANCE RULES

Agar sistem tidak hang/crash:

1. Jangan load semua data sekaligus.
2. Gunakan pagination.
3. Gunakan lazy loading.
4. Peta lengkap hanya di menu Peta Monitoring.
5. Dashboard hanya ringkasan ringan.
6. Map marker gunakan clustering jika banyak.
7. Foto wajib kompres.
8. Gunakan thumbnail di list/dashboard.
9. Realtime hanya untuk hal penting.
10. Query harus difilter berdasarkan assignment.
11. Hindari dashboard terlalu banyak widget realtime.

---

## 30. FILE `.MD` YANG DISARANKAN

Struktur `/docs`:

```text
/docs
├── /core
│   ├── SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md
│   ├── SIAGA_SDA_REBRANDING_RULES.md
│   ├── SIAGA_SDA_SYSTEM_ARCHITECTURE.md
│   └── SIAGA_SDA_WORKFLOW_MASTER.md
│
├── /design
│   ├── SIAGA_SDA_DESIGN_SYSTEM.md
│   ├── SIAGA_SDA_LOGO_GUIDELINE.md
│   └── SIAGA_SDA_UI_DIRECTION.md
│
├── /database
│   ├── SIAGA_SDA_DATABASE_RULES.md
│   ├── SIAGA_SDA_DATABASE_SCHEMA.md
│   └── SIAGA_SDA_STORAGE_RULES.md
│
├── /auth
│   ├── SIAGA_SDA_LOGIN_AUTH_UI.md
│   ├── SIAGA_SDA_PERMISSION_SYSTEM.md
│   └── SIAGA_SDA_SECURITY_RULES.md
│
├── /roles
│   ├── SIAGA_SDA_DASHBOARD_PIMPINAN.md
│   ├── SIAGA_SDA_SUPER_ADMIN_UI.md
│   ├── SIAGA_SDA_ADMIN_SYSTEM_UI.md
│   ├── SIAGA_SDA_ADMIN_KEGIATAN_UI.md
│   ├── SIAGA_SDA_ADMIN_SURAT_UI.md
│   ├── SIAGA_SDA_ADMIN_PEIL_UI.md
│   ├── SIAGA_SDA_PPK_UI.md
│   ├── SIAGA_SDA_PPTK_UI.md
│   ├── SIAGA_SDA_DIREKSI_TEKNIS_UI.md
│   ├── SIAGA_SDA_KONSULTAN_PERENCANA_UI.md
│   ├── SIAGA_SDA_KONSULTAN_PENGAWAS_UI.md
│   ├── SIAGA_SDA_KONTRAKTOR_UI.md
│   ├── SIAGA_SDA_PPHP_UI.md
│   ├── SIAGA_SDA_MANDOR_OPERASIONAL_UI.md
│   └── SIAGA_SDA_MANDOR_REHAB_UI.md
│
├── /modules
│   ├── SIAGA_SDA_MAP_MONITORING_UI.md
│   ├── SIAGA_SDA_DASHBOARD_UI.md
│   ├── SIAGA_SDA_SURVEY_UI.md
│   ├── SIAGA_SDA_PACKAGE_WORKSPACE_UI.md
│   ├── SIAGA_SDA_APPROVAL_CENTER_UI.md
│   ├── SIAGA_SDA_SURAT_UI.md
│   ├── SIAGA_SDA_PEIL_UI.md
│   ├── SIAGA_SDA_ASSET_UI.md
│   ├── SIAGA_SDA_AUDIT_LOG_UI.md
│   └── SIAGA_SDA_REPORT_EXPORT_UI.md
│
├── /operational
│   ├── SIAGA_SDA_OPERASIONAL_SDA_UI.md
│   ├── SIAGA_SDA_PASANG_SURUT_SYSTEM.md
│   ├── SIAGA_SDA_SHIFT_SYSTEM.md
│   └── SIAGA_SDA_REKAP_KEHADIRAN.md
│
├── /assets
│   ├── logo-siaga-sda.png
│   ├── login-ui-desktop.png
│   ├── login-ui-mobile.png
│   └── visual-ui-reference.png
│
└── /prompts
    └── SIAGA_SDA_CODEX_PROMPTS_STEP_BY_STEP.md
```

---

## 31. PROMPT UMUM UNTUK CODEX

Gunakan pola ini sebelum setiap tahap:

```text
Baca dan patuhi file berikut:

/docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md
/docs/design/SIAGA_SDA_DESIGN_SYSTEM.md

Project ini adalah rebranding dan pengembangan dari SIMONPRO menjadi SIAGA-SDA.
SIAGA-SDA bukan project baru.

Jangan rebuild total.
Jangan menghapus data lama tanpa audit.
Gunakan migration Supabase.
Gunakan assignment-based access.
Jangan hardcode role.
Semua UI harus responsive desktop dan mobile.
Ikuti visual referensi di /docs/assets.

Kerjakan hanya tahap yang diminta.
Setelah selesai, jalankan build/lint/typecheck dan laporkan file yang berubah.
```

---

## 32. URUTAN EKSEKUSI DISARANKAN

1. Backup SIMONPRO
2. Tambahkan folder `/docs`
3. Masukkan semua file `.md`
4. Masukkan logo dan visual referensi ke `/docs/assets`
5. Audit project lama
6. Rebranding SIAGA-SDA
7. Login/Auth/User Management
8. Database core + Supabase migration
9. Role/Assignment/Permission
10. Menu final
11. Dashboard ringan
12. Peta Monitoring lengkap
13. Survey Investigasi
14. Paket Pekerjaan
15. Approval Center
16. Surat Masuk & Keluar
17. Administrasi
18. Peil Banjir
19. Asset SDA
20. Operasional SDA
21. Pasang Surut
22. Upload compression
23. Audit log
24. Export PDF/Excel
25. Testing mobile/desktop
26. Optimasi performa

---

## 33. KESIMPULAN FINAL

SIAGA-SDA adalah pengembangan SIMONPRO menjadi:

```text
Smart Government Command Center SDA
```

Fokus akhir:

- satu data
- satu peta
- satu alur kerja
- monitoring proyek
- monitoring SDA
- survey investigasi
- surat masuk
- peil banjir
- asset SDA
- operasional lapangan
- pasang surut
- approval
- audit
- administrasi
- pengambilan keputusan cepat

Sistem harus:

- stabil
- tidak berat
- mobile-friendly
- audit-safe
- scalable multi tahun
- mudah dipakai lapangan
- mudah dipantau pimpinan
- profesional untuk Dinas PU Bidang SDA Kota Dumai
