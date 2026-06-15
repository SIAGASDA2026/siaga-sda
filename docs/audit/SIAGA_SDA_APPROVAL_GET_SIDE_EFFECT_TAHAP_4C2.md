# SIAGA-SDA Approval GET Side Effect - Tahap 4C.2

## 1. Ringkasan

Tanggal audit dan perubahan: **15 Juni 2026**

Tahap 4C.2 mengaudit Approval Center karena membuka halaman dan polling `GET /api/approval` sebelumnya dapat membuat record approval pending baru secara diam-diam.

Temuan utama:

1. `GET /api/approval` memanggil `listApprovalsForSession()`.
2. `listApprovalsForSession()` sebelumnya memanggil `ensurePendingApprovalsForVisiblePakets()`.
3. Helper tersebut dapat menjalankan `prisma.approval.create()`.
4. Halaman Approval Center melakukan polling GET setiap 5 detik.
5. Dengan dua tab aktif, endpoint GET yang memiliki side effect dapat dipanggil berulang dan bersamaan.

Setelah perubahan, `GET /api/approval` hanya membaca data approval existing. Pembuatan approval pending tidak lagi dijalankan dari GET atau polling.

## 2. File yang Dibaca

```text
AGENTS.md
docs/core/*
docs/design/*
docs/audit/*
docs/modules/SIAGA_SDA_APPROVAL_CENTER_UI.md
docs/auth/SIAGA_SDA_PERMISSION_SYSTEM.md
src/app/api/approval/route.ts
src/app/api/approval/[id]/action/route.ts
src/lib/approval-workflow.ts
src/app/(dashboard)/approval/page.tsx
src/app/(dashboard)/dashboard/page.tsx
src/components/layout/Topbar.tsx
src/components/layout/Sidebar.tsx
src/components/layout/MobileNav.tsx
src/lib/dashboard-scope.ts
src/lib/rbac.ts
src/lib/roles.ts
src/store/useAppStore.ts
```

## 3. Backup

Backup dibuat sebelum source diubah:

```text
backup/backup-approval-get-side-effect-4c2-before-change
```

File yang dibackup:

```text
src/app/api/approval/route.ts
src/lib/approval-workflow.ts
src/app/(dashboard)/approval/page.tsx
```

## 4. File yang Diubah

```text
src/lib/approval-workflow.ts
src/app/(dashboard)/approval/page.tsx
docs/audit/SIAGA_SDA_APPROVAL_GET_SIDE_EFFECT_TAHAP_4C2.md
```

`src/app/api/approval/route.ts` dibackup dan diaudit, tetapi tidak perlu diubah. Route tersebut menjadi read-only setelah `listApprovalsForSession()` dipisahkan dari operasi sinkronisasi tulis.

## 5. Temuan Endpoint GET Approval

### Sebelum

Alur request:

```text
GET /api/approval
-> listApprovalsForSession(session)
-> ensurePendingApprovalsForVisiblePakets(session)
-> ensureApproval(...)
-> prisma.approval.create(...)
-> prisma.approval.findMany(...)
```

GET dapat membuat record approval dan histori submit baru. Perilaku ini bertentangan dengan prinsip request GET yang seharusnya aman dan read-only.

### Sesudah

Alur request:

```text
GET /api/approval
-> listApprovalsForSession(session)
-> prisma.approval.findMany(...)
```

`listApprovalsForSession()` sekarang hanya menjalankan query baca.

Helper tulis tetap dipertahankan dan diganti nama menjadi:

```text
syncPendingApprovalsForVisiblePakets()
```

Helper diberi komentar tegas bahwa helper tersebut:

- merupakan operasi tulis;
- tidak boleh dipanggil dari GET atau polling;
- hanya boleh dipakai oleh endpoint mutasi eksplisit.

Pada tahap ini belum dibuat endpoint sync baru agar tidak memperluas workflow approval tanpa desain dan audit khusus.

