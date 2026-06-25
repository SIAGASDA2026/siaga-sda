# SIAGA-SDA LOGIN-CROSS-BROWSER-FIX.1

Tanggal: 25 Juni 2026

## 1. Ringkasan Masalah

Halaman login SIAGA-SDA sudah sesuai di Firefox, tetapi pada Chrome laptop/desktop dan Chrome mobile layout belum stabil. Gejala utama adalah panel kiri, logo tengah, form login kanan, widget waktu sholat, status strip, dan footer terlalu bergantung pada tinggi viewport dan grid fixed sehingga berpotensi saling menekan atau keluar proporsi.

Tahap ini hanya memperbaiki layout/responsive/cross-browser. Tidak ada redesign login, perubahan Auth, NextAuth, RBAC, Prisma, database, package, middleware, API, background, logo, data pasang surut, data cuaca, data waktu sholat, atau flow login.

## 2. Status Awal

- Branch aktif: `master`.
- Commit acuan terakhir: `04f3c86 refactor: tukar detail peringatan halo dan dashboard`.
- Masih ada pending work `UI-HEADER-FOOTER-SYSTEM.1`.
- Pending work disimpan sebagai patch sebelum sub-fix login.
- Login final lock dibaca dan dipatuhi.

## 3. File yang Dibaca

- `AGENTS.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `src/app/login/page.tsx`
- `src/components/login/login.module.css`
- `src/components/login/LoginBrandHero.tsx`
- `src/components/login/LoginDigitalClock.tsx`
- `src/components/login/LoginWeatherWidget.tsx`
- `src/components/login/LoginTideWidget.tsx`
- `src/components/login/LoginPrayerWidget.tsx`
- `src/components/login/LoginStatusStrip.tsx`
- `src/app/globals.css`
- pending diff `UI-HEADER-FOOTER-SYSTEM.1`

## 4. Backup

Backup dibuat di:

`backup/backup-login-cross-browser-fix-1-before-change/`

Isi backup:

- `login-page.tsx`
- folder `login-components/`
- `globals.css`
- `dashboard-layout.tsx`
- `Topbar.tsx`
- `ModuleLandingPage.tsx`
- `SIAGA_SDA_UI_HEADER_FOOTER_SYSTEM_1.md`
- `SIAGA_SDA_LANGKAH_BERTAHAP_PENGEMBANGAN_FINAL.md`
- `pending-work-before-login-fix.patch`

## 5. File yang Diubah

- `src/components/login/login.module.css`
- `docs/audit/SIAGA_SDA_LOGIN_CROSS_BROWSER_FIX_1.md`

File lain yang masih modified berasal dari pending work sebelumnya dan tidak diubah untuk sub-fix login.

## 6. Penyebab Teknis

Temuan utama:

1. Root login memakai `height: 100dvh` dan `overflow: hidden`.
2. Shell login memakai `height: 100%` dengan grid fixed.
3. Desktop memakai grid 3 kolom dengan minimum kolom cukup besar.
4. Mobile memakai grid row fixed berbasis `vh`, sehingga Chrome mobile cenderung dipaksa satu layar dan elemen menjadi terlalu padat.
5. Mobile form, tide widget, prayer widget, dan status strip terlalu dipadatkan sehingga tidak memberi ruang scroll natural.
6. Pending perubahan `globals.css` tidak memakai selector yang bocor ke login; utility baru bersifat class-based dan tidak memengaruhi login langsung.

## 7. Perbaikan yang Dilakukan

### Root Login

- Menambahkan fallback `min-height: 100vh` sebelum `100dvh`.
- Menjaga `max-width: 100%`.
- Memisahkan `overflow-x: hidden` dan `overflow-y: auto`.
- Desktop tetap dikunci satu layar dengan media query `min-width: 768px`.

### Shell Login

- Menambahkan `max-width: 100%`.
- Menambahkan fallback `min-height: 100vh`.
- Desktop tetap memakai `height: 100%`.
- Viewport desktop sangat pendek diberi fallback scroll vertikal agar tidak terpotong.

### Grid Desktop

- Mengubah kolom desktop dari persentase fixed ke fraksi yang lebih stabil:
  - kiri: `minmax(360px, 0.98fr)`
  - tengah: `minmax(280px, 0.82fr)`
  - kanan: `minmax(360px, 0.98fr)`
- Breakpoint tablet/laptop kecil dibuat lebih ringan:
  - kiri/kanan minimum 310px;
  - tengah minimum 230px.

### Mobile Chrome

- Mobile tidak lagi dipaksa row fixed berbasis `vh`.
- Grid mobile memakai row `auto`.
- Shell mobile diberi padding lebih aman.
- Login card mobile menjadi `height: auto`.
- Form mobile diberi spacing lebih longgar.
- Input dan tombol mobile dinaikkan menjadi 42px.
- Tide/prayer/status mobile dibuat auto-height agar bisa mengikuti scroll.
- Media query mobile pendek tidak lagi memaksa row fixed.

## 8. Hal yang Dijaga

Tetap tidak berubah:

- background final login;
- logo final;
- desain warna login;
- card login;
- grafik pasang surut;
- widget waktu sholat;
- data cuaca;
- status strip;
- footer teks;
- Auth/credential;
- NextAuth/session;
- middleware;
- RBAC;
- Prisma/database;
- package/dependency.

## 9. Dampak ke Firefox

Perubahan memakai CSS standar dan fallback `100vh` + `100dvh`, sehingga Firefox tetap menggunakan layout yang sama secara visual. Perubahan utamanya membuat layout lebih toleran terhadap perbedaan kalkulasi viewport antar browser.

## 10. Dampak ke Chrome Desktop/Laptop

Chrome desktop/laptop mendapat:

- grid 3 kolom lebih stabil;
- wrapper tidak melebar horizontal;
- fallback scroll untuk viewport tinggi sangat pendek;
- layout tetap satu layar jika tinggi cukup.

## 11. Dampak ke Chrome Mobile

Chrome mobile mendapat:

- stack vertikal natural;
- scroll vertikal aktif;
- tidak dipaksa semua elemen masuk satu layar;
- form lebih mudah dibaca dan disentuh;
- tidak ada horizontal overflow dari shell utama.

## 12. Validasi Command

Perintah yang dijalankan:

- `git status`: berhasil, menunjukkan pending work header/footer plus perubahan login cross-browser.
- `git diff --stat`: berhasil sebelum patch login; setelah patch sempat lambat/time out saat pengambilan ulang, tetapi `git status` akhir berhasil.
- `git diff -- src/app/globals.css`: berhasil, menunjukkan perubahan pending hanya utility header/footer dan tidak ada selector global login baru.
- `git diff --check`: passed.
- `npx.cmd tsc --noEmit`: passed.
- `Invoke-WebRequest http://localhost:3000/login`: HTTP 200 sebelum patch visual.

