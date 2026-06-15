# SIAGA-SDA Dashboard Scope dan Navigation - Tahap 4C

## 1. Ringkasan Tujuan

Tahap 4C memperbaiki fondasi teknis dashboard sebelum implementasi visual Command Center.

Fokus perubahan:

1. menyamakan assignment scope Dashboard, Topbar, Sidebar, dan MobileNav;
2. mencegah notifikasi, badge, kode paket, dan audit log memakai data global tanpa guard;
3. memperbaiki tujuan klik card/KPI dashboard;
4. menambahkan pembacaan query auto-filter secara bertahap pada Paket Pekerjaan, Survey Investigasi, dan Approval Center;
5. merapikan Quick Action role-aware secara konservatif;
6. membedakan data simulasi dan insight lokal dari data resmi.

Tahap ini tidak melakukan redesign visual besar dan tidak mengubah login, Auth, RBAC, Prisma, database, route utama, atau dependency.

## 2. Audit Awal Sebelum Edit

### Dashboard

Dashboard sebelumnya membentuk `scopedProjects` sendiri:

- role luas mengikuti `canViewAllProjects()`;
- role terbatas memakai `currentUser.projectIds` dan `project.assignedUsers`;
- agregat dashboard memakai hasil scoped tersebut.

### Topbar

Topbar sebelumnya menghitung seluruh notifikasi dari array `projects` global:

- masalah open/kritis;
- laporan/RAB/survey menunggu;
- paket kritis/warning;
- kontrak mendekati selesai;
- chat;
- lima audit log terbaru.

Kondisi tersebut berisiko menampilkan jumlah, kode paket, dan aktivitas di luar assignment user terbatas.

### Sidebar dan MobileNav

Sidebar dan MobileNav sudah mencoba menerapkan assignment scope, tetapi:

- hanya `super_admin` dan `admin` yang dianggap role luas;
- scope terbatas memakai `assignedUsers`, `ppk`, dan `pptk`;
- logikanya tidak sama dengan Dashboard;
- hitungan RAB pending belum mengecualikan status `rejected`.

### Helper Scope

Belum ada helper kecil bersama untuk kebutuhan Dashboard, Topbar, Sidebar, dan MobileNav.

### Clickable Navigation

Temuan awal:

- Survey Belum Ditindaklanjuti menuju `/proyek`;
- Surat menuju `/pengumuman`;
- Peil dan Asset menuju `/peta`;
- Operasional menuju `/chat`;
- Paket Kritis dan Approval Pending mengirim query yang belum dibaca halaman tujuan.

### Auto-filter

Sebelum Tahap 4C:

- `/proyek` belum membaca query awal;
- `/survey` belum membaca query awal;
- `/approval` belum membaca query awal;
- filter manual existing sudah tersedia tetapi tidak terhubung ke link dashboard.

## 3. File yang Dibaca

Dokumen:

```text
AGENTS.md
docs/core/*
docs/design/*
docs/audit/*
docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md
docs/audit/SIAGA_SDA_DASHBOARD_VISUAL_AUDIT_TAHAP_4A.md
docs/design/SIAGA_SDA_DASHBOARD_COMMAND_CENTER_TAHAP_4B.md
```

Source:

```text
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/layout.tsx
src/components/layout/Topbar.tsx
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/components/dashboard/*
src/lib/navigation.ts
src/lib/rbac.ts
src/lib/roles.ts
src/lib/reporting.ts
src/store/useAppStore.ts
src/app/(dashboard)/proyek/page.tsx
src/app/(dashboard)/survey/page.tsx
src/app/(dashboard)/approval/page.tsx
src/app/(dashboard)/surat/page.tsx
src/app/(dashboard)/peil/page.tsx
src/app/(dashboard)/asset/page.tsx
```

## 4. Backup

Backup dibuat sebelum source code diubah:

```text
backup/backup-dashboard-scope-navigation-4c-before-change
```

File yang dibackup:

```text
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/proyek/page.tsx
src/app/(dashboard)/survey/page.tsx
src/app/(dashboard)/approval/page.tsx
src/components/layout/Topbar.tsx
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
```

## 5. File yang Diubah dan Dibuat

File source yang diubah:

```text
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/proyek/page.tsx
src/app/(dashboard)/survey/page.tsx
src/app/(dashboard)/approval/page.tsx
src/components/layout/Topbar.tsx
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
```

File baru:

```text
src/lib/dashboard-scope.ts
docs/audit/SIAGA_SDA_DASHBOARD_SCOPE_NAVIGATION_TAHAP_4C.md
```

