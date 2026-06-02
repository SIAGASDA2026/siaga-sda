# SIAGA-SDA AUDIT MAPPING AWAL

## Status Dokumen

Dokumen ini dibuat sebagai arsip hasil **Audit Read-Only SIAGA-SDA**.

Audit ini dilakukan setelah Codex membaca:

```text
AGENTS.md
/docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md
/docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md
/docs/design/SIAGA_SDA_DESIGN_SYSTEM.md
```

Status audit:

```text
Read-only
Tidak ada file diubah
Tidak ada database diubah
Tidak ada role diubah
Tidak ada route diubah
Tidak ada file dibuat oleh Codex saat audit
```

Dokumen ini diletakkan di:

```text
/docs/audit/SIAGA_SDA_AUDIT_MAPPING_AWAL.md
```

---

# 1. Ringkasan Audit Read-Only

Codex sudah membaca dokumen instruksi utama dan melakukan audit awal terhadap struktur aktual SIAGA-SDA.

Hasil penting:

- tidak ada file yang diubah;
- tidak ada database yang diubah;
- tidak ada role yang diubah;
- tidak ada route yang diubah;
- audit hanya membaca dan memetakan kondisi aktual sistem;
- worktree sudah terdeteksi dirty sebelum tahap audit, dengan banyak file modified/untracked yang tidak disentuh Codex.

---

# 2. Struktur Aktual Project

Struktur aktual yang ditemukan:

```text
Next.js App Router di src/app
Komponen di src/components
Service/helper di src/lib
Zustand store di src/store/useAppStore.ts
Prisma di prisma/schema.prisma
```

Catatan penting:

```text
Package masih bernama simonpro di package.json line 2.
```

Ini perlu diperiksa secara hati-hati karena project aktif sudah bernama SIAGA-SDA. Jangan langsung rename package tanpa audit dependency, import, deployment, dan konfigurasi.

---

# 3. Route dan Menu Aktual

Menu sidebar aktual berisi 19 item:

```text
Dashboard
Peta
Survey
Laporan
Masalah
Paket
Approval
RAB
Serapan Anggaran
Kontrak
Dokumen
Chat
Pengumuman
Surat
Peil
Asset
Pengguna
Audit Log
Pengaturan
```

Sumber yang ditemukan:

```text
Sidebar.tsx line 36
```

## Perbandingan Dengan Menu Final Blueprint

Menu final SIAGA-SDA hanya 11 menu utama:

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

## Kesimpulan Mapping Menu

Menu aktual yang berlebih tidak boleh langsung dihapus. Perlu mapping menjadi sub-fitur:

```text
Laporan → export/rekap dari Dashboard, atau fitur laporan jika nanti dinaikkan
Masalah → kemungkinan masuk Survey Investigasi / Warning Center
RAB → sub-fitur Paket Pekerjaan
Serapan Anggaran → sub-fitur Dashboard / Administrasi / Paket
Kontrak → sub-fitur Administrasi
Dokumen → sub-fitur Administrasi / Paket
Chat → Catatan & Komunikasi per objek, bukan menu utama
Pengumuman → Notifikasi / Dashboard / Pengaturan
Pengguna → Pengaturan
Peta → Peta Monitoring
Survey → Survey Investigasi
Paket → Paket Pekerjaan
Approval → Approval Center
Surat → Surat Masuk & Keluar
Peil → Peil Banjir
Asset → Asset SDA
```

---

# 4. Role Aktual

Role database masih campuran.

Role enum aktual yang ditemukan antara lain:

```text
SUPER_ADMIN
ADMIN
KABID
TIM_PERENCANA
TIM_SURVEYOR
TIM_PENGAWAS
ADMINISTRASI_KONTRAK
dan role lainnya
```

UI memakai format lowercase seperti:

```text
admin_sub_kegiatan
tim_survey
konsultan_pengawasan
```

Sumber yang ditemukan:

```text
types/index.ts line 1
```

## Gap Dengan Role Final

Role final yang belum sepenuhnya tersedia sebagai enum DB/UI final:

```text
ADMIN_SISTEM
ADMIN_SDA
ADMIN_SURAT
ADMIN_PEIL
KEPALA_BIDANG
TIM_PERENCANA_RUTIN
TIM_PENGAWAS_RUTIN
MANDOR_OPERASIONAL_SDA
MANDOR_REHAB_DRAINASE
```

## Catatan Penting

Jangan langsung mengganti role karena berisiko lockout user.

Tahap aman berikutnya:

```text
Audit role aktual
Mapping role aktual ke role final
Buat daftar alias/mapping
Laporkan risiko
Baru lakukan perubahan bertahap setelah disetujui
```

---

# 5. Auth dan Permission Aktual

Auth aktual:

```text
NextAuth Credentials
bcrypt
JWT
```

Sumber yang ditemukan:

```text
auth.ts line 8
```

Middleware:

```text
Middleware sudah melindungi route
Tetapi akses ditolak masih redirect ke /dashboard
Belum menampilkan halaman Akses Dibatasi sesuai blueprint
```

Sumber yang ditemukan:

```text
middleware.ts line 19
```

