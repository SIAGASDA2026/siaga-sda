# SIAGA-SDA PB-RBAC.3 - Audit Rencana Prisma Role Peil Banjir

Tanggal audit: 2026-06-19  
Waktu audit: 01:22 WIB  
Commit acuan: `04bb603 fix: rapikan akses peil dan surat untuk role lama`  
Project: SIAGA-SDA

## 1. Ringkasan Tujuan

Tahap PB-RBAC.3 mengaudit kesiapan teknis sebelum role Peil Banjir dimasukkan ke Prisma/database.

Role yang direncanakan:

- `admin_peil_banjir` dengan label UI `Admin Peil Banjir`
- `tim_teknis_peil_banjir` dengan label UI `Tim Teknis Peil Banjir`

Tahap ini hanya audit dan dokumen. Tidak ada perubahan runtime, Prisma schema, migration, seed, database, Auth, middleware, endpoint, atau package.

## 2. Status Acuan Terakhir

- PB-RBAC.1 sudah menyiapkan role Peil di frontend runtime secara terbatas.
- PB-RBAC.2 sudah merapikan akses `/peil` dan `/surat` untuk role lama yang masih relevan.
- Role Peil Banjir sudah dikenal di TypeScript/frontend helper, tetapi belum dikenal oleh Prisma enum `Role`.
- Manajemen Pengguna masih memblokir penyimpanan role Peil karena Prisma/database belum dimigrasikan.
- Login final tetap locked.
- Modal Dashboard 4D.2 tetap final dan tidak disentuh.

## 3. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/core/SIAGA_SDA_PEIL_BANJIR_FINAL_CONCEPT.md`
- `docs/modules/SIAGA_SDA_PEIL_UI.md`
- `docs/audit/SIAGA_SDA_PB_DOC_1_FINALISASI_KONSEP_PEIL_BANJIR.md`
- `docs/audit/SIAGA_SDA_PB_RBAC_1_AUDIT_ROLE_RUNTIME_PEIL_BANJIR.md`
- `docs/audit/SIAGA_SDA_PB_RBAC_2_AUDIT_AKSES_MENU_PEIL_SURAT.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/types/index.ts`
- `src/lib/roles.ts`
- `src/lib/rbac.ts`
- `src/lib/navigation.ts`
- `src/lib/utils.ts`
- `src/lib/workflow-mapping.ts`
- `src/lib/project-db.ts`
- `src/lib/db-mappers.ts`
- `src/lib/auth.ts`
- `src/app/api/users/route.ts`
- `src/app/api/users/[id]/route.ts`
- `src/app/(dashboard)/pengguna/page.tsx`
- `src/components/dashboard/DashboardRoleHeader.tsx`
- `src/components/ai/ProjectAiAssistant.tsx`

## 4. Backup

Backup source tidak dibuat pada PB-RBAC.3 karena tahap ini hanya membuat dokumen audit baru dan tidak mengubah source runtime.

File target baru:

```text
docs/audit/SIAGA_SDA_PB_RBAC_3_AUDIT_RENCANA_PRISMA_ROLE_PEIL.md
```

## 5. Status Prisma Enum Saat Ini

`prisma/schema.prisma` memiliki enum:

```prisma
enum Role {
  SUPER_ADMIN
  ADMIN
  PEJABAT_PENGADAAN
  PPHP
  ADMINISTRASI_KONTRAK
  KEPALA_DINAS
  PIMPINAN
  PPK
  PPTK
  KABID
  DIREKSI_TEKNIS
  KONSULTAN_PERENCANA
  KONSULTAN_PENGAWAS
  TIM_PERENCANA
  TIM_SURVEYOR
  TIM_PENGAWAS
  KONTRAKTOR
  AUDITOR
}
```

Belum ada:

```prisma
ADMIN_PEIL_BANJIR
TIM_TEKNIS_PEIL_BANJIR
```

Dampak langsung:

- `User.role` belum bisa menyimpan role Peil Banjir.
- `PaketAssignment.rolePaket` juga memakai enum `Role`, sehingga penambahan enum akan membuat role Peil tersedia untuk assignment paket juga.
- Jika role Peil ditambahkan ke enum, guard aplikasi perlu memastikan role Peil tidak otomatis dipakai sebagai role paket jika belum menjadi kebutuhan resmi.

## 6. Status Mapper UI ke Prisma

`src/lib/project-db.ts` memiliki fungsi `toRole(value)`.

Saat ini mapping role frontend ke Prisma enum belum memiliki:

- `admin_peil_banjir -> Role.ADMIN_PEIL_BANJIR`
- `tim_teknis_peil_banjir -> Role.TIM_TEKNIS_PEIL_BANJIR`

Risiko penting:

- Jika API menerima role Peil sebelum mapper diperbarui, fallback saat ini dapat mengarah ke `Role.KONTRAKTOR`.
- UI Manajemen Pengguna sudah memblokir role Peil, tetapi API tetap perlu guard eksplisit pada tahap migrasi agar tidak bergantung pada UI saja.

Rekomendasi setelah migration disetujui:

```ts
admin_peil_banjir: Role.ADMIN_PEIL_BANJIR
tim_teknis_peil_banjir: Role.TIM_TEKNIS_PEIL_BANJIR
```

## 7. Status Mapper Prisma ke UI

`src/lib/db-mappers.ts` memiliki fungsi `mapDbRole(role)`.

Saat ini mapping Prisma enum ke role frontend belum memiliki:

- `ADMIN_PEIL_BANJIR -> admin_peil_banjir`
- `TIM_TEKNIS_PEIL_BANJIR -> tim_teknis_peil_banjir`

Risiko penting:

- `mapDbRole()` dipakai oleh auth/session.
- Jika database sudah berisi role Peil tetapi mapper belum diperbarui, role user dapat jatuh ke fallback `pptk`.
- Fallback role yang salah bisa membuat akses `/peil`, `/surat`, Dashboard, dan menu lain menjadi keliru.

Rekomendasi setelah migration disetujui:

```ts
ADMIN_PEIL_BANJIR: 'admin_peil_banjir'
TIM_TEKNIS_PEIL_BANJIR: 'tim_teknis_peil_banjir'
```

## 8. Status Auth dan Session

`src/lib/auth.ts` membaca user dari Prisma, lalu mengubah `user.role` melalui `mapDbRole(user.role)`.

Alur saat login:

```text
Prisma User.role
-> mapDbRole()
-> user.role di NextAuth
-> JWT token.role
-> session.user.role
-> middleware/RBAC/page guard
```

Artinya migration enum belum cukup. Mapper inbound wajib diperbarui sebelum user Peil Banjir dapat login dengan role yang benar.

Hal yang tidak boleh dilakukan:

- Jangan mengubah login.
- Jangan menambah pilihan role di halaman login.
- Jangan mengubah NextAuth workflow hanya untuk role Peil.

## 9. Status API User Management

Endpoint yang terdampak:

- `src/app/api/users/route.ts`
- `src/app/api/users/[id]/route.ts`

Keduanya menggunakan helper `toRole()` untuk menyimpan role ke Prisma.

Risiko:

- Jika role Peil dibuka di frontend sebelum `toRole()` siap, data bisa tersimpan sebagai role fallback yang salah.
- Jika `toRole()` diperbarui tetapi schema/database belum dimigrasikan, request akan gagal karena enum Prisma belum mengenali role baru.

Rekomendasi urutan:

1. Jangan buka role Peil di UI sebelum schema, migration, generated client, dan mapper siap.
2. Tambahkan validasi API eksplisit agar role pending tidak pernah diproses diam-diam.
3. Setelah migration berhasil, baru hapus guard pending di UI Manajemen Pengguna.

## 10. Status Manajemen Pengguna

`src/app/(dashboard)/pengguna/page.tsx` sudah aman untuk kondisi saat ini.

Guard yang ditemukan:

```ts
const PENDING_PRISMA_ROLES: Role[] = ['admin_peil_banjir', 'tim_teknis_peil_banjir']
const ASSIGNABLE_ROLES = ROLES.filter(role => !PENDING_PRISMA_ROLES.includes(role.val))
```

Submit juga diblokir dengan pesan:

```text
Role Peil Banjir belum dapat disimpan sebelum Prisma/database dimigrasikan
```

Status:

- Aman untuk tahap sekarang.
- Belum boleh dibuka untuk penyimpanan database.
- Perlu direvisi setelah migration benar-benar selesai.

## 11. Status Seed dan Demo

`prisma/seed.ts` memakai enum `Role` dari `@prisma/client`.

Seed user saat ini belum memiliki:

- `ADMIN_PEIL_BANJIR`
- `TIM_TEKNIS_PEIL_BANJIR`

Rekomendasi:

- Jangan menambah seed Peil pada tahap audit ini.
- Seed role Peil hanya dilakukan jika user eksplisit meminta akun demo/resmi Peil.
- Jika seed ditambahkan nanti, password, status aktif, assignment, dan scope harus ditentukan jelas.

## 12. Status RBAC Frontend Saat Ini

Frontend sudah menyiapkan role:

- `src/types/index.ts` sudah memiliki `admin_peil_banjir` dan `tim_teknis_peil_banjir`.
- `src/lib/roles.ts` sudah memiliki definisi dan alias role.
- `src/lib/rbac.ts` sudah mengatur akses `/peil` dan `/surat` secara terbatas.
- `src/lib/utils.ts` sudah memiliki label dashboard.
- `src/components/ai/ProjectAiAssistant.tsx` sudah mengenali ringkasan role Peil.
- `src/components/dashboard/DashboardRoleHeader.tsx` sudah mengenali scope role Peil.

Catatan:

- Ini baru kesiapan frontend/runtime.
- Ini bukan bukti database sudah bisa menyimpan role Peil.

## 13. Risiko Migration

