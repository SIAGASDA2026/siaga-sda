# SIAGA-SDA UX-B - Desain Visual Dashboard Tugas Saya dan Success Appreciation Balloon

Tanggal: 18 Juni 2026  
Status: dokumen visual/spec UI, belum implementasi runtime

## A. Judul

SIAGA-SDA UX-B - Desain Visual Dashboard Tugas Saya dan Success Appreciation Balloon

## B. Status Dokumen

- Dokumen visual/spec UI.
- Belum implementasi runtime.
- Belum membuat komponen React.
- Belum mengubah Dashboard.
- Belum mengubah login.
- Belum mengubah modal Dashboard 4D.2.
- Belum mengubah schema/database.
- Belum mengubah RBAC runtime.
- Belum membuat API baru.
- Belum membuat migration.
- Belum menjalankan Prisma generate/migrate/db push.

## C. Commit Acuan

- `d828f5e docs: tambah matriks tugas role dan ux apresiasi`
- `cff1c97 docs: final gate migration surat tahap 5ib`

Kondisi acuan:

- Tahap 5I-B sudah selesai.
- Tahap RBAC-UX-A sudah selesai.
- Migration belum dijalankan.
- Prisma schema asli belum diubah.
- RBAC runtime belum diubah.
- Dashboard runtime belum diubah.

## D. Prinsip Desain

- Profesional.
- Tema air, biru laut, navy, tosca, dan putih kebiruan.
- Bersih, modern, lembut, dan mudah dibaca.
- Cocok untuk aplikasi pemerintahan SDA.
- Tidak kekanak-kanakan.
- Heart hanya aksen kecil untuk apresiasi, bukan elemen dominan.
- Animasi halus dan singkat.
- Desktop/laptop nyaman untuk monitoring cepat.
- Mobile tetap boleh scroll vertikal.
- Jangan memaksa mobile satu layar.
- Tidak menambah tab utama baru.
- Tidak menampilkan data di luar assignment scope.
- Tidak menampilkan NIP ASN ke eksternal.
- Tidak menampilkan dummy sebagai data resmi.
- Tidak mengganggu modal Dashboard 4D.2.
- Tidak menggantikan Audit Log formal.

## E. Struktur Dashboard yang Disarankan

Fitur ini masuk ke Dashboard, bukan tab utama baru.

Struktur area Dashboard yang disarankan:

1. Ringkasan Hari Ini.
2. Tugas Saya.
3. Tugas Selesai.
4. Langkah Berikutnya.
5. Riwayat Apresiasi.
6. Risiko/Keterlambatan.
7. Empty Assignment State jika user aktif belum memiliki tugas.

Penempatan konseptual:

- `Dashboard > Ringkasan Hari Ini` sebagai konteks cepat.
- `Dashboard > Tugas Saya` sebagai daftar prioritas user.
- `Dashboard > Tugas Selesai` sebagai ringkasan pekerjaan yang sudah ditutup.
- `Dashboard > Langkah Berikutnya` sebagai arahan setelah tugas selesai.
- `Dashboard > Riwayat Apresiasi` sebagai riwayat UX-friendly.
- `Audit Log` tetap menjadi catatan formal.
- `Pengaturan > Preferensi Tampilan` dapat menampung opsi animasi nanti.

## F. Layout Desktop/Laptop

Desain desktop/laptop:

- Area utama Dashboard tetap ringkas.
- Panel Tugas Saya tampil sebagai card prioritas di area ringkasan.
- Card tugas menampilkan maksimal beberapa item teratas, misalnya 3 sampai 5 item prioritas.
- Sediakan tombol `Lihat Semua Tugas` untuk membuka daftar lebih lengkap pada tahap implementasi nanti.
- Tugas Selesai dan Riwayat Apresiasi tampil ringkas sebagai list kecil, bukan panel besar yang mengalahkan KPI.
- Langkah Berikutnya tampil sebagai checklist kecil atau timeline ringkas.
- Risiko/Keterlambatan tampil sebagai alert lembut berwarna amber atau merah hanya jika benar-benar perlu.
- Balloon sukses tampil di kanan atas atau kanan bawah, mengikuti ruang kosong halaman.
- Balloon tidak menutup sidebar/topbar.
- Balloon tidak menutup tombol submit/simpan atau action utama.
- Jika modal Dashboard 4D.2 sedang aktif, balloon tidak masuk ke background blur dan tidak mengganggu modal.
- Jika modal sedang aktif, rekomendasi aman adalah menahan balloon sampai modal ditutup atau menampilkan konfirmasi kecil di dalam modal terkait.

