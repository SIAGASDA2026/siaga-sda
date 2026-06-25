# SIAGA-SDA Login Mobile Brand and Tide Recap 1

## 1. Ringkasan

Sub-fix ini hanya memperbaiki tampilan mobile halaman `/login`:

1. Mobile brand identity menampilkan logo PU dan teks instansi di bawah `SIAGA-SDA` / `COMMAND CENTER SDA`.
2. Card `Rekap Pasang Tertinggi` mobile dibuat lebih lega ke bawah agar lebih mudah dibaca di HP.

Desktop/laptop yang sudah dinilai oke tidak diubah secara struktural. Tidak ada perubahan Auth, NextAuth, middleware, RBAC, Prisma, database, migration, package, dependency, API login/session, background final, file logo, atau data widget.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- dokumen audit login fix yang sudah ada
- `src/components/login/LoginBrandHero.tsx`
- `src/components/login/LoginTideWidget.tsx`
- `src/components/login/login.module.css`

## 3. Backup

Backup dibuat di:

```text
backup/backup-login-mobile-brand-and-tide-recap-1-before-change/
```

Isi backup:

- `LoginBrandHero.tsx`
- `LoginTideWidget.tsx`
- `login.module.css`
- dokumen audit login fix yang relevan
- `pending-work-before-mobile-brand-and-tide-recap.patch`

## 4. File yang Diubah

- `src/components/login/login.module.css`
- `docs/audit/SIAGA_SDA_LOGIN_MOBILE_BRAND_AND_TIDE_RECAP_1.md`

`LoginBrandHero.tsx` dan `LoginTideWidget.tsx` tidak perlu diubah karena struktur markup dan data sudah tersedia. Perubahan cukup melalui CSS mobile.

## 5. Perubahan Mobile Brand

Pada mobile, urutan brand sekarang tetap mengikuti struktur:

1. Logo SIAGA-SDA
2. Tulisan `SIAGA-SDA`
3. Tulisan `COMMAND CENTER SDA`
4. Logo PU dan teks:
   - Dinas Pekerjaan Umum
   - Bidang Sumber Daya Air
   - Kota Dumai

Perubahan teknis:

- `.institutionIdentity` yang sebelumnya `display: none` pada mobile sekarang ditampilkan sebagai `inline-flex`.
- Ukuran logo PU dibuat compact.
- Teks instansi dibuat 3 baris, rapi, dan tetap di dalam lebar mobile.
- `.brandHero` mobile diberi min-height lebih lega agar identitas instansi tidak menekan elemen berikutnya.

## 6. Perubahan Rekap Pasang Tertinggi Mobile

Pada breakpoint mobile:

- padding card `Rekap Pasang Tertinggi` diperbesar;
- gap antar item diperbesar;
- setiap item rekap diberi `min-height: 60px`;
- padding item diperbesar;
- font tanggal/jam/angka dibuat lebih terbaca;
- angka tinggi pasang tetap lebih menonjol.

Targetnya ruang vertikal rekap lebih lega sekitar 1,5x dari kondisi compact sebelumnya, tanpa horizontal scroll.

## 7. Hal yang Sengaja Tidak Diubah

- Desktop/laptop login
- `LoginBrandHero.tsx`
- `LoginTideWidget.tsx`
- Auth / NextAuth
- middleware
- RBAC / roles / permission
- Prisma / migration / database
- package.json / package-lock.json / dependency
- API login/session
- background final
- file logo SIAGA-SDA
- data pasang surut/cuaca/waktu sholat
- dashboard selain validasi visual sekilas

## 8. Validasi

Validasi yang dijalankan:

- `git status`: berhasil, worktree masih memiliki pending work lain dari tahap sebelumnya dan dokumen audit login baru.
- `git diff --check`: lulus, hanya warning line ending LF/CRLF dari Git pada working copy.
- `npx.cmd tsc --noEmit`: lulus.
- `npm.cmd run lint`: tidak tersedia, gagal dengan `Missing script: "lint"`.

## 9. Validasi Visual Manual

User perlu mengecek:

1. Chrome desktop `/login`
   - tidak berubah dari kondisi yang sudah oke.
2. Firefox desktop `/login`
   - tidak berubah dari kondisi yang sudah oke.
3. Chrome mobile `/login`:
   - 360 x 800;
   - 390 x 844;
   - 412 x 915;
   - urutan brand benar;
   - logo PU dan teks instansi tampil;
   - `Rekap Pasang Tertinggi` lebih lega;
   - mobile tetap scroll vertikal;
   - tidak ada horizontal scroll.
4. `/dashboard` sekilas.

## 10. Risiko Tersisa

- Mobile akan sedikit lebih panjang karena identitas instansi dan rekap pasang diberi ruang lebih lega. Ini sesuai arahan karena mobile boleh scroll vertikal.
- Jika pada HP tertentu item rekap 3 kolom masih terasa sempit, tahap berikutnya bisa mengubah rekap mobile menjadi 1 kolom vertikal, tetapi itu sengaja belum dilakukan agar perubahan tetap kecil.

## 11. Rekomendasi

Jangan commit dulu sampai user mengecek visual mobile.

Saran commit jika disetujui:

```text
fix: tampilkan identitas mobile dan perbesar rekap pasang login
```
