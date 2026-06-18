# SIAGA-SDA UX-C5 - Final QA & Lock Halo SIAGA-SDA

## 1. Tujuan Tahap

Tahap UX-C5 melakukan audit final dan mengunci standar `Halo SIAGA-SDA` setelah UX-C3, RBAC-GLOBAL.2, UX-C4, dan UX-C4.1.

Tahap ini bersifat dokumen-only. Tidak ada source runtime yang diubah karena audit statis tidak menemukan bug kecil yang perlu diperbaiki.

## 2. Commit Acuan

Commit acuan:

```text
0c68455 feat: tambah kendali waktu pekerjaan di halo
```

## 3. File yang Diaudit

Dokumen:

- `AGENTS.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C3_VISUAL_QA_HALO_SIAGA_SDA.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_2_FIX_HALO_ROLE_AWARE_SUGGESTIONS.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C4_HALO_PERSONAL_ROLE_PAGE_GUIDE.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C4_1_HALO_KENDALI_WAKTU_PEKERJAAN.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`

Source:

- `src/components/ai/ProjectAiAssistant.tsx`
- `src/lib/rbac.ts`
- `src/lib/navigation.ts`
- `src/types/index.ts`
- `src/store/useAppStore.ts`

## 4. File yang Diubah

Tidak ada source runtime yang diubah.

File dokumen baru:

- `docs/design/SIAGA_SDA_HALO_FINAL_LOCK.md`
- `docs/audit/SIAGA_SDA_UX_C5_FINAL_QA_LOCK_HALO.md`

## 5. File Baru yang Dibuat

- `docs/design/SIAGA_SDA_HALO_FINAL_LOCK.md`
- `docs/audit/SIAGA_SDA_UX_C5_FINAL_QA_LOCK_HALO.md`

## 6. Backup

Backup source tidak dibuat karena tahap UX-C5 hanya membuat dokumen baru dan tidak mengubah source runtime.

Jika pada tahap berikutnya source Halo harus diubah, backup wajib dibuat terlebih dahulu.

## 7. Hasil Audit Role-Aware Suggestion

Audit `ProjectAiAssistant.tsx` menunjukkan:

- daftar FAQ memakai `HALO_FAQ_ITEMS`;
- item umum memakai `alwaysVisible`;
- item sensitif memakai `accessPath`;
- filter FAQ memakai `canAccessPage(role, item.accessPath)`;
- jika user belum terbaca, hanya item umum yang tampil.

Standar yang terkunci:

- Peil hanya tampil jika user bisa akses `/peil`;
- Surat hanya tampil jika user bisa akses `/surat`;
- Approval hanya tampil jika user bisa akses `/approval`;
- User Management hanya tampil jika user bisa akses `/pengguna`;
- suggestion umum tetap boleh tampil untuk semua user Dashboard.

Tidak ada perubahan RBAC runtime.

## 8. Hasil Audit Card Waktu

Audit `ProjectAiAssistant.tsx` menunjukkan:

- label `Sisa waktu misi harian` ada;
- card `Kendali Waktu Pekerjaan` ada;
- sumber data memakai `projects` dari `useAppStore`;
- helper memakai `tanggalMulai` dan `tanggalSelesai` existing;
- status sederhana tersedia: `Belum ada jadwal`, `Aman`, `Perlu Perhatian`, `Mendesak`, `Terlambat`.

Fallback terkunci:

```text
Jadwal pekerjaan belum tersedia.
```

Tidak ada countdown palsu saat data tanggal tidak tersedia.

## 9. Hasil Audit Layout Card Panduan

Audit urutan render `ProjectAiAssistant.tsx` menunjukkan tiga card panduan berada di bagian bawah panel Halo:

1. `Panduan Role Saya`
2. `Panduan Halaman Aktif`
3. `Mengapa Menu Tidak Muncul?`

Ketiganya berada tepat di atas area:

```text
Tanya Halo SIAGA-SDA
```

Isi card dan logika role-aware tidak diubah pada tahap UX-C5.

## 10. Hasil Audit Mobile / Desktop Statis

Audit statis class layout menunjukkan:

- floating button memakai `fixed` dan label `Halo SIAGA-SDA`;
- panel Halo memakai overlay sendiri dengan `z-[70]`, tetap jauh di bawah modal utama Dashboard/Approval;
- body panel memakai `min-h-0 flex-1 overflow-y-auto overscroll-contain`;
- mobile memakai lebar `w-[calc(100vw-1rem)]`;
- desktop memakai batas `md:w-[560px]` dan `lg:w-[620px]`;
- close button tetap berada di header;
- panel tidak mengubah shared modal portal atau modal Dashboard 4D.2.

Status statis: aman untuk desktop/mobile. Uji visual browser tetap disarankan jika ada perubahan UI besar di masa depan.

## 11. Hal yang Sengaja Tidak Disentuh

Tahap UX-C5 tidak menyentuh:

- halaman login;
- Auth / NextAuth;
- middleware;
- Prisma schema;
- migration;
- database;
- seed;
- package.json;
- package-lock.json;
- endpoint API;
- RBAC besar;
- `src/lib/rbac.ts`;
- `src/lib/navigation.ts`;
- Dashboard modal 4D.2;
- Approval Center runtime;
- shared modal portal;
- Bootstrap;
- Sync Version;
- source runtime Halo.

## 12. Validasi

Validasi yang dijalankan:

- `git diff --check`

Karena source TypeScript/TSX tidak diubah pada tahap UX-C5, `npx.cmd tsc --noEmit` bersifat tambahan.

`npm run lint` tidak tersedia karena `package.json` tidak memiliki script `lint`.

`npm run build` tidak dijalankan karena tahap ini dokumen-only dan build menjalankan `prisma generate`, yang tidak diperlukan untuk lock dokumentasi.

## 13. Risiko Tersisa

- Halo masih panduan lokal, belum terhubung SOP resmi atau data misi database.
- Role/permission Halo mengikuti `canAccessPage`; jika mapping route berubah, audit Halo perlu diulang.
- Card `Kendali Waktu Pekerjaan` masih memakai jadwal paket existing, belum task center resmi.
- Belum ada uji screenshot runtime pada tahap UX-C5 karena tidak ada perubahan source.

## 14. Rekomendasi Tahap Berikutnya

Tahap berikutnya yang aman:

1. Jangan ubah Halo kecuali ada bug nyata atau instruksi eksplisit.
2. Jika Halo akan membaca data resmi, buat desain API/scope/audit trail terlebih dahulu.
3. Jika Halo akan menjadi AI resmi, buat tahap khusus untuk privacy, RBAC, sumber SOP, dan audit.
4. Jika card waktu akan membaca task center resmi, buat adapter jadwal/tugas terlebih dahulu.

## 15. Rekomendasi Commit Message

```text
docs: lock final halo siaga sda
```