## 6. Helper Assignment Scope

Helper baru berada di:

```text
src/lib/dashboard-scope.ts
```

Helper:

- `getScopedProjects()`
- `getScopedAuditLogs()`
- `getPendingApprovalCount()`

Aturan `getScopedProjects()`:

- tanpa current user mengembalikan array kosong secara konservatif;
- role luas mengikuti `canViewAllProjects()` existing;
- role terbatas menggunakan:
  - `currentUser.projectIds`;
  - `project.assignedUsers`;
  - `project.ppk`;
  - `project.pptk`.

Helper tidak mengubah definisi role/RBAC dan tidak mengubah database.

## 7. Perubahan Scope Topbar

Topbar sekarang:

- menghitung masalah, approval, laporan, RAB, survey, chat, kontrak, dan paket kritis dari `scopedProjects`;
- hanya menampilkan kategori notifikasi jika role memiliki permission existing;
- tidak menampilkan kode paket di luar scope;
- mengubah label `peringatan AI` menjadi `peringatan deviasi`;
- memberi label `Insight Lokal` pada notifikasi rule-based;
- menampilkan audit log terbaru hanya untuk role yang memiliki `view_audit_log`;
- audit log role terbatas disaring berdasarkan user sendiri atau project scoped.

Pengumuman tetap bersifat umum karena permission existing `view_announcements` berlaku luas.

## 8. Perubahan Badge Sidebar dan MobileNav

Sidebar dan MobileNav sekarang memakai helper yang sama:

```text
getScopedProjects()
getPendingApprovalCount()
```

Hasil:

- badge Approval memakai assignment scope yang sama dengan Dashboard;
- role luas mengikuti `canViewAllProjects()` existing;
- role terbatas hanya menghitung project yang ditugaskan;
- RAB rejected tidak lagi dihitung sebagai pending;
- struktur menu dan visual navigasi tidak diubah.

## 9. Perubahan Clickable Navigation Dashboard

| Area | Sebelum | Sesudah |
|---|---|---|
| Survey Belum Ditindaklanjuti | `/proyek` | `/survey?status=belum-ditindaklanjuti&source_module=dashboard` |
| Paket Kritis | Query tidak dibaca tujuan | `/proyek?...&health=kritis&source_module=dashboard` |
| Approval Pending | `status=pending` | `/approval?...&approval_status=pending&source_module=dashboard` |
| Surat | `/pengumuman` | `/surat` |
| Peil Banjir | `/peta` | `/peil` |
| Asset SDA | `/peta` | `/asset` |
| Operasional | `/chat` | `/asset?subtab=operasional&source_module=dashboard` dengan label belum final |
| Masalah Open | `/proyek` | `/masalah?status=open&source_module=dashboard` |

Card KPI, command brief, alert, dan quick action difilter secara konservatif menggunakan permission route existing.

Route baru tidak dibuat.

## 10. Perubahan Auto-filter Query

### `/proyek`

Query yang sekarang dibaca:

```text
tahun
status
health
deviasi_status
jenis_paket
sub_jenis_paket
metode_pengadaan
sub_kegiatan_id
masalah
source_module
```

Perilaku:

- query menjadi filter awal;
- perubahan query pada route yang sama ikut menyinkronkan filter;
- filter aktif tampil sebagai chip existing;
- Reset Filter existing tetap digunakan;
- daftar project sekarang terlebih dahulu memakai assignment scope.

Catatan:

- `status=aktif` dipetakan ke seluruh status selain `selesai`;
- `masalah=open` memfilter paket yang memiliki masalah open;
- nilai `sub_kegiatan_id` saat ini mengikuti nilai sub kegiatan yang tersedia pada frontend, sehingga mapping ID database masih perlu audit lanjutan.

### `/survey`

Query yang sekarang dibaca:

```text
tahun
status
kategori_masalah
survey_id
sub_kegiatan_id
source_module
```

Perilaku:

- `status=belum-ditindaklanjuti` dipetakan secara konservatif ke status `submitted`, mengikuti perhitungan dashboard existing;
- `kategori_masalah` menjadi pencarian pada kondisi/permasalahan/rekomendasi;
- `survey_id` membatasi hasil ke survey terkait;
- filter aktif dan Reset Filter ditampilkan;
- project sumber survey sekarang terlebih dahulu memakai assignment scope.

Risiko:

