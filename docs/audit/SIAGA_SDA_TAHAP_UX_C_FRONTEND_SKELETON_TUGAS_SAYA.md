# SIAGA-SDA Tahap UX-C - Frontend Skeleton Tugas Saya dan Success Appreciation Balloon

Tanggal: 18 Juni 2026  
Commit acuan: `dcfcd8c docs: tambah desain visual tugas saya dan success balloon`  
Status: frontend skeleton terbatas, tanpa data resmi, tanpa API, tanpa database

## A. Judul dan Tanggal

SIAGA-SDA Tahap UX-C - Frontend Skeleton Tugas Saya dan Success Appreciation Balloon  
Tanggal pengerjaan: 18 Juni 2026

## B. Commit Acuan

- `dcfcd8c docs: tambah desain visual tugas saya dan success balloon`
- `d828f5e docs: tambah matriks tugas role dan ux apresiasi`
- `cff1c97 docs: final gate migration surat tahap 5ib`

## C. Tujuan UX-C

Tahap UX-C membuat skeleton frontend terbatas untuk:

- `Dashboard > Tugas Saya`.
- Empty Assignment State.
- Tugas Selesai ringkas.
- Langkah Berikutnya ringkas.
- Riwayat Apresiasi ringkas.
- Success Appreciation Balloon reusable.
- Animasi ringan logo SIAGA-SDA + heart kecil.

Semua masih UI skeleton. Belum ada data resmi, belum API, belum database, belum RBAC runtime, dan belum riwayat apresiasi permanen.

## D. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/audit/SIAGA_SDA_TAHAP_5IB_FINAL_GATE_MIGRATION_SURAT.md`
- `docs/audit/SIAGA_SDA_RBAC_A_MATRIKS_TUGAS_HAK_AKSES_ROLE.md`
- `docs/design/SIAGA_SDA_UX_A_SUCCESS_APPRECIATION_BALLOON_DAN_TUGAS_SAYA.md`
- `docs/design/SIAGA_SDA_UX_B_DESAIN_VISUAL_TUGAS_SAYA_DAN_SUCCESS_BALLOON.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/lib/navigation.ts`
- `src/store/useAppStore.ts`
- `src/types/index.ts`
- `prisma/schema.prisma` read-only

## E. Backup yang Dibuat

Backup dibuat di:

`backup/backup-ux-c-frontend-skeleton-tugas-saya-before-change/`

Isi backup:

- `AGENTS.md`
- `src/app/(dashboard)/dashboard/page.tsx`
- `docs/design/SIAGA_SDA_UX_B_DESAIN_VISUAL_TUGAS_SAYA_DAN_SUCCESS_BALLOON.md`
- `docs/design/SIAGA_SDA_UX_A_SUCCESS_APPRECIATION_BALLOON_DAN_TUGAS_SAYA.md`
- `docs/audit/SIAGA_SDA_RBAC_A_MATRIKS_TUGAS_HAK_AKSES_ROLE.md`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/store/useAppStore.ts`

## F. File yang Dibuat

- `src/lib/task-center-ui.ts`
- `src/components/dashboard/EmptyAssignmentCard.tsx`
- `src/components/dashboard/TaskCard.tsx`
- `src/components/dashboard/AppreciationHistoryPanel.tsx`
- `src/components/dashboard/TaskCenterPanel.tsx`
- `src/components/dashboard/SuccessAppreciationBalloon.tsx`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C_FRONTEND_SKELETON_TUGAS_SAYA.md`

## G. File yang Diubah

- `src/app/(dashboard)/dashboard/page.tsx`

Perubahan dashboard hanya berupa import dan render `TaskCenterPanel` di tab `ringkasan`. Tidak ada perubahan filter, data source, modal Dashboard 4D.2, approval summary, route, atau layout besar.

## H. Ringkasan Komponen

### `src/lib/task-center-ui.ts`

Helper/type UI skeleton:

- `TaskPriority`
- `TaskStatus`
- `UserIdentityKind`
- `TaskCenterIdentity`
- `TaskCenterItem`
- `AppreciationEvent`
- `EMPTY_ASSIGNMENT_MESSAGE`
- `formatIdentityLabel()`
- `getEmptyAssignmentCopy()`
- `getPriorityLabel()`
- `getStatusLabel()`

Helper ini tidak membaca database, tidak fetch API, tidak import Prisma, dan tidak membuat data resmi palsu.

### `EmptyAssignmentCard`

Menampilkan empty assignment sebagai kondisi aman:

- bukan error;
- bukan forbidden;
- tidak membuka data luar scope;
- menampilkan identitas user sendiri secara aman;
- memakai pesan wajib empty assignment.

### `TaskCard`

Skeleton satu item tugas:

- judul tugas;
- modul asal;
- status;
- prioritas;
- batas waktu;
- langkah berikutnya;
- risiko jika terlewat;
- tombol detail dan aksi.

Jika task tidak punya href valid, tombol disabled dengan alasan. Tahap ini tidak mengisi task resmi.

### `TaskCenterPanel`

Panel Dashboard > Tugas Saya:

- header `Tugas Saya`;
- ringkasan Tugas Aktif, Selesai, Perhatian;
- empty assignment jika tasks kosong;
- Tugas Selesai ringkas;
- Langkah Berikutnya ringkas;
- Riwayat Apresiasi ringkas;
- badge `Belum Terhubung Data Resmi`.

Default aman: `tasks=[]`, `completedTasks=[]`, `appreciationEvents=[]`.

### `AppreciationHistoryPanel`

Skeleton list riwayat apresiasi. Jika belum ada event resmi, menampilkan empty state yang jujur.

### `SuccessAppreciationBalloon`

Komponen reusable untuk aksi sukses, tetapi belum dipasang otomatis ke aksi mana pun.

Isi:

- logo/label SIAGA-SDA kecil;
- centang sukses;
- heart kecil;
- judul `Terima kasih`;
- identitas user;
- aksi berhasil;
- langkah berikutnya;
- risiko yang dicegah;
- tombol detail/lanjut/tutup.

## I. Cara Kerja Empty Assignment

Dashboard mengirim identitas user aktif ke `TaskCenterPanel`. Karena UX-C belum memiliki data resmi tugas, panel diberi daftar task kosong sehingga `EmptyAssignmentCard` tampil.

Pesan yang tampil:

`Selamat datang di SIAGA-SDA. Akun Anda sudah aktif, tetapi saat ini belum ada tugas yang diberikan kepada Anda. Tugas baru akan muncul di menu Tugas Saya setelah admin atau pejabat berwenang memberikan penugasan.`

Aturan:

- tidak menampilkan data dummy;
- tidak menampilkan data user lain;
- tidak membuka semua data karena assignment kosong;
- tidak dianggap error.

## J. Cara Kerja Success Balloon

`SuccessAppreciationBalloon` menerima props eksplisit:

- `success`;
- `identity`;
- `actionLabel`;
- `nextStep`;
- `riskPrevented`;
- optional `detailHref`;
- optional `continueHref`;
- optional `onClose`.

Jika `success === false`, komponen tidak render. Tahap ini tidak menghubungkan balloon ke aksi existing agar tidak menampilkan sukses palsu.

## K. Batasan

- Belum data resmi.
- Belum API.
- Belum database.
- Belum RBAC runtime.
- Belum Riwayat Apresiasi permanen.
- Belum assignment resmi untuk Tugas Saya.
- Tidak membuat task dummy yang terlihat resmi.
- Tidak menampilkan NIP ke eksternal.
- Tidak mengganti Audit Log formal.

## L. Risiko Teknis

| Risiko | Mitigasi |
|---|---|
| Panel dianggap data resmi | Badge `Belum Terhubung Data Resmi` dan default empty assignment |
| Dashboard menjadi berat | Komponen murni UI, tanpa fetch/API |
| Modal Dashboard terganggu | Tidak mengubah modal/overlay/blur 4D.2 |
| Data luar scope tampil | Tidak membaca data global untuk task skeleton |
| Balloon muncul palsu | Balloon tidak dipasang otomatis dan hanya render jika `success` true |
| Mobile overflow | Layout memakai grid/stack responsive dan tidak memaksa satu layar |

## M. Hal yang Tidak Disentuh

- Login final.
- Auth/NextAuth/middleware.
- RBAC runtime dan role runtime.
- `prisma/schema.prisma`.
- Migration/database.
- Endpoint Approval.
- Endpoint Bootstrap.
- Approval provider.
- Package/dependency.
- Modal Dashboard 4D.2.
- Source data Dashboard existing.

## N. Validasi

Validasi yang wajib dijalankan setelah perubahan:

- `npx.cmd tsc --noEmit`
- `git diff --check`
- `npm run lint` jika script tersedia

`npm run build` tidak wajib untuk tahap UX-C karena build menjalankan `prisma generate`; tahap ini secara eksplisit melarang Prisma generate/migrate/db push.

## O. Rekomendasi Tahap Berikutnya

- UX-C.1: review visual manual Dashboard desktop/mobile.
- UX-D: sambungkan skeleton ke helper assignment scope jika RBAC runtime sudah disetujui.
- RBAC-B: helper assignment scope dan policy read-only.
- 5I: migration schema Surat hanya setelah backup database dan persetujuan eksplisit.
- Jangan langsung menghubungkan semua modul sekaligus.

