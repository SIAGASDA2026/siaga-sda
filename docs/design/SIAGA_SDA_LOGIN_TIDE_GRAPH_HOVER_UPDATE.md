# SIAGA-SDA Login Tide Graph Hover Update

Tanggal perubahan: 15 Juni 2026

## 1. Tujuan

Meningkatkan grafik pasang surut pada halaman login agar menggunakan kurva halus, area fill lembut, dan tooltip interaktif tanpa library chart baru atau perubahan pada data, login flow, background, logo, widget lain, dan layout besar login.

## 2. Referensi Visual

Referensi yang dibaca:

```text
docs/assets/login-reference-web.png
```

Elemen referensi yang diterapkan secara terbatas:

- garis kurva cyan yang halus;
- shading biru transparan di bawah kurva;
- titik data interaktif;
- garis vertikal titik aktif;
- tooltip yang muncul dekat titik aktif.

## 3. Backup

Backup dibuat di:

```text
backup/backup-login-tide-graph-hover-before-change
```

Isi backup:

```text
src/app/login/page.tsx
src/components/login/LoginTideWidget.tsx
src/components/login/login.module.css
```

## 4. File yang Diubah

```text
src/components/login/LoginTideWidget.tsx
src/components/login/login.module.css
docs/design/SIAGA_SDA_LOGIN_TIDE_GRAPH_HOVER_UPDATE.md
```

## 5. Implementasi Grafik

Grafik tetap menggunakan custom SVG dan data React existing.

Polyline bersudut diganti dengan path cubic Bezier yang dibuat melalui helper ringan `smoothChartPath()`. Helper mengubah titik data existing menjadi kurva Catmull-Rom yang dikonversi ke cubic Bezier.

Area di bawah kurva memakai SVG `linearGradient` cyan-biru transparan. Fill tidak menerima pointer event dan tidak menambah ukuran layout.

## 6. Interaksi Hover dan Tooltip

Pada desktop:

- gerakan mouse pada area grafik memilih titik data dengan posisi waktu terdekat;
- hover/focus pada titik menampilkan detail titik tersebut;
- titik aktif mendapat ring ringan dan garis vertikal;
- tooltip hilang saat mouse keluar dari widget;
- klik di luar widget tetap menutup detail.

Tooltip menampilkan:

```text
waktu
tinggi air
fase
status
tren naik/turun
```

Tooltip memakai posisi absolute dan dibatasi ke area horizontal aman agar tidak mengubah tinggi halaman atau menyebabkan overflow.

## 7. Fallback Mobile dan Keyboard

- Pergerakan pointer touch tidak menjalankan pemilihan titik terus-menerus.
- Pengguna mobile dapat mengetuk titik grafik untuk membuka atau menutup tooltip.
- Pengguna keyboard dapat memakai focus pada titik atau baris tabel.
- Tooltip tetap berada di dalam area grafik.

## 8. Hal yang Tidak Disentuh

```text
data pasang surut existing
tabel dan ringkasan pasang surut
peringatan dan countdown pasang tertinggi
rekap pasang tertinggi
login flow dan form
Auth / NextAuth
middleware
RBAC
Prisma dan database
background baru login
logo hero dan ukurannya
widget waktu solat
footer/copyright
dashboard, menu, dan route lain
package.json dan dependency
src/app/globals.css
```

## 9. Responsive

Target review:

```text
Desktop: 1366x768, 1440x900, 1536x864, 1920x1080
Mobile: 390x844, 430x932
```

Grafik tetap memakai SVG responsif `viewBox`, tooltip tidak menambah layout, chart membatasi overflow internal, dan mobile tetap mengikuti layout scroll vertikal existing.

## 10. Risiko Tersisa

- Pemilihan hover area menggunakan kedekatan posisi horizontal terhadap titik data, bukan interpolasi nilai kontinu.
- Localhost merespons HTTP `200`, tetapi browser in-app tidak tersedia pada sesi pengerjaan. Pemeriksaan visual dan interaksi hover manual tetap diperlukan pada browser target.

## 11. Validasi

```text
npx tsc --noEmit: lulus
git diff --check: lulus, dengan peringatan normalisasi LF/CRLF
npm run lint: tidak tersedia karena script lint tidak ada
http://localhost:3000/login: merespons HTTP 200
```
