# ROADMAP SIAGA-SDA — DARI STATUS SAAT INI HINGGA 100%

> **Sumber:** Disusun berdasarkan `STATUS_KESIAPAN_SIAGA_SDA_MENUJU_STABIL.docx` per 19 Juni 2026.
> **Tujuan dokumen:** Jadi panduan kerja teknis langkah-demi-langkah untuk dipakai bersama Codex/AI coding agent di VS Code. Setiap tahap punya: tujuan, file/area yang kemungkinan tersentuh, langkah kerja, dan kriteria selesai (Definition of Done) supaya agent tidak menebak-nebak kapan sebuah tahap dianggap tuntas.
>
> **Aturan main untuk agent:**
> 1. Kerjakan tahap **berurutan**, jangan lompat — banyak tahap saling bergantung pada tahap sebelumnya.
> 2. **Jangan menyentuh halaman Login** tanpa instruksi eksplisit (dinyatakan final/locked).
> 3. **Jangan rollback commit DATA-CONSISTENCY.1** — helper status (`project-status.ts`) sudah benar dan jadi fondasi.
> 4. Setiap tahap selesai → commit dengan pesan yang jelas, lalu update checklist di bagian paling bawah dokumen ini.
> 5. Kalau ragu antara "menambah fitur baru" vs "menyelesaikan fitur yang sudah ada", **selalu pilih menyelesaikan yang sudah ada dulu**. Scope creep adalah risiko terbesar proyek ini.

---

## FASE 0 — Baseline (Sudah Selesai, Jangan Diulang)

Checklist ini hanya untuk konteks, **tidak perlu dikerjakan ulang**:

- [x] Identitas & menu utama SIAGA-SDA aktif (11 menu utama)
- [x] Login final/locked
- [x] Branding lama dibersihkan dari output cetak/export
- [x] Upload foto sementara di frontend diberi label preview (bukan resmi)
- [x] Guard server-side menolak `blob:`, `data:`, string kosong, URL lokal sebagai `Foto.url`
- [x] Helper `project-status.ts` mencegah paket <100% tampil "On Track"
- [x] Fondasi konsep Pusat Peringatan & Tindak Lanjut (deteksi → rekomendasi → draft → catat status, tanpa auto-publish)

---

## BAGIAN A — MENUJU PILOT STABIL (Target: 2–3 minggu)

### TAHAP 1 — `DATA-CONSISTENCY.2`
**Tujuan:** Menyamakan sumber data antara "Tugas Saya", "Peringatan Sistem", dan "Halo SIAGA-SDA" sehingga ketiganya konsisten dan Halo menampilkan **semua** peringatan dalam scope user, bukan hanya satu paket.

**Langkah kerja:**
1. Audit semua tempat yang membaca status paket (dashboard widget, halo, peringatan sistem) — petakan query/data source masing-masing.
2. Pastikan semua tempat tersebut memanggil helper status yang sama (`project-status.ts`), tidak ada logika status duplikat yang menyimpang.
3. Refactor Halo SIAGA-SDA agar membaca dari sumber data peringatan sistem secara penuh (list, bukan single object/paket).
4. Pisahkan secara tegas: "Misi Pribadi" (task personal user) vs "Peringatan Sistem" (alert dari sistem berbasis kondisi paket) — pastikan tidak tercampur di komponen UI yang sama tanpa pembeda visual/struktural.
5. Tambahkan scope filtering: user hanya melihat peringatan yang relevan dengan role & assignment-nya.

**Definition of Done:**
- Halo menampilkan daftar lengkap semua peringatan sistem dalam scope user (bukan 1 paket saja).
- Dashboard, Peringatan Sistem, dan Halo menunjukkan data yang identik untuk paket yang sama.
- Tidak ada lagi paket <100% yang tampil "On Track" di mana pun.
- Misi pribadi dan peringatan sistem tampil terpisah secara jelas.

---

### TAHAP 2 — `WARNING-RECOMMENDATION.1`
**Tujuan:** Sistem merekomendasikan tindak lanjut/surat teguran untuk paket terlambat/kritis — sebagai informasi & draft, **bukan** otomatis terbit resmi.

