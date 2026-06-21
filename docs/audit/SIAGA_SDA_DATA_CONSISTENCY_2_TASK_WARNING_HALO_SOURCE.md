# SIAGA-SDA DATA-CONSISTENCY.2 — Sinkronisasi Tugas, Peringatan Sistem, Halo, dan Rekomendasi Surat Teguran/Klarifikasi

Tanggal: 19 Juni 2026

## 1. Ringkasan Tahap

Tahap DATA-CONSISTENCY.2 menyamakan sumber daftar peringatan antara Dashboard, panel Tugas Saya/Peringatan Sistem, dan Halo SIAGA-SDA.

Tujuan utama:

- Halo menampilkan daftar lengkap peringatan sistem dalam scope user, bukan hanya satu paket fokus.
- Misi pribadi tetap dipisahkan dari peringatan sistem.
- Paket terlambat/kritis menampilkan rekomendasi konseptual Surat Teguran/Klarifikasi.
- Tidak ada penerbitan surat resmi otomatis.
- Tidak ada perubahan database, Prisma schema, migration, Auth, RBAC besar, login, Sidebar/MobileNav, route utama, atau modal Dashboard 4D.2.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/roadmap/ROADMAP_SIAGA_SDA_MENUJU_100_PERSEN.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/modules/SIAGA_SDA_WARNING_ACTION_CENTER_FOUNDATION.md`
- `docs/audit/SIAGA_SDA_DATA_CONSISTENCY_1_STATUS_PAKET_DASHBOARD_HALO.md`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/TaskCenterPanel.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/lib/project-status.ts`
- `src/store/useAppStore.ts`
- `src/types/index.ts`
- `src/lib/rbac.ts` hanya dibaca

## 3. File yang Diubah

- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/TaskCenterPanel.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`

## 4. File Baru

- `src/lib/project-alerts.ts`
- `docs/audit/SIAGA_SDA_DATA_CONSISTENCY_2_TASK_WARNING_HALO_SOURCE.md`

## 5. Backup Dibuat

Backup dibuat di:

`backup/backup-data-consistency-2-task-warning-halo-before-change/`

File backup:

- `ProjectAiAssistant.tsx`
- `TaskCenterPanel.tsx`
- `dashboard-page.tsx`
- `project-status.ts`

## 6. Penyebab Halo Hanya Menampilkan 1 Paket

Sebelum perubahan, Halo membangun fokus waktu pekerjaan dari:

- `getHaloWorkTimeView(...)`
- `scheduledProjects.sort(...)`
- `const nearestProject = scheduledProjects[0]`

Artinya Halo hanya menampilkan satu paket prioritas/terdekat. Dashboard sudah punya daftar `riskProjects`, tetapi Halo tidak memakai daftar itu sebagai list peringatan lengkap.

## 7. Sumber Data Dashboard Peringatan Sistem

Sebelum perubahan, Dashboard menghitung `riskProjects` langsung di `src/app/(dashboard)/dashboard/page.tsx` dari:

- status sinkron `getProjectComputedStatus`;
- `isLate`;
- `isAtRisk`;
- health `kritis` / `warning`;
- masalah open.

Setelah perubahan, Dashboard memakai helper bersama:

`buildProjectWarningSource(visibleProjects)`

Output helper:

- `personalTasks`
- `systemWarnings`
- `priorityWarning`
- `warningSummary`

## 8. Sumber Data Halo Sebelum Perubahan

Halo membaca `projects` dari Zustand store dan memfilter via helper lokal `getHaloVisibleProjects`, tetapi hanya mengubah hasilnya menjadi satu highlight waktu kerja. Halo belum menampilkan `systemWarnings` sebagai daftar lengkap.

## 9. Helper/Sumber Data Bersama

Helper baru:

`src/lib/project-alerts.ts`

Fungsi utama:

- `buildProjectWarningSource(projects, now)`

Helper ini:

- tidak membaca database;
- tidak fetch API;
- hanya membaca object frontend yang diberikan;
- memakai `getProjectComputedStatus` dari DATA-CONSISTENCY.1;
- menyortir peringatan secara stabil;
- mengembalikan daftar lengkap `systemWarnings`;
- mengembalikan satu `priorityWarning` hanya untuk highlight.

Prioritas sorting:

1. level kritis lebih dulu;
2. paket terlambat lebih dulu;
3. progress lebih rendah lebih dulu;
4. fallback kode/nama/id agar stabil.

## 10. Perubahan UI/Copy Halo

Halo sekarang menampilkan:

- ringkasan jumlah peringatan sistem;
- daftar lengkap peringatan sistem dalam scope user;
- teks `Peringatan Sistem dalam scope Anda`;
- teks `Daftar ini bukan Tugas Saya, tetapi paket berisiko yang terlihat sesuai role dan assignment scope.`;
- daftar scroll internal maksimal awal 10 item dengan label `Menampilkan X dari Y peringatan sistem`;
- copy empty state `Belum ada misi pribadi hari ini.`;
- link `Buka Paket` ke detail paket.

Highlight `Kendali Waktu Pekerjaan` memakai `priorityWarning` dari helper bersama jika tersedia. Fallback `nearestProject` hanya dipakai jika tidak ada peringatan prioritas.

## 11. Rekomendasi Surat Teguran/Klarifikasi

Untuk paket terlambat/kritis, helper menampilkan rekomendasi:

`Direkomendasikan menyiapkan Surat Teguran / Klarifikasi kepada Kontraktor.`

Batasan yang ditampilkan:

`Rekomendasi ini belum menjadi surat resmi. Perlu verifikasi teknis dan persetujuan pejabat berwenang.`

Tahap ini tidak membuat surat resmi, tidak mengirim surat, tidak membuat database surat, dan tidak membuat workflow approval baru.

## 12. Role/Pihak Terkait yang Ditampilkan

Setiap peringatan menampilkan pihak terkait konseptual:

- PPK;
- PPTK;
- Direksi Teknis sesuai assignment paket;
- Konsultan Pengawas jika tercantum;
- Kontraktor;
- Kabid/Pimpinan untuk monitoring/eskalasi sesuai scope.

Jika nama pihak belum tersedia di data paket, UI menampilkan label jujur seperti `belum tersedia` atau `jika tercantum pada paket`.

## 13. Status Tindak Lanjut Konseptual

Status tindak lanjut disiapkan sebagai daftar konseptual frontend:

- Belum Ada Tindak Lanjut
- Rekomendasi Dibuat
- Menunggu Verifikasi Teknis
- Menunggu Review PPK/PPTK
- Draft Surat Disiapkan
- Diajukan untuk Persetujuan
- Disetujui
- Dikirim ke Kontraktor
- Menunggu Tindak Lanjut Kontraktor
- Ditindaklanjuti
- Selesai / Diarsipkan
- Dibatalkan dengan Alasan

Status default yang ditampilkan per paket:

`Belum Ada Tindak Lanjut`

Catatan UI:

`Status ini konseptual dan belum menulis database.`

## 14. Risiko yang Dikurangi

- Halo tidak lagi menyembunyikan peringatan lain karena hanya membaca satu paket fokus.
- Dashboard, TaskCenter, dan Halo memakai sumber daftar peringatan yang sama.
- Risiko sistem tidak disebut sebagai misi pribadi.
- Rekomendasi surat teguran/klarifikasi tampil sebagai rekomendasi, bukan aksi resmi.
- Sorting daftar peringatan menjadi stabil dan konsisten.

## 15. Risiko Tersisa

- `personalTasks` masih kosong karena data misi pribadi resmi belum terhubung ke database/API.
- Status tindak lanjut masih konseptual dan belum persist.
- Belum ada workflow resmi draft surat teguran/klarifikasi.
- Belum ada audit log untuk perubahan status tindak lanjut karena tahap ini tidak menulis data.
- Modul peta/laporan masih perlu audit lanjutan jika ingin memakai helper `project-alerts`.

## 16. Validasi yang Dijalankan

Wajib dicatat pada laporan akhir:

- `npx.cmd tsc --noEmit`
- `git diff --check`
- `npm run lint` jika tersedia

Build penuh tidak dijalankan jika dianggap berat.

## 17. Revisi Visual Setelah Cek User

Revisi kecil setelah cek visual user:

- Canvas Halo SIAGA-SDA diperbesar untuk desktop/laptop menjadi sekitar 3/4 halaman melalui lebar responsif `lg:w-[75vw]` dengan batas aman `xl:max-w-[1280px]`.
- Tablet memakai lebar sekitar `90vw`.
- Mobile tetap memakai lebar hampir penuh `w-[calc(100vw-24px)]`, tidak dipaksa menjadi 3/4 halaman.
- Canvas utama tetap `overflow-hidden`, isi panjang tetap scroll di body Halo, dan footer `Tutup Halo SIAGA-SDA` tetap berada di luar area scroll.
- Scroll lock ditambahkan saat Halo terbuka agar halaman belakang tidak ikut scroll.

## 18. Revisi Kendali Waktu

`Kendali Waktu Pekerjaan` diubah dari detail satu paket menjadi ringkasan agregat.

Isi baru:

- jumlah misi pribadi;
- jumlah peringatan sistem;
- jumlah terlambat/kritis;
- jumlah rekomendasi teguran/klarifikasi;
- prioritas tertinggi sebagai teks ringkas saja;
- CTA `Lihat Peringatan Sistem`.

Detail lengkap paket sekarang dipusatkan hanya di section `Peringatan Sistem dalam scope Anda`.

Risiko yang dikurangi:

- duplikasi detail paket antara Kendali Waktu dan Peringatan Sistem;
- kesan bahwa hanya ada 1 paket bermasalah;
- canvas Halo terlalu sempit untuk membaca daftar peringatan dan tindak lanjut.

## 19. Revisi Header/Subjudul Halo

Header Halo dibuat dinamis:

- jika ada personal task, subtitle dapat menjadi `Misi Harian Saya`;
- jika tidak ada personal task tetapi ada peringatan sistem, subtitle menjadi `Peringatan Sistem & Kendali Waktu`;
- jika tidak ada personal task dan tidak ada peringatan, subtitle menjadi `Belum ada misi pribadi`.

Copy utama tetap menegaskan:

- `Belum ada misi pribadi hari ini.`;
- `Peringatan Sistem dalam scope Anda.`;
- `Daftar ini bukan Tugas Saya, tetapi paket berisiko yang terlihat sesuai role dan assignment scope.`

## 20. Catatan Responsive

Checklist yang perlu dicek manual:

- desktop/laptop: panel Halo sekitar 3/4 halaman, scroll internal, footer terlihat;
- tablet: panel tidak keluar layar;
- mobile: panel tetap nyaman, tidak ada scroll horizontal;
- daftar Peringatan Sistem menampilkan seluruh item awal sampai 10 dan menampilkan teks `Menampilkan X dari Y peringatan sistem.`

## 21. Revisi Lanjutan Card Clickable dan Canvas

Revisi lanjutan setelah cek visual user:

- Canvas Halo dinaikkan lagi agar area baca lebih lega:
  - mobile memakai `max-h-[94dvh]`;
  - desktop/laptop memakai `md:max-h-[92vh]`;
  - lebar desktop tetap dipertahankan `lg:w-[75vw]`.
- Card ringkasan `Kendali Waktu Pekerjaan` sekarang clickable:
  - `Misi Pribadi`;
  - `Peringatan Sistem`;
  - `Terlambat/Kritis`;
  - `Rekomendasi`.
- Klik card mengubah filter aktif dan memindahkan fokus ke section detail `Peringatan Sistem`.
- Filter aktif:
  - `Misi Pribadi` menampilkan empty state misi pribadi karena data misi resmi belum terhubung;
  - `Peringatan Sistem` menampilkan semua peringatan sistem dalam scope;
  - `Terlambat/Kritis` menampilkan paket terlambat, health kritis, atau level critical;
  - `Rekomendasi` menampilkan paket dengan rekomendasi klarifikasi/teguran konseptual.
- Warna card dibuat berbeda tetapi tetap dalam tema SIAGA-SDA:
  - biru untuk misi pribadi;
  - amber untuk peringatan sistem;
  - merah lembut untuk terlambat/kritis;
  - cyan/tosca untuk rekomendasi.
- Efek visual card ditingkatkan dengan border, shadow, ring, dan elevasi hover ringan agar terasa clickable tanpa gaya neon/gaming.
- Struktur informasi tetap dijaga:
  - `Kendali Waktu Pekerjaan` hanya ringkasan agregat;
  - `Peringatan Sistem` tetap menjadi daftar detail.

Catatan: revisi ini tidak menambah API, tidak menulis database, tidak mengubah RBAC, dan tidak membuat rekomendasi menjadi surat resmi.

## 22. Rekomendasi Tahap Berikutnya

- WARNING-RECOMMENDATION.1: buat UI/fondasi status tindak lanjut peringatan secara lebih formal, tetap tanpa auto-publish surat resmi.
- Audit apakah Peta Monitoring dan laporan perlu memakai `buildProjectWarningSource`.
- Rancang persistence status tindak lanjut hanya setelah user memberi instruksi schema/API eksplisit.

## 23. Rekomendasi Commit Message

`fix: rapikan interaksi dan tampilan card halo`
