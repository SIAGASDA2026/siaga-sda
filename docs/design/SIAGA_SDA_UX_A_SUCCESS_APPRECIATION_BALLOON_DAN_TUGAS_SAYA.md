# SIAGA-SDA UX-A - Success Appreciation Balloon, Tugas Saya, Riwayat Apresiasi, dan Empty Assignment

Tanggal: 18 Juni 2026  
Commit acuan: `cff1c97 docs: final gate migration surat tahap 5ib`  
Status tahap: dokumen konsep UX setelah 5I-B, belum implementasi runtime

## A. Ringkasan Tujuan UX-A

Tahap UX-A menyusun standar pengalaman pengguna untuk:

- Success Appreciation Balloon setelah aksi berhasil.
- Animasi sukses yang profesional dengan logo SIAGA-SDA, centang sukses, dan heart kecil sebagai aksen lembut.
- Menu `Tugas Saya`, `Tugas Selesai`, `Langkah Berikutnya`, dan `Riwayat Apresiasi`.
- Empty Assignment State untuk user aktif yang belum diberi tugas.

Dokumen ini tidak membuat komponen React, tidak mengubah Dashboard runtime, tidak mengubah modal Dashboard 4D.2, tidak mengubah login, dan tidak mengubah RBAC runtime.

## B. Status

- Konsep UX, belum implementasi runtime.
- Tahap 5I-B sudah selesai.
- RBAC-UX-A dikerjakan setelah 5I-B sebagai tahap konsep sebelum migration.
- Belum membuat komponen React.
- Belum mengubah Dashboard.
- Belum mengubah modal Dashboard 4D.2.
- Belum mengubah login.
- Belum mengubah Prisma schema.
- Schema Prisma asli tetap belum diubah.
- Belum membuat migration.
- Belum mengubah database.
- Belum mengubah Auth, RBAC runtime, endpoint, atau dependency.

File acuan tambahan setelah 5I-B:

- `docs/audit/SIAGA_SDA_TAHAP_5IB_FINAL_GATE_MIGRATION_SURAT.md`

## C. Prinsip UX

- Profesional dan cocok untuk aplikasi pemerintah.
- Ramah tanpa menjadi kekanak-kanakan.
- Mengikuti tema air, biru laut, tosca, navy, dan putih kebiruan.
- Animasi halus, singkat, dan tidak mengganggu pekerjaan.
- Mobile friendly.
- Tidak menutup tombol penting.
- Tidak mengganggu modal aktif.
- Dapat dimatikan di Pengaturan pada tahap implementasi nanti.
- Tidak menampilkan data sensitif tanpa izin.
- Tidak menampilkan data dummy, demo, atau konseptual sebagai tugas resmi.
- Tidak menggantikan Audit Log formal.

## D. Success Appreciation Balloon

Success Appreciation Balloon adalah notifikasi UX yang muncul setelah aksi benar-benar berhasil. Balloon memberi konfirmasi, ucapan terima kasih, konteks tugas, dan langkah berikutnya.

Aksi pemicu:

- Simpan.
- Ubah.
- Upload.
- Kirim.
- Approve.
- Reject.
- Disposisi.
- Verifikasi.
- Tindak Lanjut.
- Arsipkan.
- Selesaikan.
- Tambah Catatan.
- Upload Foto.
- Upload Dokumen.
- Submit Laporan.
- Review Dokumen.

Aturan:

- Hanya muncul jika aksi benar-benar sukses.
- Tidak muncul jika aksi gagal.
- Aksi gagal harus menampilkan error state yang jelas.
- Balloon tidak boleh menggantikan Audit Log.
- Balloon tidak boleh membuat data resmi palsu.
- Balloon tidak boleh muncul terlalu berlebihan.
- Balloon harus mengikuti assignment scope dan role.
- Balloon tidak boleh menampilkan NIP ASN kepada pihak eksternal.

## E. Level Balloon

### 1. Aksi Kecil

Digunakan untuk aksi cepat yang dampaknya rendah.

Contoh pesan:

`Data berhasil disimpan.`

Isi:

- Status sukses.
- Nama aksi.
- Tombol `Tutup` jika diperlukan.

### 2. Aksi Tugas

Digunakan ketika user menyelesaikan tugas yang muncul di Tugas Saya.

