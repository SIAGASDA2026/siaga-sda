<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini mengunci konsep Peil Banjir tahap PB-DOC.1. Dokumen ini belum mengubah RBAC runtime, Prisma schema, migration, database, API, atau dependency.
-->

# SIAGA-SDA Peil Banjir Final Concept

## 1. Definisi Final

Peil Banjir di SIAGA-SDA adalah modul layanan permohonan dan penerbitan rekomendasi teknis peil banjir dari pihak ketiga, rekanan, perusahaan, atau pemohon lain yang membutuhkan rekomendasi dari Dinas PU Bidang SDA.

Peil Banjir bukan sekadar menu monitoring tinggi muka air, banjir, rob, atau catatan genangan. Data banjir, rob, drainase, dan kondisi lapangan tetap dapat dicatat sebagai bagian dari survey dan analisis teknis, tetapi bukan definisi utama modul.

Contoh pemohon:

- developer atau vendor perumahan;
- pemohon untuk kebutuhan KPR;
- perusahaan besar;
- perusahaan industri;
- perusahaan migas;
- pihak yang membangun fasilitas seperti tangki minyak, bangunan usaha, kawasan, atau kegiatan lain yang membutuhkan rekomendasi peil banjir.

## 2. Batasan Kewenangan

Dinas PU Bidang SDA menerbitkan rekomendasi teknis peil banjir, bukan izin bangunan.

Copy aman:

```text
Dinas PU Bidang SDA menerbitkan rekomendasi teknis peil banjir, bukan izin bangunan.
```

## 3. Hubungan Antar Menu

Alur administrasi resmi:

```text
Surat Masuk & Keluar
-> Surat permohonan diterima dan diagendakan
-> Kategori: Permohonan Rekomendasi Peil Banjir
-> Aksi: Buat Proses Peil Banjir
-> Masuk ke Peil Banjir sebagai permohonan/kasus aktif
-> Surat rekomendasi yang sudah terbit diarsipkan sebagai Surat Keluar
```

Prinsip:

- Surat Masuk & Keluar adalah pintu awal administrasi resmi.
- Peil Banjir adalah ruang kerja teknis dan administrasi proses rekomendasi.
- Surat Keluar adalah arsip surat rekomendasi yang sudah terbit atau ditandatangani.
- Jangan membuat konsep bahwa semua permohonan langsung masuk ke Peil Banjir tanpa pencatatan Surat Masuk.

## 4. Alur Lengkap Permohonan

Alur final:

```text
Surat Masuk & Keluar
-> Surat permohonan diterima dan diagendakan
-> Kategori: Permohonan Rekomendasi Peil Banjir
-> Aksi: Buat Proses Peil Banjir
-> Peil Banjir sebagai permohonan/kasus aktif
-> Verifikasi Administrasi
-> Survey Lapangan
-> Pengambilan Titik Koordinat
-> Review/Koreksi Hidrologi dan Hidrolika
-> Penyusunan Draft Rekomendasi
-> Review/Approval PPTK
-> Approval PPK
-> Tanda tangan Kadis
-> Surat Rekomendasi Terbit
-> Arsip Peil Banjir dan Surat Keluar
```

Sub-menu Peil Banjir yang disarankan:

1. Semua Permohonan
2. Verifikasi Administrasi
3. Survey Lapangan
4. Analisis Teknis
5. Draft Rekomendasi
6. Approval
7. Arsip & Rekap
8. Master Persyaratan

Master Persyaratan hanya untuk admin berwenang.

## 5. Persyaratan Administrasi Aktif

Gunakan label netral:

- Persyaratan Administrasi
- Daftar persyaratan yang berlaku untuk permohonan ini
- Master Persyaratan Peil Banjir
- Template Persyaratan Aktif
- Daftar Persyaratan Aktif
- Persyaratan Rekomendasi Peil Banjir

Jangan gunakan label yang menempelkan tahun pada nama persyaratan atau template UI.

Daftar persyaratan dari lampiran user menjadi referensi awal persyaratan aktif, bukan aturan hardcoded permanen dan tidak boleh menampilkan tahun pada UI utama, judul export PDF, atau label template.

## 6. Daftar Awal Persyaratan

