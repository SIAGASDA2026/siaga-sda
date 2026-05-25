# SIAGA_SDA_PASANG_SURUT_GRAFIK_UI.md

# SIAGA-SDA
## Spesifikasi Grafik Pasang Surut Air Laut
### Dinas Pekerjaan Umum — Bidang Sumber Daya Air Kota Dumai

---

## 1. Tujuan Dokumen

Dokumen ini menjadi acuan untuk Codex dalam membuat fitur **grafik pasang surut air laut** pada aplikasi **SIAGA-SDA — Command Center SDA**.

Fitur pasang surut tidak boleh hanya berupa teks ringkasan. Sistem wajib menampilkan **grafik/kurva pasang surut air laut** yang mudah dibaca oleh:

- Pimpinan
- Kepala Bidang
- PPK
- PPTK
- Admin SDA
- Mandor Operasional SDA
- Petugas pintu air/rumah pompa jika nanti diberi akses terbatas

---

## 2. Prinsip Utama

Pasang surut air laut adalah bagian penting dari sistem monitoring SDA Kota Dumai karena berkaitan dengan:

- banjir rob
- genangan wilayah pesisir
- operasi pintu air
- operasi rumah pompa
- peringatan dini kenaikan air
- keputusan lapangan oleh mandor/petugas
- monitoring oleh PPK/PPTK/Kabid/Pimpinan

Fitur ini harus:

- ringan
- cepat dibuka
- responsive untuk laptop dan mobile
- tidak membebani dashboard
- tidak fetch langsung dari frontend setiap halaman dibuka
- memakai data cache dari database/Supabase
- bisa menampilkan status aman/waspada/siaga/kritis

---

## 3. Lokasi Tampilan Grafik

Grafik pasang surut wajib tersedia di tiga area:

### 3.1 Dashboard

Di Dashboard hanya tampil **ringkasan kecil** agar dashboard tetap ringan.

Isi ringkasan:

- status saat ini
- tinggi muka air saat ini
- tren naik/turun
- countdown menuju pasang tertinggi atau surut terendah
- tombol `Lihat Detail`

Dashboard **tidak boleh** memuat grafik besar yang berat.

### 3.2 Peta Monitoring

Di Peta Monitoring, grafik tampil sebagai panel detail/side panel.

Isi panel:

- grafik 3 jam sebelum dan 3 jam sesudah
- titik waktu saat ini
- prediksi pasang tertinggi
- prediksi surut terendah
- ambang waspada/siaga/kritis
- status peringatan
- countdown
- tombol lihat detail stasiun pasang surut

### 3.3 Halaman/Section Pasang Surut

Jika dibuat halaman detail Pasang Surut, tampilkan grafik lengkap:

- grafik 24 jam
- grafik 7 hari
- tabel data observasi/prediksi
- histori status peringatan
- daftar stasiun
- sumber data
- waktu update terakhir

---

## 4. Data Yang Wajib Ditampilkan

Grafik utama wajib menampilkan:

- data 3 jam sebelum waktu saat ini
- data saat ini
- data 3 jam sesudah waktu saat ini
- tinggi muka air saat ini
- prediksi pasang tertinggi berikutnya
- prediksi surut terendah berikutnya
- tren air naik/turun/stabil
- ambang waspada
- ambang siaga
- ambang kritis
- status peringatan
- waktu update terakhir

---

## 5. Format Grafik

Gunakan grafik garis/line chart yang ringan.

Rekomendasi library:

- Recharts
- Chart.js
- atau library chart ringan lain yang sudah tersedia di project

Jangan gunakan grafik berat atau animasi berlebihan.

### Elemen Grafik

Grafik harus memiliki:

- sumbu waktu
- sumbu tinggi muka air
- garis muka air
- marker waktu saat ini
- garis ambang waspada
- garis ambang siaga
- garis ambang kritis
- tooltip saat hover/tap
- label status

---

## 6. Status Peringatan

Gunakan status:

```text
AMAN
WASPADA
SIAGA
KRITIS
```

### Warna Status

```text
AMAN    = Hijau
WASPADA = Kuning/Orange
SIAGA   = Orange Tua
KRITIS  = Merah
```

Status dihitung berdasarkan perbandingan tinggi muka air terhadap threshold.