Skala visual:

- Card utama radius besar konsisten.
- Border biru lembut.
- Shadow lembut.
- Aksen tosca untuk sukses.
- Amber untuk perhatian.
- Merah hanya untuk kritis/error.
- Text navy untuk judul.
- Text slate untuk deskripsi.

## G. Layout Mobile

Desain mobile:

- Mobile boleh scroll vertikal.
- `Tugas Saya` tampil sebagai card stack satu kolom.
- Setiap tugas memiliki tap target minimal nyaman untuk jari.
- Balloon sukses tampil di bawah layar, di atas bottom navigation.
- Balloon ringkas dan tidak menutup tombol submit/simpan.
- Empty assignment tampil sebagai card lembut dengan ikon status, identitas user, dan arahan kontak.
- Riwayat Apresiasi bisa berupa accordion atau list ringkas.
- Animasi ringan agar tidak berat pada perangkat lapangan.
- Tidak ada hover-only interaction.
- Tidak ada horizontal overflow.
- Jika keyboard/form aktif, balloon tidak boleh menutupi input aktif.

## H. Komponen Tugas Saya

Struktur satu item tugas:

- Judul tugas.
- Modul asal.
- Status.
- Prioritas.
- Batas waktu jika ada.
- Role yang bertanggung jawab.
- Identitas user.
- Paket/surat/survey terkait jika ada.
- Langkah berikutnya.
- Risiko jika terlewat.
- Tombol aksi.
- Tombol lihat detail.

Contoh struktur visual:

```text
[Prioritas] [Status]                 [Batas waktu]
Judul tugas
Modul asal - entity terkait
Langkah berikutnya
Risiko jika terlewat
[Lihat Detail] [Kerjakan]
```

Aturan data:

- Entity terkait hanya tampil jika user memiliki akses.
- Jika data belum resmi, tampilkan badge `Persiapan`, `Demo`, atau `Simulasi`.
- Jika assignment kosong, jangan tampilkan contoh tugas palsu.
- Jika role read-only, tombol aksi tulis disembunyikan dan diganti `Lihat Detail`.

## I. State Tugas Saya

| State | Desain | Pesan/aturan |
|---|---|---|
| Loading | Skeleton card lembut | `Memuat tugas Anda...` |
| Ada tugas aktif | Card prioritas + tindakan | Tampilkan tugas scoped, status, prioritas, dan route detail |
| Tidak ada tugas aktif tetapi pernah menyelesaikan tugas | Empty ringan + Tugas Selesai/Riwayat Apresiasi | `Tidak ada tugas aktif saat ini. Lihat tugas selesai atau riwayat apresiasi.` |
| User aktif tetapi belum ada assignment | Empty Assignment State | Tampilkan identitas user sendiri dan arahan kontak |
| Error mengambil data | Error card jelas | `Tugas belum berhasil dimuat. Coba lagi atau hubungi admin.` |
| Forbidden karena tidak punya akses | Access card, bukan dummy | Arahkan ke halaman akses dibatasi atau pesan role tidak berwenang |
| Data demo/simulasi jika hanya contoh desain | Badge wajib | Jangan tampilkan sebagai tugas resmi |

## J. Empty Assignment State

Pesan wajib:

> "Selamat datang di SIAGA-SDA. Akun Anda sudah aktif, tetapi saat ini belum ada tugas yang diberikan kepada Anda. Tugas baru akan muncul di menu Tugas Saya setelah admin atau pejabat berwenang memberikan penugasan."

Tambahan untuk internal/ASN:

- Nama lengkap.
- NIP.
- Role SIAGA-SDA.
- Unit/Bidang jika tersedia.

Tambahan untuk eksternal:

- Nama personel.
- Nama perusahaan.
- Posisi di perusahaan.
- Role/Penugasan SIAGA-SDA.

Aturan:

- Ini bukan error.
- Ini bukan forbidden.
- Jangan tampilkan data user lain.
- Jangan tampilkan dummy.
- Jangan buka semua data karena assignment kosong.
- Beri arahan hubungi Admin Bidang, PPK, PPTK, Kabid, atau petugas berwenang.
- Tetap sediakan akses ke Pengaturan Profil bila user boleh mengaksesnya.
- Jangan tampilkan paket/surat/survey/approval yang bukan assignment user.