## 6. Temuan Polling Approval Center

### Sebelum

- polling berjalan setiap 5 detik;
- polling berjalan tanpa guard visibility;
- setiap polling memanggil GET yang dapat menulis database;
- dua tab dapat memanggil proses tulis yang sama berulang dan berpotensi race/duplikasi.

### Sesudah

- polling tetap dipertahankan sebagai refresh baca;
- interval diperlambat menjadi 15 detik;
- polling hanya berjalan jika tab browser berstatus `visible`;
- GET yang dipanggil polling sudah read-only;
- jika endpoint mengembalikan 403, polling dihentikan untuk sesi halaman tersebut.

Polling sekarang tidak dapat membuat approval baru.

## 7. Temuan Approval Workflow

Fungsi read-only:

```text
listApprovalsForSession()
```

Fungsi tulis pembentukan approval:

```text
syncPendingApprovalsForVisiblePakets()
ensureApproval()
```

Fungsi aksi tulis formal:

```text
applyApprovalAction()
applyLegacyStatusUpdate()
```

`applyApprovalAction()` tetap hanya dipanggil dari endpoint POST:

```text
POST /api/approval/[id]/action
```

Operasi approve, reject, request revision, histori approval, update data asal, dan audit log tidak dipindahkan ke GET.

## 8. Tombol Aksi dan `canAct`

Sebelumnya backend mengirim:

```text
canAct = role bukan pimpinan dan bukan auditor
```

Kondisi tersebut terlalu luas karena role lain yang tidak memiliki permission approve/reject/revision tetap dapat melihat tombol formal dan baru ditolak backend setelah klik.

Sekarang backend menghitung kemampuan per item:

```text
canApprove
canReject
canRequestRevision
canAct
```

`canApprove` mengikuti tipe entity:

- RAB memakai `approve_rab`;
- Survey memakai `approve_survey`;
- laporan dan entity lain memakai `approve_laporan`.

`canReject` mengikuti `reject_item`.

`canRequestRevision` mengikuti `request_revision`.

Frontend hanya menampilkan tombol formal yang memang diizinkan backend untuk item tersebut. Backend tetap menjadi guard final.

## 9. Kasus Multi-tab Tim Perencana dan Toast Forbidden

Role frontend aktual untuk Tim Perencana Rutin adalah:

```text
tim_perencanaan
```

Role tersebut saat ini:

- dapat melihat/input survey;
- dapat melihat/upload RAB;
- tidak memiliki `view_approval`;
- tidak memiliki permission approval formal.

Request yang menghasilkan toast merah adalah:

```text
GET /api/approval
```

Endpoint mengembalikan:

```text
403 Forbidden
```

Karena pemeriksaan `view_approval` terjadi sebelum `listApprovalsForSession()`, tab Tim Perencana tidak menjalankan operasi tulis approval. Masalahnya adalah frontend sebelumnya terus polling dan menampilkan toast `Forbidden` berulang.

Perubahan:

- 403 tidak lagi ditampilkan sebagai toast berulang;
- halaman menampilkan pesan `Akses Dibatasi`;
- polling dihentikan setelah 403;
- Tim Perencana tidak diberi permission baru atau permission luas;
- tombol Setujui, Minta Revisi, dan Tolak tidak tampil untuk role tanpa kemampuan aksi formal.

## 10. Dampak Dashboard, Topbar, Sidebar, dan MobileNav

Dashboard, Topbar, Sidebar, dan MobileNav tidak memanggil `/api/approval` dan tidak memicu sinkronisasi approval.

Agregat/badge approval pada area tersebut dihitung dari project scoped existing:

```text
laporan belum disetujui
RAB pending
survey submitted
```

Area tersebut tetap read-only dan tidak diubah pada Tahap 4C.2.

Catatan risiko: angka agregat project scoped dapat berbeda dari jumlah record tabel Approval Center sampai pembuatan record approval dipindahkan ke aksi submit sumber yang eksplisit.

