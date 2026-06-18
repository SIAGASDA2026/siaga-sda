# SIAGA-SDA Tahap UX-C.2B-R1 - Revisi Copy dan Role-Aware Halo SIAGA-SDA

Tanggal: 18 Juni 2026

## 1. Tujuan Revisi

Tahap UX-C.2B-R1 merapikan copy user-facing pada panel `Halo SIAGA-SDA` agar tidak menyebut `AI API`, `API AI`, `layanan AI eksternal`, atau istilah sejenis yang dapat menimbulkan kesan aplikasi sedang memakai layanan eksternal.

Tahap ini juga mengaudit ulang kalimat role-aware agar cocok untuk semua role aktif maupun role konsep yang mungkin masuk dari session/store di tahap berikutnya.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C2B_HALO_SIAGA_SDA_FLOATING_PANEL_FINAL.md`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/store/useAppStore.ts`
- `src/lib/roles.ts`
- `package.json`

## 3. File yang Dibackup

Backup dibuat di:

`backup/backup-ux-c2b-r1-copy-role-halo-siaga-before-change/`

File backup:

- `src/components/ai/ProjectAiAssistant.tsx`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C2B_HALO_SIAGA_SDA_FLOATING_PANEL_FINAL.md`
- `src/store/useAppStore.ts`
- `src/lib/roles.ts`

`useAppStore.ts` dan `roles.ts` hanya dibackup sebagai referensi baca, tidak diubah.

## 4. File yang Diubah

- `src/components/ai/ProjectAiAssistant.tsx`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C2B_R1_REVISI_COPY_ROLE_HALO_SIAGA_SDA.md`

Tidak ada file runtime lain yang diubah.

## 5. Copy `AI API` yang Dihapus dari UI User-Facing

Copy lama yang dihapus dari panel aktif:

- `Panel ini belum menulis data, belum membaca misi resmi, dan belum memanggil AI API.`
- `Apakah panel ini sudah memakai AI API?`
- `tidak mengirim data ke backend atau layanan AI eksternal.`
- `Mode persiapan: belum ada AI API, belum ada penyimpanan percakapan, dan tidak ada data yang dikirim ke backend.`

Hasil audit `src/components/ai/ProjectAiAssistant.tsx`:

- tidak ada sisa string `AI API`;
- tidak ada sisa string `API AI`;
- tidak ada sisa string `layanan AI`;
- tidak ada sisa string `memanggil AI`;
- tidak ada sisa string `AI eksternal`;
- tidak ada sisa string `Analisis AI aktif`.

## 6. Copy Pengganti yang Dipakai

Copy pengganti utama:

`Konteks halaman: [nama halaman]. Panel ini masih dalam mode panduan lokal, belum membaca misi resmi, dan belum melakukan perubahan data.`

Copy area tanya:

`Mode panduan lokal. Fitur tanya jawab resmi akan diaktifkan setelah sumber SOP dan batas akses disetujui.`

FAQ tanya jawab:

`Belum. Area Tanya Halo SIAGA-SDA masih dalam mode panduan lokal dan belum membaca sumber SOP resmi atau data misi resmi.`

Badge tambahan:

- `Mode Panduan Lokal`
- `Belum Terhubung Data Resmi`
- `Persiapan UI`

## 7. Sumber Role yang Digunakan

Panel mengambil role dari Zustand store existing:

`useAppStore((state) => state.currentUser)`

Field yang dipakai:

`currentUser?.role`

Tidak ada pembacaan database, tidak ada fetch, tidak ada session parser baru, tidak ada perubahan RBAC runtime, dan tidak ada perubahan `roles.ts`.

## 8. Hasil Audit Role-Aware Sentence

Sebelum:

`Tugas Anda sebagai seorang [role] yang harus diselesaikan hari ini, [hari, tanggal].`

Masalah:

- kata `seorang` janggal untuk role seperti `Tim Perencana`, `Tim Survey`, atau `Kepala Bidang`;
- istilah `Tugas` kurang selaras dengan panel `Misi Harian Saya`.

Sesudah:

