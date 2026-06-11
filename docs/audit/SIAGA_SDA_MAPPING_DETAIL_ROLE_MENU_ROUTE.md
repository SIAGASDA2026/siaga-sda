# SIAGA-SDA MAPPING DETAIL ROLE, MENU, MODUL, DAN ROUTE

## Status Dokumen

Dokumen ini adalah laporan mapping lanjutan berdasarkan audit read-only sebelumnya.

Ruang lingkup:

```text
Role aktual vs role final SIAGA-SDA
Menu aktual 19 item vs menu utama final 11 item
Modul aktif vs modul shell
Route yang bisa dipertahankan
Route yang perlu dipetakan/normalisasi
Risiko perubahan
Rekomendasi tahapan aman sebelum coding
```

Pembatasan:

```text
Tidak mengubah file src
Tidak mengubah database
Tidak mengubah role
Tidak mengubah route
Tidak menghapus file/data
Tidak melakukan coding fitur
```

Dokumen acuan:

```text
AGENTS.md
docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md
docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md
docs/design/SIAGA_SDA_DESIGN_SYSTEM.md
docs/audit/SIAGA_SDA_AUDIT_MAPPING_AWAL.md
```

Catatan penting:

```text
Blueprint adalah target pengembangan.
Kode aktual adalah kondisi lapangan.
Perubahan implementasi hanya boleh dilakukan setelah mapping ini disetujui.
```

---

# 1. Ringkasan Eksekutif

SIAGA-SDA aktual sudah memiliki pondasi aplikasi yang dapat dipertahankan:

```text
Next.js App Router
NextAuth Credentials
Prisma PostgreSQL
Zustand
Dashboard command center
Peta Monitoring berbasis Leaflet
Paket-centric data model
Approval awal
Audit log awal
Layout desktop dan mobile
```

Namun sistem aktual belum sepenuhnya selaras dengan blueprint final karena:

```text
Role masih campuran antara role lama, role alias UI, dan role final.
Menu aktual masih 19 item, sedangkan menu utama final 11 item.
Beberapa route sudah aktif, tetapi sebagian seharusnya menjadi sub-fitur.
Beberapa modul final masih shell UI dan belum memiliki tabel/workflow resmi.
Clickable navigation sudah ada sebagian, tetapi belum konsisten semua modul.
```

Kesimpulan aman:

```text
Jangan hapus menu/route dulu.
Jangan rename role langsung.
Jangan ubah enum database langsung.
Gunakan mapping alias bertahap.
Pertahankan route aktif yang sudah dipakai user.
Normalisasi tampilan menu tanpa menghapus route internal.
```

---

# 2. Mapping Role Aktual vs Role Final

## 2.1 Sumber Role Aktual

Role aktual ditemukan pada tiga lapisan:

```text
Database enum Prisma:
prisma/schema.prisma

TypeScript UI role:
src/types/index.ts

Role definition dan permission:
src/lib/roles.ts
src/lib/rbac.ts
src/lib/project-db.ts
src/lib/db-mappers.ts
```

## 2.2 Role Database Aktual

Role enum database aktual:

```text
SUPER_ADMIN
ADMIN
PEJABAT_PENGADAAN
PPHP
ADMINISTRASI_KONTRAK
KEPALA_DINAS
PIMPINAN
PPK
PPTK
KABID
DIREKSI_TEKNIS
KONSULTAN_PERENCANA
KONSULTAN_PENGAWAS
TIM_PERENCANA
TIM_SURVEYOR
TIM_PENGAWAS
KONTRAKTOR
AUDITOR
```

## 2.3 Role UI Aktual

Role UI aktual:

```text
super_admin
admin
pejabat_pengadaan
pphp
admin_sub_kegiatan
pptk
ppk
kabid
direksi_teknis
pimpinan
tim_perencanaan
tim_survey
tim_pengawasan
konsultan_perencana
konsultan_pengawasan
kontraktor
auditor
```

## 2.4 Role Final Blueprint

Role final SIAGA-SDA:

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

## 2.5 Tabel Mapping Role