**Langkah kerja:**
1. Definisikan trigger kondisi "terlambat/kritis" berdasarkan data progres vs target (gunakan helper status yang sudah ada di Tahap 1).
2. Tambahkan field/komponen UI yang menampilkan status tindak lanjut menggunakan state machine berikut (urut sesuai dokumen):
   - Belum Ada Tindak Lanjut
   - Rekomendasi Dibuat
   - Menunggu Verifikasi Teknis
   - Menunggu Review PPK/PPTK
   - Draft Surat Disiapkan
   - Diajukan untuk Persetujuan
   - Dikirim ke Kontraktor
   - Menunggu Tindak Lanjut Kontraktor
   - Selesai / Diarsipkan
3. Buat tampilan rekomendasi (read-only/draft) di UI untuk paket terlambat/kritis — tombol aksi mengubah status secara manual oleh user berwenang, **tidak ada otomasi penerbitan surat resmi**.
4. Catat histori perubahan status tindak lanjut (terhubung dengan Audit Log di Tahap 6 nanti).
5. Tidak perlu mengubah skema database besar di tahap ini — cukup field status & histori minimal yang diperlukan untuk menampilkan informasi.

**Definition of Done:**
- Paket terlambat/kritis menampilkan rekomendasi tindak lanjut secara otomatis di UI.
- Status tindak lanjut bisa diubah manual oleh role berwenang, tidak ada auto-publish surat resmi.
- Histori perubahan status tersimpan dan bisa dilihat.

---

### TAHAP 3 — `PILOT-SCOPE.1`
**Tujuan:** Mengunci modul mana yang aktif untuk pilot, dan memberi label jelas pada modul yang belum siap, agar user pilot tidak bingung.

**Modul AKTIF untuk pilot:**
- Dashboard
- Survey Investigasi
- Paket Pekerjaan
- Laporan Harian
- Approval Center
- Audit Log
- Pengaturan user/role dasar

**Modul DITUNDA (beri label "Segera Hadir" / "Dalam Persiapan"):**
- Surat Masuk & Keluar (penuh)
- Peil Banjir (penuh)
- Asset SDA
- Operasional SDA
- Offline (penuh)
- Multi-role database lanjutan

**Langkah kerja:**
1. Tambahkan flag/config (misal `MODULE_STATUS` config object) untuk menandai status setiap modul: `active`, `coming_soon`, `hidden`.
2. Untuk modul `coming_soon`: tampilkan halaman placeholder yang jelas ("Modul ini sedang disiapkan") — jangan tampilkan menu kosong/error.
3. Sembunyikan atau nonaktifkan akses langsung (route guard) ke modul yang belum siap dari role non-admin.
4. Pastikan navigasi/menu utama mencerminkan status ini secara konsisten.

**Definition of Done:**
- User pilot tidak bisa mengakses modul belum siap tanpa melihat label yang jelas.
- Tidak ada menu yang mengarah ke halaman kosong/error.
- Konfigurasi status modul terdokumentasi di satu tempat (mudah diubah saat modul siap).

---

### TAHAP 4 — `STORAGE-FOTO.1`
**Tujuan:** Upload foto permanen minimal untuk Survey Investigasi dan Laporan Harian (bukan lagi preview lokal/blob).

**Langkah kerja:**
1. Buat endpoint upload resmi di backend (multipart/form-data atau presigned URL ke storage — pilih sesuai infrastruktur yang tersedia, misal local disk terstruktur, S3-compatible, atau storage provider lain).
2. Validasi server-side:
   - Tipe file (hanya image: jpg/jpeg/png/webp)
   - Ukuran maksimum file
   - Reject jika payload berupa `blob:`, `data:`, string kosong, atau URL lokal browser (guard ini sudah ada — pastikan tetap konsisten dipakai di endpoint baru)
3. Tambahkan proses:
   - Kompresi gambar (resize ke resolusi wajar, kompres kualitas tanpa merusak detail penting)
   - Watermark (timestamp + nama lokasi/koordinat, sesuai kebutuhan bukti lapangan)
   - Generate thumbnail untuk preview list
4. Simpan metadata: koordinat GPS (jika tersedia dari device), waktu upload, ID uploader, ID paket/laporan terkait.
5. Update frontend Survey & Laporan Harian untuk memanggil endpoint resmi ini, ganti total mekanisme preview lokal yang lama untuk foto final (preview lokal boleh tetap dipakai sebagai *preview sementara sebelum submit*, tapi setelah submit harus melalui endpoint resmi ini).

**Definition of Done:**
- Foto yang disimpan di Survey & Laporan Harian benar-benar tersimpan permanen di storage, bukan blob/local URL.
- Validasi mime/ukuran berjalan di server, bukan hanya di frontend.
- Metadata (koordinat, waktu, uploader) tersimpan dan bisa ditampilkan kembali.
- Thumbnail & watermark tampil dengan benar di UI.

