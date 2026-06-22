# SIAGA-SDA UI-WARNING-CARD-SWAP.1B - Tukar Detail Peringatan Halo dan Dashboard Full Width

Tanggal: 22 Juni 2026

## 1. Ringkasan Tahap

Tahap ini menukar level detail card `Peringatan Sistem dalam scope Anda` antara Halo SIAGA-SDA dan Dashboard, lalu merevisi layout 1B agar Dashboard menjadi full width dan Halo tidak memiliki scroll internal kecil pada daftar peringatan.

Tujuan desain:

- Halo SIAGA-SDA menjadi alarm/asisten cepat yang ringkas.
- Dashboard menjadi ruang monitoring detail untuk analisis paket berisiko.
- Sumber data, role-aware behavior, assignment scope, route, dan logic DATA-CONSISTENCY.2 tidak diubah.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/audit/SIAGA_SDA_DATA_CONSISTENCY_2_TASK_WARNING_HALO_SOURCE.md`
- `docs/audit/SIAGA_SDA_UI_CANVAS_SYSTEM_2B_ALL_TABS_CANVAS_CARD.md`
- `docs/audit/SIAGA_SDA_UI_CARD_SYSTEM_1_CANVAS_CARD_STANDARDIZATION.md`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/components/dashboard/TaskCenterPanel.tsx`
- `src/components/dashboard/EmptyAssignmentCard.tsx`
- `src/components/dashboard/TaskCard.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`
- `src/components/dashboard/CommandCenterNavigation.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/lib/project-alerts.ts`
- `src/app/globals.css`

## 3. File yang Diubah

- `src/components/ai/ProjectAiAssistant.tsx`
- `src/components/dashboard/TaskCenterPanel.tsx`

## 4. File Baru

- `docs/audit/SIAGA_SDA_UI_WARNING_CARD_SWAP_1_HALO_DASHBOARD.md`

## 5. Backup Dibuat

Backup dibuat di:

`backup/backup-ui-warning-card-swap-1-before-change/`

Backup lanjutan 1B dibuat di:

`backup/backup-ui-warning-card-swap-1b-dashboard-fullwidth-before-change/`

File backup:

- `ProjectAiAssistant.tsx`
- `TaskCenterPanel.tsx`

## 6. Masalah Sebelum Revisi 1B

- Halo masih berisiko terasa terlalu panjang bila detail warning ditampilkan penuh.
- Revisi awal sempat membatasi daftar Halo menjadi 5 item.
- Dashboard warning detail masih berada pada kolom kanan `TaskCenterPanel`.
- Dashboard warning detail masih memakai `max-h` dan `overflow-y-auto`, sehingga terlihat seperti box detail kecil.

## 7. Perubahan Halo SIAGA-SDA

Card `Peringatan Sistem dalam scope Anda` di Halo dibuat ringkas:

- semua item pada filter aktif ditampilkan dalam bentuk compact;
- setiap item hanya menampilkan kode/nama paket, penyebab ringkas, badge status, status waktu pendek, dan tombol `Buka Paket`;
- detail progress, target, rekomendasi surat, status tindak lanjut, pihak terkait, dan 12 tahap konseptual tidak lagi ditampilkan di Halo;
- tombol `Lihat Detail di Dashboard` ditambahkan untuk membuka analisis detail di Dashboard;
- filter Halo tetap ada dan tetap memakai daftar warning yang sama.

Halo tetap memiliki body utama scroll internal dan footer `Tutup Halo SIAGA-SDA`.

## 8. Card Peringatan Sistem Halo Tanpa Scroll Internal

Pada daftar `Peringatan Sistem dalam scope Anda` di Halo:

- `slice(0, 5)` dihapus;
- `max-h` pada wrapper daftar dihapus;
- `overflow-y-auto` pada wrapper daftar dihapus;
- semua paket bermasalah pada filter aktif tampil sebagai compact list;
- jika isi Halo panjang, scroll terjadi pada body utama Halo, bukan pada card peringatan.

## 9. Perubahan Dashboard

Card `Peringatan Sistem dalam scope Anda` pada `TaskCenterPanel` Dashboard dibuat detail:

- kode paket;
- nama paket;
- badge status;
- progress fisik dan keuangan;
- target tanggal;
- status waktu;
- penyebab;
- rekomendasi tindak lanjut;
- catatan bahwa rekomendasi belum menjadi surat resmi;
- status tindak lanjut konseptual;
- pihak terkait;
- tombol `Buka Paket`.

Daftar detail mengikuti flow halaman Dashboard dan tidak memakai scroll internal kecil.

## 10. Dashboard Warning Card Full Width

Card Dashboard dipindahkan keluar dari kolom kanan `TaskCenterPanel`.

Posisi baru:

1. Header dan metrik `Tugas Saya`.
2. Area tugas/empty assignment dan `Langkah Berikutnya`.
3. `Peringatan Sistem dalam scope Anda` sebagai section full-width.
4. `Tugas Selesai` dan `Riwayat Apresiasi` di bawahnya.

Section warning memakai `w-full` di area konten Dashboard, bukan `100vw`, sehingga tidak melewati sidebar.

## 11. Dashboard Warning Card Tanpa Scroll Internal Kecil

Pada Dashboard:

- `max-h-[620px]` dihapus dari daftar warning;
- `overflow-y-auto` dihapus dari daftar warning;
- `pr-1` khusus scrollbar kecil dihapus;
- semua warning dari `systemWarnings` ditampilkan mengikuti scroll halaman Dashboard normal.

## 12. Sumber Data yang Dipakai

Sumber data tetap helper yang sama dari DATA-CONSISTENCY.2:

`buildProjectWarningSource(...)`

Alur data:

- Dashboard membangun `taskCenterSystemWarnings` dari `projectWarningSource.systemWarnings`.
- Halo membangun `haloWarningSource` dari `buildProjectWarningSource(haloVisibleProjects, now)`.
- Tidak ada data baru, dummy baru, fetch API baru, atau perubahan database.

## 13. Hal yang Tidak Diubah

- Login final.
- Auth/NextAuth.
- RBAC role/permission global.
- Assignment scope.
- Prisma schema.
- Migration.
- Database.
- API/backend.
- Sidebar/MobileNav.
- Route/menu utama.
- `src/lib/project-alerts.ts` sebagai source data.
- Logic DATA-CONSISTENCY.2.

## 14. Dampak Responsive Desktop/Mobile

Halo:

- lebih ringkas;
- daftar warning compact tampil tanpa nested scroll;
- body utama Halo tetap scroll internal;
- footer tetap terlihat.

Dashboard:

- detail warning memakai card dengan grid responsif;
- card warning full-width di area konten;
- daftar detail mengikuti scroll halaman normal;
- tombol `Buka Paket` tetap visible per item;
- tidak ada perubahan layout global Dashboard.

## 15. Risiko yang Dikurangi

- Halo tidak lagi terlalu penuh seperti halaman detail.
- Detail warning dipusatkan di Dashboard sebagai ruang monitoring utama.
- Dashboard warning tidak lagi sempit di kolom kanan.
- Tidak ada nested scrollbar kecil pada Halo maupun Dashboard warning card.
- Sumber data warning tetap konsisten antara Halo dan Dashboard.
- Risiko user mengira rekomendasi surat sudah resmi tetap ditekan dengan copy pembatas.

## 16. Risiko Tersisa

- Cek visual manual desktop/mobile tetap diperlukan untuk memastikan tinggi daftar warning nyaman pada data banyak.
- Status tindak lanjut masih konseptual dan belum persist ke database.
- Rekomendasi surat masih berupa UI informasi, belum workflow resmi.

## 17. Validasi yang Dijalankan

- `npx.cmd tsc --noEmit`: lulus.
- `git diff --check`: lulus, hanya warning CRLF Git.
- `npm run lint`: tidak tersedia pada `package.json`.

Build penuh tidak dijalankan karena tahap ini perubahan UI terbatas dan user meminta tidak melakukan perubahan besar.

## 18. Rekomendasi Tahap Berikutnya

- Lakukan cek visual manual Dashboard dan Halo pada desktop/mobile.
- Jika disetujui, commit dengan message:

`refactor: tukar detail peringatan halo dan dashboard`