`Misi Anda sebagai [Nama Role] yang harus diselesaikan hari ini, [hari, tanggal].`

Fallback tanpa role:

`Misi Anda yang harus diselesaikan hari ini, [hari, tanggal].`

Mapping label role dibuat lokal di `ProjectAiAssistant.tsx` sebagai label UI saja. Mapping ini tidak mengaktifkan role baru dan tidak mengubah permission.

## 9. Daftar Role Label yang Diuji Statis

Mapping UI lokal mencakup:

- `super_admin` -> `Super Admin`
- `admin` -> `Admin`
- `admin_sistem` -> `Admin Sistem`
- `admin_bidang` -> `Admin Bidang`
- `admin_sda` -> `Admin SDA`
- `admin_sub_kegiatan` -> `Admin Sub Kegiatan`
- `kabid` -> `Kepala Bidang`
- `kepala_bidang` -> `Kepala Bidang`
- `kepala_dinas` -> `Pimpinan`
- `pimpinan` -> `Pimpinan`
- `ppk` -> `PPK`
- `pptk` -> `PPTK`
- `direksi_teknis` -> `Direksi Teknis`
- `pejabat_pengadaan` -> `Pejabat Pengadaan`
- `pphp` -> `PPHP`
- `tim_perencanaan` -> `Tim Perencanaan`
- `tim_perencana_rutin` -> `Tim Perencana (Rutin)`
- `tim_survey` -> `Tim Survey`
- `tim_pengawasan` -> `Tim Pengawasan`
- `tim_pengawas_rutin` -> `Tim Pengawas (Rutin)`
- `konsultan_perencana` -> `Konsultan Perencana`
- `konsultan_pengawasan` -> `Konsultan Pengawasan`
- `konsultan_pengawas` -> `Konsultan Pengawas`
- `kontraktor` -> `Kontraktor`
- `auditor` -> `Auditor`
- `admin_surat` -> `Admin Surat`
- `admin_peil` -> `Admin Peil`
- `admin_peil_banjir` -> `Admin Peil Banjir`
- `admin_asset` -> `Admin Asset`
- `mandor_operasional_sda` -> `Mandor Operasional SDA`
- `mandor_pintu_air` -> `Mandor Pintu Air`
- `petugas_pintu_air` -> `Petugas Pintu Air`
- `mandor_rehab_drainase` -> `Mandor Rehab Drainase`
- `mandor_rehabilitasi_drainase` -> `Mandor Rehabilitasi Drainase`

Jika role tidak dikenali, label fallback mengubah underscore menjadi spasi dan kapitalisasi wajar.

## 10. Hal yang Tidak Disentuh

- Login.
- Auth, NextAuth, middleware.
- RBAC runtime.
- `src/lib/rbac.ts`.
- `src/lib/roles.ts`.
- Prisma schema.
- Migration.
- Database.
- API routes.
- Endpoint Approval, Bootstrap, dan Sync Version.
- Package dan dependency.
- Modal Dashboard/Approval Center.
- Route dashboard besar.
- Source data dashboard.

## 11. Risiko Tersisa

- Panel masih bersifat persiapan UI dan mode panduan lokal.
- Misi harian resmi belum tersedia sampai source data assignment/misi disetujui.
- Role konsep yang belum aktif runtime hanya dipakai sebagai label UI bila suatu saat role string tersebut muncul dari session/store.
- Uji visual manual tetap diperlukan untuk memastikan copy baru nyaman di mobile dan desktop.

## 12. Hasil Validasi

Validasi yang dijalankan:

- `git diff --check`: lulus. Git hanya menampilkan peringatan LF/CRLF pada file existing, tanpa whitespace error.
- `npx.cmd tsc --noEmit`: lulus.
- `npm run lint`: tidak dijalankan karena `package.json` tidak memiliki script `lint`.

Build tidak dijalankan karena tahap ini hanya revisi copy UI dan script build menjalankan `prisma generate`.

## 13. Rekomendasi Commit Message

`fix: rapikan copy panduan lokal halo siaga sda`