1. Surat Permohonan
2. Fotocopy KTP Pemohon
3. Surat Kuasa Jika Pengurusan Diwakilkan
4. Fotocopy Surat Kepemilikan Tanah
5. Bukti Lunas PBB Tahun Terakhir
6. Akta Pendirian / Akta Perubahan Perusahaan
7. Biodata Perusahaan
8. Surat Pengesahan Menteri Kehakiman dan HAM bagi PT
9. Fotocopy NPWP
10. Gambar Situasi Tanah / Peta Lokasi / Layout
11. Detail Bangunan
12. Detail Saluran
13. Perhitungan Debit Air Maksimal / Hidrologi dan Hidrolika
14. Konfirmasi Kesesuaian Kegiatan Pemanfaatan Ruang
15. Izin Lokasi / Izin Tetangga
16. Dokumen/Persyaratan Lainnya

## 7. Fleksibilitas Persyaratan

Persyaratan administrasi harus bisa:

- ditambah;
- diedit;
- dinonaktifkan atau dihapus secara aman;
- diubah susunannya;
- diatur nomor urutnya;
- diberi sifat wajib, opsional, kondisional, atau tidak berlaku;
- diberi catatan;
- digunakan untuk upload dokumen per item.

Aksi UI konseptual:

- Tambah Persyaratan
- Edit Persyaratan
- Hapus / Nonaktifkan Persyaratan
- Ubah Susunan / Atur Urutan
- Tambah Persyaratan Khusus pada detail permohonan
- Upload File per item persyaratan
- Catatan Verifikator
- Riwayat perubahan / audit trail

Tombol UI boleh memakai label "Hapus" agar mudah dipahami user, tetapi secara konsep sistem melakukan nonaktif/soft delete. Hapus permanen tidak boleh dilakukan tanpa tahap khusus dan audit.

## 8. Dampak Perubahan Master Persyaratan

Perubahan pada Master Persyaratan hanya berlaku untuk permohonan Peil Banjir baru atau berikutnya.

Pola final:

```text
Master Persyaratan Aktif
-> dipakai saat membuat permohonan baru
-> sistem membuat snapshot checklist pada permohonan tersebut
-> jika master persyaratan diubah setelahnya, permohonan lama tetap memakai checklist lama/snapshot
-> export PDF berikutnya mengikuti daftar persyaratan aktif terbaru
-> permohonan baru berikutnya memakai daftar terbaru
```

Copy UI aman:

```text
Kelola daftar persyaratan yang akan digunakan untuk permohonan baru. Perubahan tidak memengaruhi permohonan yang sudah dibuat.
```

```text
Daftar persyaratan ini mengikuti ketentuan aktif saat permohonan dibuat.
```

```text
Jika persyaratan berubah, perubahan hanya berlaku untuk permohonan berikutnya.
```

```text
Permohonan lama tetap menggunakan daftar persyaratan yang berlaku saat permohonan dibuat.
```

## 9. Snapshot Checklist

Setiap permohonan Peil Banjir harus menyimpan snapshot persyaratan yang berlaku saat permohonan dibuat.

Snapshot minimal mencakup:

- nama persyaratan saat itu;
- nomor urut saat itu;
- sifat persyaratan saat itu;
- kategori persyaratan saat itu;
- status per item;
- file per item;
- catatan verifikator;
- riwayat upload/perubahan jika tersedia.

Tujuan snapshot:

- permohonan lama tidak berubah saat master persyaratan diedit;
- audit trail aman;
- arsip tetap sesuai kondisi saat proses berjalan.

## 10. Pola Upload Dokumen

Pola upload terdiri dari dua lapis:

1. Upload PDF/Berkas Gabungan Pemohon

- boleh diupload sebagai arsip awal;
- digunakan jika pemohon menyerahkan seluruh berkas dalam satu file;
- bukan satu-satunya dasar verifikasi rinci;
- tetap perlu checklist per item.

2. Upload Dokumen Per Persyaratan

- wajib disediakan untuk verifikasi resmi;
- setiap item checklist punya file, status, dan catatan;
- admin/verifikator menilai masing-masing dokumen secara terpisah.

Status checklist:

- Belum Upload
- Sudah Upload
- Lengkap
- Perlu Perbaikan
- Tidak Sesuai
- Tidak Berlaku

Sifat persyaratan:

- Wajib
- Opsional
- Kondisional
- Tidak Berlaku

Tampilan konseptual detail permohonan:

```text
Persyaratan Administrasi
Daftar persyaratan yang berlaku untuk permohonan ini

[Upload Berkas Gabungan]
[+ Tambah Persyaratan Khusus]

No | Persyaratan | Sifat | Status | File | Catatan | Aksi
```