## 11. Uji Manual

Uji HTTP lokal terautentikasi dilakukan menggunakan session NextAuth aplikasi.

Hasil Tim Perencana:

```text
Role: tim_perencanaan
GET /api/approval tiga kali: 403, 403, 403
Dua session/tab role sama: 403, 403
```

Hasil tersebut sesuai RBAC existing. Pemeriksaan permission berhenti sebelum query workflow approval, sehingga dua tab Tim Perencana tidak menjalankan operasi tulis.

Hasil PPK:

```text
GET /api/approval tiga kali: 200, 200, 200
Jumlah approval: 6, 6, 6
Jumlah sebelum diam 20 detik: 6
Jumlah setelah diam 20 detik: 6
```

Semua enam item PPK yang ditemukan bertipe Survey dan memiliki capability:

```text
canApprove: true
canRequestRevision: true
canReject: true
```

Uji source dan typecheck juga memverifikasi:

- tidak ada pemanggil `syncPendingApprovalsForVisiblePakets()`;
- GET hanya memanggil `listApprovalsForSession()`;
- operasi create approval hanya berada di helper tulis yang tidak dipanggil GET;
- frontend berhenti polling setelah 403 dan tidak menampilkan toast `Forbidden` berulang.

Temuan konsistensi badge:

```text
Jumlah record Approval Center PPK: 6
Badge pending berbasis project scoped/bootstrap: 0
```

Mismatch tersebut sudah ada karena badge membaca status turunan project, sedangkan Approval Center membaca tabel approval formal. Perbaikan mismatch ditunda karena memerlukan penyelarasan source-of-truth lintas Dashboard, Topbar, Sidebar, dan MobileNav.

Uji visual dua tab melalui browser masih perlu dilakukan manual untuk memastikan pesan `Akses Dibatasi` dan tidak adanya tombol formal tampil sesuai harapan.

## 12. Hal yang Tidak Disentuh

```text
Login dan asset login
Auth / NextAuth
Middleware
RBAC dan daftar role
Prisma schema dan migration
Database dan data approval existing
package.json dan dependency
Route root dan /login
Dashboard, Topbar, Sidebar, MobileNav
Desain visual besar Approval Center
```

## 13. Risiko Tersisa

1. Helper sinkronisasi tulis belum memiliki endpoint POST eksplisit.
2. Approval pending baru tidak lagi dibentuk otomatis saat membuka Approval Center. Integrasi yang benar sebaiknya dilakukan ketika data asal diajukan/submitted.
3. `ensureApproval()` memakai pola cari-lalu-buat. Jika kelak dipanggil bersamaan tanpa unique constraint/idempotency key, masih ada risiko duplikasi.
4. Badge project scoped dan jumlah record Approval Center dapat berbeda sampai lifecycle submit-to-approval diselaraskan.
5. Uji HTTP multi-session berhasil, tetapi uji visual dua tab browser masih perlu dilakukan manual.
6. Badge project scoped bernilai `0` sementara tabel Approval Center PPK berisi `6` record.

## 14. Rekomendasi

Belum disarankan langsung lanjut ke visual Tahap 4D sebelum uji manual multi-tab dan refresh selesai.

Rekomendasi tahap kecil berikutnya:

1. mapping aksi submit pada Laporan, RAB, dan Survey;
2. bentuk approval pada aksi POST/PATCH submit sumber, bukan tombol sync generik;
3. tambahkan idempotency/unique business key untuk approval entity;
4. selaraskan badge project scoped dengan record Approval Center.

## 15. Hasil Validasi

```text
npx tsc --noEmit: lulus
git diff --check: lulus, hanya peringatan normalisasi LF ke CRLF
npm run lint: script tidak tersedia
npm run build: tidak dijalankan karena tidak diwajibkan dan environment dev sedang berat
```
