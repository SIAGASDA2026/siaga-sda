# SIAGA-SDA Login Background Update

Tanggal perubahan: 15 Juni 2026

## 1. Tujuan

Mengganti background halaman login SIAGA-SDA dengan background baru yang disediakan user, tanpa mengubah overlay, layout, logo, ukuran logo, form, widget, footer, login flow, Auth, RBAC, route, Prisma, atau database.

## 2. Background Lama

Background lama:

```text
public/brand/login-bg-night-dam.png
Ukuran: 1672 x 941 px
```

File tersebut tidak dihapus dan telah disalin ke backup.

## 3. Background Baru

Background baru:

```text
public/brand/Background-2.png
Ukuran: 1672 x 941 px
```

Sumber yang disebut sebagai `public/brand/Background-2` ditemukan sebagai satu file gambar eksplisit bernama `Background-2.png`, bukan folder. Background baru memiliki resolusi dan rasio yang sama dengan background lama.

## 4. Lokasi Backup

```text
backup/backup-login-background-before-change
```

Backup mencakup:

```text
public/brand/login-bg-night-dam.png
public/brand/Background-2.png
src/app/login/page.tsx
src/components/login/login.module.css
```

## 5. File yang Diubah

```text
src/app/login/page.tsx
docs/design/SIAGA_SDA_LOGIN_BACKGROUND_UPDATE.md
```

Perubahan source hanya mengganti static import background login:

```text
public/brand/login-bg-night-dam.png
menjadi
public/brand/Background-2.png
```

Overlay dan aturan CSS `center center / cover no-repeat` tetap dipertahankan.

## 6. Area yang Tidak Disentuh

```text
logo dan ukuran logo hero login
posisi logo hero login
overlay dan gradient login
layout login
form dan validasi login
Auth / NextAuth
middleware
RBAC dan permission
widget pasang surut
widget waktu solat
jam digital dan cuaca
footer/copyright
route
dashboard dan seluruh tab aplikasi
Prisma dan database
package.json dan dependency
src/app/globals.css
```

## 7. Responsive

Background lama dan baru sama-sama berukuran `1672 x 941 px`. Aturan existing menggunakan:

```css
center center / cover no-repeat
```

Dengan demikian background tetap memenuhi viewport, mempertahankan proporsi, tidak repeat, dan tidak menambah ukuran layout.

Target review:

```text
Desktop: 1366x768, 1440x900, 1536x864, 1920x1080
Mobile: 390x844, 430x932
```

Mobile tetap mengikuti keputusan existing: boleh scroll vertikal dan tidak boleh overflow horizontal.

Pemeriksaan visual browser tidak dilakukan karena server `http://localhost:3000` tidak aktif. Dev server tidak dijalankan ulang pada tahap ini. Review responsif dilakukan berdasarkan kesamaan resolusi/rasio background dan aturan layout existing.

## 8. Cara Rollback

Cara rollback paling sempit:

1. Ubah kembali import background pada `src/app/login/page.tsx` dari:

   ```text
   ../../../public/brand/Background-2.png
   ```

   menjadi:

   ```text
   ../../../public/brand/login-bg-night-dam.png
   ```

2. Jika diperlukan, pulihkan file dari:

   ```text
   backup/backup-login-background-before-change
   ```

## 9. Risiko Tersisa

Background baru memiliki ornamen emas yang lebih kontras dibanding night dam lama. Overlay existing dipertahankan sesuai scope, sehingga evaluasi selera visual akhir tetap memerlukan pemeriksaan manual pada browser/perangkat target.

## 10. Hasil Validasi

```text
npx tsc --noEmit: lulus
git diff --check: lulus, dengan peringatan normalisasi LF/CRLF
npm run lint: tidak tersedia karena script lint tidak ada
```