---

## 7. Threshold / Ambang Batas

Sistem harus menyediakan pengaturan threshold:

- ambang waspada
- ambang siaga
- ambang kritis

Threshold dapat diatur di menu:

```text
Pengaturan → Pasang Surut & Warning Threshold
```

Contoh:

```text
Ambang Waspada : +0.80 m
Ambang Siaga   : +1.20 m
Ambang Kritis  : +1.80 m
```

Nilai ini harus dapat diubah oleh role yang berwenang, misalnya:

- SUPER_ADMIN
- ADMIN_SISTEM
- ADMIN_SDA yang diberi izin

Semua perubahan threshold wajib masuk `audit_log`.

---

## 8. Sumber Data

Data pasang surut dapat berasal dari:

- API resmi jika tersedia
- data BMKG/instansi terkait jika bisa diakses
- data manual petugas
- data sensor/AWLR jika nanti tersedia
- data prediksi yang disimpan berkala

Prinsip penting:

```text
Frontend tidak boleh mengambil data langsung dari sumber eksternal setiap halaman dibuka.
```

Gunakan alur:

```text
Scheduler Backend / Cron
→ Fetch data sumber
→ Simpan/cache ke Supabase
→ Frontend membaca dari Supabase
```

---

## 9. Struktur Tabel Database

Tambahkan/siapkan tabel berikut.

### 9.1 tide_stations

```sql
tide_stations
- id
- station_code
- station_name
- location_name
- latitude
- longitude
- source
- warning_threshold
- alert_threshold
- critical_threshold
- is_active
- created_at
- updated_at
```

### 9.2 tide_observations

```sql
tide_observations
- id
- station_id
- observed_at
- water_level
- predicted_level
- tide_status
- trend_status
- warning_status
- source
- fetched_at
- created_at
```

### 9.3 tide_warning_logs

```sql
tide_warning_logs
- id
- station_id
- warning_status
- water_level
- threshold_value
- message
- triggered_at
- resolved_at
- created_at
```

### 9.4 tide_settings

```sql
tide_settings
- id
- station_id
- warning_threshold
- alert_threshold
- critical_threshold
- notification_enabled
- updated_by
- updated_at
```

---

## 10. Logika Perhitungan Tren

Sistem harus menghitung tren:

```text
AIR_NAIK
AIR_TURUN
STABIL
```

Contoh logika:

- Jika level sekarang lebih tinggi dari level 30–60 menit sebelumnya → AIR_NAIK
- Jika level sekarang lebih rendah → AIR_TURUN
- Jika selisih sangat kecil → STABIL

Tambahkan indikator:

```text
Naik +0.18 m dalam 1 jam
Turun -0.08 m dalam 1 jam
Stabil ±0.02 m
```

---

## 11. Countdown

Sistem wajib menampilkan countdown menuju:

- pasang tertinggi berikutnya
- surut terendah berikutnya

Contoh tampilan:

```text
Menuju Pasang Tertinggi:
02 jam 35 menit 24 detik

Prediksi Pasang Tertinggi:
+1.86 m
Pukul 17:45 WIB
```

Jika air sedang turun, tampilkan countdown ke surut terendah.

---

## 12. Warning System

Jika muka air melewati threshold, sistem wajib membuat warning.

Contoh:

```text
WASPADA
Pasang laut meningkat. Tinggi muka air +1.25 m.
Diperkirakan menuju +1.80 m pada 17:45 WIB.
```

Jika status `SIAGA` atau `KRITIS`, tampilkan di:

- Dashboard
- Peta Monitoring
- Warning Center
- Notifikasi user terkait
- Panel operasional mandor jika fitur operasional aktif

---

## 13. Integrasi Dengan Peta Monitoring

Layer pasang surut wajib tampil di Peta Monitoring.

Marker stasiun pasang surut menampilkan:

- nama stasiun
- tinggi muka air saat ini
- status warning
- tren naik/turun
- waktu update
- tombol detail

Klik marker membuka detail drawer:

- grafik 3 jam sebelum dan 3 jam sesudah
- status
- threshold
- countdown
- histori warning singkat
- tombol buka detail pasang surut

---

## 14. Integrasi Dengan Operasional SDA