Visual:

```text
[Ikon SIAGA-SDA lembut]
Belum Ada Tugas
Selamat datang di SIAGA-SDA...

Identitas:
- Nama / NIP / Role / Unit
atau
- Nama personel / Perusahaan / Posisi / Role

Apa berikutnya?
Tugas baru akan muncul otomatis di Tugas Saya...

[Lihat Profil] [Hubungi Admin]
```

## K. Success Appreciation Balloon

Struktur balloon:

- Logo SIAGA-SDA kecil.
- Icon centang sukses.
- Heart kecil sebagai aksen.
- Judul `Terima kasih`.
- Identitas user.
- Aksi berhasil.
- Langkah berikutnya.
- Risiko yang dicegah.
- Tombol `Lihat Detail`.
- Tombol `Lanjutkan`.
- Tombol `Tutup`.

Aturan:

- Hanya muncul jika aksi benar-benar sukses.
- Tidak muncul jika aksi gagal.
- Tidak menggantikan Audit Log.
- Tidak tampil terlalu sering.
- Aksi kecil cukup toast singkat.
- Aksi penting memakai balloon lengkap.
- Harus bisa dimatikan nanti di Pengaturan.
- Tidak menampilkan NIP ASN kepada eksternal.
- Tidak tampil sebagai bukti formal audit.
- Tidak membuat data resmi palsu.

Level:

1. Toast singkat untuk aksi kecil.
2. Balloon tugas untuk tugas workflow.
3. Balloon penting untuk approval, disposisi, verifikasi, arsip, atau keputusan formal.

## L. Animasi Logo SIAGA-SDA + Heart

Spesifikasi:

- Logo SIAGA-SDA kecil muncul dengan fade-in.
- Centang sukses muncul setelah logo.
- Heart kecil pulse satu kali.
- Sparkle sangat halus jika diperlukan.
- Durasi animasi 0.8-1.5 detik.
- Balloon tampil 4-6 detik.
- Reduced motion harus didukung nanti.
- Jangan seperti game.
- Jangan terlalu heboh.
- Jangan mengganggu user lapangan.
- Jangan menambah blur halaman jika bukan modal.

Timing konseptual:

```text
0.00s logo fade-in
0.20s centang muncul
0.35s heart pulse satu kali
0.80s konten teks stabil
4-6s auto-dismiss jika tidak ada interaksi
```

## M. Contoh Pesan Balloon

| Skenario | Contoh pesan |
|---|---|
| Admin Bidang menambahkan user | Terima kasih, `Nama Admin Bidang` (`Admin Bidang`). User baru berhasil disiapkan. Langkah berikutnya: berikan assignment agar tugas muncul di Tugas Saya. Risiko yang dicegah: akun aktif tanpa arah kerja. |
| User baru login tapi belum punya tugas | Selamat datang, `Nama User` (`Role SIAGA-SDA`). Akun Anda aktif, tetapi belum ada tugas yang diberikan. Langkah berikutnya: tunggu assignment dari admin atau pejabat berwenang. Risiko yang dicegah: data luar scope tidak ditampilkan. |
| Kabid melakukan disposisi | Terima kasih, `Nama Kabid` (`Kepala Bidang`). Disposisi berhasil dicatat. Langkah berikutnya: role teknis menerima tugas tindak lanjut. Risiko yang dicegah: surat atau laporan tertahan tanpa arahan. |
| Tim Survey upload hasil survey | Terima kasih, `Nama Surveyor` (`Tim Survey`). Hasil survey berhasil diunggah. Langkah berikutnya: Kabid/PPK/PPTK menilai rekomendasi. Risiko yang dicegah: keputusan tanpa bukti lapangan. |
| PPK approve paket | Terima kasih, `Nama PPK` (`PPK`). Approval paket berhasil dicatat. Langkah berikutnya: Admin Sub Kegiatan/PPTK/penyedia menindaklanjuti status. Risiko yang dicegah: approval tertunda dan status paket tidak sinkron. |
| PPTK update progres | Terima kasih, `Nama PPTK` (`PPTK`). Progress kegiatan berhasil diperbarui. Langkah berikutnya: PPK atau pengawas dapat mereview. Risiko yang dicegah: progres lapangan tidak sesuai dashboard. |
| Direksi Teknis upload catatan pengawasan | Terima kasih, `Nama Direksi Teknis`. Catatan pengawasan berhasil diunggah. Langkah berikutnya: PPK/PPTK meninjau deviasi atau masalah. Risiko yang dicegah: pekerjaan tanpa catatan teknis. |
| Kontraktor upload foto progres | Terima kasih, `Nama Personel`, `Nama Perusahaan`, `Kontraktor`. Foto progres berhasil diunggah. Langkah berikutnya: pengawas atau PPK/PPTK melakukan review. Risiko yang dicegah: progres tanpa bukti dokumentasi. |
| Konsultan Pengawasan upload laporan | Terima kasih, `Nama Personel`, `Nama Perusahaan`, `Konsultan Pengawasan`. Laporan pengawasan berhasil dikirim. Langkah berikutnya: Direksi Teknis/PPK/PPTK meninjau. Risiko yang dicegah: bukti pengawasan tidak terdokumentasi. |
| Auditor membuka riwayat audit | Terima kasih, `Nama Auditor` (`Auditor`). Riwayat audit berhasil dibuka sesuai scope. Langkah berikutnya: lanjutkan pemeriksaan bukti. Risiko yang dicegah: pemeriksaan tanpa jejak formal. |