| Role Final | Role DB Aktual | Role UI Aktual | Status Mapping | Rekomendasi |
|---|---|---|---|---|
| SUPER_ADMIN | SUPER_ADMIN | super_admin | Sesuai | Pertahankan |
| ADMIN_SISTEM | ADMIN | admin | Belum spesifik | Mapping `ADMIN` sebagai alias sementara ke `ADMIN_SISTEM` |
| ADMIN_SDA | ADMIN | admin | Belum ada role khusus | Butuh role final baru atau permission turunan setelah audit |
| ADMIN_SUB_KEGIATAN | ADMINISTRASI_KONTRAK | admin_sub_kegiatan | Alias aktif | Pertahankan alias sementara, migrasi bertahap ke enum final |
| ADMIN_SURAT | Belum ada | Belum ada | Belum tersedia | Jangan dibuat sebelum desain permission surat final |
| ADMIN_PEIL | Belum ada | Belum ada | Belum tersedia | Jangan dibuat sebelum desain modul Peil final |
| PIMPINAN | PIMPINAN / KEPALA_DINAS | pimpinan | Ada dua sumber DB | Konsolidasikan hati-hati, jangan hapus salah satu langsung |
| KEPALA_BIDANG | KABID | kabid | Alias aktif | Mapping `KABID` ke `KEPALA_BIDANG` |
| PPK | PPK | ppk | Sesuai | Pertahankan |
| PPTK | PPTK | pptk | Sesuai | Pertahankan |
| DIREKSI_TEKNIS | DIREKSI_TEKNIS | direksi_teknis | Sesuai | Pertahankan, jangan dihapus dari paket fisik |
| TIM_SURVEY | TIM_SURVEYOR | tim_survey | Alias aktif | Mapping `TIM_SURVEYOR` ke `TIM_SURVEY` |
| TIM_PERENCANA_RUTIN | TIM_PERENCANA | tim_perencanaan | Alias aktif | Mapping ke role final rutin |
| TIM_PENGAWAS_RUTIN | TIM_PENGAWAS | tim_pengawasan | Alias aktif | Mapping ke role final rutin |
| PEJABAT_PENGADAAN | PEJABAT_PENGADAAN | pejabat_pengadaan | Sesuai | Pertahankan |
| KONSULTAN_PERENCANA | KONSULTAN_PERENCANA | konsultan_perencana | Sesuai | Pertahankan |
| KONSULTAN_PENGAWAS | KONSULTAN_PENGAWAS | konsultan_pengawasan | Beda suffix UI | Normalisasi label/alias, jangan ubah DB langsung |
| KONTRAKTOR | KONTRAKTOR | kontraktor | Sesuai | Pertahankan |
| PPHP | PPHP | pphp | Sesuai | Pertahankan |
| AUDITOR | AUDITOR | auditor | Sesuai | Pertahankan read-only |
| MANDOR_OPERASIONAL_SDA | Belum ada | Belum ada | Belum tersedia | Buat setelah modul Asset/Operasional dimodelkan |
| MANDOR_REHAB_DRAINASE | Belum ada | Belum ada | Belum tersedia | Buat setelah workflow operasional/rehab disetujui |

## 2.6 Role Yang Harus Diwaspadai

Role yang rawan salah ubah:

```text
ADMIN
ADMINISTRASI_KONTRAK
KEPALA_DINAS
PIMPINAN
KABID
TIM_PERENCANA
TIM_SURVEYOR
TIM_PENGAWAS
KONSULTAN_PENGAWAS
```

Alasan:

```text
Role tersebut masih menjadi penghubung antara database lama dan role UI baru.
Menghapus atau mengganti enum langsung dapat membuat user kehilangan akses.
```

## 2.7 Rekomendasi Mapping Role

Tahap aman:

```text
1. Inventaris user aktif dan role DB aktual.
2. Buat tabel alias role di dokumentasi/konfigurasi, bukan langsung migration.
3. Cocokkan setiap role dengan permission dan assignment aktif.
4. Uji akses read-only untuk Pimpinan dan Auditor.
5. Baru rancang migration role final jika data aktual sudah jelas.
```

