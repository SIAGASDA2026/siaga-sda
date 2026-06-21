# SIAGA-SDA UI-CARD-SYSTEM.1 - Standarisasi Visual Canvas dan Card

Tanggal: 19 Juni 2026

## 1. Ringkasan Tahap

Tahap ini merapikan standar visual canvas dan card SIAGA-SDA agar batas wadah utama, sub-card, dan card interaktif lebih jelas. Perubahan bersifat visual-only dan tidak mengubah workflow, role, RBAC, Auth, Prisma, database, route, package, dependency, login final, atau modal Dashboard 4D.2.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/roadmap/ROADMAP_SIAGA_SDA_MENUJU_100_PERSEN.md`
- `docs/modules/SIAGA_SDA_WARNING_ACTION_CENTER_FOUNDATION.md`
- `docs/audit/SIAGA_SDA_DATA_CONSISTENCY_2_TASK_WARNING_HALO_SOURCE.md`
- `src/app/globals.css`
- `src/components/ui/index.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/components/dashboard/TaskCenterPanel.tsx`
- `src/components/dashboard/TaskCard.tsx`
- `src/components/dashboard/EmptyAssignmentCard.tsx`
- `src/components/dashboard/AppreciationHistoryPanel.tsx`
- `src/components/dashboard/CommandCenterNavigation.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`
- `src/components/modules/ModuleLandingPage.tsx`
- `src/components/navigation/SubfeatureEntryPoints.tsx`

## 3. File yang Diubah

- `src/app/globals.css`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/components/dashboard/TaskCenterPanel.tsx`
- `src/components/dashboard/TaskCard.tsx`
- `src/components/dashboard/EmptyAssignmentCard.tsx`
- `src/components/dashboard/AppreciationHistoryPanel.tsx`
- `src/components/dashboard/CommandCenterNavigation.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`
- `src/components/modules/ModuleLandingPage.tsx`
- `src/components/navigation/SubfeatureEntryPoints.tsx`

## 4. File Baru

- `docs/audit/SIAGA_SDA_UI_CARD_SYSTEM_1_CANVAS_CARD_STANDARDIZATION.md`

## 5. Backup Dibuat

Backup dibuat di:

`backup/backup-ui-card-system-1-before-change/`

File backup:

- `globals.css`
- `ProjectAiAssistant.tsx`
- `TaskCenterPanel.tsx`
- `TaskCard.tsx`
- `EmptyAssignmentCard.tsx`
- `AppreciationHistoryPanel.tsx`
- `CommandCenterNavigation.tsx`
- `CommandCenterOverview.tsx`
- `ModuleLandingPage.tsx`
- `SubfeatureEntryPoints.tsx`

## 6. Temuan Utama Masalah Visual Sebelumnya

- Banyak canvas dan card sama-sama memakai `bg-white`, `border-slate-100`, dan `shadow-sm`, sehingga batas hirarki visual kurang terlihat.
- Card kecil di dalam canvas tidak selalu terasa sebagai sub-card.
- Shadow/elevasi belum konsisten antara Dashboard, Halo, Tugas Saya, dan module landing.
- Varian warna sudah ada di beberapa tempat, tetapi belum memiliki standar utility bersama.
- Beberapa card terlalu tinggi atau terlalu besar untuk informasi ringkas.

## 7. Standar Visual Canvas Baru

Utility baru:

- `siaga-section-canvas`
- `siaga-section-canvas-muted`

Karakter canvas:

- border lebih tegas tetapi tetap lembut;
- radius 24px;
- background netral dengan subtle water/cyan tint;
- shadow bawah lebih jelas;
- inset highlight tipis agar terasa sebagai container utama;
- tetap mobile-safe dan tidak memaksa tinggi/width baru.

## 8. Standar Visual Card Baru

Utility baru/ditingkatkan:

- `siaga-card`
- `siaga-card-compact`
- `siaga-card-interactive`

