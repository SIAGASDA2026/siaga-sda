# SIAGA-SDA Login Final Lock

## Status Final

Halaman login SIAGA-SDA sudah dianggap final dan telah disetujui secara visual.

- UI halaman login tidak boleh diubah tanpa instruksi eksplisit dari user.
- Jangan melakukan redesign, penyesuaian visual, refactor, atau optimasi login sebagai pekerjaan sampingan.
- Saat mengerjakan dashboard, peta monitoring, survey, paket pekerjaan, approval, surat, peil banjir, aset, administrasi, audit log, pengaturan, atau modul lain, halaman login harus tetap tidak berubah.

## Elemen Login Final

Elemen berikut sudah final dan wajib dipertahankan:

- background night dam;
- overlay background;
- logo dan hero SIAGA-SDA;
- jam digital format 24 jam;
- strip cuaca Dumai;
- card LOGIN dengan judul **Selamat Datang**;
- widget PASANG SURUT;
- grafik pasang surut;
- peringatan pasang tertinggi;
- countdown pasang tertinggi;
- rekap pasang tertinggi hari ini, minggu ini, dan bulan ini;
- widget WAKTU SOLAT;
- aurora neon border;
- status strip;
- footer resmi login;
- optimasi performa animasi aurora dan realtime rendering.

## File Login Sensitif

File berikut dianggap sensitif dan tidak boleh diubah tanpa instruksi eksplisit untuk halaman login:

```text
src/app/login/page.tsx
src/components/login/login.module.css
src/components/login/LoginDigitalClock.tsx
src/components/login/LoginWeatherWidget.tsx
src/components/login/LoginTideWidget.tsx
src/components/login/LoginPrayerWidget.tsx
src/components/login/LoginBrandHero.tsx
src/components/login/LoginStatusStrip.tsx
```

## Larangan Perubahan Tanpa Instruksi Eksplisit

Tanpa permintaan eksplisit dari user, jangan mengubah:

- UI, background, overlay, atau layout login;
- aurora neon;
- widget jam, cuaca, pasang surut, atau waktu solat;
- teks final login;
- logic login atau validasi login;
- NextAuth atau Auth;
- RBAC;
- database atau Prisma schema;
- middleware.

Jangan menyertakan file login dalam refactor umum, formatting massal, cleanup lint, penggantian tema, atau perubahan lintas modul.

## Kapan Login Boleh Diubah

Login hanya boleh diubah jika user secara eksplisit meminta perubahan halaman login. Contoh instruksi yang memenuhi syarat:

- "ubah halaman login";
- "perbaiki login";
- "ganti background login";
- "ubah widget pasang surut di login";
- "ubah card login".

Permintaan perubahan pada dashboard atau modul lain bukan izin untuk mengubah halaman login.

## Prosedur Jika Login Harus Diubah

Jika user secara eksplisit meminta perubahan login:

1. Baca dokumen ini terlebih dahulu.
2. Audit kondisi aktual dan batasi scope perubahan.
3. Buat backup sebelum perubahan.
4. Ubah hanya file yang benar-benar diperlukan.
5. Jangan mengubah Auth, RBAC, database, Prisma, atau middleware kecuali diminta secara eksplisit.
6. Jalankan `npx tsc --noEmit`.
7. Jalankan `git diff --check`.
8. Laporkan file yang berubah, lokasi backup, hasil validasi, dan risiko.

## Catatan Performa

- Aurora neon sudah dioptimasi dan harus tetap ringan.
- Jangan mengembalikan animasi berat seperti animasi sudut `conic-gradient` terus-menerus.
- Hindari blur, shadow, filter, dan interval realtime yang berlebihan.
- Jam digital boleh diperbarui setiap 1 detik.
- Countdown pasang tertinggi boleh diperbarui setiap 1 detik.
- Data cuaca diperbarui setiap 15 menit.
- Data pasang surut diperbarui setiap 30 menit.
- Jadwal waktu solat diperbarui 1 kali per hari.
- Semua interval wajib dibersihkan saat komponen dilepas.

## Prinsip Final

Halaman login adalah area terkunci. Pertahankan tampilan, fungsi, responsivitas, dan optimasi performanya sampai user memberikan instruksi eksplisit untuk mengubahnya.