## 11. Master Persyaratan Peil Banjir

Master Persyaratan Peil Banjir mengelola daftar persyaratan aktif yang digunakan untuk permohonan baru.

Tombol/aksi:

- Tambah Persyaratan
- Edit
- Hapus / Nonaktifkan
- Ubah Susunan
- Export PDF Persyaratan

Kolom konseptual:

- No
- Nama Persyaratan
- Kategori
- Sifat
- Status
- Urutan
- Catatan
- Aksi

Copy aman:

```text
Kelola daftar persyaratan yang digunakan untuk permohonan baru. Perubahan tidak memengaruhi permohonan yang sudah dibuat.
```

```text
Gunakan ubah susunan untuk mengatur nomor urut persyaratan yang tampil pada checklist dan export PDF.
```

## 12. Export PDF Persyaratan

Admin berwenang dapat mengunduh daftar Persyaratan Administrasi Peil Banjir sebagai PDF agar mudah diberikan kepada pemohon, rekanan, atau perusahaan.

Copy tombol:

- Export PDF Persyaratan
- Download Persyaratan PDF

Lokasi:

- Master Persyaratan Peil Banjir;
- detail permohonan jika relevan.

Isi minimal PDF:

1. Judul: Persyaratan Rekomendasi Peil Banjir
2. Pengantar: Daftar persyaratan ini digunakan untuk pengajuan permohonan rekomendasi peil banjir pada Dinas PU Bidang SDA.
3. Daftar persyaratan aktif sesuai susunan terbaru.
4. Catatan: Persyaratan dapat berubah sesuai ketentuan yang berlaku.
5. Catatan batasan: Dinas PU Bidang SDA menerbitkan rekomendasi teknis peil banjir, bukan izin bangunan.
6. Informasi opsional: nama instansi, tanggal export, nama petugas/admin yang mengunduh jika aman, dan kontak/ruang informasi jika tersedia.

Aturan PDF:

- mengambil daftar persyaratan aktif/latest dari sistem;
- tidak mengambil daftar hardcoded tahun tertentu;
- nomor urut mengikuti susunan terbaru Master Persyaratan Aktif;
- export berikutnya mengikuti perubahan terbaru;
- tidak menampilkan tahun pada judul/label utama PDF;
- perubahan master hanya berlaku untuk export berikutnya dan permohonan baru;
- permohonan lama tetap memakai snapshot lama.

Tahap PB-DOC.1 hanya mengunci konsep. Jangan menambah library PDF, dependency, endpoint, migration, atau database.

## 13. Role Khusus Peil Banjir

Dua role khusus final secara konsep:

1. `admin_peil_banjir`
   Label UI: Admin Peil Banjir

2. `tim_teknis_peil_banjir`
   Label UI: Tim Teknis Peil Banjir

Pada tahap PB-DOC.1, role ini hanya ditetapkan dalam dokumen konsep, copy, dan panduan. Jangan memaksa masuk ke RBAC runtime, Prisma schema, migration, database, seed, atau permission runtime.

Tahap implementasi role runtime harus dilakukan pada tahap khusus:

```text
PB-RBAC.1 - Penambahan Role Admin Peil Banjir dan Tim Teknis Peil Banjir
```

## 14. Tugas Admin Peil Banjir

Fokus: administrasi layanan Peil Banjir.

Tugas konseptual:

- input permohonan dari Surat Masuk;
- upload berkas awal/gabungan;
- cek kelengkapan persyaratan administrasi;
- mengelola checklist persyaratan;
- tambah/edit/nonaktifkan persyaratan jika diberi kewenangan;
- ubah susunan persyaratan jika diberi kewenangan;
- export PDF persyaratan jika diberi kewenangan;
- mencatat status verifikasi administrasi;
- mengarsipkan surat rekomendasi final;
- menghubungkan permohonan dengan Surat Masuk dan Surat Keluar.

Yang dapat dilihat:

- daftar permohonan Peil Banjir;
- surat masuk terkait permohonan;
- dokumen persyaratan;
- status verifikasi;
- status survey;
- status rekomendasi;
- arsip permohonan.

Yang dapat dilakukan:

- input/edit data administrasi permohonan sesuai kewenangan;
- upload dokumen administrasi;
- mengubah status kelengkapan;
- memberi catatan verifikator;
- export PDF persyaratan;
- menyiapkan arsip administrasi.

