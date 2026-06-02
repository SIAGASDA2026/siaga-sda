<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA CODEX PROMPTS — STEP BY STEP UPDATED

## Prinsip Utama

Project ini adalah SIAGA-SDA. Jangan melakukan penggantian nama aplikasi.

Codex wajib membaca:

```text
AGENTS.md
/docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md
/docs/design/SIAGA_SDA_DESIGN_SYSTEM.md
```

Dilarang mengubah role, workflow, database, routing, auth, atau file di luar scope tanpa instruksi eksplisit.

---

# PROMPT 0 — AUDIT DAN MAPPING TANPA CODING

```text
Baca dan patuhi AGENTS.md serta /docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md.

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

# PROMPT 1 — SINKRONISASI ROLE ADMIN_SUB_KEGIATAN

```text
Baca dan patuhi AGENTS.md serta blueprint.

Tugas:
Audit referensi ADMIN_KEGIATAN dan mapping ke ADMIN_SUB_KEGIATAN secara aman.

Jangan hapus sembarangan.
Jangan ubah database besar tanpa instruksi.
Jangan ubah workflow.

Laporkan dahulu:
- file yang masih memakai ADMIN_KEGIATAN;
- dampak perubahan;
- rencana mapping;
- risiko.

Setelah disetujui, baru lakukan perubahan bertahap.
```

---

# PROMPT 2 — ROLE-BASED MENU

```text
Terapkan menu berdasarkan role dan assignment.

Menu yang bukan kewenangan user disembunyikan.
Jika URL diakses tanpa izin, tampilkan Akses Dibatasi.
Jika role ada tapi assignment belum ada, tampilkan Belum Ada Penugasan Aktif.

Jangan ubah role final.
Jangan tambah menu utama baru.
```

---

# PROMPT 3 — DASHBOARD REKAP

```text
Update Dashboard menjadi pusat rekap seluruh modul.

Dashboard tidak boleh memuat peta interaktif besar.
Peta besar hanya di Peta Monitoring.

Gunakan rekap:
- paket fisik per sub kegiatan/metode;
- paket rutin;
- konsultan perencanaan/pengawasan PL/Tender;
- survey;
- surat;
- approval;
- administrasi;
- peil;
- asset;
- operasional;
- pasang surut;
- audit log.
```

---

# PROMPT 4 — LOGIN

```text
Update Login sesuai SIAGA-SDA.

Dilarang:
- Google Login
- Microsoft Login
- Social Login
- Dropdown role

Login menampilkan:
- logo;
- kepanjangan SIAGA-SDA;
- Command Center SDA;
- Dinas PU Bidang SDA Kota Dumai;
- widget pasang surut;
- waktu salat;
- footer resmi.
```

---

# PROMPT 5 — PETA MONITORING

```text
Update Peta Monitoring sebagai pusat spasial SIAGA-SDA.

Layer:
- Paket
- Survey
- Asset
- Operasional
- Peil
- Pasang Surut
- Surat lokasi
- Deviasi/Warning

Jangan marker bertumpuk.
Gunakan 1 lokasi = 1 marker utama jika terkait.
```

---

# PROMPT 6 — SURVEY INVESTIGASI

```text
Update Survey Investigasi.

Gunakan istilah Ditindaklanjuti.
Jangan gunakan Menjadi Paket.

Survey tidak boleh hilang setelah ditindaklanjuti.
Tampilkan relasi ke tab tujuan.
```

---

# PROMPT 7 — PAKET PEKERJAAN

```text
Update Paket Pekerjaan.

Jenis paket:
- Fisik
- Konsultan
- Rutin

Sub jenis konsultan:
- Perencanaan
- Pengawasan

Metode:
- PL
- Tender/Lelang

Direksi Teknis wajib tetap ada untuk paket fisik.
```

---

# PROMPT 8 — SURAT MASUK & KELUAR

```text
Update Surat Masuk & Keluar.

Tambahkan Notulen & Tindak Lanjut Rapat sebagai sub-fitur pada surat undangan rapat.
Jangan buat tab utama Notulen.

Surat dapat ditindaklanjuti ke Survey, Peil, Paket, Surat Keluar, Notulen, atau Arsip.
```

---

# PROMPT 9 — ASSET SDA DAN OPERASIONAL

```text
Update Asset SDA.

Tambahkan QR Code asset dan sub-tab Operasional SDA.
Petugas biasa tidak wajib login.
Mandor wajib login dan memilih petugas dari master data.
Foto absensi dihapus.
```

---

# PROMPT 10 — FINAL CHECK

```text
Lakukan final check UI dan workflow.

Jangan tambah fitur baru.
Jangan ubah role.
Jangan ubah database.
Jangan ubah workflow.

Laporkan:
- file berubah;
- risiko;
- hasil build/lint/typecheck;
- bagian yang perlu dicek manual.
```
