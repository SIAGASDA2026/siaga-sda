# SIAGA-SDA Dashboard Data Consistency - Tahap 4C.1

## 1. Ringkasan

Tanggal audit dan perubahan: **15 Juni 2026**

Tahap 4C.1 mengaudit penyebab data pada Dashboard, Paket Pekerjaan, Survey Investigasi, dan Approval Center terlihat berubah setelah halaman di-refresh.

Penyebab utama yang ditemukan bukan data demo yang dibuat acak, melainkan urutan bootstrap aplikasi:

1. Zustand tidak dipersistenkan dan selalu dimulai dengan `DUMMY_PROJECTS`, `DUMMY_USERS`, serta `DUMMY_AUDIT_LOGS`.
2. Layout dashboard sebelumnya langsung menandai aplikasi siap ditampilkan sebelum `/api/bootstrap` selesai.
3. Bootstrap awal baru dijalankan setelah jeda 1,2 detik.
4. Akibatnya, hard refresh sempat menampilkan data demo/fallback lalu menggantinya dengan data database.
5. Hasil gabungan Paket baru dan Proyek legacy dari bootstrap belum diurutkan kembali dengan comparator global yang stabil.

Perbaikan dibuat kecil dan tidak mengubah database, Prisma, Auth, RBAC, login, data demo, atau desain besar.

## 2. File yang Dibaca

```text
AGENTS.md
docs/core/*
docs/design/*
docs/audit/*
src/store/useAppStore.ts
src/lib/data.ts
src/lib/dashboard-scope.ts
src/lib/db-mappers.ts
src/lib/reporting.ts
src/lib/approval-workflow.ts
src/app/api/bootstrap/route.ts
src/app/api/sync-version/route.ts
src/app/api/approval/route.ts
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/proyek/page.tsx
src/app/(dashboard)/survey/page.tsx
src/app/(dashboard)/approval/page.tsx
src/components/dashboard/*
```

## 3. Backup

Backup dibuat sebelum perubahan di:

```text
backup/backup-dashboard-data-consistency-4c1-before-change
```

File yang dibackup:

```text
src/app/(dashboard)/layout.tsx
src/app/api/bootstrap/route.ts
```

## 4. File yang Diubah

```text
src/app/(dashboard)/layout.tsx
src/app/api/bootstrap/route.ts
docs/audit/SIAGA_SDA_DASHBOARD_DATA_CONSISTENCY_TAHAP_4C1.md
```

File store, data dummy, Dashboard, Paket, Survey, Approval, login, Auth, RBAC, Prisma, dan database tidak diubah pada tahap ini.

## 5. Temuan Data Random dan Dinamis

### `Math.random`

Tidak ditemukan pada pembentukan awal `DUMMY_PROJECTS`, `DUMMY_USERS`, atau `DUMMY_AUDIT_LOGS`.

Penggunaan yang ditemukan:

- pembuatan ID lokal untuk aksi/input baru;
- fallback GPS simulasi saat user secara eksplisit meminta lokasi tetapi GPS gagal.

Penggunaan tersebut tidak membuat data demo awal berubah saat refresh.

### `Date.now`

Digunakan untuk ID lokal ketika membuat aksi/input baru. Tidak digunakan untuk membentuk ulang data demo awal saat refresh.

### `new Date`

Mayoritas digunakan untuk:

- format tanggal;
- filter tahun;
- sorting tanggal;
- waktu realtime panel pasang surut/waktu salat;
- timestamp aksi database.

Penggunaan realtime pada panel simulasi/utilitas bukan sumber perubahan proyek demo/database.

### `randomUUID`, `faker`, dan `shuffle`

Tidak ditemukan sebagai sumber data dashboard awal.

### Sort Tidak Stabil

Query Prisma utama telah memiliki `orderBy`, tetapi `/api/bootstrap` sebelumnya menggabungkan dua array yang sudah terurut secara terpisah:

```text
pakets + legacy projects
```

Array gabungan tersebut belum diurutkan kembali. Tahap ini menambahkan urutan global deterministik berdasarkan:

1. `updatedAt` terbaru;
2. `id` sebagai tie-breaker.

Beberapa daftar turunan masih hanya mengurutkan berdasarkan tanggal tanpa tie-breaker ID. Risiko ini dicatat untuk tahap lanjutan dan tidak diperluas pada perubahan sempit 4C.1.

## 6. Status Data Demo dan Fallback

Data demo di `src/lib/data.ts` bersifat statis:

- ID tetap;
- tanggal tetap;
- progres/status tetap;
- tidak memakai random untuk bootstrap awal.

Data demo tidak dicampur dengan database oleh `hydrateFromDatabase()`. Ketika bootstrap berhasil, store mengganti seluruh users/projects/audit logs dengan data database dan mengubah `dashboardDataSource` menjadi `database`.

