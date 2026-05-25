# Instruksi Wajib Codex — SIAGA-SDA

> File ini wajib diletakkan di **root project**, sejajar dengan `package.json`, bukan di dalam folder `/docs`.

---

## 1. Identitas Project

Project ini adalah:

```text
SIAGA-SDA
Sistem Informasi, Analisis, Gerak Cepat dan Administrasi Sumber Daya Air
Command Center SDA
```

Project ini merupakan **rebranding dan pengembangan bertahap dari SIMONPRO**, bukan project baru.

Instansi:

```text
Dinas Pekerjaan Umum
Bidang Sumber Daya Air
Kota Dumai
```

Footer resmi aplikasi:

```text
SIAGA-SDA
©2026 Budi Legawan, ST
All Rights Reserved
```

---

## 2. File Dokumentasi yang Wajib Dibaca Sebelum Coding

Sebelum mengubah kode apa pun, Codex wajib membaca dan mengikuti dokumen berikut:

```text
/docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md
/docs/core/SIAGA_SDA_REBRANDING_RULES.md
/docs/core/SIAGA_SDA_SYSTEM_ARCHITECTURE.md
/docs/core/SIAGA_SDA_WORKFLOW_MASTER.md

/docs/design/SIAGA_SDA_DESIGN_SYSTEM.md
/docs/design/SIAGA_SDA_LOGO_GUIDELINE.md
/docs/design/SIAGA_SDA_UI_DIRECTION.md

/docs/database/SIAGA_SDA_DATABASE_RULES.md
/docs/database/SIAGA_SDA_DATABASE_SCHEMA.md
/docs/database/SIAGA_SDA_STORAGE_RULES.md

/docs/auth/SIAGA_SDA_LOGIN_AUTH_UI.md
/docs/auth/SIAGA_SDA_PERMISSION_SYSTEM.md
/docs/auth/SIAGA_SDA_SECURITY_RULES.md
```

Jika pekerjaan menyentuh role tertentu, baca juga file terkait di:

```text
/docs/roles
```

Jika pekerjaan menyentuh modul tertentu, baca juga file terkait di:

```text
/docs/modules
```

Jika pekerjaan menyentuh operasional SDA, shift, pasang surut, atau rekap kehadiran, baca juga file terkait di:

```text
/docs/operational
```

---

## 3. Aturan Utama yang Tidak Boleh Dilanggar

1. Jangan rebuild total.
2. Jangan menganggap SIAGA-SDA sebagai project baru.
3. Jangan menghapus sistem lama tanpa audit.
4. Pertahankan data lama SIMONPRO sejauh mungkin.
5. Lakukan refactor bertahap dan aman.
6. Semua perubahan database wajib menggunakan migration Supabase.
7. Semua fitur wajib responsive untuk laptop/desktop dan mobile/HP.
8. Jangan hardcode role dan permission.
9. Semua akses harus berbasis role + assignment aktif.
10. User dapat memiliki banyak role.
11. User/personel tidak boleh dihapus permanen jika masih punya histori.
12. Gunakan status `AKTIF`, `NONAKTIF`, atau `ARSIP`.
13. Semua aksi penting wajib masuk audit log.
14. Peta Monitoring adalah jantung aplikasi.
15. Dashboard hanya menampilkan ringkasan ringan.
16. Dashboard tidak boleh memuat peta interaktif besar.
17. Program/Kegiatan/Sub Kegiatan bukan menu utama.
18. Program/Kegiatan/Sub Kegiatan hanya menjadi relasi/filter data.
19. Master Data tidak menjadi tab utama sidebar.
20. Master Data ditempatkan di Pengaturan/Admin sesuai permission.
21. Foto absensi tidak digunakan.
22. Petugas lapangan biasa tidak wajib punya akun.
23. Mandor wajib punya akun.
24. Mandor memilih anggota dari master data petugas, bukan mengetik nama bebas.
25. Semua foto upload wajib dikompres otomatis sebelum disimpan.
26. Ikuti design system dan visual reference di `/docs/assets`.

---

## 4. Prinsip Kerja Codex

Saat menerima tugas, Codex wajib:

1. Membaca file dokumentasi yang relevan.
2. Memahami konteks SIMONPRO lama sebelum mengubah kode.
3. Melakukan perubahan kecil, aman, dan bertahap.
4. Menghindari penghapusan file/fungsi lama tanpa audit.
5. Menghindari perubahan besar yang tidak diminta.
6. Memastikan perubahan berlaku untuk desktop dan mobile.
7. Menjaga struktur role, permission, workflow, dan database tetap konsisten.
8. Menjelaskan risiko jika ada bagian yang belum aman.
9. Tidak membuat asumsi besar tanpa menulis asumsi tersebut.
10. Tidak membuat role/menu/workflow baru jika tidak ada di dokumen `/docs`.

---

## 5. Prioritas Pengerjaan

Urutan prioritas project:

1. Stabilitas sistem lama SIMONPRO.
2. Kompatibilitas data lama.
3. Refactor bertahap.
4. Fitur baru.
5. Optimasi UI/UX.
6. Optimasi performa.
7. Perapian kode.
8. Dokumentasi tambahan.

---

## 6. Aturan UI/UX

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

Warna utama mengikuti dokumen:

```text
/docs/design/SIAGA_SDA_DESIGN_SYSTEM.md
```

Visual referensi mengikuti file di:

```text
/docs/assets
```

Semua perubahan UI wajib dicek untuk:

```text
Desktop / Laptop
Tablet jika ada
Mobile / HP
```

Aturan navigasi UI global:

1. Semua menu dan navigasi penting wajib terlihat tanpa zoom in/out pada desktop, tablet, dan mobile.
2. Semua card, angka, tabel, list, dokumen, laporan, status, panel kanan, dan ringkasan data yang relevan wajib bisa diklik menuju tab asal, detail data, atau sumber data terkait.
3. Setiap masuk ke sub menu, sub tab, halaman detail, mode drill-down, form tambah/edit, atau hasil filter khusus wajib menyediakan tombol `Kembali`.
4. Semua navigasi klik wajib tetap mengikuti role, permission, dan assignment existing.
5. Jangan membuat link atau tombol palsu. Jika tujuan data belum tersedia, tampilkan status belum tersedia tanpa aksi klik.
6. Jangan merusak auth, role, API, database, state, route, dan logic lama saat menambah navigasi.
7. Backup file sebelum mengubah UI.
8. Uji tampilan pada desktop 1366px, desktop besar, tablet, dan mobile 360-430px.
9. Laporkan file backup, file berubah, elemen yang dibuat clickable, tujuan navigasi, tombol kembali, serta hasil lint/typecheck/build.

---

## 7. Menu Utama Final

Menu utama final SIAGA-SDA:

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

Catatan:

- Jangan membuat `Master Data` sebagai tab utama sidebar.
- Jangan membuat `Program`, `Kegiatan`, dan `Sub Kegiatan` sebagai menu utama.
- Data tersebut hanya menjadi relasi/filter di paket dan administrasi.

---

## 8. Role Utama Final

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

Prinsip role:

- Jangan hardcode role.
- Gunakan role + assignment.
- User bisa punya lebih dari satu role.
- Assignment punya masa berlaku.
- Assignment lama tetap disimpan untuk histori/audit.
- Jika pejabat pindah/berganti, jangan ubah histori lama.
- Buat assignment baru untuk pejabat pengganti.

---

## 9. Aturan Login dan Auth

Login final berisi:

```text
Username / Email / NIP
Password
Masuk
Lupa Password
Daftar Akun Eksternal
```

Tidak boleh ada:

- Login Google
- Login Microsoft
- Login sosial
- Role dropdown di halaman login utama

Role ditentukan setelah login berdasarkan database/assignment, bukan dipilih manual di halaman login.

---

## 10. Aturan Database

Prinsip database:

1. Assignment-based.
2. Multi-role.
3. Audit-ready.
4. Scalable.
5. Tidak hard delete.
6. Migration bertahap.
7. Indexed query.
8. Pagination.
9. Lazy loading.
10. Query difilter berdasarkan assignment.

Semua perubahan database wajib dibuat melalui:

```text
Supabase migration
```

Jangan mengubah schema secara manual tanpa migration.

Index penting:

```text
package_id
survey_id
letter_id
peil_id
asset_id
activity_id
status
created_at
assigned_user_id
role_code
fiscal_year
coordinates
```

---

## 11. Aturan Storage dan Upload

Semua foto wajib dikompres otomatis sebelum upload.

Workflow foto:

```text
Kamera HP
→ user ambil foto
→ frontend compress
→ generate thumbnail
→ upload ke storage
```

Metadata wajib disimpan:

```text
original_size
compressed_size
compression_ratio
thumbnail_url
file_category
uploaded_by
uploaded_at
```

Foto absensi tidak digunakan.

---