---

### TAHAP 5 — `PILOT-FORM-MOBILE.1`
**Tujuan:** Merapikan form lapangan (Survey, Laporan Harian) agar nyaman dipakai di HP — karena pengguna lapangan mayoritas pakai mobile browser.

**Langkah kerja:**
1. Review semua form input Survey & Laporan Harian di breakpoint mobile (≤480px lebar layar).
2. Pastikan input besar (touch target minimal ±44px), label jelas, dan urutan field logis untuk pengisian satu tangan.
3. Optimalkan komponen upload foto agar bisa langsung dari kamera HP (`<input type="file" accept="image/*" capture="environment">` atau setara di framework yang dipakai).
4. Cek perilaku form saat koneksi lambat — pastikan tidak ada submit ganda akibat tap berulang (disable button saat submitting).
5. Uji manual di minimal 2 ukuran layar HP berbeda (kecil & besar).

**Definition of Done:**
- Form Survey & Laporan Harian nyaman diisi penuh dari HP tanpa perlu zoom/scroll horizontal.
- Upload foto dari kamera HP berjalan lancar.
- Tidak ada submit ganda/error duplikasi data.

---

### TAHAP 6 — `CORE-FLOW-QA.1`
**Tujuan:** Menguji alur inti end-to-end: **Survey → Paket → Laporan → Approval → Audit Log**.

**Langkah kerja:**
1. Buat skenario uji end-to-end (manual checklist atau automated test jika waktu memungkinkan) yang mencakup:
   - Buat Survey baru → data tersimpan benar
   - Survey terhubung ke Paket Pekerjaan yang sesuai
   - Laporan Harian dibuat berdasarkan paket tersebut → progres terupdate
   - Laporan masuk ke Approval Center → status approval berubah sesuai aksi (approve/reject/revisi)
   - Setiap aksi di atas tercatat di Audit Log dengan detail yang benar (siapa, kapan, apa)
2. Cek konsistensi status di setiap tahap (apakah update di satu modul tercermin benar di modul lain — terhubung ke hasil Tahap 1).
3. Catat dan perbaiki semua bug yang ditemukan selama pengujian alur ini sebelum lanjut ke tahap berikutnya.

**Definition of Done:**
- Alur penuh Survey → Paket → Laporan → Approval → Audit Log berjalan tanpa error.
- Semua perubahan status konsisten di seluruh modul terkait.
- Audit Log mencatat seluruh aksi penting di alur ini secara akurat.

---

### TAHAP 7 — `ROLE-ASSIGNMENT-QA.1`
**Tujuan:** Menguji akses data per role dan assignment — memastikan setiap role hanya melihat data sesuai scope-nya.

**Role yang harus diuji satu per satu:**
- Kontraktor → hanya melihat paket miliknya sendiri
- Konsultan Pengawas → sesuai assignment pengawasannya
- PPK/PPTK → sesuai kewenangan paket yang dipegang
- Pimpinan → read-only, akses lebih luas untuk monitoring
- Auditor → read-only, akses ke audit log & laporan
- Admin → akses penuh untuk konfigurasi sistem

**Langkah kerja:**
1. Buat matriks akses: Role × Modul × Aksi (lihat/tambah/ubah/hapus/approve).
2. Uji login dengan masing-masing role, pastikan data yang tampil sesuai scope (tidak melihat data role/assignment lain).
3. Uji bahwa role read-only (Pimpinan, Auditor) benar-benar tidak bisa melakukan aksi tulis/ubah di UI maupun API (cek juga di level API, jangan hanya sembunyikan tombol di frontend).
4. Perbaiki setiap kebocoran akses yang ditemukan.

**Definition of Done:**
- Setiap role hanya bisa mengakses/mengubah data sesuai matriks akses yang didefinisikan.
- Role read-only tidak bisa melakukan aksi tulis baik dari UI maupun langsung lewat API.
- Tidak ada kebocoran data antar kontraktor/assignment.

---

### TAHAP 8 — `DEPLOYMENT-PILOT.1`
**Tujuan:** Deploy ke environment pilot internal, siap dipakai user pilot pertama.

