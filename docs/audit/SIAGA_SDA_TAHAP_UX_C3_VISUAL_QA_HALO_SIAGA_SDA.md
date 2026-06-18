# SIAGA-SDA Tahap UX-C.3 - Visual QA Halo SIAGA-SDA Desktop dan Mobile

Tanggal: 18 Juni 2026

## 1. Tujuan Tahap

Tahap UX-C.3 melakukan uji visual dan audit statis terhadap floating button dan panel `Halo SIAGA-SDA` setelah UX-C.2B dan UX-C.2B-R1.

Fokus uji:

- posisi floating button desktop/mobile;
- keterbacaan panel;
- scroll internal panel;
- tombol close;
- avatar fallback;
- role-aware sentence;
- countdown `Sisa Waktu`;
- ringkasan misi;
- empty state;
- area `Tanya Halo SIAGA-SDA`;
- copy aman tanpa istilah `AI API`;
- z-index terhadap modal Dashboard/Approval Center.

## 2. Status Git Sebelum Audit

Hasil gate awal:

```text
## master...origin/master [ahead 2]
```

Working tree bersih. Branch lokal sudah ahead 2 dari `origin/master`.

## 3. File yang Dibaca

- `AGENTS.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C2A_PINDAH_TUGAS_SAYA_BAWAH_5_KARTU.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C2B_HALO_SIAGA_SDA_FLOATING_PANEL_FINAL.md`
- `docs/audit/SIAGA_SDA_TAHAP_UX_C2B_R1_REVISI_COPY_ROLE_HALO_SIAGA_SDA.md`
- `src/components/ai/ProjectAiAssistant.tsx`
- `src/components/ui/index.tsx`
- `package.json`

## 4. File yang Diubah

Tidak ada source runtime yang diubah.

Dibuat:

- `docs/audit/SIAGA_SDA_TAHAP_UX_C3_VISUAL_QA_HALO_SIAGA_SDA.md`

## 5. Backup yang Dibuat

Tidak ada backup source dibuat karena UX-C.3 hanya membuat dokumen audit dan tidak mengubah source runtime.

## 6. Keterbatasan Uji Visual

Dev server lokal terdeteksi aktif:

- `/login`: HTTP 200
- `/dashboard` tanpa sesi: HTTP 307 redirect ke autentikasi

In-app Browser tidak tersedia pada sesi ini (`iab` tidak aktif), sehingga screenshot dan klik visual runtime tidak dapat dilakukan. Uji dilakukan melalui:

- HTTP smoke check;
- static JSX/CSS review;
- audit z-index dan class responsive;
- audit copy dan role label.

## 7. Hasil Uji Desktop

Target desktop yang dinilai secara statis:

- 1366 x 768
- 1440 x 900
- 1920 x 1080

Temuan:

- floating button memakai `fixed bottom-24 right-4 z-40` dan `md:bottom-5`;
- panel desktop memakai `md:flex md:items-end md:justify-end`;
- panel desktop diberi `md:mb-5 md:mr-5 md:max-h-[82dvh] md:rounded-3xl`;
- lebar panel dibatasi `max-w-lg`;
- panel tidak keluar layar secara struktur karena wrapper `fixed inset-0` dan konten `max-h`;
- body panel memakai `min-h-0 flex-1 overflow-y-auto overscroll-contain`;
- tombol close berada di header kanan dan memakai `aria-label="Tutup Halo SIAGA-SDA"`;
- header memakai avatar 48px dan teks singkat, masih relatif compact.

Status desktop: aman secara static review. Perlu uji visual manual nyata jika browser tersedia.

## 8. Hasil Uji Mobile

Target mobile yang dinilai secara statis:

- 360 x 800
- 390 x 844
- 414 x 896

Temuan:

- floating button berada pada `bottom-24`, lebih aman dari bottom navigation dibanding `bottom-20`;
- ukuran tombol `h-12 w-12`, masih tap-friendly;
- panel mobile memakai `max-h-[88dvh]`;
- panel mobile memakai `rounded-t-3xl`, sehingga terasa sebagai sheet dari bawah;
- body panel punya scroll internal;
- header tidak fixed terpisah, tetapi berada di area panel dan tetap terlihat saat panel awal dibuka;
- ringkasan misi masih `grid-cols-3`, sehingga pada 360px berpotensi sempit untuk label `Perlu Perhatian`;
- badge status memakai `flex flex-wrap`, sehingga aman saat ruang sempit;
- role panjang seperti `Tim Perencana (Rutin)` berpotensi memanjang, tetapi paragraf memakai `leading-relaxed` dan tidak memakai `nowrap`.

Status mobile: aman secara static review, dengan catatan ringkasan misi 3 kolom perlu dicek visual pada 360px.

## 9. Hasil Uji Role-Aware

Sumber role:

`useAppStore((state) => state.currentUser)?.role`

Format:

`Misi Anda sebagai [Nama Role] yang harus diselesaikan hari ini, [hari, tanggal].`

Fallback role kosong:

`Misi Anda yang harus diselesaikan hari ini, [hari, tanggal].`

Role yang dicek secara statis:

| Role | Label UI | Status |
|---|---|---|
| `ppk` | `PPK` | aman |
| `pptk` | `PPTK` | aman |
| `tim_perencana_rutin` | `Tim Perencana (Rutin)` | aman, perlu cek wrapping mobile |
| `tim_pengawas_rutin` | `Tim Pengawas (Rutin)` | aman, perlu cek wrapping mobile |
| `direksi_teknis` | `Direksi Teknis` | aman |
| `kontraktor` | `Kontraktor` | aman |
| `kepala_bidang` | `Kepala Bidang` | aman |
| kosong/null | fallback tanpa role | aman |

Tidak ada NIP, nama ASN, nama perusahaan, paket tertentu, surat tertentu, atau data user lain yang ditampilkan.

## 10. Hasil Uji Copy Aman tanpa AI API

Pencarian pada `src/components/ai/ProjectAiAssistant.tsx` tidak menemukan string user-facing berikut:

- `AI API`
- `API AI`
- `layanan AI eksternal`
- `memanggil AI`
- `AI eksternal`
- `Analisis AI aktif`

Copy aktif memakai istilah:

- `Mode Panduan Lokal`
- `belum membaca misi resmi`
- `belum melakukan perubahan data`
- `belum membaca sumber SOP resmi`
- `belum membaca data misi resmi`

Status copy: aman.

## 11. Hasil Uji Z-Index dan Modal

Panel Halo SIAGA-SDA:

- floating button: `z-40`;
- overlay panel: `z-[70]`.

Shared modal Dashboard/Approval Center:

- overlay: `z-[9998]`;
- wrapper/modal: `z-[9999]`;
- memakai `createPortal(..., document.body)`.

Kesimpulan:

- panel Halo tidak mengalahkan modal Dashboard/Approval Center;
- modal utama tetap berada jauh di atas panel Halo;
- Halo panel tidak mengubah shared modal, portal, overlay, atau scroll lock.

## 12. Hasil Uji Floating Button

Temuan:

- tombol tidak memakai avatar, icon `Bot` tetap dipertahankan;
- tooltip/title dan aria-label adalah `Halo SIAGA-SDA`;
- posisi mobile `bottom-24` membantu menghindari bottom navigation;
- posisi desktop `md:bottom-5` menempatkan tombol di pojok kanan bawah;
- z-index `z-40` cukup untuk floating assistant, tetapi tetap di bawah modal utama.

Risiko:

- pada desktop dengan scrollbar kanan dan konten sangat rapat, `right-4` bisa terasa dekat scrollbar. Belum terbukti bug karena tidak ada uji screenshot.

## 13. Temuan Visual

Temuan yang perlu dicek manual saat browser tersedia:

1. Ringkasan misi `grid-cols-3` pada viewport 360px bisa terasa sempit.
2. Role panjang seperti `Tim Perencana (Rutin)` perlu dicek pada mobile kecil.
3. Panel `max-h-[88dvh]` perlu dicek terhadap browser chrome mobile nyata.
4. Posisi `right-4` pada desktop perlu dicek jika scrollbar terlihat dekat.

Tidak ditemukan bug source yang cukup kuat untuk mengubah runtime pada tahap ini.

## 14. Perbaikan Kecil yang Dilakukan

Tidak ada source runtime yang diubah.

Tahap ini hanya membuat dokumen audit visual/static QA.

## 15. Hal yang Sengaja Tidak Disentuh

- Login.
- Auth, NextAuth, middleware.
- RBAC runtime.
- Prisma schema, migration, database.
- API routes.
- Endpoint Approval, Bootstrap, Sync Version.
- Package dan dependency.
- Modal Dashboard/Approval Center.
- Workflow approval.
- Chat/AI resmi.
- Notifikasi lonceng global.
- Surat teguran resmi otomatis.
- Data resmi, dummy, dan dashboard source data.

## 16. Risiko Tersisa

- Tidak ada screenshot runtime karena in-app browser tidak tersedia.
- Uji visual sebenarnya masih perlu dilakukan pada desktop 1366x768/1440x900/1920x1080 dan mobile 360x800/390x844/414x896.
- Jika ringkasan misi 3 kolom sempit pada mobile, tahap revisi kecil berikutnya dapat mengubahnya menjadi `grid-cols-1 min-[380px]:grid-cols-3` atau pola 2+1.

## 17. Validasi Command

Validasi dijalankan setelah dokumen audit dibuat:

- `git diff --check`: lulus tanpa whitespace error.
- `npx.cmd tsc --noEmit`: lulus tanpa error TypeScript.
- `npm run lint`: tidak tersedia di `package.json`.
- `npm run build`: tidak dijalankan karena tahap ini audit/dokumen dan script build menjalankan `prisma generate`.

## 18. Rekomendasi Commit Message

Karena hanya audit dokumen:

`docs: audit visual halo siaga sda desktop mobile`