## N. Riwayat Apresiasi

Desain:

- Card/list riwayat.
- Filter modul.
- Filter status.
- Filter tanggal.
- Status sudah dibaca/belum.
- Link detail.
- Badge sumber data bila relevan.
- Bedakan dengan Audit Log formal.

Isi data:

- Waktu.
- Nama user.
- NIP jika internal dan diizinkan.
- Perusahaan/posisi jika eksternal.
- Role.
- Modul.
- Aksi.
- Status tugas.
- Langkah berikutnya.
- Link detail.

Aturan:

- Riwayat apresiasi adalah UX-friendly.
- Audit Log tetap sumber formal.
- Jangan mencampur riwayat apresiasi dengan audit formal tanpa aturan.
- Jika aksi gagal, jangan membuat riwayat apresiasi sukses.
- Jika data rollback, riwayat apresiasi harus ikut ditandai batal atau tidak dibuat.

## O. Risiko UI/UX

| Risiko | Dampak | Mitigasi | Catatan implementasi nanti |
|---|---|---|---|
| Balloon terlalu sering | User terganggu | Batasi level dan frekuensi | Aksi kecil cukup toast |
| Animasi terlalu ramai | Tidak cocok untuk aplikasi pemerintah | Durasi pendek, heart kecil, sparkle opsional | Hormati reduced motion |
| NIP bocor ke eksternal | Risiko privasi | Masking identitas berdasarkan tipe user | Validasi role sebelum render |
| User mengira apresiasi sebagai bukti audit formal | Salah tafsir audit | Label bahwa Audit Log tetap catatan formal | Link ke Audit Log bila role berhak |
| Empty assignment dianggap error | User bingung | Pesan jelas `Belum Ada Tugas` | Bukan forbidden |
| Mobile tertutup balloon | Tombol penting sulit ditekan | Letak di atas bottom nav, ukuran ringkas | Hindari saat keyboard aktif |
| User melihat data luar scope | Kebocoran data | Assignment scope wajib sebelum render | Jangan fallback ke global |
| Data dummy tampil sebagai tugas resmi | Keputusan salah | Badge Demo/Persiapan/Simulasi wajib | Jangan tampilkan dummy di Tugas Saya resmi |
| Balloon muncul padahal aksi gagal | User mengira data tersimpan | Render hanya setelah response sukses | Error state terpisah |
| Modal Dashboard terganggu | Detail modal tidak nyaman | Jangan tampil di background blur; tahan atau tampil dalam konteks modal | Modal 4D.2 tetap prioritas |

## P. Wireframe Teks

### 1. Dashboard Desktop dengan Tugas Saya

```text
[Header Command Center]
[Ringkasan Hari Ini: KPI compact]

+------------------------------+------------------------------+
| Tugas Saya                   | Risiko / Keterlambatan       |
| - Tugas prioritas 1          | - Risiko 1                   |
| - Tugas prioritas 2          | - Risiko 2                   |
| - Tugas prioritas 3          | [Lihat Risiko]               |
| [Lihat Semua Tugas]          |                              |
+------------------------------+------------------------------+

+------------------------------+------------------------------+
| Tugas Selesai                | Langkah Berikutnya           |
| - Item selesai terbaru       | - Arahan tindak lanjut       |
| - Item selesai terbaru       | - Approval/review berikutnya |
+------------------------------+------------------------------+

[Riwayat Apresiasi ringkas]
```