Risiko utama jika migration dilakukan tanpa urutan yang benar:

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Enum Prisma ditambah tetapi mapper inbound belum diperbarui | User Peil login sebagai fallback role yang salah | Update `mapDbRole()` dalam batch yang sama |
| Mapper outbound diperbarui sebelum schema migration | API user gagal menyimpan role baru | Migration dan `prisma generate` harus selesai dulu |
| UI Manajemen Pengguna dibuka terlalu cepat | Role tersimpan salah atau request gagal | Pertahankan `PENDING_PRISMA_ROLES` sampai semua siap |
| Enum `Role` dipakai juga oleh `PaketAssignment.rolePaket` | Role Peil bisa tidak sengaja muncul sebagai role paket | Tambahkan guard role assignment paket jika diperlukan |
| Seed Peil dibuat tanpa assignment | User bisa login tetapi mengalami empty state membingungkan | Seed hanya jika assignment/scope jelas |
| Build/Prisma generate terkunci di Windows | Validasi gagal karena `query_engine-windows.dll.node` terkunci | Tutup proses dev/build yang mengunci DLL, jangan ubah dependency |

## 14. Rencana Perubahan Jika Migration Disetujui

Urutan aman yang direkomendasikan:

1. Backup database dan `prisma/schema.prisma`.
2. Edit `enum Role` di `prisma/schema.prisma` dengan:

```prisma
ADMIN_PEIL_BANJIR
TIM_TEKNIS_PEIL_BANJIR
```

3. Buat migration resmi.
4. Jalankan `npx prisma format`.
5. Jalankan `npx prisma validate`.
6. Jalankan migration hanya setelah persetujuan eksplisit user.
7. Jalankan `npx prisma generate`.
8. Update `src/lib/project-db.ts` untuk mapping UI -> Prisma.
9. Update `src/lib/db-mappers.ts` untuk mapping Prisma -> UI.
10. Tambahkan validasi eksplisit di endpoint user create/update.
11. Revisi `src/app/(dashboard)/pengguna/page.tsx` agar role Peil bisa dipilih setelah database siap.
12. Audit kembali `PaketAssignment.rolePaket` agar role Peil tidak dipakai sebagai assignment paket secara tidak sengaja.
13. Tambahkan seed Peil hanya jika diminta.
14. Validasi login dan akses:
    - Admin Peil Banjir: Dashboard, `/peil`, `/surat` sesuai scope.
    - Tim Teknis Peil Banjir: Dashboard dan `/peil` sesuai scope.
    - Role lama tetap tidak berubah.

## 15. File yang Perlu Diubah Pada Tahap Migration Nanti

Jika user menyetujui migration, file yang kemungkinan perlu disentuh:

- `prisma/schema.prisma`
- `prisma/migrations/<timestamp>_add_peil_roles/`
- `src/lib/project-db.ts`
- `src/lib/db-mappers.ts`
- `src/app/api/users/route.ts`
- `src/app/api/users/[id]/route.ts`
- `src/app/(dashboard)/pengguna/page.tsx`
- `prisma/seed.ts` jika akun seed Peil diminta
- dokumen audit lanjutan

File yang tidak perlu disentuh untuk migration role saja:

- halaman login
- middleware besar
- RBAC besar
- Dashboard modal 4D.2
- endpoint Approval
- endpoint Bootstrap
- package/dependency

## 16. Hal yang Tidak Disentuh Pada PB-RBAC.3

- `prisma/schema.prisma`
- folder `prisma/migrations/`
- database
- `prisma/seed.ts`
- Auth/NextAuth
- middleware
- RBAC runtime
- halaman login
- Dashboard/modal 4D.2
- endpoint Approval
- endpoint Bootstrap
- endpoint Sync Version
- `package.json`
- dependency
- source runtime aplikasi

## 17. Rekomendasi Tahap Lanjut

Rekomendasi teknis:

1. Jangan langsung migration sebelum user menyetujui eksplisit.
2. Buat tahap khusus PB-RBAC.4 untuk patch migration role Peil jika disetujui.
3. Pada PB-RBAC.4, perubahan harus dalam satu batch terkendali:
   - Prisma enum
   - migration
   - generated client
   - mapper inbound/outbound
   - API validation
   - UI Manajemen Pengguna
   - regression test role lama
4. Seed Peil sebaiknya menjadi tahap terpisah jika user ingin akun demo/resmi.

## 18. Validasi

Validasi yang perlu dijalankan setelah dokumen dibuat:

- `git diff --check`
- `npx.cmd tsc --noEmit`

`npm run build` tidak wajib untuk PB-RBAC.3 karena tahap ini hanya dokumen audit dan tidak menyentuh runtime.

## 19. Kesimpulan Audit

Role Peil Banjir sudah siap secara konsep dan frontend runtime, tetapi belum siap untuk disimpan ke database.

Titik wajib sebelum role Peil dapat dipakai resmi:

- Prisma enum `Role` harus ditambah.
- Prisma client harus digenerate ulang.
- `toRole()` harus mengenali role Peil.
- `mapDbRole()` harus mengenali role Peil.
- API user create/update harus memiliki validasi eksplisit.
- UI Manajemen Pengguna baru boleh membuka pilihan role Peil setelah seluruh rantai schema-mapper-auth siap.

Tanpa urutan tersebut, risiko terbesar adalah user Peil tersimpan sebagai role fallback yang salah atau login sebagai role yang keliru.