## 15. Tugas Tim Teknis Peil Banjir

Fokus: survey, koordinat, analisis teknis, review hidrologi/hidrolika, dan bahan rekomendasi.

Tugas konseptual:

- melihat permohonan Peil Banjir yang ditugaskan;
- melakukan survey lokasi;
- mengambil/input titik koordinat;
- upload foto/dokumentasi lapangan;
- mencatat kondisi drainase/kawasan sekitar;
- memeriksa dokumen teknis pemohon;
- review/koreksi perhitungan hidrologi;
- review/koreksi perhitungan hidrolika;
- membuat catatan teknis;
- menyusun bahan rekomendasi Peil Banjir;
- mengirim hasil review ke PPTK/PPK.

Yang dapat dilihat:

- permohonan yang ditugaskan;
- dokumen teknis pemohon;
- hasil verifikasi administrasi yang relevan;
- data lokasi;
- foto/dokumentasi survey;
- catatan teknis;
- status review.

Yang dapat dilakukan:

- input hasil survey;
- input koordinat;
- upload dokumentasi lapangan;
- memberi catatan teknis;
- mengoreksi perhitungan hidrologi/hidrolika;
- menyusun bahan rekomendasi;
- mengubah status teknis sesuai kewenangan.

## 16. Role Lain yang Terlibat

PPTK:

- review hasil survey dan rekomendasi teknis;
- memeriksa draft rekomendasi;
- memberi catatan/perbaikan;
- meneruskan ke PPK.

PPK:

- review final teknis/administrasi;
- approve sebelum naik ke tanda tangan Kadis;
- memberi catatan perbaikan.

Kabid:

- monitor seluruh proses;
- melihat rekap/status;
- memberi arahan sesuai kewenangan.

Kadis:

- tanda tangan surat rekomendasi final.

Jika Kadis belum punya akun di sistem, gunakan status:

- Menunggu Tanda Tangan Kadis
- Sudah Ditandatangani Kadis

Pemohon/perusahaan:

- untuk tahap awal tidak dibuat portal eksternal;
- pemohon/perusahaan dicatat sebagai pihak pengaju permohonan.

## 17. Catatan untuk Halo SIAGA-SDA

Copy final:

```text
Peil Banjir digunakan untuk mengelola permohonan rekomendasi peil banjir dari pihak ketiga, mulai dari surat masuk, verifikasi administrasi, survey lokasi, pengambilan titik koordinat, review perhitungan hidrologi dan hidrolika, penyusunan draft rekomendasi, approval PPTK/PPK, hingga penerbitan surat rekomendasi yang ditandatangani Kadis.
```

Catatan aman:

```text
Dinas PU Bidang SDA tidak menerbitkan izin bangunan. Fitur ini membantu proses rekomendasi teknis peil banjir sesuai permohonan dan hasil pemeriksaan.
```

Ringkasan role:

- Admin Peil Banjir mengelola administrasi layanan, persyaratan, dokumen, dan arsip permohonan.
- Tim Teknis Peil Banjir menangani survey, koordinat, review hidrologi/hidrolika, catatan teknis, dan bahan rekomendasi.

Halo tidak boleh menyebut semua role bisa edit/upload. Akses selalu sesuai kewenangan.

## 18. Batasan Implementasi Tahap Berikutnya

PB-DOC.1 tidak melakukan:

- perubahan RBAC runtime;
- penambahan role runtime;
- perubahan Prisma schema;
- migration;
- perubahan database;
- seed data;
- endpoint API baru;
- dependency PDF;
- export PDF runtime dari nol;
- perubahan login;
- perubahan modal Dashboard/Approval Center.

## 19. Rekomendasi Tahap Berikutnya

1. PB-RBAC.1 - Penambahan role runtime Admin Peil Banjir dan Tim Teknis Peil Banjir setelah review role.
2. PB-DATA.1 - Proposal schema Peil Banjir, master persyaratan, snapshot checklist, dokumen, survey, dan approval tanpa migration.
3. PB-UI.1 - UI detail permohonan Peil Banjir dan Master Persyaratan tanpa menambah dependency.
4. PB-PDF.1 - Desain export PDF Persyaratan jika data master sudah tersedia.
5. PB-API.1 - API resmi Peil Banjir setelah schema dan RBAC disetujui eksplisit.
