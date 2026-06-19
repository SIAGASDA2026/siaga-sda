# SIAGA-SDA DATA-CONSISTENCY.1 — Sinkronisasi Status Paket, Dashboard, Halo, dan Warning

Tanggal: 19 Juni 2026

## 1. Ringkasan Tujuan

Tahap DATA-CONSISTENCY.1 menyatukan sumber status tampilan paket agar Paket Pekerjaan, Dashboard, panel Tugas Saya/Peringatan Sistem, Halo SIAGA-SDA, dan fondasi Warning Action Center membaca aturan status yang sama.

Tahap ini tidak mengubah database, Prisma schema, migration, Auth, RBAC besar, endpoint Approval, halaman login, atau standar modal Dashboard 4D.2.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/modules/SIAGA_SDA_WARNING_ACTION_CENTER_FOUNDATION.md`
- `docs/audit/SIAGA_SDA_DOCS_CLEANUP_1_BLUEPRINT_ROLE_MAPPING.md`
- `docs/audit/SIAGA_SDA_DATA_SAFETY_2_SERVER_GUARD_FOTO_URL.md`
- `src/app/(dashboard)/proyek/page.tsx`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/TaskCenterPanel.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/store/useAppStore.ts`
- `src/lib/project-db.ts`
- `src/lib/rbac.ts` hanya dibaca
- `src/lib/navigation.ts` hanya dibaca
- `src/types/index.ts`

## 3. Backup

Backup dibuat di:

`backup/backup-data-consistency-1-status-before-change/`

File backup:

- `dashboard-page.tsx`
- `proyek-page.tsx`
- `proyek-id-page.tsx`
- `TaskCenterPanel.tsx`
- `ProjectAiAssistant.tsx`

## 4. File yang Diubah/Dibuat

File baru:

- `src/lib/project-status.ts`
- `docs/audit/SIAGA_SDA_DATA_CONSISTENCY_1_STATUS_PAKET_DASHBOARD_HALO.md`

File diubah:

