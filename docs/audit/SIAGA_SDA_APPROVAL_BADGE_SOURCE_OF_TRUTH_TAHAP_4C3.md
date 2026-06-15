# SIAGA-SDA Approval Badge Source-of-Truth - Tahap 4C.3

## 1. Ringkasan

Tanggal audit dan perubahan: **15 Juni 2026**

Tahap 4C.3 menyelaraskan angka Approval Pending pada Dashboard, Topbar, Sidebar, dan MobileNav dengan Approval Center.

Sebelum perubahan, Approval Center membaca tabel Approval formal, sedangkan empat area badge menghitung turunan data project berupa laporan belum disetujui, RAB pending, dan survey submitted. Perbedaan sumber tersebut menyebabkan PPK melihat 6 record pada Approval Center tetapi badge approval bernilai 0.

Setelah perubahan, seluruh badge approval formal membaca satu summary read-only yang memakai scope dan tabel Approval yang sama dengan Approval Center.

## 2. File yang Dibaca

```text
AGENTS.md
docs/core/*
docs/design/*
docs/audit/*
src/lib/approval-workflow.ts
src/app/api/approval/route.ts
src/app/(dashboard)/approval/page.tsx
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/layout.tsx
src/components/layout/Topbar.tsx
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/lib/dashboard-scope.ts
src/lib/navigation.ts
src/lib/rbac.ts
src/store/useAppStore.ts
```

## 3. Backup

Backup dibuat sebelum source diubah:

```text
backup/backup-approval-badge-source-of-truth-4c3-before-change
```

File yang dibackup:

```text
src/lib/approval-workflow.ts
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/approval/page.tsx
src/components/layout/Topbar.tsx
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
```

## 4. File yang Diubah dan Dibuat

Diubah:

```text
src/lib/approval-workflow.ts
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/approval/page.tsx
src/components/layout/Topbar.tsx
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
```

Dibuat:

```text
src/app/api/approval/summary/route.ts
src/components/approval/ApprovalSummaryProvider.tsx
docs/audit/SIAGA_SDA_APPROVAL_BADGE_SOURCE_OF_TRUTH_TAHAP_4C3.md
```

## 5. Source-of-Truth Sebelum

| Area | Sumber angka |
|---|---|
| Approval Center | Tabel Approval formal melalui `listApprovalsForSession()` |
| Dashboard | Turunan project scoped: laporan, RAB, dan survey |
| Topbar | Turunan project scoped: laporan, RAB, dan survey |
| Sidebar | `getPendingApprovalCount(scopedProjects)` |
| MobileNav | `getPendingApprovalCount(scopedProjects)` |

GET Approval sudah read-only setelah Tahap 4C.2. Helper sinkronisasi tulis tetap terpisah dan tidak dipanggil dari GET.

## 6. Source-of-Truth Sesudah

Semua area approval formal memakai:

```text
GET /api/approval/summary
-> getApprovalSummaryForSession(session)
-> prisma.approval.groupBy(...)
```

Scope summary memakai filter paket yang sama dengan daftar Approval Center:

```text
role luas -> seluruh Approval sesuai permission existing
role terbatas -> paket berdasarkan PPK, PPTK, atau assignments user
```

Status pending formal:

```text
DRAFT
SUBMITTED
REVIEWED
```

Status selesai formal:

```text
APPROVED
FINAL
```

## 7. Helper dan Endpoint Read-only

Helper:

```text
getApprovalSummaryForSession()
```

Endpoint:

```text
GET /api/approval/summary
```

Karakteristik:

- memerlukan session;
- memerlukan permission existing `view_approval`;
- hanya mengembalikan count ringkas;
- memakai assignment scope yang sama dengan Approval Center;
- tidak menjalankan `create`, `update`, `upsert`, atau `delete`;
- tidak memanggil `syncPendingApprovalsForVisiblePakets()`;
- mengembalikan 403 untuk role tanpa `view_approval`.

## 8. Penghindaran Fetch Berulang

`ApprovalSummaryProvider` dipasang sekali pada layout dashboard dan menjadi sumber bersama untuk:

```text
Dashboard
Topbar
Sidebar
MobileNav
Approval Center
```

Provider:

- tidak melakukan fetch untuk role tanpa akses Approval Center;
- refresh setiap 30 detik hanya saat tab visible;
- refresh saat tab kembali visible atau window kembali focus;
- mencegah request summary paralel dengan in-flight guard;
- mempertahankan angka terakhir jika koneksi sementara gagal;
- tidak menampilkan toast Forbidden berulang.

Approval Center meminta refresh summary setelah aksi formal berhasil agar badge segera konsisten.

## 9. Dampak UI

### Dashboard

- KPI dan quick action Approval Pending memakai summary formal.
- Link Approval Pending membuka `/approval?approval_status=pending&source_module=dashboard`.
- Ringkasan tab Approval memakai pending, revisi, dan selesai dari tabel Approval formal.
- Perbandingan approval tahun sebelumnya berbasis turunan project dihapus agar tidak mencampur source-of-truth.

### Topbar

- notifikasi Approval Pending memakai summary formal.
- deskripsi tidak lagi mengklaim rincian laporan/RAB/survey dari sumber project yang berbeda.

### Sidebar dan MobileNav

- badge Approval memakai summary formal yang sama.
- role tanpa akses Approval tidak melihat menu maupun badge formal.

### Approval Center

- card statistik total, pending, revisi, dan selesai memakai summary formal.
- daftar tetap memakai `GET /api/approval` read-only.

## 10. Uji Manual

Uji HTTP lokal terautentikasi dilakukan pada server development.

### PPK

```text
GET /api/approval: 200
GET /api/approval/summary: 200
Pending pada daftar: 6
Pending pada summary: 6
Total summary: 6
Item actionable: 6
```

Pengujian tiga kali dan setelah diam 20 detik:

```text
Daftar total/pending: 6/6
Summary total/pending: 6/6
Angka tidak berubah sendiri.
```

### Tim Perencana

```text
GET /api/approval: 403
GET /api/approval/summary: 403
```

Provider tidak memanggil endpoint summary untuk role tanpa akses berdasarkan `canAccessPage()`. Permission Tim Perencana tidak diperluas.

### Pimpinan

```text
GET /api/approval: 200
GET /api/approval/summary: 200
Pending pada daftar/summary: 6/6
Item actionable: 0
```

Pimpinan tetap read-only.

### Mobile

MobileNav memakai context summary yang sama dengan Sidebar desktop. Review kode memastikan tidak ada elemen visual atau lebar layout yang ditambah. Verifikasi visual browser otomatis tidak dapat dilakukan karena in-app browser tidak tersedia pada sesi ini.

## 11. Hal yang Tidak Disentuh

```text
halaman dan asset login
Auth dan NextAuth
middleware
RBAC dan role
Prisma schema dan migration
database
package dan dependency
shared navigation structure
desain visual besar dashboard
```

## 12. Risiko Tersisa

1. Approval Center membatasi daftar maksimum 200 record, sedangkan summary menghitung seluruh record scoped. Untuk volume di atas 200, count summary tetap benar tetapi daftar memerlukan pagination tahap khusus.
2. Provider refresh setiap 30 detik. Perubahan dari tab/browser lain dapat terlihat pada badge maksimal sekitar 30 detik kemudian.
3. Helper lama `getPendingApprovalCount()` masih tersedia untuk kompatibilitas, tetapi tidak lagi dipakai oleh badge approval formal.
4. Verifikasi visual desktop/mobile perlu dilakukan manual karena browser otomatis tidak tersedia.

## 13. Validasi

```text
npx tsc --noEmit: lulus
git diff --check: lulus
npm run lint: tidak tersedia pada package.json
npm run build: tidak dijalankan sesuai batasan tahap
```

## 14. Rekomendasi

Tahap 4C.3 secara teknis siap dilanjutkan setelah pengecekan visual manual singkat pada Dashboard, Topbar, Sidebar, dan MobileNav.

Sebelum volume Approval formal melebihi 200 record, buat tahap pagination Approval Center agar daftar dan summary tetap mudah diaudit pada data besar.