---

# 3. Mapping Menu Aktual 19 Item vs Menu Final 11 Item

## 3.1 Menu Aktual

Menu aktual desktop/sidebar:

```text
Dashboard
Peta Monitoring
Survey Investigasi
Laporan Harian
Masalah & Kendala
Paket Pekerjaan
Approval Center
RAB
Serapan Anggaran
Kontrak
Dokumen
Chat Proyek
Pengumuman
Surat Masuk/Keluar
Peil Banjir
Asset SDA
Pengguna
Audit Log
Pengaturan
```

Jumlah:

```text
19 item
```

## 3.2 Menu Utama Final Blueprint

Menu utama final:

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

Jumlah:

```text
11 item
```

## 3.3 Tabel Mapping Menu

| Menu Aktual | Route Aktual | Menu Final | Status | Rekomendasi |
|---|---|---|---|---|
| Dashboard | `/dashboard` | Dashboard | Sesuai | Pertahankan |
| Peta Monitoring | `/peta` | Peta Monitoring | Sesuai label, route pendek | Pertahankan route, label final tetap Peta Monitoring |
| Survey Investigasi | `/survey` | Survey Investigasi | Sesuai | Pertahankan |
| Laporan Harian | `/laporan` | Dashboard / Paket Pekerjaan | Menu ekstra | Jadikan sub-fitur laporan/rekap, jangan hapus route dulu |
| Masalah & Kendala | `/masalah` | Dashboard / Survey / Warning | Menu ekstra | Mapping ke Warning Center atau relasi Survey/Paket |
| Paket Pekerjaan | `/proyek` | Paket Pekerjaan | Sesuai konsep, route legacy | Pertahankan route internal, label final Paket Pekerjaan |
| Approval Center | `/approval` | Approval Center | Sesuai | Pertahankan |
| RAB | `/rab` | Paket Pekerjaan | Menu ekstra | Jadikan sub-fitur Paket Pekerjaan |
| Serapan Anggaran | `/serapan-anggaran` | Dashboard / Administrasi | Menu ekstra | Jadikan panel dashboard atau sub-fitur Administrasi |
| Kontrak | `/kontrak` | Administrasi | Menu ekstra | Jadikan sub-fitur Administrasi |
| Dokumen | `/dokumen` | Administrasi / Paket | Menu ekstra | Jadikan sub-fitur dokumen paket/administrasi |
| Chat Proyek | `/chat` | Sub-fitur Paket/Asset | Menu ekstra | Pertahankan route internal, sembunyikan dari menu utama jika disetujui |
| Pengumuman | `/pengumuman` | Notifikasi / Pengaturan | Menu ekstra | Mapping ke notifikasi/dashboard/pengaturan |
| Surat Masuk/Keluar | `/surat` | Surat Masuk & Keluar | Sesuai, masih shell | Pertahankan dan kembangkan setelah model surat |
| Peil Banjir | `/peil` | Peil Banjir | Sesuai, masih shell | Pertahankan dan kembangkan setelah model peil |
| Asset SDA | `/asset` | Asset SDA | Sesuai, masih shell | Pertahankan dan tambahkan Operasional sebagai sub-tab |
| Pengguna | `/pengguna` | Pengaturan | Menu ekstra | Pindahkan sebagai sub-fitur Pengaturan |
| Audit Log | `/audit-log` | Audit Log | Sesuai | Pertahankan |
| Pengaturan | `/pengaturan` | Pengaturan | Sesuai | Pertahankan |

## 3.4 Menu Yang Boleh Tetap Jadi Menu Utama

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

## 3.5 Menu Yang Sebaiknya Menjadi Sub-Fitur

```text
Laporan Harian -> Dashboard / Paket Pekerjaan
Masalah & Kendala -> Warning Center / Paket / Survey
RAB -> Paket Pekerjaan
Serapan Anggaran -> Dashboard / Administrasi
Kontrak -> Administrasi
Dokumen -> Administrasi / Paket
Chat Proyek -> Paket / Asset / Operasional
Pengumuman -> Notifikasi / Pengaturan
Pengguna -> Pengaturan
```