- `src/app/(dashboard)/proyek/page.tsx`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/TaskCenterPanel.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`

## 5. Temuan Sumber Status Sebelum Perubahan

- Paket Pekerjaan memakai `project.health` dan `getHealthBadge(project.health)`.
- Dashboard menghitung `onTrack`, `warning`, `kritis`, grafik, dan daftar risiko langsung dari `project.health`.
- Halo SIAGA-SDA menghitung status waktu sendiri dari `tanggalSelesai`, sehingga dapat memberi label berbeda dari Paket/Dashboard.
- Store dan mapper database masih membentuk health dari deviasi fisik-keuangan, belum selalu mempertimbangkan tanggal target.
- Panel `Tugas Saya` menerima `tasks={[]}` sehingga assignment pribadi kosong, tetapi belum punya wadah eksplisit untuk peringatan sistem yang bukan tugas pribadi.

Akibatnya paket dengan target selesai lewat tetapi progress belum 100% masih dapat terlihat `On Track` di Paket/Dashboard jika `project.health` tersimpan `on_track`, sementara Halo menyebutnya `Terlambat`.

## 6. Aturan Status Sinkron

Helper baru `src/lib/project-status.ts` menjadi adapter frontend untuk status tampilan paket.

Urutan keputusan:

1. `Selesai`: progress fisik 100% atau status final/closed/selesai.
2. `Terlambat`: target selesai sudah lewat, progress belum 100%, dan paket belum selesai.
3. `Kritis`: deviasi progress berada pada batas kritis.
4. `Risiko Terlambat`: target selesai mendekat atau deviasi negatif perlu perhatian.
5. `Data Belum Lengkap`: target selesai atau progress tidak valid/tidak tersedia.
6. `On Track`: hanya jika target belum lewat, data valid, paket belum selesai, dan tidak ada deviasi risiko/kritis.

Aturan penting:

- `On Track` tidak ditampilkan jika target selesai sudah lewat dan progress belum 100%.
- Data tanpa target tidak dipaksa menjadi sehat; ditampilkan sebagai data belum lengkap.
- Helper tidak membaca database dan tidak fetch API.
- Helper hanya membaca object paket yang sudah tersedia di frontend.

## 7. Dampak ke Paket Pekerjaan

- List Paket, card mobile, dan panel detail memakai `getProjectComputedBadge`.
- Filter `health` di `/proyek` memakai status terhitung.
- Statistik deviasi/perlu perhatian memakai status sinkron, bukan hanya `project.health`.
- Detail paket menampilkan catatan `Status sinkron` berisi label dan alasan perhitungan.

## 8. Dampak ke Dashboard

- KPI `On Track`, `Warning`, dan `Kritis` dihitung dari status sinkron.
- Grafik progress memakai health terhitung.
- `riskProjects` memakai status sinkron, masalah open, dan deviasi.
- Focus package di Command Center memakai health terhitung.
- `Paket Risiko Prioritas`, `Warning Center`, dan tabel paket memakai badge sinkron.

## 9. Dampak ke Tugas Saya dan Peringatan Sistem

Panel `Tugas Saya` tetap memisahkan assignment pribadi dari risiko sistem:

- `Tugas Saya`: hanya untuk assignment resmi/user task.
- `Peringatan Sistem`: daftar paket berisiko yang terlihat sesuai role dan assignment scope, tetapi tidak dianggap sebagai tugas pribadi.

Ini mencegah broad-role seperti pimpinan/admin melihat semua paket risiko sebagai tugas personal.

## 10. Dampak ke Halo SIAGA-SDA

Halo memakai `getProjectComputedStatus` untuk menentukan status waktu paket.

Perubahan penting:

- Paket selesai tidak lagi disebut terlambat hanya karena tanggal lewat.
- Paket lewat target dan progress belum 100% selalu disebut `Terlambat`.
- Paket risiko menggunakan alasan yang sama dengan Dashboard/Paket.

## 11. Dampak ke Warning Action Center

Tahap ini belum membuat runtime Warning Action Center.

Fondasi yang disiapkan:

- daftar risiko Dashboard sudah memakai status sinkron;
- peringatan sistem di panel Tugas Saya sudah dipisahkan dari assignment pribadi;
- helper status bisa dipakai pada tahap Warning runtime berikutnya.

## 12. Risiko yang Dikurangi

- Perbedaan label antara Paket, Dashboard, dan Halo.
- Paket lewat target tampil `On Track`.
- Risiko sistem dianggap tugas personal.
- Warning Action Center memakai status yang tidak sama dengan Dashboard.

## 13. Risiko Tersisa

- `project.health` yang tersimpan di data lama/store/database masih bisa bernilai berbeda; helper baru hanya menormalkan tampilan frontend.
- Mapper database `toHealthStatus` dan `mapDbPaket` masih menghitung health dari deviasi saja. Tidak diubah pada tahap ini agar tidak mengubah kontrak data/backend.
- Modul lain di luar scope, seperti Peta Monitoring, mungkin masih memakai `project.health` langsung dan perlu audit tahap lanjutan.
- Belum ada endpoint summary warning resmi.

## 14. Validasi

Wajib dijalankan setelah perubahan:

- `git diff --check`
- `npx tsc --noEmit`

Hasil validasi dicatat pada laporan akhir.

## 15. Rekomendasi Lanjut

- Gunakan `src/lib/project-status.ts` sebagai adapter frontend resmi untuk status paket pada Warning Action Center.
- Audit modul Peta Monitoring dan laporan jika masih memakai `project.health` langsung.
- Jika kelak status backend ingin benar-benar diseragamkan, lakukan tahap khusus yang mengubah mapper/API secara bertahap dan tervalidasi.

## 16. Saran Commit Message

`fix: sinkronkan status paket dashboard halo`