Perubahan tahap ini:

- konten tab tidak dirender selama percobaan bootstrap database pertama;
- jika bootstrap gagal, fallback demo tetap tersedia;
- fallback demo diberi peringatan global bahwa angka bukan data resmi.

## 7. Status Bootstrap dan Store

### Sebelum

```text
Session authenticated
-> store masih berisi demo
-> layout langsung ditampilkan
-> tunggu 1,2 detik
-> fetch /api/bootstrap
-> data berubah menjadi database
```

### Sesudah

```text
Session authenticated
-> tampilkan state "Memuat data database..."
-> fetch /api/bootstrap langsung
-> jika berhasil, render data database
-> jika gagal, render fallback demo dengan label jelas
```

Guard `initialBootstrapCompleteRef` memastikan loading hanya menahan bootstrap awal. Sinkronisasi berikutnya tetap berjalan di belakang dan tidak membuat halaman berkedip setiap sesi diperbarui.

Endpoint `/api/sync-version` menggunakan versi dari ID/timestamp/count database dan tidak memakai waktu sekarang, sehingga tidak memicu hydrate ulang tanpa perubahan data nyata.

## 8. Status Assignment Scope dan Query Filter

Helper assignment scope `src/lib/dashboard-scope.ts` tidak memakai random dan tetap dipertahankan.

Query filter Dashboard ke Paket, Survey, dan Approval juga tetap dipertahankan. Filter aktif dapat membuat daftar terlihat berbeda sesuai URL, tetapi halaman tujuan telah menampilkan chip filter aktif dan menyediakan reset filter. Kondisi tersebut bukan perubahan acak data source.

## 9. Catatan Approval Center

Approval Center melakukan polling setiap 5 detik dan endpoint GET memastikan approval pending untuk data yang memang belum memiliki record approval. Karena itu, jumlah approval dapat berubah secara sah ketika workflow database menghasilkan record baru.

Perilaku tersebut tidak diubah pada Tahap 4C.1 karena merupakan workflow aplikasi dan bukan random/fallback refresh. Audit lanjutan disarankan untuk mengevaluasi side effect pada GET secara terpisah.

## 10. Uji Refresh

Server lokal terdeteksi aktif. Request tanpa sesi ke `/dashboard` mengembalikan redirect `307` ke `/login`, sesuai guard aplikasi.

Uji refresh terautentikasi melalui browser tidak dapat dilakukan pada sesi ini karena browser otomatis tidak tersedia. Verifikasi kode menunjukkan:

- Dashboard: tidak lagi menampilkan demo sebelum bootstrap database selesai;
- Paket Pekerjaan: menerima project array hasil bootstrap yang terurut stabil;
- Survey Investigasi: memakai project array yang sama dan assignment scope existing;
- Approval Center: tetap memakai API scoped dan polling workflow existing.

## 11. Hal yang Tidak Disentuh

```text
Halaman dan asset login
Auth / NextAuth
Middleware
RBAC dan role
Prisma schema dan migration
Database
package.json dan dependency
Data dummy/demo
Route root dan /login
Desain visual besar
Dashboard scope dan clickable navigation Tahap 4C
```

## 12. Risiko Tersisa

1. Bila bootstrap database gagal, aplikasi tetap memakai demo/fallback. Kondisi sekarang sudah diberi label global, tetapi alasan teknis kegagalan belum ditampilkan ke user.
2. Beberapa daftar turunan mengurutkan tanggal tanpa tie-breaker ID.
3. Approval Center melakukan polling setiap 5 detik dan GET dapat membuat approval pending yang belum ada. Perubahan jumlah dari proses ini adalah perubahan database sah, tetapi dapat terasa seperti data berubah.
4. Audit log bootstrap masih diambil secara global sesuai implementasi existing. Risiko assignment scope ini bukan bagian perubahan 4C.1.
5. Uji refresh terautentikasi masih perlu dilakukan manual.

## 13. Rekomendasi

Tahap 4D baru layak dilanjutkan setelah uji manual terautentikasi memastikan Dashboard, Paket, Survey, dan Approval tidak lagi mengalami transisi demo-ke-database saat hard refresh.

Sebelum redesign besar, disarankan tahap kecil terpisah untuk:

1. audit side effect GET Approval Center;
2. menambahkan tie-breaker ID pada daftar turunan yang penting;
3. memastikan audit log mengikuti assignment scope;
4. menambahkan observability bootstrap tanpa membuka detail sensitif ke UI.

## 14. Hasil Validasi

```text
npx tsc --noEmit: lulus
git diff --check: lulus, hanya menampilkan peringatan normalisasi LF ke CRLF
npm run lint: script tidak tersedia
npm run build: tidak dijalankan
```
