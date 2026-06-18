# SIAGA-SDA Tahap UX-C4.1 - Halo Kendali Waktu Pekerjaan

## 1. Tujuan Tahap

Tahap UX-C4.1 menambahkan kendali waktu pekerjaan ringan pada Halo SIAGA-SDA.

Tujuan perubahan:

- mengganti label `Sisa Waktu` menjadi `Sisa waktu misi harian`;
- menambahkan card `Kendali Waktu Pekerjaan`;
- memakai data tanggal pekerjaan existing jika tersedia;
- menampilkan fallback jujur jika jadwal pekerjaan belum tersedia;
- menjaga Halo tetap role-aware, frontend-only, dan mobile-friendly.

Tahap ini bukan tahap database, bukan form admin, bukan perubahan role/permission, dan bukan perubahan API.

## 2. Commit Acuan

Commit acuan:

```text
77f56da feat: perkaya halo siaga sda dengan panduan role halaman
```

Tahap UX-C4.1 dikerjakan setelah UX-C4 selesai dan working tree bersih.

## 3. File yang Diaudit

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C4_HALO_PERSONAL_ROLE_PAGE_GUIDE.md`
- `docs/audit/SIAGA_SDA_RBAC_GLOBAL_2_FIX_HALO_ROLE_AWARE_SUGGESTIONS.md`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/store/useAppStore.ts`
- `src/types/index.ts`

## 4. File yang Diubah

- `src/components/ai/ProjectAiAssistant.tsx`

## 5. File Baru yang Dibuat

- `docs/audit/SIAGA_SDA_TAHAP_UX_C4_1_HALO_KENDALI_WAKTU_PEKERJAAN.md`

## 6. Backup yang Dibuat

Backup dibuat di:

```text
backup/backup-ux-c4-1-halo-kendali-waktu-pekerjaan-before-change/
```

Isi backup:

- `ProjectAiAssistant.tsx`
- `BACKUP_FILE_LIST.md`

## 7. Label yang Diganti

Label pada card countdown misi harian diganti dari:

```text
Sisa Waktu
```

menjadi:

```text
Sisa waktu misi harian
```

Label ini tetap merujuk pada countdown akhir hari perangkat lokal, bukan jadwal kontrak/paket.

## 8. Card "Kendali Waktu Pekerjaan" yang Ditambahkan

Card baru ditambahkan di panel Halo:

```text
Kendali Waktu Pekerjaan
```

Copy utama:

```text
Pantau sisa waktu pekerjaan berdasarkan jadwal yang tersedia.
```

Jika jadwal ditemukan, card menampilkan:

- nama paket;
- tanggal mulai jika tersedia;
- target selesai;
- sisa waktu;
- status sederhana.

Status yang dipakai:

- `Belum ada jadwal`
- `Aman`
- `Perlu Perhatian`
- `Mendesak`
- `Terlambat`

## 8A. Penataan Ulang Card Panduan

Setelah revisi kecil UX-C4.1, tiga card panduan dipindahkan ke bagian bawah panel Halo SIAGA-SDA:

1. `Panduan Role Saya`
2. `Panduan Halaman Aktif`
3. `Mengapa Menu Tidak Muncul?`

Posisi baru ketiga card berada tepat di atas area:

```text
Tanya Halo SIAGA-SDA
```

Isi card, helper role/page guide, dan filter role-aware tidak diubah.

Guard RBAC-GLOBAL.2 tetap dipertahankan:

- Peil tetap hanya tampil jika user bisa akses `/peil`;
- Surat tetap hanya tampil jika user bisa akses `/surat`;
- Approval tetap hanya tampil jika user bisa akses `/approval`;
- User Management tetap hanya tampil jika user bisa akses `/pengguna`.

## 9. Sumber Data Existing yang Dipakai

Sumber data berasal dari Zustand store:

```text
useAppStore((state) => state.projects)
```

Field existing yang dipakai dari `Proyek`:

- `nama`
- `tanggalMulai`
- `tanggalSelesai`
- `assignedUsers`
- `projectIds` pada user
- `ppk`
- `pptk`

Data difilter secara konservatif:

- role luas tertentu dapat membaca daftar proyek sesuai kemampuan dashboard;
- role terbatas hanya memakai proyek yang ada di `projectIds`, `assignedUsers`, `ppk`, atau `pptk`;
- tidak ada query database baru;
- tidak ada endpoint API baru;
- tidak ada field baru.

## 10. Fallback Jika Tanggal Tidak Tersedia

Jika tidak ada proyek visible dengan `tanggalSelesai` valid, card menampilkan:

```text
Jadwal pekerjaan belum tersedia.
```

Copy tambahan:

```text
Data waktu akan mengikuti jadwal tugas atau kontrak jika sudah tersedia di sistem.
```

Tidak ada countdown palsu dibuat saat tanggal target tidak tersedia.

## 11. Hal yang Sengaja Tidak Dibuat

Tahap ini sengaja tidak membuat:

- form admin;
- menu admin baru;
- field input waktu baru;
- schema database baru;
- migration;
- seed;
- endpoint API baru;
- role baru;
- permission baru;
- perubahan RBAC;
- perubahan Auth/Login;
- perubahan middleware;
- fitur addendum/perpanjangan waktu.

Catatan addendum/perpanjangan waktu disarankan untuk tahap khusus setelah desain data kontrak dan perubahan waktu disetujui.

## 12. Validasi

Validasi yang ditargetkan:

- `git diff --check`
- `npx.cmd tsc --noEmit`

`npm run lint` tidak tersedia jika tidak ada script `lint` pada `package.json`.

## 13. Risiko Tersisa

- Pemilihan paket memakai jadwal terdekat dari data proyek yang terlihat, bukan task center resmi.
- Jika assignment proyek belum lengkap, card dapat masuk fallback walaupun user sebenarnya punya pekerjaan.
- Jika data tanggal di store berasal dari demo/fallback, label sumber data umum di Halo tetap perlu diperhatikan.
- Belum ada dukungan addendum/perpanjangan waktu.
- Belum ada integrasi dengan dokumen kontrak resmi.

## 14. Rekomendasi Tahap Berikutnya

Tahap berikutnya yang aman:

- desain adapter task/jadwal resmi bila data tugas sudah tersedia;
- audit hubungan tanggal paket, kontrak, addendum, dan laporan progress;
- implementasi addendum/perpanjangan waktu hanya setelah desain schema dan workflow disetujui;
- uji visual Halo pada desktop dan mobile dengan role terbatas dan role luas.

Saran commit message:

```text
feat: tambah kendali waktu pekerjaan di halo
```
