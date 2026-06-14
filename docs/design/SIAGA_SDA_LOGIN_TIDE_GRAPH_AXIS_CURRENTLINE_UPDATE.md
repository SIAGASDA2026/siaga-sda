# SIAGA-SDA Login Tide Graph Axis and Current Water Line Update

Tanggal perubahan: 15 Juni 2026

## 1. Tujuan

Menyelesaikan grafik pasang surut halaman login dengan sumbu meter dan waktu, garis kurva yang lebih tipis, garis puncak merah, garis posisi air saat ini berwarna biru, serta detail hover yang tetap ringan dan responsif.

## 2. Backup

Backup dibuat di:

```text
backup/backup-login-tide-graph-axis-currentline-before-change
```

File yang dibackup:

```text
src/app/login/page.tsx
src/components/login/LoginTideWidget.tsx
src/components/login/login.module.css
```

## 3. File yang Diubah

```text
src/components/login/LoginTideWidget.tsx
src/components/login/login.module.css
docs/design/SIAGA_SDA_LOGIN_TIDE_GRAPH_AXIS_CURRENTLINE_UPDATE.md
```

## 4. Rendering Sebelum Perubahan

Grafik sudah memakai custom SVG, kurva cubic Bezier, area fill, marker data, dan tooltip interaktif. Namun koordinat titik masih berasal dari posisi manual, belum memiliki label sumbu meter/jam, dan belum memiliki indikator posisi air berdasarkan waktu sekarang.

## 5. Label Ketinggian dan Auto-Scale

Sumbu kiri dibuat dinamis dari seluruh nilai tinggi air existing pada hari tersebut.

Cara menghitung skala:

1. Ambil nilai minimum dan maksimum dari data pasang surut.
2. Bulatkan batas bawah ke kelipatan langkah axis di bawah nilai minimum.
3. Bulatkan batas atas ke kelipatan langkah axis di atas nilai maksimum.
4. Tambahkan satu interval padding jika data terlalu dekat dengan batas atas atau bawah.
5. Langkah axis dimulai dari `0.5 m` dan otomatis diperbesar dalam kelipatan `0.5 m` jika rentang data besar agar label tidak terlalu ramai.
6. Tidak ada batas maksimum statis. Data di atas `2.0 m`, `4.0 m`, atau nilai lainnya tetap membuat axis naik otomatis.
7. Jika terdapat data negatif, batas bawah otomatis turun ke angka rapi yang mencakup data tersebut.

Grid horizontal menggunakan posisi yang sama dengan label meter. Koordinat vertikal seluruh titik dihitung dari minimum dan maksimum axis dinamis yang sama.

## 6. Label Jam

Sumbu bawah menampilkan jam dari setiap data existing:

```text
06:00
09:00
12:00
15:00
18:00
```

Koordinat horizontal setiap titik dihitung dari selisih menit terhadap waktu awal dan akhir data.

## 7. Garis Utama dan Fill

- Kurva tetap smooth menggunakan cubic Bezier.
- Warna garis menjadi putih kebiruan `#b9efff`.
- Ketebalan garis menjadi `0.9` pada viewBox SVG.
- Glow dikurangi menjadi drop-shadow ringan.
- Area fill tetap ada dengan opacity lebih lembut.

## 8. Garis Puncak

Garis merah putus-putus tetap selalu tampil pada data puncak pasang. Ketebalan diturunkan menjadi `0.6` agar tidak terlalu dominan. Label puncak tetap dipertahankan.

## 9. Garis Posisi Air Saat Ini

Garis biru putus-putus selalu tampil dan menunjukkan waktu browser saat ini.

Cara perhitungan:

1. Waktu data dikonversi menjadi total menit.
2. Waktu sekarang dicari di antara dua pembacaan terdekat.
3. Posisi horizontal dan tinggi air dihitung dengan interpolasi linear.
4. Jika waktu berada sebelum atau sesudah rentang data, posisi di-clamp ke pembacaan awal atau akhir.
5. Marker biru kecil ditempatkan pada estimasi perpotongan current-water dengan kurva.

Current-water diperbarui setiap satu menit. Refresh data pasang surut existing tetap setiap 30 menit.

Current-water marker dan seluruh titik data menggunakan skala axis dinamis yang sama. Garis puncak merah memakai posisi waktu dari titik puncak, sedangkan marker puncaknya mengikuti koordinat tinggi dari skala dinamis.

## 10. Hover Tooltip

- Gerakan mouse pada area grafik memilih titik data terdekat.
- Tooltip menampilkan waktu, tinggi air, fase, status, dan tren.
- Tren naik sebelum puncak ditampilkan sebagai `Menuju Puncak`.
- Tooltip hilang saat pointer mouse keluar dari area grafik.
- Tooltip juga hilang saat mouse keluar dari widget atau klik di luar.
- Focus keyboard pada titik atau baris tabel tetap didukung.

## 11. Fallback Mobile

- Mobile dapat mengetuk titik untuk membuka atau menutup tooltip.
- Pointer touch tidak menjalankan pemilihan hover terus-menerus.
- Label axis memakai ukuran lebih kecil pada mobile.
- Tooltip dan marker tidak menambah tinggi layout.

## 12. Hal yang Tidak Disentuh

```text
data sumber pasang surut
tabel dan ringkasan pasang surut
alert, countdown, dan rekap pasang tertinggi
background login
logo hero dan ukurannya
form dan login flow
Auth / NextAuth
middleware
RBAC
Prisma dan database
widget waktu solat
footer/copyright
layout besar login
dashboard, menu, dan route lain
package.json dan dependency
src/app/globals.css
```

## 13. Risiko Tersisa

- Marker current-water memakai interpolasi linear sesuai instruksi, sementara kurva visual memakai cubic Bezier. Pada segmen dengan kelengkungan tinggi dapat terdapat selisih visual kecil.
- Localhost merespons HTTP `200` dan markup axis/current marker telah dirender. Pemeriksaan interaksi visual manual tetap diperlukan karena browser in-app tidak tersedia pada sesi pengerjaan.

## 14. Hasil Validasi

```text
npx tsc --noEmit: lulus
git diff --check: lulus, dengan peringatan normalisasi LF/CRLF
npm run lint: tidak tersedia karena script lint tidak ada
http://localhost:3000/login: merespons HTTP 200
```
