# SIAGA-SDA Photo Documentation Viewer Standard

Tanggal: 17 Juni 2026

## 1. Ringkasan Tujuan

Photo Documentation Viewer adalah standar tampilan bukti foto lapangan SIAGA-SDA.

Alur standar:

```text
Klik thumbnail/foto dokumentasi
-> modal tengah terbuka
-> foto besar tampil
-> metadata dokumentasi tampil
-> user dapat menutup modal atau membuka modul asal
```

Viewer ini dibuat sebagai komponen reusable, bukan sistem upload baru. Data tetap berasal dari foto yang sudah tersedia di modul asal.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `docs/database/SIAGA_SDA_STORAGE_RULES.md`
- `src/types/index.ts`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/laporan/page.tsx`
- `src/app/(dashboard)/dokumen/page.tsx`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `src/app/(dashboard)/surat/page.tsx`
- `src/app/(dashboard)/peil/page.tsx`
- `src/app/(dashboard)/asset/page.tsx`
- `src/app/(dashboard)/peta/page.tsx`
- `src/lib/project-db.ts`
- `src/app/api/bootstrap/route.ts`
- `src/app/api/projects/[id]/records/[kind]/route.ts`

## 3. File yang Dibuat/Diubah

File baru:

- `src/components/common/PhotoDocumentationViewer.tsx`
- `docs/design/SIAGA_SDA_PHOTO_DOCUMENTATION_VIEWER_STANDARD.md`

File diubah:

- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/laporan/page.tsx`

## 4. Backup

Backup dibuat di:

```text
backup/backup-photo-documentation-viewer-before-change
```

File yang dibackup:

- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/laporan/page.tsx`

Dokumen standar belum ada sebelumnya, sehingga tidak ada backup dokumen lama.

## 5. Hasil Audit Foto Existing

| Modul | Status Foto di Source | Field/URL | Status Viewer |
|---|---|---|---|
| Survey Investigasi | Ada `Survey.foto[]` dan thumbnail di halaman list/detail | `foto[].url`, `uploadedAt`, `uploadedBy`, `keterangan`, `koordinat` | Diterapkan |
| Paket Pekerjaan | Foto muncul melalui laporan/survey di detail proyek | `survey.foto[]`, `laporanHarian.foto[]` | Persiapan tahap lanjutan |
| Laporan Harian/Pengawasan | Ada `LaporanHarian.foto[]` dan thumbnail di halaman laporan | `foto[].url`, `uploadedAt`, `uploadedBy`, `keterangan`, `koordinat` | Diterapkan |
| Administrasi | Belum ditemukan foto/lampiran gambar aktif yang jelas di halaman modul | Belum jelas | Persiapan |
| Surat Masuk & Keluar | Halaman masih shell, belum ada lampiran foto aktif | Belum jelas | Persiapan |
| Peil Banjir | Halaman masih shell, belum ada foto aktif | Belum jelas | Persiapan |
| Asset SDA | Halaman masih shell, belum ada foto aktif | Belum jelas | Persiapan |
| Peta Monitoring | Ada marker/layer, belum ada foto dokumentasi per titik | Belum jelas | Persiapan |
| Dokumen | Mengagregasi foto laporan/survey/masalah sebagai dokumen | `url`, `uploadedBy`, `uploadedAt`, `keterangan` | Persiapan integrasi lanjutan |

## 6. Standar Data Foto

Komponen menerima item foto dengan struktur ringkas:

```ts
type PhotoDocumentationItem = {
  id: string
  src: string
  thumbnailSrc?: string
  title?: string
  caption?: string
  module: 'survey' | 'paket' | 'administrasi' | 'surat' | 'peil' | 'asset' | 'peta' | 'audit' | 'lainnya'
  entityId?: string
  entityCode?: string
  entityName?: string
  location?: string
  takenAt?: string
  uploadedAt?: string
  uploadedBy?: string
  uploaderRole?: string
  progressPercent?: number
  physicalProgress?: number
  financialProgress?: number
  stage?: string
  status?: string
  verificationStatus?: string
  coordinates?: {
    lat?: number
    lng?: number
  }
  sourceLabel?: 'Database' | 'Demo' | 'Simulasi' | 'Persiapan' | 'Upload' | 'Lampiran'
  notes?: string
  detailHref?: string
}
```

Struktur ini tidak mengubah database dan tidak memaksa semua field tersedia. Metadata yang kosong tidak ditampilkan.

## 7. Standar Modal Desktop

Desktop memakai centered modal:

- overlay `bg-slate-950/40`;
- tanpa `blur`, `filter`, atau `backdrop-blur`;
- foto besar di kiri;
- metadata di kanan;
- tinggi maksimum `86dvh`;
- scroll internal jika detail panjang;
- tombol close di kanan atas;
- tombol `Buka Detail Modul` jika `detailHref` tersedia.

## 8. Standar Modal Mobile

Mobile tetap memakai modal tengah dengan layout satu kolom:

- foto besar di atas;
- detail di bawah;
- tombol close mudah ditekan;
- konten modal bisa scroll internal;
- tidak ada horizontal overflow;
- tidak mengandalkan hover;
- overlay hanya gelap transparan tipis.

## 9. Metadata Wajib

Viewer menampilkan metadata berdasarkan ketersediaan data:

- judul foto;
- modul asal;
- kode/ID data;
- nama paket/survey/laporan;
- lokasi;
- tanggal foto atau waktu upload;
- uploader/petugas;
- tahap;
- status;
- verifikasi;
- koordinat;
- progress fisik dan keuangan jika ada;
- catatan;
- sumber data.

## 10. Role-Aware Behavior

Viewer tidak membuat bypass RBAC.

Aturan yang diterapkan:

- viewer hanya bisa dibuka dari thumbnail yang sudah tampil di halaman asal;
- Survey memakai `getScopedProjects()` dan filter halaman Survey;
- Laporan memakai data yang sudah tampil di halaman Laporan;
- role read-only tetap dapat melihat foto jika modul asal boleh dibaca;
- tombol detail hanya menuju modul asal, bukan membuka data baru dari luar scope;
- tidak ada permission baru;
- tidak ada perubahan RBAC.

## 11. Performance Rule

Aturan performa:

- halaman utama tetap menampilkan thumbnail kecil;
- foto besar dimuat saat modal dibuka;
- gambar memakai `loading="lazy"`;
- tidak ada dependency image viewer baru;
- tidak ada carousel berat;
- tidak ada preload semua galeri;
- tidak ada API/fetch baru dari viewer.

## 12. Modul yang Sudah Diterapkan

### Survey Investigasi

Area yang diperbarui:

- thumbnail strip pada list survey;
- grid foto pada modal detail survey.

Metadata yang tampil:

- kondisi eksisting;
- proyek/kode proyek;
- lokasi proyek;
- tanggal survey;
- surveyor/uploader;
- status tindak lanjut;
- koordinat;
- rekomendasi atau permasalahan;
- sumber data Database/Demo.

### Laporan Harian

Area yang diperbarui:

- thumbnail strip pada list laporan harian;
- grid foto pada modal detail laporan harian.

Metadata yang tampil:

- uraian pekerjaan;
- proyek/kode proyek;
- lokasi proyek;
- tanggal laporan;
- pelapor/uploader;
- status persetujuan;
- koordinat;
- progress fisik;
- sumber data Database/Demo.

## 13. Modul yang Masih Persiapan

Modul berikut belum dipaksa karena struktur foto/lampiran aktif belum jelas atau masih shell:

- Paket Pekerjaan detail proyek;
- Dokumen;
- Administrasi;
- Surat Masuk & Keluar;
- Peil Banjir;
- Asset SDA;
- Peta Monitoring.

Tahap berikutnya dapat memasang viewer pada modul tersebut setelah mapping data foto dan scope modul jelas.

## 14. Hal yang Tidak Disentuh

- Halaman login dan asset login.
- Auth, NextAuth, middleware.
- RBAC dan role.
- Prisma schema, migration, database.
- Endpoint Approval, Bootstrap, Sync Version.
- Sistem upload, storage, dan data source utama.
- `package.json`, dependency.

## 15. Risiko Tersisa

- Foto upload lokal saat ini memakai object URL pada form. Viewer tahap ini dipasang pada foto yang sudah tersimpan/terlihat pada list/detail, bukan preview form upload.
- Modul Dokumen sudah mengagregasi foto, tetapi belum dipasang viewer agar tidak memperluas scope terlalu cepat.
- Asset, Peil, Surat, dan Administrasi perlu mapping field lampiran/foto sebelum viewer dipasang.
- Jika URL foto remote eksternal membutuhkan konfigurasi image domain, viewer sengaja memakai `<img>` agar tidak perlu mengubah konfigurasi Next.js.

## 16. Rekomendasi Tahap Berikutnya

1. Pasang viewer di `src/app/(dashboard)/dokumen/page.tsx` karena modul ini sudah mengagregasi foto laporan/survey/masalah.
2. Pasang viewer di detail proyek `src/app/(dashboard)/proyek/[id]/page.tsx` untuk foto survey dan laporan dalam konteks paket.
3. Tambahkan field thumbnail resmi jika storage sudah menyediakan `thumbnail_url`.
4. Mapping lampiran foto untuk Surat, Peil, Asset, dan Administrasi sebelum implementasi.
5. Pastikan setiap modul tetap memakai assignment scope existing sebelum membuka thumbnail.

## 17. Hasil Validasi

- `npx tsc --noEmit`: lulus.
- `git diff --check`: lulus; Git menampilkan peringatan line-ending CRLF pada beberapa file existing, tetapi tidak ada whitespace error.
- `npm run lint`: tidak dijalankan karena `package.json` tidak memiliki script `lint`.