**Langkah kerja:**
1. Siapkan environment pilot (terpisah dari development) — variabel env, koneksi database, storage foto (Tahap 4) dikonfigurasi dengan benar.
2. Buat user awal untuk masing-masing role yang akan ikut pilot.
3. Siapkan data demo atau data resmi awal (paket pekerjaan yang sedang berjalan) sesuai kebutuhan pilot.
4. Pastikan ada mekanisme backup data (minimal backup database terjadwal/manual sebelum pilot dimulai).
5. Uji aplikasi di browser desktop utama (Chrome, minimal 1 browser lain) dan di HP (Android & iOS jika memungkinkan).
6. Siapkan kontak/jalur pelaporan bug cepat dari user pilot (misal grup WA/Telegram internal) selama masa pilot berjalan.

**Definition of Done:**
- Environment pilot berjalan stabil, bisa diakses user pilot.
- Backup data sudah ada sebelum pilot mulai.
- Aplikasi tervalidasi jalan baik di desktop & mobile.
- Jalur pelaporan bug pilot sudah siap.

---

## BAGIAN B — MENUJU STABIL KERJA HARIAN DINAS (Target tambahan: 4–6 minggu dari awal)

> Tahap ini dimulai setelah Bagian A selesai dan pilot berjalan tanpa blocker besar.

### TAHAP 9 — Penguatan Modul Pilot Berdasarkan Feedback
**Tujuan:** Memperbaiki isu yang muncul dari pemakaian nyata user pilot sebelum diperluas ke pemakaian harian penuh.

**Langkah kerja:**
1. Kumpulkan semua feedback/bug dari masa pilot (Tahap 8) — kategorikan: critical / major / minor.
2. Perbaiki seluruh item critical & major terlebih dahulu sebelum menambah modul baru.
3. Lakukan regresi singkat di alur inti (ulangi sebagian Tahap 6) setelah perbaikan untuk memastikan tidak ada yang rusak.

**Definition of Done:**
- Semua bug critical & major dari pilot sudah diperbaiki dan diverifikasi ulang.
- Tidak ada regresi di alur inti.

### TAHAP 10 — Penyelesaian Approval Center & Audit Log Lanjutan
**Tujuan:** Approval Center punya workflow & role yang matang; Audit Log terintegrasi penuh dengan warning & tindak lanjut.

**Langkah kerja:**
1. Pastikan setiap state approval (approve/reject/revisi) punya aturan role yang jelas (siapa yang boleh approve apa).
2. Integrasikan Audit Log agar mencatat setiap perubahan status tindak lanjut/surat teguran dari Tahap 2.
3. Tambahkan filter/pencarian dasar di Audit Log (per user, per tanggal, per modul) agar auditor bisa menelusuri histori dengan mudah.

**Definition of Done:**
- Approval Center punya aturan role yang konsisten dan teruji.
- Audit Log mencakup seluruh aksi tindak lanjut/warning, bisa difilter/dicari.

### TAHAP 11 — Pengaturan, Master Data & Assignment Lanjutan
**Tujuan:** Pengaturan role, assignment, dan master data siap dipakai harian (bukan sekadar dasar).

**Langkah kerja:**
1. Lengkapi UI Pengaturan untuk admin mengelola user, role, dan assignment paket tanpa perlu akses langsung ke database.
2. Tambahkan validasi master data (misal: tidak bisa assign kontraktor ke paket yang tidak ada, role wajib terisi, dsb).
3. Lakukan QA pilot lanjutan khusus modul Pengaturan ini (sejalan dengan Tahap 7 tapi lebih dalam dari sisi pengelolaan data, bukan hanya akses baca).

**Definition of Done:**
- Admin bisa mengelola user/role/assignment penuh lewat UI tanpa akses database manual.
- Validasi master data berjalan, tidak ada data yatim (assignment ke entitas yang tidak ada).

---

## BAGIAN C — MENUJU PRODUCTION LENGKAP / 100% (Target tambahan: 6+ bulan dari awal)

> Tahap ini untuk modul besar yang sengaja ditunda di Bagian A & B. Bisa dikerjakan paralel oleh tim berbeda jika resource memungkinkan, namun tetap disarankan satu-satu agar QA tidak kehilangan fokus.

### TAHAP 12 — `Surat Masuk & Keluar` (Backend Penuh)
**Tujuan:** Workflow surat resmi: masuk, keluar, disposisi, notulen, tindak lanjut.