## 3.6 Catatan Aman Menu

Jangan langsung menghapus route ekstra karena:

```text
Route mungkin sudah dipakai oleh tombol dashboard, peta, detail paket, notifikasi, atau user.
Menghapus menu tidak sama dengan menghapus route.
Route internal dapat dipertahankan walaupun tidak tampil sebagai menu utama.
```

---

# 4. Mapping Modul Aktif vs Modul Shell

## 4.1 Modul Sudah Aktif / Parsial Aktif

| Modul | Route | Status Aktual | Catatan |
|---|---|---|---|
| Dashboard | `/dashboard` | Aktif | Sudah ada ringkasan, tab, KPI, warning, peta ringkas, pasang surut simulasi |
| Peta Monitoring | `/peta` | Aktif parsial | Leaflet, marker paket/proyek, filter, detail panel |
| Paket Pekerjaan | `/proyek`, `/proyek/[id]` | Aktif | Paket/proyek, detail, progress, relasi survey/RAB/laporan/chat |
| Survey Investigasi | `/survey` | Aktif parsial | Input survey, GPS, foto, status approval dasar |
| Approval Center | `/approval` | Aktif parsial | Approval dari laporan/RAB/survey, histori dasar |
| Laporan | `/laporan` | Aktif parsial | Harian/mingguan/bulanan, export awal, input laporan |
| RAB | `/rab` | Aktif parsial | Input/upload RAB, item RAB, status approval |
| Kontrak | `/kontrak` | Aktif parsial | Data kontrak paket, nilai, penyedia |
| Dokumen | `/dokumen` | Aktif parsial | UI dokumen, tetapi storage resmi perlu audit |
| Masalah | `/masalah` | Aktif parsial | Input/resolve masalah paket |
| Chat Proyek | `/chat` | Aktif parsial | Chat per paket/proyek, belum WebSocket penuh |
| Pengumuman | `/pengumuman` | Aktif parsial | Berbasis Notifikasi, bukan modul surat resmi |
| Pengguna | `/pengguna` | Aktif parsial | User, role, assignment UI |
| Audit Log | `/audit-log` | Aktif parsial | Membaca log, perlu perluasan event audit |
| Pengaturan | `/pengaturan` | Aktif parsial | Profil/preferensi, belum semua master data final |

## 4.2 Modul Masih Shell

| Modul | Route | Status Aktual | Kebutuhan Blueprint |
|---|---|---|---|
| Administrasi | `/administrasi` | Shell UI | Kontrak/SPK, Addendum, SPM, Pembayaran, Jaminan, arsip paket |
| Surat Masuk & Keluar | `/surat` | Shell UI | Surat masuk, surat keluar, disposisi, notulen, relasi survey/peil/paket |
| Peil Banjir | `/peil` | Shell UI | Permohonan, verifikasi, survey, approval, rekomendasi, arsip |
| Asset SDA | `/asset` | Shell UI | Asset, QR, kondisi, dokumen, histori operasi |
| Operasional SDA | Belum route utama final | Shell dalam dashboard/asset target | Sub-tab Asset SDA, shift, mandor, petugas, pompa/pintu air |

## 4.3 Modul Yang Belum Terlihat Sebagai Sistem Final

```text
Backup data
Supabase Storage resmi
Offline draft lapangan
Foto compression otomatis
Watermark foto otomatis
Realtime WebSocket
Status online/offline user
RLS Supabase
QR Code asset final
PHO/FHO detail final
Termin/MC/SPM/pembayaran lengkap
Notulen dan tindak lanjut rapat
```

---

# 5. Route Yang Bisa Dipertahankan

Route berikut layak dipertahankan sebagai route aktif karena sudah menjadi bagian alur kerja aktual atau dasar navigasi:

| Route | Alasan Dipertahankan | Status Menu Final |
|---|---|---|
| `/dashboard` | Pusat rekap dan entry point utama | Menu utama |
| `/peta` | Peta Monitoring sudah aktif | Menu utama |
| `/survey` | Input dan daftar survey sudah aktif | Menu utama |
| `/proyek` | Paket pekerjaan aktual menggunakan route ini | Menu utama dengan label final Paket Pekerjaan |
| `/proyek/[id]` | Detail paket berisi sub-tab penting | Route detail internal |
| `/approval` | Approval Center sudah aktif parsial | Menu utama |
| `/surat` | Route final tersedia walau shell | Menu utama |
| `/administrasi` | Route final tersedia walau shell | Menu utama |
| `/peil` | Route final tersedia walau shell | Menu utama |
| `/asset` | Route final tersedia walau shell | Menu utama |
| `/audit-log` | Audit log sudah tersedia | Menu utama |
| `/pengaturan` | Pengaturan sudah tersedia | Menu utama |
| `/login` | Login final berbasis credentials | Route publik |

Route ekstra yang tetap bisa dipertahankan sebagai route internal/sub-fitur:

| Route | Dipertahankan Sebagai | Catatan |
|---|---|---|
| `/laporan` | Sub-fitur laporan/rekap | Jangan tampil sebagai menu utama jika final disetujui |
| `/rab` | Sub-fitur Paket Pekerjaan | Dapat tetap dipanggil dari detail paket |
| `/kontrak` | Sub-fitur Administrasi | Perlu relasi ke Administrasi |
| `/dokumen` | Sub-fitur Administrasi/Paket | Perlu storage resmi |
| `/masalah` | Sub-fitur Warning/Paket/Survey | Bisa menjadi sumber warning aktif |
| `/chat` | Sub-fitur komunikasi per paket/asset | Perlu realtime bila dinaikkan |
| `/pengumuman` | Sub-fitur notifikasi/pengaturan | Jangan disamakan dengan Surat |
| `/pengguna` | Sub-fitur Pengaturan | Hanya role berwenang |
| `/serapan-anggaran` | Sub-fitur Dashboard/Administrasi | Jangan jadi menu utama |
| `/panduan` | Route bantuan internal | Tidak menjadi menu utama final |

---

# 6. Route Yang Perlu Dipetakan / Dinormalisasi

Karena prompt user terpotong pada poin "5. route", bagian ini memetakan route yang perlu normalisasi.

## 6.1 Route Legacy Naming

| Route Aktual | Nama Final | Rekomendasi |
|---|---|---|
| `/proyek` | Paket Pekerjaan | Pertahankan route, ubah label/metadata bertahap |
| `/peta` | Peta Monitoring | Pertahankan route pendek, label final tetap Peta Monitoring |
| `/survey` | Survey Investigasi | Pertahankan |
| `/surat` | Surat Masuk & Keluar | Pertahankan |
| `/peil` | Peil Banjir | Pertahankan |
| `/asset` | Asset SDA | Pertahankan |

## 6.2 Route Ekstra Yang Perlu Turun Menjadi Sub-Fitur

| Route | Target Mapping | Catatan Implementasi Nanti |
|---|---|---|
| `/laporan` | Dashboard/Paket -> Laporan | Route tetap hidup, menu utama disembunyikan bila disetujui |
| `/rab` | Paket Pekerjaan -> RAB | Filter `package_id` perlu konsisten |
| `/kontrak` | Administrasi -> Kontrak/SPK | Perlu tampil dalam Administrasi |
| `/dokumen` | Administrasi/Paket -> Dokumen | Perlu storage dan audit upload |
| `/masalah` | Dashboard Warning/Paket -> Masalah | Perlu relasi warning dan tindak lanjut |
| `/chat` | Paket/Asset -> Chat | Perlu assignment access |
| `/pengumuman` | Notifikasi/Pengaturan | Jangan jadi surat |
| `/pengguna` | Pengaturan -> User Management | Jangan jadi menu utama |
| `/serapan-anggaran` | Dashboard/Administrasi -> Keuangan | Perlu mapping pembayaran/SPM |

## 6.3 Route Yang Perlu Halaman Akses Resmi

Saat ini akses tidak berwenang masih berisiko redirect diam-diam.