Karakter card:

- border lebih jelas daripada sebelumnya;
- background sedikit berbeda dari canvas;
- shadow/elevasi ringan;
- padding lebih padat pada card kecil;
- hover/focus pada card interaktif lebih mudah dikenali;
- tetap mempertahankan `min-width: 0` untuk mencegah overflow horizontal.

## 9. Variasi Warna Card

Utility varian:

- `siaga-card-info`: biru lembut untuk informasi umum.
- `siaga-card-warning`: amber/krem untuk perhatian.
- `siaga-card-critical`: merah/salmon lembut untuk kritis/terlambat.
- `siaga-card-success`: hijau lembut untuk aman/selesai.
- `siaga-card-recommendation`: cyan/tosca untuk rekomendasi/tindak lanjut.
- `siaga-card-neutral`: putih/abu terang untuk konten netral.

## 10. Efek 3D/Elevasi yang Diterapkan

Efek visual:

- border 1px dengan opacity yang lebih terbaca;
- shadow bawah lembut;
- inset highlight putih tipis;
- hover translate `-2px` pada card interaktif;
- focus visible ring untuk aksesibilitas keyboard;
- tidak memakai neon/gaming style.

## 11. Dampak ke Halo

Halo SIAGA-SDA tetap memakai canvas besar dari DATA-CONSISTENCY.2. Perubahan tahap ini:

- body Halo memakai background slate lebih jelas;
- section utama Halo memakai `siaga-section-canvas` / `siaga-section-canvas-muted`;
- card summary `Kendali Waktu` tetap clickable dan filter aktif tetap terbaca;
- sub-card peringatan, progress, target, status waktu, rekomendasi, dan pihak terkait memakai card compact;
- footer `Tutup Halo SIAGA-SDA` tetap di luar area scroll.

## 12. Dampak ke Tab-tab Lain

Perubahan paling langsung berlaku pada:

- Dashboard Command Center;
- Tugas Saya / Peringatan Sistem;
- Halo SIAGA-SDA;
- Module landing placeholder/persiapan;
- Subfeature entry point;
- card dashboard lama yang sudah memakai `.siaga-card`.

Halaman yang masih memakai class manual sepenuhnya belum dirombak total agar scope tetap aman. Utility global baru menjadi standar untuk tahap lanjutan ketika page spesifik dirapikan satu per satu.

## 13. Risiko yang Dikurangi

- Canvas dan card tidak lagi terlalu mirip pada area yang sudah distandarkan.
- Card interaktif lebih terlihat clickable.
- Warna card lebih jelas sesuai fungsi.
- Card terasa lebih elevated tanpa style berlebihan.
- Pengguna lebih mudah membedakan ringkasan, detail, warning, dan rekomendasi.

## 14. Risiko Tersisa

- Masih ada page spesifik yang memakai class manual dan perlu perapihan bertahap.
- Validasi visual manual desktop/mobile masih perlu dilakukan di browser.
- Standar utility belum dipaksa sebagai satu-satunya pola di seluruh source agar tidak menimbulkan refactor besar.

## 15. Validasi yang Dijalankan

Wajib dicatat pada laporan akhir:

- `npx.cmd tsc --noEmit`
- `git diff --check`
- `npm run lint` jika tersedia

Build penuh tidak dijalankan pada tahap ini jika dianggap berat.

## 16. Rekomendasi Tahap Berikutnya

- UI-CARD-SYSTEM.2: migrasi bertahap page yang masih memakai card manual ke utility `siaga-section-canvas` dan `siaga-card-*`.
- Cek visual manual di Dashboard, Halo, Peta Monitoring, Survey, Paket, Approval, Surat, Peil, Asset, Audit Log, dan Pengaturan.
- Setelah visual disetujui, gunakan utility ini sebagai baseline untuk komponen baru.

## 17. Rekomendasi Commit Message

`feat: standarkan visual canvas dan card siaga sda`
