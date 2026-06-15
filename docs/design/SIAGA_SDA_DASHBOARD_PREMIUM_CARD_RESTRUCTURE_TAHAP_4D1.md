# SIAGA-SDA Dashboard Premium Card Restructure - Tahap 4D.1

## 1. Ringkasan Tujuan

- Tanggal: 15 Juni 2026
- Dashboard aktif: `/dashboard`
- Fokus: merapikan landing tab Ringkasan tanpa rewrite total
- Prinsip: lebih sedikit card, informasi lebih padat, detail muncul atas tindakan user

Tahap 4D.1 menyusun ulang Command Center Tahap 4D agar area utama tidak terasa seperti kumpulan banyak card. Fondasi data, role-aware behavior, assignment scope, dan Approval Summary formal tetap dipertahankan.

## 2. File yang Dibaca

- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/components/layout/Topbar.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/approval/ApprovalSummaryProvider.tsx`
- `src/components/dashboard/**`
- `src/lib/dashboard-scope.ts`
- `src/lib/navigation.ts`
- `src/store/useAppStore.ts`
- dokumen Tahap 4A sampai 4D dan login final lock

## 3. File yang Diubah dan Dibuat

Diubah:

- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`

Dibuat:

- `src/components/dashboard/CommandCenterNavigation.tsx`
- `docs/design/SIAGA_SDA_DASHBOARD_PREMIUM_CARD_RESTRUCTURE_TAHAP_4D1.md`

## 4. Backup

Backup dibuat di:

`backup/backup-dashboard-premium-card-restructure-4d1-before-change`

File yang dibackup:

- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`

## 5. Card yang Dihapus atau Diturunkan dari Area Utama

Tidak ada fitur atau source code lama yang dihapus secara destruktif.

Pada tab Ringkasan:

- navigasi 14 pill lama disembunyikan;
- card Filter Ringkas besar tetap disembunyikan;
- filter lanjutan hanya muncul saat tombol Filter compact diklik;
- Quick Action tidak lagi menjadi grid card besar;
- Aktivitas tidak lagi menjadi card terpisah;
- shortcut Peta tidak lagi menjadi card besar tersendiri;
- Waktu & Salat serta Insight Lokal tidak tampil sebagai pill besar;
- rekap detail lama tetap tersedia melalui `Buka Rekap Tambahan`.

Navigasi/tab lama tetap tampil ketika user masuk ke tab detail.

## 6. Card yang Digabung

- Progres Fisik dan Progres Keuangan digabung menjadi satu KPI.
- Quick Action dan Aktivitas Terbaru digabung menjadi panel `Akses & Aktivitas`.
- Surat, Peil, Asset, Administrasi, Waktu & Salat, serta Insight Lokal digabung menjadi panel `Modul Pendukung`.
- Peta Monitoring dipindahkan menjadi item Navigasi Command Center dan shortcut kecil pada Modul Pendukung.

## 7. Navigasi Command Center

Navigasi ringkas terdiri dari:

1. Ringkasan
2. Risiko & Approval
3. Progress
4. Aktivitas
5. Peta Monitoring
6. Modul Pendukung

Setiap item memiliki ikon, label, angka/status ringkas, dan detail interaktif.

### Desktop

Klik item membuka dialog/popover compact berisi:

- deskripsi fungsi;
- ringkasan angka;
- status sumber data;
- catatan role dan assignment scope;
- tombol `Buka Modul`.

### Mobile

Komponen yang sama berubah menjadi bottom sheet dari bawah layar. Detail tidak bergantung pada hover dan dapat ditutup dengan tombol, backdrop, atau tombol Escape pada keyboard.

## 8. Struktur Desktop Baru

1. Header compact dengan tombol Filter.
2. Navigasi Command Center satu strip.
3. KPI Strip maksimal lima item.
4. Tiga Decision Panels:
   - Command Brief
   - Progress
   - Risk & Approval
5. Dua panel bawah:
   - Akses & Aktivitas
   - Modul Pendukung
6. Rekap Tambahan opsional.

## 9. Struktur Mobile Baru

- Navigasi Command Center dapat digeser horizontal.
- Detail navigasi memakai bottom sheet.
- KPI tetap dua kolom.
- Decision Panels menjadi satu kolom.
- Akses cepat berupa chip horizontal.
- Aktivitas berupa compact timeline.
- Modul pendukung berupa summary row.
- Mobile tetap scroll vertikal dan tidak menggunakan hover-only interaction.

## 10. Role-Aware Behavior

- Seluruh item navigasi difilter melalui `canAccessPage()`.
- Role tanpa akses Approval tidak melihat angka atau link Approval formal.
- Risiko & Approval diarahkan secara konservatif ke Paket Berisiko untuk role tanpa Approval.
- Quick Action memakai mapping dan permission existing.
- Modul pendukung hanya menampilkan route yang dapat diakses role.
- Aktivitas dan Audit Log tetap mengikuti scope/permission existing.

Tidak ada permission atau role baru yang dibuat.

## 11. Source Data dan Badge

- Approval Pending tetap memakai `approvalSummary.pending` dari source-of-truth formal Tahap 4C.3.
- KPI paket, progres, risiko, dan survey tetap memakai data scoped dashboard existing.
- Header tetap membedakan `Data Database` dan `Data Demo/Fallback`.
- Surat, Peil, dan Asset yang belum terbukti sebagai data resmi diberi badge `Persiapan`.
- Waktu & Salat diberi badge `Utility`.
- Insight Lokal tetap diberi badge `Insight Lokal` dan bukan rekomendasi resmi.

## 12. Clickable Navigation

Mapping utama dipertahankan:

- Approval Pending ke `/approval?approval_status=pending&source_module=dashboard`
- Survey pending ke `/survey?status=belum-ditindaklanjuti&source_module=dashboard`
- Paket kritis ke `/proyek?health=kritis&source_module=dashboard`
- Surat ke `/surat`
- Peil ke `/peil`
- Asset ke `/asset`
- Administrasi ke `/administrasi`
- Peta ke `/peta`

Semua link tetap mengikuti guard route existing.

## 13. Hal yang Tidak Disentuh

- Login dan asset login
- Auth, NextAuth, middleware, RBAC, role, dan permission
- Prisma, database, migration, dan schema
- Endpoint Approval, Bootstrap, dan Sync Version
- Approval Summary source-of-truth
- Sidebar, MobileNav, Topbar, dan menu utama
- Route root, `/login`, dan `/dashboard`
- Data dummy/demo
- Package dan dependency

## 14. Risiko Tersisa

- Dialog desktop menggunakan pola modal compact, bukan balloon yang menempel pada setiap tombol, agar posisi tetap stabil pada desktop dan mobile.
- Filter lanjutan tetap memiliki ukuran existing ketika dibuka, tetapi tidak tampil default.
- Rekap Tambahan dan tab detail lama masih dapat menampilkan card lama karena tidak dihapus pada tahap ini.
- Modul Persiapan belum memiliki angka resmi dan tidak boleh dianggap sebagai data operasional resmi.
- Verifikasi visual manual lintas viewport dan role masih diperlukan.

## 15. Validasi

- `npx tsc --noEmit`: lulus.
- `git diff --check`: lulus.
- `npm run lint`: script lint tidak tersedia.
- `npm run build`: tidak dijalankan karena tidak wajib dan dapat memicu proses Prisma/build berat.
- Server lokal: `/login` merespons 200 dan `/dashboard` tanpa sesi merespons redirect 307.
- Uji sesi PPK/Tim Perencana: tidak selesai karena callback credentials lokal timeout/500 dan tidak menghasilkan sesi valid.
- Uji visual browser: tidak dapat dijalankan karena browser terintegrasi tidak tersedia pada sesi ini.

## 16. Rekomendasi Tahap Berikutnya

1. Uji visual PPK dan Tim Perencana pada desktop/mobile.
2. Tuning tinggi panel berdasarkan data production nyata.
3. Audit dan ringkas tab detail lama secara bertahap tanpa menghapus fitur.
4. Jangan menaikkan status modul Persiapan menjadi Database sebelum sumber resmi tersedia.