### 2. Dashboard Mobile dengan Tugas Saya

```text
[Header Scope + Data Source]
[Ringkasan Hari Ini]

[Tugas Saya]
  [Card tugas 1]
  [Card tugas 2]
  [Lihat Semua]

[Langkah Berikutnya]
[Tugas Selesai]
[Riwayat Apresiasi]
[Risiko/Keterlambatan]
```

### 3. Empty Assignment Card

```text
+--------------------------------+
| SIAGA-SDA                      |
| Belum Ada Tugas                |
| Akun Anda sudah aktif...       |
|                                |
| Identitas Anda                 |
| Nama / NIP / Role / Unit       |
|                                |
| Tugas baru muncul otomatis...  |
| [Lihat Profil] [Hubungi Admin] |
+--------------------------------+
```

### 4. Success Appreciation Balloon

```text
+----------------------------------+
| [Logo] [Centang]        [Heart]  |
| Terima kasih                    |
| Nama User - Role                |
| Aksi berhasil                   |
| Langkah berikutnya              |
| Risiko yang dicegah             |
| [Lihat Detail] [Lanjutkan] [X]  |
+----------------------------------+
```

### 5. Riwayat Apresiasi

```text
[Filter Modul] [Filter Status] [Filter Tanggal]

- 10:15  Survey  Selesai
  Nama User - Role
  Hasil survey berhasil dikirim
  [Lihat Detail]

- 09:30  Approval  Selesai
  Nama PPK - PPK
  Approval paket berhasil dicatat
  [Lihat Detail]
```

## Q. Rekomendasi Implementasi Berikutnya

- UX-C: frontend skeleton Tugas Saya dan Balloon tanpa data resmi.
- RBAC-B: helper assignment scope dan policy read-only.
- 5I: migration schema Surat hanya jika backup database dan persetujuan eksplisit sudah ada.
- Jangan langsung implement semua modul sekaligus.
- Mulai dari skeleton dan state UI tanpa mengubah source data.
- Setelah skeleton stabil, integrasikan aksi sukses yang sudah punya response stabil.
- Pastikan setiap agregat dan tugas mengikuti assignment scope.
- Pastikan modal Dashboard 4D.2 tetap tidak terganggu.

## File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/audit/SIAGA_SDA_TAHAP_5IB_FINAL_GATE_MIGRATION_SURAT.md`
- `docs/audit/SIAGA_SDA_RBAC_A_MATRIKS_TUGAS_HAK_AKSES_ROLE.md`
- `docs/design/SIAGA_SDA_UX_A_SUCCESS_APPRECIATION_BALLOON_DAN_TUGAS_SAYA.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`
- `src/lib/navigation.ts`
- `src/store/useAppStore.ts`
- `prisma/schema.prisma`

## Backup yang Dibuat

Backup dibuat di:

`backup/backup-ux-b-tugas-saya-balloon-before-change/`

Isi backup:

- `AGENTS.md`
- `docs/audit/SIAGA_SDA_RBAC_A_MATRIKS_TUGAS_HAK_AKSES_ROLE.md`
- `docs/design/SIAGA_SDA_UX_A_SUCCESS_APPRECIATION_BALLOON_DAN_TUGAS_SAYA.md`
- `docs/design/SIAGA_SDA_DASHBOARD_FIXED_RIGHT_INSPECTOR_TAHAP_4D2.md`
- `docs/design/SIAGA_SDA_LOGIN_FINAL_LOCK.md`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/lib/rbac.ts`
- `src/lib/roles.ts`

## Hal yang Tidak Disentuh

- Source runtime.
- `src/app/(dashboard)/dashboard/page.tsx`.
- Komponen Dashboard.
- Modal Dashboard 4D.2.
- Halaman login.
- Auth/NextAuth/middleware.
- RBAC runtime.
- Role runtime.
- `prisma/schema.prisma`.
- Migration.
- Database.
- Prisma generate/migrate/db push.
- `package.json` dan dependency.
- API baru.
- Komponen React runtime.