Jika status pasang surut naik ke WASPADA/SIAGA/KRITIS, sistem dapat memberi peringatan kepada:

- MANDOR_OPERASIONAL_SDA
- petugas pintu air/rumah pompa jika ada akses
- PPK/PPTK terkait
- Kepala Bidang
- Pimpinan read-only

Peringatan tidak otomatis memerintahkan operasi, tetapi menjadi dasar informasi untuk:

- buka/tutup pintu air
- hidup/matikan pompa
- patroli lokasi rawan
- laporan operasi mandor

---

## 15. UI Dashboard Ringkas

Di Dashboard, tampilkan card:

```text
Pasang Surut (Ringkasan)

Status Saat Ini : WASPADA
Tinggi Muka Air : +1.42 m
Trend           : TURUN / NAIK
Menuju Siaga    : 02:35:24
Sumber          : Stasiun Pasut Dumai
Update          : 10:24 WIB

[Lihat Detail]
```

Dashboard hanya ringkasan. Jangan memuat grafik besar interaktif.

---

## 16. UI Peta Monitoring

Di Peta Monitoring, tampilkan panel:

```text
Pasang Surut Air Laut
Stasiun Pantai Dumai

Grafik:
3 jam sebelum — saat ini — 3 jam sesudah

Saat Ini:
+1.42 m

Trend:
AIR_NAIK / AIR_TURUN

Pasang Tertinggi:
+1.86 m pukul 17:45 WIB

Surut Terendah:
+0.45 m pukul 21:15 WIB

Status:
WASPADA
```

---

## 17. UI Mobile

Di mobile, tampilan harus sederhana:

- card status pasang surut
- grafik kecil responsive
- countdown besar
- warning jelas
- tombol lihat detail

Jangan memaksa banyak chart dalam satu layar mobile.

Gunakan layout:

```text
[Status Pasang Surut]
[Countdown]
[Grafik Mini]
[Prediksi Pasang/Surut]
[Warning]
```

---

## 18. Performance Rules

Wajib:

- data diambil dari cache database
- gunakan pagination untuk histori
- gunakan chart ringan
- jangan realtime setiap detik untuk semua user
- refresh berkala cukup 1–5 menit
- countdown boleh berjalan di frontend
- data pasut tidak boleh membuat dashboard lambat

---

## 19. Audit Log

Catat ke `audit_log` jika:

- threshold diubah
- data manual pasut diinput
- warning dibuat otomatis
- warning di-resolve
- sumber data diubah
- stasiun pasut ditambah/dinonaktifkan

---

## 20. Prompt Untuk Codex

Gunakan prompt ini saat mengerjakan fitur pasang surut:

```text
Baca dan patuhi:

/docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md
/docs/design/SIAGA_SDA_DESIGN_SYSTEM.md
/docs/modules/SIAGA_SDA_PASANG_SURUT_GRAFIK_UI.md

Buat fitur grafik pasang surut air laut untuk SIAGA-SDA.

Ketentuan:
- tampilkan grafik/kurva pasang surut
- data utama 3 jam sebelum, saat ini, dan 3 jam sesudah
- tampilkan pasang tertinggi dan surut terendah berikutnya
- tampilkan tren naik/turun/stabil
- tampilkan countdown
- tampilkan status aman/waspada/siaga/kritis
- tampilkan threshold waspada/siaga/kritis
- data frontend harus berasal dari Supabase/cache, bukan fetch langsung ke API eksternal setiap halaman dibuka
- gunakan chart ringan dan responsive
- tampilkan ringkasan kecil di Dashboard
- tampilkan panel grafik di Peta Monitoring
- buat tampilan mobile yang ringan dan mudah dibaca
- semua perubahan threshold dan warning wajib masuk audit_log
- jangan membuat dashboard berat
- jangan memuat peta besar atau grafik besar di Dashboard
```

---

## 21. Kesimpulan

Fitur grafik pasang surut air laut wajib menjadi bagian penting SIAGA-SDA.

Namun implementasinya harus tetap:

- ringan
- jelas
- aman untuk mobile
- terhubung ke Peta Monitoring
- terhubung ke Warning Center
- mendukung operasional pintu air dan rumah pompa
- tidak membuat dashboard berat