`npm.cmd run lint` dijalankan dan gagal karena script `lint` tidak tersedia di `package.json`.

Browser automation tidak berhasil tersambung di lingkungan Codex, sehingga validasi visual lintas browser belum diklaim selesai dari sisi agent.

## 13. Validasi Visual yang Perlu Dicek User

Perlu dicek manual oleh user sebelum commit:

1. Firefox desktop `/login`.
2. Chrome desktop `/login`.
3. Chrome laptop resolusi normal.
4. Chrome responsive mobile:
   - 390 x 844;
   - 412 x 915;
   - 360 x 800.
5. Pastikan mobile bisa scroll vertikal.
6. Pastikan tidak ada horizontal scroll.
7. Cek `/dashboard` desktop/mobile secara sekilas untuk memastikan pending header/footer tetap aman.
8. Cek satu halaman `ModuleLandingPage`, misalnya `/surat`.

## 14. Risiko Tersisa

- Perubahan ini perlu inspeksi visual Chrome nyata karena bug awal berasal dari perbedaan rendering browser.
- Widget tide/prayer mobile sekarang lebih natural-scroll; halaman mobile akan lebih panjang, sesuai instruksi.
- Jika user ingin semua panel mobile tetap terlihat di satu layar, itu akan bertentangan dengan instruksi bahwa mobile wajib boleh scroll vertikal.

## 15. Rekomendasi

Jangan commit dulu sampai user cek visual di Chrome desktop/laptop/mobile.

Jika visual sudah sesuai, commit bisa digabung dengan pending UI header/footer atau dipisah sebagai:

`fix: stabilkan layout login lintas browser`