Route policy yang perlu disiapkan setelah disetujui:

```text
/akses-dibatasi
/belum-ada-penugasan
```

Catatan:

```text
Jangan membuat route ini tanpa persetujuan coding.
Dokumen ini hanya mapping.
```

---

# 7. Mapping Clickable Navigation dan Filter

## 7.1 Parameter Aktual Yang Sudah Terlihat

Parameter/filter yang sudah digunakan sebagian:

```text
tahun
status
health
source
masalah
proyek
from
subKegiatan
```

## 7.2 Parameter Final Yang Dibutuhkan

Dari aturan global clickable navigation:

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

## 7.3 Mapping Awal Filter

| Kebutuhan Final | Parameter Aktual/Usulan | Route Tujuan |
|---|---|---|
| Paket kritis | `health=kritis` | `/proyek` |
| Paket warning | `health=warning` | `/proyek` |
| Tahun anggaran | `tahun=2026` | `/dashboard`, `/proyek`, `/peta` |
| Sub kegiatan | `subKegiatan=...` atau `sub_kegiatan_id=...` | `/proyek` |
| Survey pending | `source=survey&status=belum-ditindaklanjuti` | `/survey` atau `/proyek` setelah normalisasi |
| Approval pending | `status=pending` atau `approval_status=pending` | `/approval` |
| Masalah open | `masalah=open` atau `status=open` | `/masalah` |
| Paket detail | `package_id=...` atau route `/proyek/[id]` | `/proyek/[id]` |
| Asset detail | `asset_id=...` | `/asset` |
| Peil detail | `peil_id=...` | `/peil` |
| Surat detail | `letter_id=...` | `/surat` |

## 7.4 Risiko Filter

```text
Dashboard sudah mengirim beberapa query.
Belum semua halaman tujuan membaca query tersebut.
Jika langsung menambah query baru tanpa mapping, user bisa membuka halaman kosong atau filter tidak aktif.
```

---

# 8. Risiko Perubahan Role

Risiko utama:

```text
User existing bisa kehilangan akses.
Session JWT menyimpan role UI lowercase, sedangkan DB enum uppercase.
Middleware dan rbac memakai role UI, sedangkan Prisma memakai enum DB.
ADMIN_SUB_KEGIATAN saat ini dipetakan ke ADMINISTRASI_KONTRAK.
KABID masih dipakai sebagai Kepala Bidang.
TIM_PERENCANA/TIM_PENGAWAS belum memakai suffix RUTIN.
Mandor belum ada role.
```

Dampak jika role langsung diubah:

```text
Login berhasil tetapi menu kosong.
API return Forbidden.
Assignment paket tidak cocok.
Approval tidak muncul.
Pimpinan/Auditor bisa salah mendapatkan akses tulis.
Kontraktor/Konsultan bisa melihat data di luar paket jika policy salah.
```

Mitigasi:

```text
Buat daftar alias role dulu.
Uji role per halaman.
Uji API per role.
Tambah halaman akses resmi sebelum role migration.
Backup database sebelum migration role.
```

---

# 9. Risiko Perubahan Menu

Risiko utama:

```text
Menghapus menu tidak otomatis aman karena route masih dipakai link internal.
Dashboard dan Peta sudah mengarah ke beberapa route ekstra.
Mobile nav punya struktur sendiri yang harus sinkron dengan sidebar.
User terbiasa dengan menu lama.
```

Dampak jika menu langsung dipangkas:

```text
Link dashboard mengarah ke route yang tidak terlihat di menu.
Petugas lapangan sulit menemukan input laporan/survey.
Pimpinan kehilangan akses rekap tertentu.
Approval bisa kehilangan konteks data asal.
```

Mitigasi:

```text
Tahap 1: tandai route ekstra sebagai sub-fitur.
Tahap 2: tampilkan sub-fitur dari menu final terkait.
Tahap 3: sembunyikan menu ekstra dari sidebar/mobile setelah link pengganti tersedia.
Tahap 4: pertahankan route internal untuk backward compatibility.
```

---

# 10. Risiko Perubahan Database