**Langkah kerja:**
1. Desain skema data: Surat (jenis, nomor, tanggal, pengirim/penerima, lampiran), Disposisi (dari siapa ke siapa, instruksi), Notulen (rapat terkait, hasil), Tindak Lanjut (status, terhubung ke Tahap 2 jika relevan untuk surat teguran).
2. Bangun backend CRUD + workflow status surat (draft → diajukan → disposisi → ditindaklanjuti → selesai/diarsipkan).
3. Bangun UI untuk membuat, melihat, mendisposisikan, dan melacak status surat.
4. Hubungkan dengan modul Audit Log agar setiap perubahan status surat tercatat.
5. Export PDF surat resmi (gunakan template sesuai format dinas).

**Definition of Done:**
- Surat masuk/keluar bisa dibuat, didisposisikan, dilacak statusnya, dan diexport PDF.
- Histori perubahan status tercatat di Audit Log.

### TAHAP 13 — `Peil Banjir` (Backend Penuh)
**Tujuan:** Modul permohonan, checklist fleksibel, persyaratan, export PDF, dan workflow teknis untuk Peil Banjir.

**Langkah kerja:**
1. Desain skema data: Permohonan (pemohon, lokasi, jenis permohonan), Checklist (item persyaratan yang fleksibel sesuai jenis permohonan), Workflow teknis (tahapan verifikasi/survey/persetujuan).
2. Bangun backend CRUD + status workflow permohonan.
3. Bangun UI pengajuan permohonan (untuk pemohon eksternal/internal) dan UI verifikasi (untuk petugas teknis).
4. Tambahkan export PDF hasil rekomendasi/keputusan peil banjir.
5. QA alur penuh: permohonan → checklist terisi → verifikasi teknis → keputusan → export PDF.

**Definition of Done:**
- Alur permohonan Peil Banjir berjalan penuh dari pengajuan hingga keputusan & export PDF.
- Checklist persyaratan fleksibel sesuai jenis permohonan dan tervalidasi.

### TAHAP 14 — `Asset SDA` (Backend Penuh)
**Tujuan:** Manajemen aset SDA: data aset, histori, QR code, kondisi, dan operasional.

**Langkah kerja:**
1. Desain skema data: Aset (jenis, lokasi, spesifikasi), Histori (perubahan kondisi/perbaikan dari waktu ke waktu), Kondisi (status terkini), Operasional (penggunaan/jadwal pemeliharaan jika relevan).
2. Bangun backend CRUD aset + histori kondisi.
3. Generate QR code unik per aset (untuk dipindai di lapangan, redirect ke detail aset).
4. Bangun UI manajemen aset (list, detail, update kondisi, riwayat).
5. Hubungkan dengan modul Survey/Laporan jika aset terkait paket pekerjaan tertentu.

**Definition of Done:**
- Setiap aset punya QR code yang bisa dipindai untuk melihat detail & histori.
- Update kondisi aset tercatat sebagai histori, tidak menimpa data lama.

### TAHAP 15 — `Offline Lapangan` (Penuh)
**Tujuan:** Petugas lapangan bisa mengisi form (Survey/Laporan) tanpa sinyal, lalu sinkron otomatis saat online kembali.

**Langkah kerja:**
1. Implementasikan local storage/draft di sisi client (browser storage atau app storage, sesuai platform) untuk menyimpan form yang belum terkirim.
2. Tambahkan status visual "Menunggu Sinkronisasi" pada data yang masih tersimpan lokal.
3. Bangun sync queue: saat koneksi kembali, kirim data tersimpan secara berurutan ke server, termasuk foto (terhubung ke Tahap 4 — pastikan foto offline juga ikut tersimpan lokal sebelum sync).
4. Tangani konflik data (misal data sudah diubah di server saat user offline) — tentukan aturan resolusi (server wins / tampilkan konflik ke user untuk dipilih).
5. Uji skenario nyata: isi form dalam mode pesawat, kembalikan koneksi, pastikan data tersinkron benar tanpa duplikasi atau hilang.

**Definition of Done:**
- Form bisa diisi penuh tanpa koneksi internet dan tersimpan sebagai draft lokal.
- Sinkronisasi otomatis berjalan saat online kembali, tanpa duplikasi/data hilang.
- Status "Menunggu Sinkronisasi" terlihat jelas oleh user selama proses ini.

### TAHAP 16 — `Warning Action Center` Runtime Penuh
**Tujuan:** Mengembangkan fondasi dokumen Pusat Peringatan & Tindak Lanjut (dari Tahap 2) menjadi sistem runtime penuh dengan route dan status tindak lanjut yang lengkap.

