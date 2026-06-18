# SIAGA-SDA Tahap UX-C.2B - Halo SIAGA-SDA Floating Panel Final

Tanggal: 18 Juni 2026

## 1. Ringkasan Tujuan

Tahap UX-C.2B mengubah floating assistant lama dari label `AI Analisis` menjadi `Halo SIAGA-SDA` tanpa mengganti icon tombol floating yang sudah ada.

Perubahan ini menyiapkan panel ringan berisi:

- `Halo SIAGA-SDA`;
- `Misi Harian Saya`;
- `Dibantu AI Analis SDA`;
- kalimat role-aware berdasarkan user aktif;
- countdown sisa waktu hari ini;
- status `Belum Terhubung Data Resmi` dan `Persiapan UI`;
- empty state misi harian yang jujur;
- area tanya Halo SIAGA-SDA sebagai persiapan UI, tanpa AI API;
- konsep peringatan deviasi paket dan draft surat teguran;
- konsep pengingat harian.

Tahap ini tidak menghubungkan data misi resmi, tidak membuat AI API, tidak membuat backend baru, dan tidak membuat data dummy sebagai data resmi.

## 2. Status Acuan

- Tahap UX-C.2A sudah memindahkan `Tugas Saya` ke bawah lima kartu ringkasan dashboard.
- Login final/locked dan tidak disentuh.
- Modal Dashboard 4D.2 final dan tidak disentuh.
- Prisma schema, migration, database, Auth, RBAC runtime, endpoint Approval, endpoint Bootstrap, package, dan dependency tidak disentuh.

## 3. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `docs/design/SIAGA_SDA_UX_A_SUCCESS_APPRECIATION_BALLOON_DAN_TUGAS_SAYA.md`
- `docs/audit/SIAGA_SDA_RBAC_A_MATRIKS_TUGAS_HAK_AKSES_ROLE.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C2_RESPONSIVE_TUGAS_SAYA.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C2A_PINDAH_TUGAS_SAYA_BAWAH_5_KARTU.md`
- `src/app/(dashboard)/layout.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/store/useAppStore.ts`
- `src/lib/utils.ts`
- `src/lib/brand.ts`
- `package.json`

## 4. Audit Sumber Floating Button

Sumber floating button aktif ditemukan di:

`src/components/ai/ProjectAiAssistant.tsx`

Komponen tersebut dirender global pada dashboard shell melalui:

`src/app/(dashboard)/layout.tsx`

Temuan sebelum perubahan:

- tombol floating memakai icon `Bot`;
- posisi tombol memakai `fixed bottom-20 right-4 z-40`;
- label/title lama adalah `AI Analisis`;
- panel lama memakai overlay `z-[70]`;
- konten panel lama berisi analisis proyek lokal berbasis store.

Keputusan:

- icon tombol floating tetap memakai `Bot`;
- label/title/aria tombol diubah menjadi `Halo SIAGA-SDA`;
- panel tetap berada di layer `z-[70]`, sehingga tidak mengalahkan modal Dashboard/Approval shared portal `z-[9998]/[9999]`;
- konten panel diganti menjadi misi harian dan asisten virtual persiapan UI.

## 5. Backup

Backup dibuat di:

`backup/backup-ux-c2b-halo-siaga-sda-final-before-change/`

Isi backup:

- `src/components/ai/ProjectAiAssistant.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/TaskCenterPanel.tsx`
- `src/components/dashboard/EmptyAssignmentCard.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`
- `src/lib/task-center-ui.ts`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C2_RESPONSIVE_TUGAS_SAYA.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C2A_PINDAH_TUGAS_SAYA_BAWAH_5_KARTU.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`

## 6. File yang Diubah dan Dibuat

Diubah:

- `src/components/ai/ProjectAiAssistant.tsx`

Dibuat:

- `docs/audit/SIAGA_SDA_TAHAP_UX_C2B_HALO_SIAGA_SDA_FLOATING_PANEL_FINAL.md`

Tidak ada source runtime lain yang diubah pada tahap ini.

## 7. Implementasi Floating Button

Perubahan tombol:

- `title` menjadi `Halo SIAGA-SDA`;
- `aria-label` menjadi `Halo SIAGA-SDA`;
- icon tetap `Bot`;
- ukuran dan posisi tetap floating compact;
- posisi mobile dinaikkan ke `bottom-24` agar lebih aman terhadap bottom navigation;
- desktop tetap `md:bottom-5`;
- z-index tetap `z-40`, sehingga tidak menutup modal aplikasi.

Avatar tidak ditempatkan pada tombol floating.

## 8. Implementasi Panel Halo SIAGA-SDA

Panel dibuka saat floating button diklik.

Isi panel:

- header `Halo SIAGA-SDA`;
- subtitle `Misi Harian Saya`;
- label `Dibantu AI Analis SDA`;
- avatar fallback di dalam panel;
- kalimat role-aware;
- countdown `Sisa Waktu`;
- kartu ringkasan misi dengan nilai `0`;
- empty state `Belum Ada Misi Harian`;
- peringatan konsep deviasi paket dan draft surat teguran;
- area `Tanya Halo SIAGA-SDA`;
- FAQ aman;
- konsep pengingat harian.

Panel tidak mengubah layout dashboard, tidak mengubah modal Dashboard, dan tidak menambah route.

## 9. Role-Aware Sentence

Kalimat utama memakai role user aktif dari Zustand store.

Format:

`Tugas Anda sebagai seorang [role user] yang harus diselesaikan hari ini, [hari, tanggal].`

Jika role tidak tersedia, fallback:

`Tugas Anda yang harus diselesaikan hari ini, [hari, tanggal].`

Tidak ada NIP, nama ASN, perusahaan, atau identitas sensitif baru yang ditampilkan.

## 10. Countdown

Countdown dihitung lokal di client menuju akhir hari perangkat.

Label:

- `Sisa Waktu`
- format normal: `06 jam 42 menit`
- fallback ketika habis: `Hari ini berakhir`

Interval hanya satu menit agar ringan.

## 11. Status Data dan Empty State

Panel wajib menampilkan bahwa fitur belum terhubung data resmi:

- `Belum Terhubung Data Resmi`
- `Persiapan UI`
- `Database` atau `Data Demo/Fallback` mengikuti status dashboard existing.

Empty state:

`Belum Ada Misi Harian`

Pesan menjelaskan bahwa misi akan muncul setelah admin atau pejabat berwenang menghubungkan data tugas resmi ke role dan assignment user.

## 12. Tanya Halo SIAGA-SDA

Area tanya dibuat sebagai UI persiapan:

- textarea disabled;
- placeholder seputar misi harian, SOP, deviasi paket, surat teguran, administrasi, dan alur kerja SIAGA-SDA;
- tidak ada submit;
- tidak ada fetch;
- tidak ada AI API;
- tidak ada backend;
- tidak ada penyimpanan percakapan.

FAQ yang disediakan bersifat statis dan aman.

## 13. Avatar

Avatar hanya muncul di dalam panel.

Sumber yang disiapkan:

`/assets/halo-siaga-sda-avatar.png`

Jika asset belum tersedia, panel memakai fallback visual internal berbasis inisial `S` dan label `SDA`.

Tidak ada external image dan tidak ada dependency baru.

## 14. Hal yang Tidak Disentuh

- Login dan asset login.
- Auth, NextAuth, middleware.
- RBAC runtime dan role runtime.
- Prisma schema, migration, database.
- Endpoint Approval, Bootstrap, Sync Version.
- Modal Dashboard 4D.2 dan shared modal portal.
- Dashboard visual 4D.2.
- Source data dashboard existing.
- Filter dashboard existing.
- Task Center data resmi.
- Package dan dependency.

## 15. Risiko Tersisa

- Panel masih UI persiapan dan belum membaca misi resmi.
- Tidak ada AI API; area tanya hanya placeholder dan FAQ statis.
- Asset avatar khusus belum tersedia, sehingga fallback visual digunakan.
- Karena floating assistant berada di layout dashboard global, perubahan label berlaku pada semua route dashboard.
- Uji visual mobile/desktop tetap perlu dilakukan manual untuk memastikan tinggi panel sesuai browser perangkat nyata.

## 16. Validasi

Validasi dijalankan setelah implementasi:

- `git diff --check`: lulus. Git hanya menampilkan peringatan line-ending LF/CRLF pada file existing, tanpa whitespace error.
- `npx.cmd tsc --noEmit`: lulus.
- `npm run lint`: tidak tersedia di `package.json`.
- `npm run build`: tidak dijalankan karena tahap ini tidak mewajibkan build dan script build menjalankan `prisma generate`.

## 17. Rekomendasi Tahap Berikutnya

- UX-C.3 dapat melakukan uji visual manual desktop/mobile untuk Halo SIAGA-SDA.
- Integrasi misi resmi harus menunggu source data tugas dan assignment scope yang disetujui.
- Integrasi AI API harus menjadi tahap terpisah dengan audit keamanan, privasi, dan batas data role.

## 18. Saran Commit Message

`feat: ubah floating assistant menjadi halo siaga sda`