## Assignment-Based Access

Assignment-based access sudah ada untuk paket melalui:

```text
ppkId
pptkId
PaketAssignment
```

Namun belum menjadi policy global seluruh modul.

## Gap Dengan Blueprint

Yang perlu dibuat bertahap:

```text
Halaman Akses Dibatasi
Halaman Belum Ada Penugasan Aktif
Policy assignment-based global
Proteksi direct URL yang tidak hanya redirect diam-diam
Audit log untuk akses ditolak jika sistem mendukung
```

---

# 6. Database, Schema, dan Migration

Schema aktual sudah relatif kaya.

Model yang ditemukan antara lain:

```text
TahunAnggaran
Program
Kegiatan
SubKegiatan
Paket
PaketAssignment
SurveyBaru
Approval
Document
Notifikasi
AuditLog
```

Sumber yang ditemukan:

```text
schema.prisma line 274
```

## Risiko Utama

Folder migration hanya terlihat berisi:

```text
init
add role procurement
approval phase 2
```

Ada risiko:

```text
schema.prisma sudah lebih maju daripada migration history
database aktual belum sama dengan schema
migration drift
migration gagal jika langsung dijalankan
```

## Keputusan Aman

Sebelum perubahan database apa pun:

```text
Verifikasi database Supabase aktual
Bandingkan schema.prisma dengan migration history
Jangan membuat migration baru sebelum audit DB selesai
Jangan membuat tabel baru yang berpotensi ganda
```

---

# 7. Komponen UI Aktual

Komponen UI yang ditemukan:

```text
custom UI kit di src/components/ui/index.tsx
layout sidebar
mobile nav
topbar
dashboard widgets pasang surut/waktu salat
module shell
project filters
AI assistant
```

Catatan:

```text
Belum terlihat struktur shadcn/ui formal.
Lebih berupa custom component set.
```

## Implikasi

UI SIAGA-SDA bisa dilanjutkan menggunakan komponen yang sudah ada, selama tetap mengikuti:

```text
SIAGA-SDA Fluent Water Theme
desktop/mobile responsive
role-based
assignment-based
clickable navigation + auto filter
```

---

# 8. Login Aktual

Login sudah menampilkan:

```text
SIAGA-SDA
widget pasang surut
waktu salat
status sistem
footer ©2026 Budi Legawan, ST
```

Sumber yang ditemukan:

```text
login/page.tsx line 130
```

Tidak ditemukan:

```text
Google Login
Microsoft Login
dropdown role login
```

## Gap Login

Label login menyebut:

```text
Email / NIP
```

Tetapi backend auth masih memakai:

```text
findUnique({ email })
```

Sumber yang ditemukan:

```text
auth.ts line 18
```

## Catatan Aman

Jangan langsung ubah auth. Perlu audit dulu apakah NIP sudah tersedia di user table. Jika belum, login NIP harus dibuat bertahap dan aman.

---

# 9. Dashboard Aktual

Dashboard sudah cukup maju.

Fitur yang ditemukan:

```text
tab ringkasan
monitoring
survey
paket
approval
surat
peil
asset
operasional
pasang surut
warning
aktivitas
AI
filter tahun/program/sub kegiatan
banyak link klik
```

## Gap Dashboard

Masalah yang ditemukan:

```text
beberapa panel masih angka 0/shell
pasang surut masih simulasi
query filter yang dikirim belum pasti dikonsumsi semua halaman tujuan
```

## Kaitan Dengan Global Clickable Navigation

Dashboard sudah punya dasar clickable, tetapi belum konsisten seluruh modul.

Perlu mapping:

```text
klik card/angka → tab tujuan
filter query → benar-benar dibaca tab tujuan
breadcrumb/kembali/reset filter → tersedia
```

---

# 10. Peta Monitoring Aktual

Peta memakai:

```text
Leaflet
OpenStreetMap
filter paket
marker proyek
drawer/detail
tombol ke detail paket/chat/laporan
```

Sumber yang ditemukan:

```text
peta/page.tsx line 71
```

## Gap Peta Monitoring

Layer yang belum sepenuhnya berbasis tabel aktual:

```text
asset
survey
peil
surat
warning
```

Beberapa count masih:

```text
turunan/fallback
```

## Keputusan Aman

Peta Leaflet dapat dipertahankan sebagai basis.

Perlu dikembangkan bertahap agar mendukung layer final:

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

---

# 11. Tab dan Modul Aktual

Fitur parsial aktif:

```text
Paket/Proyek
Detail paket
Survey
Laporan
RAB
Kontrak
Dokumen
Masalah
Chat
Approval
Pengguna
Pengumuman
Audit Log
```

Masih shell:

```text
Surat
Peil
Asset
Administrasi
Operasional SDA
```

Shell memakai:

```text
ModuleLandingPage line 58
```

## Implikasi

Jangan langsung membuat workflow penuh untuk Surat/Peil/Asset/Operasional sebelum audit DB dan route.

Tahap aman:

```text
mapping route
mapping model/table
mapping data source
baru coding bertahap
```

---

# 12. Perbedaan Utama Dengan Blueprint

Perbedaan utama:

```text
Role belum final
Menu utama terlalu banyak
Auth denial belum sesuai teks resmi
Database migration drift
Realtime masih polling 15 detik, belum WebSocket
Supabase Storage belum terlihat
Offline draft/camera compression/watermark belum production-ready
Modul Surat/Peil/Asset/Operasional belum punya tabel/workflow nyata
```

---

# 13. Bagian Yang Bisa Dipertahankan

Yang bisa dipertahankan sebagai pondasi:

```text
Next.js + Prisma + Zustand
NextAuth Credentials
package-centric data model
dashboard command center
peta Leaflet sebagai basis
approval/audit awal
layout desktop/mobile
mapping DB-to-UI
```

---

# 14. Bagian Yang Perlu Mapping

Bagian yang perlu mapping sebelum coding:

```text
Role DB ke role final
Menu ekstra menjadi sub-fitur
Migration aktual vs schema
Akses URL ke halaman Akses Dibatasi / Belum Ada Penugasan Aktif
Query filter global
Storage foto/dokumen
Audit event taxonomy
Sisa nama lama pada package/config jika ada
```

---

# 15. Bagian Yang Belum Ada / Masih Kurang

Bagian yang belum ada atau kurang:

```text
Tabel resmi surat
Tabel resmi peil
Tabel resmi asset
Tabel resmi operasional
Tabel shift/petugas mandor
Offline draft
Supabase Storage integration
WebSocket/realtime notification
Chat online status
RLS Supabase
Export laporan siap cetak penuh
PHO/FHO detail lengkap
Global clickable navigation konsisten semua modul
```

---

# 16. Risiko Jika Langsung Diubah

Risiko besar jika langsung menerapkan blueprint tanpa mapping:

```text
lockout user karena role campuran
data hilang karena endpoint DELETE masih hard delete relasi paket
migration gagal karena schema/migration drift
menu ganda makin membingungkan
dummy/fallback data masuk produksi
route filter klik dashboard/peta membuka halaman tanpa filter aktif
modul shell dipaksa menjadi fitur besar tanpa data model siap
```

---

# 17. Status Tugas Audit

Status dari Codex:

```text
File diubah: tidak ada
File dibuat: tidak ada
File tidak jadi diubah: semua file karena tahap ini audit dan mapping saja
Build/lint/typecheck: tidak dijalankan karena instruksi read-only audit
Rollback: tidak diperlukan untuk pekerjaan Codex
```

Catatan:

```text
Worktree sudah dirty dengan banyak modified/untracked file yang tidak disentuh Codex.
```

---

# 18. Cek Manual Berikutnya

Hal yang perlu dicek manual:

```text
Verifikasi database Supabase aktual terhadap schema.prisma
Verifikasi migration history
Verifikasi role aktual pada database
Verifikasi user aktif agar tidak lockout
Verifikasi route filter dashboard/peta
Verifikasi hard delete pada endpoint paket
Verifikasi storage foto/dokumen
Verifikasi modul shell Surat/Peil/Asset/Operasional
```

---

# 19. Rekomendasi Tahap Lanjutan

Jangan coding fitur besar dulu.

Urutan aman berikutnya:

```text
1. Commit dokumentasi dan AGENTS.md yang sudah final.
2. Simpan dokumen audit ini di /docs/audit.
3. Audit role aktual vs role final secara lebih detail.
4. Audit menu aktual 19 item vs menu final 11 item.
5. Audit database aktual vs schema.prisma dan migration.
6. Baru lakukan perubahan kecil pertama:
   - halaman Akses Dibatasi
   - halaman Belum Ada Penugasan Aktif
   - mapping query filter dasar
```

---

# 20. Prompt Lanjutan Yang Disarankan

Gunakan prompt ini untuk Codex:

```text
Baca dan patuhi AGENTS.md serta:

/docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md
/docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md
/docs/design/SIAGA_SDA_DESIGN_SYSTEM.md
/docs/audit/SIAGA_SDA_AUDIT_MAPPING_AWAL.md

Tugas tahap ini hanya membuat mapping detail lanjutan, bukan coding.

Jangan ubah file src.
Jangan ubah database.
Jangan ubah role.
Jangan ubah route.
Jangan hapus apa pun.

Buat laporan mapping detail untuk:
1. role aktual vs role final SIAGA-SDA;
2. menu aktual 19 item vs menu utama final 11 item;
3. modul yang sudah aktif vs modul yang masih shell;
4. route yang bisa dipertahankan;
5. route yang perlu dipetakan;
6. risiko perubahan role;
7. risiko perubahan menu;
8. risiko perubahan database;
9. rekomendasi tahapan coding paling aman.

Jangan melakukan perubahan apa pun sebelum saya menyetujui hasil mapping.
```

---

# 21. Catatan Final

Audit ini menunjukkan bahwa SIAGA-SDA sudah punya pondasi yang baik, tetapi belum boleh langsung dipaksa mengikuti seluruh blueprint tanpa mapping.

Blueprint harus dipakai sebagai kompas.

Sistem aktual harus dipakai sebagai peta lapangan.

Perubahan harus dilakukan bertahap, aman, dan bisa di-rollback.
