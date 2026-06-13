# AGENTS.md — SIAGA-SDA

## Identitas Project

Project ini adalah **SIAGA-SDA**.

SIAGA-SDA adalah:

```text
Sistem Informasi, Analisis, Gerak Cepat dan Administrasi Sumber Daya Air
Command Center SDA
Dinas Pekerjaan Umum Bidang Sumber Daya Air Kota Dumai
```

Jangan melakukan penggantian nama aplikasi.  
Jangan mencari atau mengembalikan konteks nama lama.  
Jangan membuat ulang sistem dari awal.

---

## Dokumen Wajib Dibaca

Sebelum mengubah kode apa pun, AI coding agent/Codex wajib membaca dan mematuhi:

```text
/docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md
/docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md
/docs/design/SIAGA_SDA_DESIGN_SYSTEM.md
```

Jika `SIAGA_SDA_DESIGN_SYSTEM.md` belum tersedia, gunakan blueprint utama dan referensi visual di `/docs/assets/` sebagai acuan.

---

## Prinsip Kerja Utama

Kerjakan **hanya tugas yang diminta pada prompt**.

Jika menemukan masalah di luar scope:

```text
Laporkan saja.
Jangan diperbaiki sebelum mendapat izin.
```

Sebelum coding besar, wajib lakukan:

```text
audit
mapping
laporan risiko
rencana perubahan bertahap
```

Blueprint adalah arah pengembangan, bukan bukti bahwa semua tabel, role, route, field, dan modul sudah tersedia di kode. Cocokkan terlebih dahulu dengan sistem aktual.

---

## Larangan Keras

AI coding agent/Codex dilarang:

1. Mengubah file di luar scope.
2. Mengubah role tanpa instruksi eksplisit.
3. Mengubah workflow tanpa instruksi eksplisit.
4. Mengubah database besar tanpa instruksi eksplisit.
5. Mengubah auth/permission tanpa instruksi eksplisit.
6. Mengubah routing utama tanpa instruksi eksplisit.
7. Menambah menu utama baru tanpa instruksi.
8. Menghapus menu utama final tanpa instruksi.
9. Membuat ulang sistem dari awal.
10. Melakukan refactor besar tanpa izin.
11. Menambah dependency tanpa alasan kuat dan tanpa laporan.
12. Membuat login Google/Microsoft/social login.
13. Membuat dropdown role di halaman login.
14. Membuat tab Master Data sebagai menu utama.
15. Membuat peta interaktif besar di Dashboard.
16. Mengganti istilah **“Ditindaklanjuti”** menjadi **“Menjadi Paket”**.
17. Menghapus **Direksi Teknis** dari paket fisik.
18. Membuat petugas biasa wajib login.
19. Membuat foto absensi.
20. Membuat kembali role **ADMIN_KEGIATAN**.
21. Menghapus data lama tanpa audit dan instruksi eksplisit.
22. Membuat tabel/route/role ganda sebelum mapping sistem aktual.
23. Membuat fitur baru di luar permintaan.
24. Mengubah konfigurasi `.env`, Supabase, auth provider, atau storage tanpa instruksi eksplisit.
25. Mengubah tampilan hanya untuk desktop tanpa memperbaiki mobile.

---

## Role Final SIAGA-SDA

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

Role berikut **tidak digunakan lagi**:

```text
ADMIN_KEGIATAN
```

Jika masih ada referensi `ADMIN_KEGIATAN` di kode lama, jangan hapus sembarangan. Mapping bertahap ke:

```text
ADMIN_SUB_KEGIATAN
```

Laporkan file yang terdampak sebelum perubahan besar.

---

## Menu Utama Final

Menu utama SIAGA-SDA:

```text
Dashboard
Peta Monitoring
Survey Investigasi
Paket Pekerjaan
Approval Center
Surat Masuk & Keluar
Administrasi
Peil Banjir
Asset SDA
Audit Log
Pengaturan
```

Jangan membuat menu utama baru tanpa instruksi.

Fitur tambahan ditempatkan sebagai sub-fitur:

```text
Operasional SDA → sub-tab Asset SDA
Notulen & Tindak Lanjut Rapat → sub-fitur Surat Masuk & Keluar
Warning Center → panel Dashboard + icon notifikasi
Laporan → export/rekap dari Dashboard
Master Data → Pengaturan
```

---

## Prinsip Akses

Gunakan:

```text
role-based access
assignment-based access
```

Aturan akses:

- menu yang bukan kewenangan user disembunyikan;
- akses URL tanpa izin menampilkan halaman **Akses Dibatasi**;
- user dengan role tetapi belum memiliki assignment aktif menampilkan **Belum Ada Penugasan Aktif**;
- Pimpinan dan Auditor bersifat read-only;
- Kontraktor/Konsultan hanya melihat paketnya sendiri;
- Mandor hanya melihat asset/operasional yang ditugaskan;
- petugas biasa tidak wajib login;
- mandor wajib login dan memilih petugas dari master data;
- semua penolakan akses penting dicatat ke Audit Log jika sistem mendukung.

Teks halaman akses dibatasi:

```text
Akses Dibatasi

Halaman ini hanya dapat diakses oleh user yang memiliki role dan penugasan aktif sesuai kewenangan.
Silakan hubungi Admin Sistem jika akses ini diperlukan.
```

Teks halaman belum ada penugasan:

```text
Belum Ada Penugasan Aktif

Anda memiliki role terkait, tetapi belum ditugaskan ke data/kegiatan/paket tersebut.
Silakan hubungi Admin Sistem.
```

---

## Prinsip Alur Data

Data tidak boleh hilang setelah ditindaklanjuti.

Setiap data harus dapat dilacak dari:

```text
tab asal
tab tujuan
Dashboard
Peta Monitoring
Laporan
Audit Log
```

Contoh alur:

```text
Surat Masuk → Survey / Peil / Paket / Surat Keluar / Arsip
Survey Investigasi → Paket / Operasional / Surat Keluar / Arsip
Paket Pekerjaan → Administrasi + Approval + Laporan
Asset SDA → Operasional / Survey / Paket Rutin
Approval Center → kembali ke tab asal
```

Setiap data yang ditindaklanjuti harus mempertahankan relasi:

```text
origin_module
target_module
linked_origin_id
status
tindak_lanjut
rekap_akhir
```

Status asal data berubah menjadi:

```text
Ditindaklanjuti
Selesai
Arsip
```

---

## Global Clickable Navigation & Auto Filter

Semua elemen data yang tampil di SIAGA-SDA wajib clickable jika memiliki sumber data atau relasi data.

Wajib membaca:

```text
/docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md
```

Elemen yang wajib clickable:

```text
angka rekap dashboard
card statistik
badge status
nama paket
nama survey
nama surat
nama asset
nama peil banjir
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

Saat diklik:

1. arahkan user ke tab asal data;
2. aktifkan filter otomatis sesuai klasifikasi yang diklik;
3. jika data tunggal, buka detail data langsung;
4. jika data banyak, tampilkan daftar dengan filter aktif;
5. tampilkan breadcrumb asal klik;
6. sediakan tombol **Reset Filter**;
7. sediakan tombol **Kembali**;
8. tetap ikuti role-based dan assignment-based access;
9. jangan membuka halaman kosong;
10. jangan menghilangkan konteks asal.

Contoh:

```text
Dashboard → klik “Paket Fisik Tender Sub Kegiatan A”
→ Paket Pekerjaan
→ filter aktif: jenis_paket=Fisik, metode=Tender, sub_kegiatan=Sub Kegiatan A
```

```text
Dashboard → klik “Survey Ditindaklanjuti”
→ Survey Investigasi
→ filter aktif: status=Ditindaklanjuti
```

```text
Peta Monitoring → klik marker asset
→ drawer detail asset
→ tombol Buka Detail Asset
→ Asset SDA dengan asset_id aktif
```

---

## Aturan UI

Gunakan tema:

```text
SIAGA-SDA Fluent Water Theme
```

Karakter UI:

```text
clean
elegan
tema air
navy
biru
aqua
putih
soft shadow
rounded
responsive desktop dan mobile
```

Jangan gunakan style:

```text
gaming
neon
terlalu gelap
terlalu ramai
template SaaS umum yang tidak cocok untuk pemerintah
```

Semua perubahan UI wajib berlaku untuk:

```text
desktop/laptop
tablet jika relevan
mobile/phone
```

---

## Login

Login menggunakan:

```text
Email / NIP / Username
Password
```

Login wajib menampilkan:

```text
Logo SIAGA-SDA
Nama SIAGA-SDA
Kepanjangan SIAGA-SDA
Command Center SDA
Dinas Pekerjaan Umum Bidang Sumber Daya Air Kota Dumai
Widget pasang surut
Waktu salat
Status sistem
Footer resmi
```

Footer:

```text
SIAGA-SDA
©2026 Budi Legawan, ST
All Rights Reserved
```

Dilarang:

```text
Google Login
Microsoft Login
Social Login
Dropdown pilih role di login
```

---

## Dashboard

Dashboard adalah pusat rekap seluruh modul.

Dashboard wajib menampilkan rekap:

```text
paket fisik
paket rutin
paket konsultan
survey investigasi
surat masuk/keluar
approval
administrasi
peil banjir
asset SDA
operasional SDA
pasang surut
audit log
warning aktif
```

Dashboard tidak boleh memuat peta interaktif besar.

Dashboard cukup menampilkan:

```text
peta ringkas
ringkasan lokasi
tombol Buka Peta Monitoring
```

Peta besar hanya berada di menu:

```text
Peta Monitoring
```

---

## Peta Monitoring

Peta Monitoring adalah pusat spasial SIAGA-SDA.

Layer final:

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
- gunakan konsep satu lokasi = satu marker utama jika data saling terkait;
- detail marker harus menampilkan relasi data;
- tombol detail harus membuka tab asal;
- marker dan relasi wajib clickable.

---

## Survey Investigasi

Istilah final:

```text
Ditindaklanjuti
```

Dilarang menggunakan istilah:

```text
Menjadi Paket
```

Survey tidak boleh hilang setelah ditindaklanjuti. Status berubah dan relasinya ditampilkan.

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

---

## Paket Pekerjaan

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

Paket fisik wajib mendukung:

```text
PPK
PPTK
Direksi Teknis
Konsultan Pengawas jika ada
Kontraktor
PPHP
```

Paket rutin mendukung:

```text
Tim Perencana Rutin
Tim Pengawas Rutin
Pejabat Pengadaan
Kontraktor/Pelaksana
PPTK
PPK
ADMIN_SUB_KEGIATAN
```

---

## Surat Masuk & Keluar

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

Notulen & Tindak Lanjut Rapat adalah sub-fitur di detail surat undangan rapat. Jangan membuat tab utama Notulen.

---

## Administrasi

Administrasi dikelola oleh:

```text
ADMIN_SUB_KEGIATAN
```

bukan `ADMIN_KEGIATAN`.

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

Administrasi harus terhubung ke:

```text
Paket Pekerjaan
Approval Center
Dashboard
Laporan
Audit Log
```

---

## Asset SDA dan Operasional

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

Asset mendukung:

```text
Kode asset
Koordinat
Kondisi
Status operasional
Foto
Dokumen
Histori operasi
QR Code
```

Operasional SDA diletakkan sebagai sub-tab di Asset SDA.

Keputusan final:

```text
Foto absensi dihapus.
Petugas biasa tidak wajib login.
Mandor wajib login.
Mandor memilih petugas dari master data.
```

---

## Pengaturan

Master Data tidak boleh menjadi tab utama.

Master Data berada di:

```text
Pengaturan
```

Untuk Super Admin/Admin Sistem, Pengaturan dapat memuat:

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

---

## Audit Log

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

## SIAGA-SDA Login Final Lock

- Halaman login SIAGA-SDA sudah final.
- Sebelum mengubah file login, wajib baca `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`.
- Jangan mengubah halaman login kecuali user secara eksplisit meminta perubahan login.
- Saat mengerjakan dashboard, peta monitoring, survey, paket pekerjaan, approval, surat, peil banjir, aset, administrasi, audit log, atau pengaturan, jangan ikut mengubah halaman login.
- Jika login memang harus diubah, wajib membuat backup terlebih dahulu serta menjalankan `npx tsc --noEmit` dan `git diff --check`.

---

## Prompt Pertama Wajib Untuk Codex

Sebelum coding apa pun, gunakan audit dan mapping:

```text
Baca dan patuhi AGENTS.md serta:

/docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md
/docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md
/docs/design/SIAGA_SDA_DESIGN_SYSTEM.md

Tugas tahap ini hanya AUDIT dan MAPPING.

Jangan coding.
Jangan ubah file.
Jangan ubah database.
Jangan ubah role.
Jangan ubah route.
Jangan hapus apa pun.

Audit sistem SIAGA-SDA aktual dan cocokkan dengan blueprint.

Cek dan laporkan:
1. struktur folder aktual;
2. route/menu aktual;
3. role yang sudah ada;
4. auth dan permission yang sudah ada;
5. tabel/schema/migration yang sudah ada;
6. komponen UI yang sudah ada;
7. halaman login aktual;
8. dashboard aktual;
9. peta monitoring aktual;
10. tab/modul yang sudah ada;
11. perbedaan antara sistem aktual dan blueprint;
12. bagian yang bisa dipertahankan;
13. bagian yang perlu mapping;
14. bagian yang belum ada;
15. risiko jika langsung diubah.

Jangan melakukan perubahan apa pun sebelum saya menyetujui hasil audit.
```

---

## Aturan Setiap Selesai Tugas

Setelah mengerjakan tugas, wajib laporkan:

1. File yang diubah.
2. File yang dibuat.
3. File yang tidak jadi diubah dan alasannya.
4. Risiko perubahan.
5. Cara rollback.
6. Hasil build/lint/typecheck jika dijalankan.
7. Bagian yang perlu dicek manual.