Risiko utama:

```text
schema.prisma tampak lebih maju daripada migration history.
Beberapa modul final belum memiliki model resmi.
Role final belum semua ada di enum.
Data lama Proyek dan data baru Paket hidup berdampingan.
Endpoint delete paket masih berpotensi hard delete relasi.
```

Dampak jika database langsung diubah:

```text
Migration drift.
Deploy gagal.
Data lama tidak terbaca.
Relasi approval/audit/foto putus.
User lockout karena enum role berubah.
```

Mitigasi:

```text
Jalankan audit DB aktual secara read-only.
Bandingkan Supabase schema dengan prisma/schema.prisma.
Inventaris migration yang sudah diterapkan.
Gunakan migration additive.
Jangan drop enum/tabel/kolom.
Sediakan rollback SQL sebelum migration.
```

---

# 11. Rekomendasi Tahapan Coding Paling Aman

Tahap 0 - Tetap dokumentasi:

```text
Setujui dokumen mapping ini.
Tetapkan role alias sementara.
Tetapkan menu utama yang akan ditampilkan.
Tetapkan route internal yang tetap dipertahankan.
```

Tahap 1 - Akses dan safety:

```text
Buat halaman Akses Dibatasi.
Buat halaman Belum Ada Penugasan Aktif.
Update middleware agar tidak redirect diam-diam.
Catat akses ditolak ke Audit Log jika tersedia.
```

Tahap 2 - Menu tanpa hapus route:

```text
Sinkronkan Sidebar dan MobileNav ke 11 menu utama.
Pindahkan route ekstra sebagai sub-fitur.
Pastikan semua link internal tetap berfungsi.
```

Tahap 3 - Query filter:

```text
Standarkan parameter filter dashboard dan peta.
Buat halaman tujuan membaca filter aktif.
Tambahkan chip filter aktif, Reset Filter, dan Kembali.
```

Tahap 4 - Role mapping:

```text
Tambahkan alias role final di layer aplikasi.
Jangan migration enum dulu.
Uji seluruh role terhadap menu/API.
```

Tahap 5 - Modul shell:

```text
Surat Masuk & Keluar
Peil Banjir
Asset SDA
Operasional SDA sebagai sub-tab Asset
Administrasi final
```

Tahap 6 - Database final:

```text
Audit DB aktual.
Buat migration additive.
Aktifkan Supabase Storage.
Aktifkan audit trail lengkap.
Aktifkan realtime sesuai prioritas.
```

---

# 12. Keputusan Yang Perlu Persetujuan User

Sebelum coding, perlu keputusan eksplisit:

```text
1. Apakah route ekstra tetap hidup sebagai sub-fitur internal?
2. Apakah sidebar/mobile nav boleh disederhanakan ke 11 menu utama?
3. Apakah ADMIN saat ini dipetakan sementara ke ADMIN_SISTEM?
4. Apakah ADMINISTRASI_KONTRAK tetap menjadi alias DB untuk ADMIN_SUB_KEGIATAN?
5. Apakah KABID dipetakan ke KEPALA_BIDANG?
6. Apakah TIM_PERENCANA/TIM_PENGAWAS dipetakan ke role rutin?
7. Apakah role Mandor dibuat setelah modul Asset/Operasional siap?
8. Apakah perubahan pertama dimulai dari halaman akses resmi?
```

---

# 13. Status Akhir Dokumen

File yang dibuat:

```text
docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md
```

File yang tidak diubah:

```text
src/*
prisma/*
database
role
route
```

Build/lint/typecheck:

```text
Tidak dijalankan karena tugas hanya dokumentasi mapping.
```

Rollback dokumen:

```text
Hapus file docs/audit/SIAGA_SDA_MAPPING_DETAIL_ROLE_MENU_ROUTE.md
```

Bagian yang perlu dicek manual:

```text
User role aktual di database
Migration yang sudah diterapkan di Supabase
Route yang paling sering dipakai user
Kesesuaian query filter Dashboard/Peta dengan halaman tujuan
Data lama Proyek vs data baru Paket
```
