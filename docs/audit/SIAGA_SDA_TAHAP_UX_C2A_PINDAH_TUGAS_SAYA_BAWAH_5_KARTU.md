# SIAGA-SDA Tahap UX-C.2A - Pindah Tugas Saya ke Bawah 5 Kartu Ringkasan

Tanggal: 18 Juni 2026

## A. Commit Acuan

- `d8e8770 fix: rapikan responsive tugas saya dan empty assignment`

## B. Tujuan

Memindahkan posisi panel `Tugas Saya` agar tampil setelah 5 kartu ringkasan/KPI Dashboard, tanpa mengubah isi, jumlah, data source, filter, logic, modal Dashboard 4D.2, atau source data Dashboard existing.

## C. File yang Dibaca

- `AGENTS.md`
- `docs/core/*`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C_FRONTEND_SKELETON_TUGAS_SAYA.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C1_REVIEW_VISUAL_TUGAS_SAYA.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C2_RESPONSIVE_TUGAS_SAYA.md`
- `docs/design/SIAGA_SDA_UX_B_DESAIN_VISUAL_TUGAS_SAYA_DAN_SUCCESS_BALLOON.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/TaskCenterPanel.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`
- `src/components/dashboard/EmptyAssignmentCard.tsx`
- `src/lib/task-center-ui.ts`

## D. Backup yang Dibuat

Backup dibuat di:

`backup/backup-ux-c2a-move-task-card-after-five-summary-cards/`

Isi backup:

- `page.tsx`
- `TaskCenterPanel.tsx`
- `CommandCenterOverview.tsx`
- `SIAGA_SDA_TAHAP_UX_C2_RESPONSIVE_TUGAS_SAYA.md`

## E. Struktur Dashboard yang Ditemukan

### Komponen yang merender 5 kartu

5 kartu ringkasan/KPI dirender di:

`src/components/dashboard/CommandCenterOverview.tsx`

Section aktif:

```text
<section className="grid grid-cols-2 ... xl:grid-cols-5">
  {kpis.map(...)}
</section>
```

Data 5 kartu berasal dari `commandCenterKpis` di:

`src/app/(dashboard)/dashboard/page.tsx`

Daftar KPI:

1. `packages` - Total Paket Aktif
2. `progress` - Progres Fisik / Keuangan
3. `risk` - Deviasi / Risiko
4. `approval` - Approval Pending
5. `survey` - Survey Belum Ditindaklanjuti

Kartu tetap difilter berdasarkan `canAccessPage(currentRole, item.accessPath)`. Tahap ini tidak mengubah isi array, jumlah item, filter akses, href, tone, helper, atau source data.

### Lokasi TaskCenterPanel sebelum perubahan

Sebelum UX-C.2A, `TaskCenterPanel` dirender di `src/app/(dashboard)/dashboard/page.tsx` setelah seluruh `CommandCenterOverview` selesai.

Artinya panel `Tugas Saya` berada setelah KPI, Command Brief, Progress, Risk & Approval, Akses & Aktivitas, dan Modul Pendukung.

### Lokasi target setelah 5 kartu

Lokasi target jelas: tepat setelah section KPI `kpis.map(...)` di dalam `CommandCenterOverview`, sebelum section Command Brief.

### Keamanan pemindahan

Struktur aman untuk dipindahkan karena:

- 5 kartu berada dalam section yang jelas;
- `CommandCenterOverview` sudah menerima `ReactNode` lain seperti `filterPanel`;
- pemindahan bisa dilakukan sebagai slot presentasi `afterKpiContent`;
- `TaskCenterPanel` tidak perlu diubah;
- `commandCenterKpis` tidak perlu diubah.

## F. File yang Diubah

- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/CommandCenterOverview.tsx`

## G. File yang Dibuat

- `docs/audit/SIAGA_SDA_TAHAP_UX_C2A_PINDAH_TUGAS_SAYA_BAWAH_5_KARTU.md`

## H. Ringkasan Perubahan

### Posisi sebelum

```text
CommandCenterOverview
  Header
  Filter
  Navigation
  5 KPI
  Command Brief
  Progress
  Risk & Approval
  Akses & Aktivitas
  Modul Pendukung
TaskCenterPanel
```

### Posisi sesudah

```text
CommandCenterOverview
  Header
  Filter
  Navigation
  5 KPI
  TaskCenterPanel
  Command Brief
  Progress
  Risk & Approval
  Akses & Aktivitas
  Modul Pendukung
```

### Implementasi teknis

- `CommandCenterOverview` menerima prop baru `afterKpiContent?: ReactNode`.
- `afterKpiContent` dirender tepat setelah section KPI.
- `page.tsx` mengirim `TaskCenterPanel` melalui `afterKpiContent`.
- Render lama `TaskCenterPanel` setelah seluruh `CommandCenterOverview` dihapus.

### Yang tetap utuh

- 5 kartu KPI tetap utuh.
- Data source KPI tidak berubah.
- `commandCenterKpis` tidak berubah.
- Filter role/access KPI tidak berubah.
- Tab logic Dashboard tidak berubah.
- Modal Dashboard 4D.2 tidak berubah.
- `TaskCenterPanel` tidak diubah.
- `SuccessAppreciationBalloon` tidak diubah.

## I. Risiko Teknis

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Layout dashboard lebih panjang tepat setelah KPI | User melihat Tugas Saya lebih awal, konten keputusan lain turun | Ini sesuai permintaan user; mobile boleh scroll vertikal |
| Salah posisi jika KPI nested | Bisa menaruh panel di lokasi yang tidak dimaksud | KPI sudah teridentifikasi pada section `kpis.map` di `CommandCenterOverview` |
| Mengganggu tab ringkasan | Ringkasan berubah urutan | Perubahan hanya urutan render dalam tab `ringkasan` |
| Modal Dashboard 4D.2 terganggu | Overlay/scroll-lock rusak | Modal tidak disentuh |
| Z-index/overlay terganggu | Panel menutup modal/topbar | `TaskCenterPanel` tidak dibuat fixed/sticky dan z-index tidak diubah |

## J. Mitigasi

- Hanya memindahkan urutan render.
- Tidak mengubah data.
- Tidak mengubah 5 kartu.
- Tidak mengubah modal.
- Tidak mengubah API/RBAC/schema.
- Tidak mengubah `TaskCenterPanel`.
- Tidak mengubah `SuccessAppreciationBalloon`.

## K. Hal yang Tidak Disentuh

- Login.
- Auth/NextAuth/middleware.
- RBAC runtime.
- Role runtime.
- Prisma schema.
- Migration/database.
- API.
- Endpoint Approval/Bootstrap.
- Package/dependency.
- Modal Dashboard 4D.2.
- Source data Dashboard.
- Filter Dashboard existing.
- `TaskCenterPanel` styling/logic.
- `EmptyAssignmentCard`.
- `SuccessAppreciationBalloon` behavior.

## L. Validasi

Validasi yang dijalankan:

- `git diff --check`
- `npx.cmd tsc --noEmit`
- `npm run lint` jika script tersedia

Catatan:

- `npm run build` tidak dijalankan karena script build menjalankan `prisma generate && next build`, sedangkan tahap ini melarang `prisma generate`.