- model status survey existing belum memiliki status eksplisit `belum-ditindaklanjuti`; mapping `submitted` perlu dikonfirmasi pada tahap workflow.

### `/approval`

Query yang sekarang dibaca:

```text
tahun
approval_status
status
approver_role
entity_type
approval_id
source_module
```

Perilaku:

- `approval_status=pending` memfilter seluruh status yang dianggap pending oleh helper existing;
- `approval_id` membuka detail item setelah data dimuat;
- filter tahun, entity type, dan approver role didukung;
- filter aktif dan Reset Filter ditampilkan;
- API Approval existing tetap menjadi sumber scope dan `canAct`.

## 11. Role-Aware dan Quick Action

Perubahan konservatif:

- Quick Action difilter kembali menggunakan permission route existing;
- Pimpinan tetap hanya menerima shortcut baca;
- Auditor mendapat shortcut baca Audit Log, Dokumen, Paket Kritis, dan Serapan Anggaran;
- Admin Sub Kegiatan mendapat shortcut paket/administrasi/dokumen/approval sesuai permission;
- Direksi Teknis dan Konsultan Pengawas mendapat shortcut pengawasan sesuai scope;
- Konsultan Perencana dan Tim Perencanaan mendapat shortcut survey/RAB/dokumen/paket;
- Kontraktor mendapat shortcut paket sendiri, masalah, dokumen, dan chat;
- PPHP mendapat shortcut pemeriksaan/approval/dokumen/masalah;
- Pejabat Pengadaan mendapat shortcut paket/RAB/kontrak/dokumen.

Role final yang belum tersedia tidak ditambahkan atau dipaksakan.

## 12. Data Demo, Simulasi, dan Insight Lokal

- warning data demo existing tetap dipertahankan;
- panel Pasang Surut dashboard diberi badge `Data Simulasi`;
- alert Pasang Surut diberi label `(Simulasi)`;
- tab `AI Analisis` diubah label visualnya menjadi `Insight Lokal`;
- panel Insight Lokal menjelaskan bahwa hasilnya rule-based dan bukan rekomendasi resmi;
- tidak ada data demo/simulasi yang diubah menjadi data resmi.

## 13. Hal yang Tidak Disentuh

```text
halaman dan komponen login
asset login
Auth / NextAuth
middleware
src/lib/rbac.ts
src/lib/roles.ts
Prisma schema dan migration
database
package.json dan package-lock.json
dependency
route root /
route /login
shared navigation config
data production
file environment
desain visual Command Center besar
```

## 14. Risiko Tersisa

1. Permission Surat, Peil, Asset, dan Operasional masih memakai permission existing yang luas.
2. `/masalah`, `/surat`, `/peil`, `/asset`, dan `/serapan-anggaran` belum menerima auto-filter lengkap pada Tahap 4C.
3. Operasional belum mempunyai route/sub-tab final; link konservatif diarahkan ke Asset SDA dengan penanda belum final.
4. Status Survey `belum-ditindaklanjuti` masih dipetakan ke `submitted`.
5. `sub_kegiatan_id` frontend belum dibuktikan selalu menggunakan ID database.
6. Pengumuman Topbar masih umum sesuai permission existing.
7. Audit log hanya dapat dibuktikan scoped jika `entityId` langsung merujuk project; relasi entity turunan belum sepenuhnya tersedia.
8. Query filter didukung sebagai initial/synchronized UI filter, tetapi belum seluruhnya ditulis kembali ke URL saat user mengubah filter manual.
9. Uji visual dan interaksi per role masih diperlukan karena server memerlukan sesi autentikasi.

## 15. Validasi

```text
npx tsc --noEmit: lulus
git diff --check: lulus
npm run lint: tidak tersedia (Missing script: lint)
npm run build: tidak dijalankan sesuai batasan tahap
```

## 16. Rekomendasi Tahap Berikutnya

Fondasi utama Tahap 4C sudah cukup untuk melanjutkan ke Tahap 4D implementasi visual Command Center secara bertahap, dengan syarat:

1. lakukan uji manual multi-role terhadap Topbar, badge, dan query filter;
2. jangan menganggap Operasional dan data simulasi sebagai modul/data resmi;
3. pertahankan helper scope bersama;
4. jangan memperluas permission Surat/Peil/Asset saat redesign;
5. perbaikan auto-filter modul tambahan dilakukan bertahap, bukan sekaligus.

Jika uji multi-role menemukan ketidaksesuaian assignment, lakukan revisi 4C terlebih dahulu sebelum implementasi visual.