## 12. Aturan Peta Monitoring

Peta Monitoring adalah jantung aplikasi.

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

Prinsip marker:

```text
1 lokasi = 1 marker utama aktif
```

Jika survey sudah ditindaklanjuti:

- histori survey tetap disimpan
- marker aktif dapat berubah menjadi marker paket/tindak lanjut
- detail marker menampilkan survey asal dan tindak lanjut terkait

---

## 13. Aturan Dashboard

Dashboard harus ringan.

Dashboard tidak boleh memuat peta interaktif besar.

Dashboard hanya menampilkan ringkasan:

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
- Tombol Buka Peta Monitoring

---

## 14. Aturan Survey Investigasi

Survey Investigasi bukan hanya banjir.

Kategori dapat mencakup:

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

Istilah yang tidak boleh digunakan:

```text
Menjadi Paket
Jadikan Paket
Tindak Menjadi Paket
```

Gunakan istilah:

```text
Ditindaklanjuti
Tindak Lanjuti
```

Karena tidak semua survey harus menjadi paket.

---

## 15. Aturan Paket Pekerjaan

Jenis paket final hanya:

```text
FISIK
KONSULTAN
RUTIN
```

Subkategori konsultan:

```text
KONSULTAN_PERENCANAAN
KONSULTAN_PENGAWASAN
```

Metode pengadaan terpisah:

```text
PENGADAAN_LANGSUNG
LELANG
```

Jangan membuat jenis paket terlalu banyak.

Prinsip:

```text
1 paket = 1 ruang kerja
```

---

## 16. Aturan Approval Center

Approval Center menampilkan item pending sesuai role dan assignment.

Jenis item:

- Survey Investigasi
- Laporan Harian/Mingguan/Bulanan
- Dokumen Konsultan
- Addendum
- SPM/Pembayaran
- PHO/FHO
- Peil Banjir
- Surat Keluar
- Dokumen Perencanaan

Aksi:

- Setujui
- Minta Revisi
- Tolak
- Lihat Detail
- Catatan

Pimpinan dan Auditor bersifat read-only.

---

## 17. Aturan Audit Log

Audit log wajib mencatat aksi penting, termasuk:

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

## 18. Aturan Multi Tahun dan Arsip

Data tahun lama tidak dihapus.

Gunakan filter:

```text
tahun_anggaran / fiscal_year
```

Jika proyek lintas tahun:

- paket tetap aktif
- tahun anggaran asal tetap tercatat
- status lintas tahun/lanjutan dicatat
- histori tetap aman

Jika PPK/PPTK/Kabid berganti:

- assignment lama diberi end_date
- assignment lama tidak dihapus
- assignment baru dibuat
- histori approval lama tetap milik pejabat lama

---

## 19. Aturan Performance

Agar sistem tidak berat:

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

## 20. Checklist Wajib Setelah Coding

Setelah menyelesaikan setiap tahap, Codex wajib melaporkan:

```text
1. File yang berubah
2. Migration database baru jika ada
3. Komponen UI yang diubah
4. Dampak ke desktop/laptop
5. Dampak ke mobile/HP
6. Hasil build
7. Hasil lint/typecheck
8. Risiko atau bagian yang belum selesai
9. Saran tahap berikutnya
```

Jika build/lint/typecheck gagal, Codex wajib:

1. Menjelaskan error.
2. Menjelaskan penyebab paling mungkin.
3. Memperbaiki jika masih dalam scope.
4. Tidak mengklaim selesai jika masih error.

---

## 21. Prompt Standar Saat Mengerjakan Task

Gunakan prinsip kerja berikut untuk setiap task:

```text
Baca dan patuhi AGENTS.md dan seluruh dokumen relevan di /docs.

Project ini adalah SIMONPRO yang direbranding dan dikembangkan menjadi SIAGA-SDA, bukan project baru.

Jangan rebuild total.
Jangan hapus data lama tanpa audit.
Gunakan migration Supabase.
Jangan hardcode role.
Gunakan role + assignment aktif.
Semua UI wajib responsive desktop/laptop dan mobile/HP.
Ikuti design system di /docs/design.
Ikuti workflow di /docs/core.
Ikuti role di /docs/roles.
Kerjakan hanya scope yang diminta.
Setelah selesai, jalankan build/lint/typecheck dan laporkan hasilnya.
```

---

## 22. Kesimpulan

SIAGA-SDA harus menjadi:

```text
Smart Government Command Center SDA
```

Fokus utama:

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