Isi:

- Ucapan terima kasih.
- Identitas ringkas user.
- Tugas yang selesai.
- Langkah berikutnya.
- Tombol `Lihat Detail`, `Lanjutkan`, atau `Tutup`.

### 3. Aksi Penting

Digunakan untuk approval, disposisi, verifikasi, tindak lanjut, arsip, dan keputusan penting.

Isi:

- Identitas user.
- Role.
- Tugas selesai.
- Langkah berikutnya.
- Risiko yang dicegah.
- Tombol `Lihat Detail`, `Lanjutkan`, atau `Tutup`.

## F. Identitas di Balloon

### ASN/Internal

Data yang boleh tampil sesuai izin:

- Nama lengkap.
- NIP.
- Role SIAGA-SDA.
- Unit/Bidang jika tersedia.

Catatan:

- NIP hanya tampil kepada user sendiri atau role internal yang berwenang.
- NIP tidak tampil kepada kontraktor/konsultan/pihak eksternal.

### Eksternal

Data yang boleh tampil:

- Nama personel.
- Nama perusahaan.
- Posisi di perusahaan.
- Role/Penugasan SIAGA-SDA.

Catatan:

- Tidak menampilkan NIP ASN lain.
- Tidak menampilkan paket/dokumen eksternal lain di luar assignment.

## G. Contoh Pesan Balloon per Role

Format contoh:

- Terima kasih.
- Identitas.
- Aksi sukses.
- Langkah berikutnya.
- Risiko yang dicegah.

| Role | Contoh pesan |
|---|---|
| Kabid/Kepala Bidang | Terima kasih, `Nama Kabid` (`Kepala Bidang`). Disposisi tindak lanjut berhasil dicatat. Langkah berikutnya: PPK/PPTK atau tim teknis akan menerima tugas di Tugas Saya. Risiko yang dicegah: surat atau laporan tidak tertahan tanpa arahan. |
| PPK | Terima kasih, `Nama PPK` (`PPK`). Keputusan paket/approval berhasil dicatat. Langkah berikutnya: PPTK, Admin Sub Kegiatan, atau penyedia menindaklanjuti sesuai status. Risiko yang dicegah: approval tertunda dan dokumen paket tidak siap audit. |
| PPTK | Terima kasih, `Nama PPTK` (`PPTK`). Update teknis kegiatan berhasil disimpan. Langkah berikutnya: PPK atau Direksi Teknis dapat mereview progres. Risiko yang dicegah: data lapangan tidak sinkron dengan status paket. |
| Direksi Teknis | Terima kasih, `Nama Direksi Teknis`. Catatan pengawasan berhasil dikirim. Langkah berikutnya: PPK/PPTK meninjau catatan dan deviasi. Risiko yang dicegah: progres fisik tanpa bukti teknis. |
| Tim Survey | Terima kasih, `Nama Surveyor` (`Tim Survey`). Survey investigasi berhasil dikirim. Langkah berikutnya: Kabid/PPK/PPTK menilai tindak lanjut. Risiko yang dicegah: aduan atau surat tidak memiliki dasar lapangan. |
| Tim Pengawasan | Terima kasih, `Nama Pengawas` (`Tim Pengawasan`). Laporan pengawasan berhasil masuk. Langkah berikutnya: Direksi Teknis/PPK/PPTK mereview masalah dan progres. Risiko yang dicegah: masalah lapangan terlambat naik. |
| Pejabat Pengadaan | Terima kasih, `Nama Pejabat Pengadaan`. Status pengadaan berhasil diperbarui. Langkah berikutnya: PPK/PPTK meninjau kesiapan paket. Risiko yang dicegah: proses pengadaan tidak terlacak. |
| PPHP | Terima kasih, `Nama PPHP`. Hasil pemeriksaan berhasil dicatat. Langkah berikutnya: PPK menindaklanjuti rekomendasi pemeriksaan. Risiko yang dicegah: serah terima pekerjaan tanpa catatan pemeriksaan. |
| Admin Bidang | Terima kasih, `Nama Admin Bidang`. Data bidang berhasil dipetakan ke workflow yang benar. Langkah berikutnya: role teknis menerima tugas sesuai assignment. Risiko yang dicegah: data masuk tanpa tindak lanjut. |
| Admin Sub Kegiatan | Terima kasih, `Nama Admin Sub Kegiatan`. Dokumen administrasi berhasil disiapkan. Langkah berikutnya: PPK/PPTK atau Approval Center mereview. Risiko yang dicegah: dokumen kontrak/pembayaran tidak siap audit. |
| Konsultan Perencana | Terima kasih, `Nama Personel`, `Nama Perusahaan`, `Konsultan Perencana`. Dokumen perencanaan berhasil dikirim. Langkah berikutnya: PPK/PPTK mereview atau meminta revisi. Risiko yang dicegah: rencana teknis tidak siap diproses. |
| Konsultan Pengawasan | Terima kasih, `Nama Personel`, `Nama Perusahaan`, `Konsultan Pengawasan`. Laporan pengawasan berhasil dikirim. Langkah berikutnya: Direksi Teknis/PPK/PPTK meninjau. Risiko yang dicegah: bukti pengawasan tidak terdokumentasi. |
| Kontraktor | Terima kasih, `Nama Personel`, `Nama Perusahaan`, `Kontraktor`. Laporan/foto pekerjaan berhasil diunggah. Langkah berikutnya: pengawas atau PPK/PPTK mereview. Risiko yang dicegah: progres pekerjaan tidak memiliki bukti. |
| Auditor | Terima kasih, `Nama Auditor` (`Auditor`). Filter/review audit berhasil dibuka. Langkah berikutnya: lanjutkan pemeriksaan bukti sesuai scope. Risiko yang dicegah: temuan audit kehilangan jejak data. |
| Pimpinan | Terima kasih, `Nama Pimpinan` (`Pimpinan`). Ringkasan prioritas berhasil dibuka. Langkah berikutnya: Kabid/PPK menindaklanjuti arahan melalui workflow resmi. Risiko yang dicegah: risiko kritis tidak terlihat pada level keputusan. |