**Langkah kerja:**
1. Bangun halaman/route khusus Warning Action Center (bukan hanya indikator di Halo/Dashboard) yang menampilkan seluruh peringatan aktif beserta status tindak lanjutnya secara terpusat.
2. Tambahkan kemampuan filter (per status tindak lanjut, per paket, per role terkait).
3. Integrasikan penuh dengan modul Surat Masuk & Keluar (Tahap 12) — saat status tindak lanjut mencapai "Draft Surat Disiapkan" atau lebih lanjut, terhubung langsung ke surat resmi terkait.
4. Tambahkan notifikasi (in-app minimal, email/WA jika infrastruktur memungkinkan) untuk role terkait setiap kali ada perubahan status penting.

**Definition of Done:**
- Ada halaman terpusat yang menampilkan semua peringatan & status tindak lanjutnya, bisa difilter.
- Terintegrasi penuh dengan modul Surat Masuk & Keluar.
- Notifikasi perubahan status berjalan untuk role terkait.

### TAHAP 17 — Multi-Role Database & Hardening Lanjutan
**Tujuan:** Memperkuat struktur multi-role di level database (bukan hanya di level aplikasi) dan melakukan hardening keamanan/performa untuk siap production penuh.

**Langkah kerja:**
1. Review skema database — pastikan constraint role/assignment diterapkan di level database (foreign key, check constraint), bukan hanya validasi aplikasi.
2. Audit keamanan dasar: rate limiting endpoint sensitif, validasi input di semua endpoint (cegah injection), pengelolaan secret/env yang aman.
3. Audit performa: index database untuk query yang sering dipakai (dashboard, halo, laporan), cek query N+1 jika ada.
4. Siapkan monitoring dasar (log error terpusat, alert jika server down/error rate tinggi).
5. Siapkan dokumentasi deployment production (langkah deploy, rollback, backup rutin).

**Definition of Done:**
- Constraint multi-role diterapkan di level database.
- Tidak ada celah keamanan dasar yang ditemukan dalam audit (injection, secret exposure, dsb).
- Query-query utama sudah diindex dan diuji performanya.
- Monitoring & dokumentasi deployment production tersedia.

---

## CHECKLIST RINGKAS — UPDATE SETIAP TAHAP SELESAI

### Bagian A — Pilot Stabil (target 2–3 minggu)
- [ ] Tahap 1 — DATA-CONSISTENCY.2
- [ ] Tahap 2 — WARNING-RECOMMENDATION.1
- [ ] Tahap 3 — PILOT-SCOPE.1
- [ ] Tahap 4 — STORAGE-FOTO.1
- [ ] Tahap 5 — PILOT-FORM-MOBILE.1
- [ ] Tahap 6 — CORE-FLOW-QA.1
- [ ] Tahap 7 — ROLE-ASSIGNMENT-QA.1
- [ ] Tahap 8 — DEPLOYMENT-PILOT.1

### Bagian B — Stabil Kerja Harian (target tambahan 4–6 minggu)
- [ ] Tahap 9 — Penguatan modul pilot dari feedback
- [ ] Tahap 10 — Approval Center & Audit Log lanjutan
- [ ] Tahap 11 — Pengaturan, master data & assignment lanjutan

### Bagian C — Production Lengkap 100% (target tambahan 6+ bulan)
- [ ] Tahap 12 — Surat Masuk & Keluar (backend penuh)
- [ ] Tahap 13 — Peil Banjir (backend penuh)
- [ ] Tahap 14 — Asset SDA (backend penuh)
- [ ] Tahap 15 — Offline lapangan (penuh)
- [ ] Tahap 16 — Warning Action Center runtime penuh
- [ ] Tahap 17 — Multi-role database & hardening production

---

## CATATAN PENTING UNTUK AGENT/CODEX

- Selalu cek ulang **Tahap 1 (DATA-CONSISTENCY.2)** sebagai sumber kebenaran status sebelum mengerjakan tahap manapun yang menampilkan data status paket.
- Jangan kerjakan Bagian C sebelum Bagian A selesai penuh dan pilot berjalan tanpa blocker besar — risiko terbesar proyek ini adalah scope melebar sebelum fondasi stabil.
- Setiap tahap yang selesai harus diverifikasi terhadap **Definition of Done** masing-masing sebelum ditandai selesai di checklist — jangan menandai selesai hanya karena kode sudah ditulis, tapi karena sudah diuji sesuai kriteria.
- Jika menemukan keputusan desain yang tidak tercakup di dokumen ini, catat sebagai pertanyaan terbuka, jangan diasumsikan sendiri — terutama untuk hal yang berkaitan dengan kewenangan resmi (surat teguran, approval, role).
