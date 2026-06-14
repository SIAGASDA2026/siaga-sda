# SIAGA-SDA Logo Update Final

Tanggal perubahan: 14 Juni 2026

## 1. Tujuan

Memastikan logo resmi SIAGA-SDA terbaru digunakan secara konsisten pada login dan shell aplikasi, serta memperbaiki bagian bawah login yang sebelumnya terpotong atau terlalu mepet tanpa mengecilkan logo hero login.

## 2. Logo Resmi

Logo runtime utama:

```text
public/brand/logo-siaga-sda.png
Path aplikasi: /brand/logo-siaga-sda.png
Ukuran asset: 1254 x 1254 px
Format: PNG transparan
```

Logo dokumentasi:

```text
docs/assets/logo-siaga-sda.png
```

Kedua file memiliki hash SHA-256 yang sama pada saat audit.

Logo PUPR/SDA runtime:

```text
public/brand/logo-pu-sda.png
Path aplikasi: /brand/logo-pu-sda.png
```

File ini disalin dari asset dokumentasi agar halaman runtime tidak lagi memuat logo dari `docs/assets`.

Catatan login:

```text
Login memakai static import dari public/brand.
```

Static import diperlukan karena middleware existing melindungi request langsung `/brand/*` untuk user unauthenticated. Static import menghasilkan path build `_next/static/media/*` sehingga logo tetap tampil pada login tanpa mengubah middleware.

## 3. Backup

Backup dibuat di:

```text
backup/backup-logo-update-login-tabs-before-change
```

Backup mencakup asset logo, halaman/CSS login, komponen hero, sumber brand, dan seluruh komponen shell yang ditemukan menampilkan logo.

## 4. File yang Diubah

```text
src/app/login/page.tsx
src/components/login/login.module.css
```

File runtime baru:

```text
public/brand/logo-pu-sda.png
```

## 5. Audit Area Logo

| Area | Sumber logo | Ukuran visual existing | Status |
|---|---|---|---|
| Login hero | sebelumnya import `docs/assets/logo-siaga-sda.png` | stage maksimum 340 px, tinggi `clamp(205px, 32vh, 330px)`, image width 145% | Diubah ke static import `public/brand/logo-siaga-sda.png`; ukuran dipertahankan |
| Login hero mobile | logo runtime resmi | stage 108 x 88 px, image width 145% | Ukuran dipertahankan |
| Sidebar desktop | `BRAND.logoPath` | frame 48 x 48 px | Sudah benar, tidak diubah |
| Topbar | `BRAND.logoPath` | frame 32 x 32 px | Sudah benar, tidak diubah |
| Mobile menu header | `BRAND.logoPath` | frame 40 x 40 px | Sudah benar, tidak diubah |
| Peta Monitoring | `BRAND.logoPath` | compact, `object-contain` | Sudah benar, tidak diubah |
| Halaman akses | `BRAND.logoPath` | compact, `object-contain` | Sudah benar, tidak diubah |
| Dashboard/tab/modul lain | memakai shell Sidebar/Topbar | tidak memasang logo besar berulang | Sudah benar, tidak diubah |

`src/lib/brand.ts` sudah menetapkan path shell authenticated:

```text
logoPath: /brand/logo-siaga-sda.png
```

Tidak ada perubahan pada shared navigation config atau struktur menu.

Request langsung `/brand/*` tanpa session saat audit mengembalikan redirect `307` ke `/login`. Middleware tidak diubah karena berada di luar scope dan secara eksplisit dilarang.

## 6. Ukuran Logo Hero Login

Ukuran logo hero login tidak diubah.

Desktop:

```css
.logoStage {
  width: min(100%, 340px);
  height: clamp(205px, 32vh, 330px);
}

.logoImage {
  width: 145%;
}
```

Mobile:

```css
.logoStage {
  width: 108px;
  height: 88px;
}

.logoImage {
  width: 145%;
}
```

Class `.logoStage` dan `.logoImage` tidak disentuh pada perubahan ini.

## 7. Penyebab Bagian Bawah Login Mepet/Terpotong

Halaman login menggunakan:

```css
height: 100dvh;
overflow: hidden;
```

Pada mobile, shell dan workspace juga dikunci ke tinggi viewport dengan overflow tersembunyi. Kombinasi tinggi widget, status strip, footer, safe-area browser, dan viewport mobile dinamis dapat menyebabkan bagian bawah tidak dapat dicapai.

Pada desktop, padding bawah shell hanya 6 px dan baris footer hanya 18 px sehingga footer terlihat terlalu mepet.

## 8. Perbaikan Spacing dan Layout Bawah

Desktop:

- baris footer shell dinaikkan dari 18 px menjadi 20 px;
- padding bawah shell dinaikkan dari 6 px menjadi 10 px;
- ukuran logo hero tidak diubah.

Mobile:

- halaman menggunakan `min-height: 100dvh` dan mengizinkan scroll vertikal;
- overflow horizontal tetap disembunyikan;
- shell menggunakan tinggi otomatis dan padding bawah safe-area;
- workspace tidak lagi memotong konten bawah;
- area pasang surut diberi tinggi minimum yang aman;
- footer dapat dicapai melalui scroll.

## 9. Responsive Review

Review kode dilakukan untuk:

```text
Desktop: 1366x768, 1440x900, 1536x864, 1920x1080
Mobile: 390x844, 430x932
```

Hasil review:

- desktop tetap memakai layout single viewport;
- ukuran logo hero desktop tetap;
- mobile diperbolehkan scroll vertikal sesuai keputusan user;
- mobile tetap `overflow-x: hidden`;
- footer mobile dapat dicapai;
- widget tidak diposisikan absolute dan tetap berada pada grid row terpisah;
- shell aplikasi setelah login tetap memakai ukuran logo compact existing.

Pengujian screenshot headless tidak berhasil karena proses GPU Chrome pada environment lokal gagal. Pengecekan visual manual tetap direkomendasikan.

## 10. Hal yang Tidak Disentuh

```text
ukuran logo hero login
background dan overlay login
form dan flow login
Auth / NextAuth
middleware
RBAC dan permission
Prisma dan database
route
menu Sidebar/MobileNav
widget pasang surut
widget waktu salat
footer/copyright text
dashboard logic
shared navigation config
src/app/globals.css
package.json dan dependency
```

## 11. Risiko Tersisa

1. Mobile login sekarang lebih panjang dan membutuhkan scroll vertikal, sesuai instruksi khusus mobile.
2. Tampilan perlu pengecekan manual pada browser mobile nyata karena dynamic viewport dan safe-area berbeda antar perangkat.
3. Logo resmi memiliki ruang transparan internal yang cukup besar; ukuran visual hero sengaja tidak dikoreksi karena sudah disetujui.

## 12. Hasil Validasi

```text
npx tsc --noEmit: lulus
git diff --check: lulus
npm run lint: tidak tersedia
build: tidak dijalankan
```