## H. Animasi Sukses

Konsep visual:

- Logo SIAGA-SDA kecil.
- Heart kecil lembut sebagai aksen apresiasi.
- Centang sukses.
- Sparkle halus jika perlu.
- Fade-in.
- Scale ringan.
- Pulse heart satu kali.
- Durasi animasi 0.8 sampai 1.5 detik.
- Balloon tampil 4 sampai 6 detik.
- Desktop: kanan atas atau kanan bawah sesuai konteks halaman.
- Mobile: bawah layar, di atas bottom navigation.

Aturan animasi:

- Jangan terlalu heboh.
- Jangan seperti game.
- Jangan menutup tombol penting.
- Jangan mengganggu modal.
- Jangan membuat halaman belakang blur kecuali memakai modal/balloon standar yang ditentukan.
- Harus tetap nyaman di mobile.
- Harus ada opsi disable animation di Pengaturan nanti.
- Jika user memilih reduced motion, tampilkan versi tanpa animasi bergerak.

## I. Riwayat Apresiasi

Balloon bersifat sementara. Ucapan dan konteks tugas harus tetap tersedia di menu:

- `Dashboard > Tugas Saya`
- `Dashboard > Tugas Selesai`
- `Dashboard > Riwayat Apresiasi`

Isi riwayat:

- Waktu aksi.
- Nama user.
- NIP untuk internal sesuai izin, atau perusahaan/posisi untuk eksternal.
- Role.
- Aksi yang dilakukan.
- Modul terkait.
- Status tugas.
- Langkah berikutnya.
- Link detail jika ada.
- Status sudah dibaca/belum.

Catatan:

- Riwayat apresiasi adalah UX-friendly.
- Audit Log tetap catatan formal.
- Jangan mencampur riwayat apresiasi dengan audit formal tanpa aturan.
- Riwayat apresiasi tidak boleh menjadi bukti tunggal untuk keputusan audit.
- Jika aksi dibatalkan/rollback, riwayat apresiasi harus ikut dikoreksi atau tidak dibuat.

## J. Empty Assignment UX

Kondisi:

- User aktif.
- User bisa login.
- User belum punya assignment/tugas aktif.

Pesan utama:

> "Selamat datang di SIAGA-SDA. Akun Anda sudah aktif, tetapi saat ini belum ada tugas yang diberikan kepada Anda."

Arahan:

> "Tugas baru akan muncul otomatis di menu Tugas Saya setelah admin atau pejabat berwenang memberikan penugasan."

Tambahan:

> "Jika Anda merasa seharusnya sudah mendapatkan tugas, silakan hubungi Admin Bidang, PPK, PPTK, Kabid, atau petugas yang berwenang."

Untuk eksternal:

> "Akun perusahaan Anda sudah aktif, tetapi belum ada paket pekerjaan atau dokumen yang ditugaskan kepada akun ini."

Aturan:

- Bukan error.
- Bukan forbidden.
- Bukan data kosong rusak.
- Jangan tampilkan dummy.
- Jangan tampilkan data user lain.
- Tetap tampilkan identitas user sendiri.
- Beri status `Belum Ada Tugas`.
- Jangan membuka semua data karena assignment kosong.
- Jangan membuat shortcut ke data yang user tidak boleh lihat.

## K. UI Placement

Penempatan yang disarankan:

- `Dashboard > Tugas Saya`
- `Dashboard > Tugas Selesai`
- `Dashboard > Langkah Berikutnya`
- `Dashboard > Riwayat Apresiasi`
- `Pengaturan > Preferensi Tampilan` untuk opsi animasi nanti
- `Audit Log` untuk jejak formal

Catatan:

- Tidak menambah tab utama baru.
- Tugas Saya tetap bagian Dashboard.
- Preferensi animasi tidak perlu masuk implementasi sampai tahap UX runtime disetujui.
- Riwayat formal tetap Audit Log.

## L. Risiko UX

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Balloon terlalu sering | User terganggu dan mengabaikan pesan penting | Batasi frekuensi, gabungkan aksi kecil, gunakan level balloon |
| User menganggap apresiasi sebagai bukti audit formal | Audit formal rancu | Jelaskan Audit Log tetap sumber formal |
| NIP bocor ke eksternal | Risiko privasi dan kepatuhan | Masking identitas berdasarkan tipe user dan role |
| Animasi mengganggu pekerjaan | Petugas lapangan lambat input | Animasi singkat, dapat dimatikan, hormati reduced motion |
| Balloon muncul saat aksi gagal | User mengira data tersimpan | Tampilkan hanya setelah response sukses dan validasi selesai |
| Mobile tertutup balloon | Tombol penting tidak bisa ditekan | Posisi di atas bottom nav, ukuran ringkas, auto-dismiss |
| Empty state dianggap error | User bingung dan melapor salah | Gunakan pesan "Belum Ada Tugas" dan arahan kontak |
| Data dummy tampil sebagai tugas resmi | Keputusan salah | Jangan tampilkan dummy di Tugas Saya; beri badge Demo/Persiapan jika ada contoh |
| Balloon menutup modal | Workflow detail terganggu | Jika modal aktif, tampilkan balloon kecil non-blocking atau tunggu modal ditutup |
| Riwayat apresiasi tidak sinkron dengan status tugas | User melihat tugas selesai padahal rollback | Buat riwayat hanya setelah status final sukses |

## M. Rekomendasi Implementasi Nanti

Urutan implementasi yang direkomendasikan:

1. Finalisasi spesifikasi pesan dan mapping role.
2. Buat helper message builder yang role-aware.
3. Buat tipe frontend untuk appreciation event.
4. Buat komponen Success Appreciation Balloon.
5. Integrasi bertahap pada aksi sukses prioritas.
6. Buat Tugas Saya dengan empty assignment yang jujur.
7. Buat Tugas Selesai dan Langkah Berikutnya.
8. Buat Riwayat Apresiasi.
9. Tambahkan opsi disable animation di Pengaturan.
10. Audit akses dan logging sebelum memperluas ke semua modul.

Jangan sekaligus mengubah semua modul. Mulai dari aksi yang paling jelas dan sudah punya response sukses yang stabil, misalnya update survey, approval action, upload dokumen/foto, dan update progress paket.

## N. Hal yang Tidak Disentuh

- Login.
- Modal Dashboard 4D.2.
- Dashboard visual runtime.
- Prisma schema.
- Migration.
- Database.
- Auth.
- Middleware.
- RBAC runtime.
- Role runtime.
- API Surat.
- Form Surat.
- Endpoint Approval.
- Endpoint Bootstrap.
- `package.json` dan dependency.
