# SIAGA-SDA Halo Final Lock

## 1. Status Final Halo

`Halo SIAGA-SDA` dinyatakan sebagai standar final UI panduan lokal setelah tahap UX-C5.

Lock ini mengunci nama, mode, urutan panel, fallback jadwal, dan guard role-aware agar Halo tidak berubah sembarangan pada tahap berikutnya.

Commit acuan:

```text
0c68455 feat: tambah kendali waktu pekerjaan di halo
```

## 2. Nama Baku Fitur

Nama fitur wajib tetap:

```text
Halo SIAGA-SDA
```

Jangan mengganti nama menjadi AI Assistant generik, chatbot umum, task bot, atau nama lain tanpa instruksi eksplisit.

## 3. Mode Panduan Lokal

Halo SIAGA-SDA wajib tetap berada dalam mode:

- panduan lokal;
- belum menggunakan AI eksternal;
- belum membaca database misi resmi;
- belum melakukan perubahan data;
- belum menjadi alat approval resmi;
- belum mengirim notifikasi resmi;
- belum membaca SOP resmi secara otomatis.

Copy yang wajib dipertahankan secara makna:

```text
Mode Panduan Lokal
```

dan:

```text
Panel ini masih dalam mode panduan lokal, belum membaca misi resmi, dan belum melakukan perubahan data.
```

## 4. Standar Role-Aware Suggestion

Suggestion/FAQ Halo wajib tetap role-aware dan mengikuti `canAccessPage()`.

Standar guard:

- Peil Banjir hanya tampil jika user bisa akses `/peil`;
- Surat Masuk & Keluar hanya tampil jika user bisa akses `/surat`;
- Approval Center hanya tampil jika user bisa akses `/approval`;
- User Management hanya tampil jika user bisa akses `/pengguna`;
- suggestion umum tetap boleh tampil untuk semua user Dashboard;
- role tanpa akses tidak boleh diberi copy yang seolah-olah dapat membuka modul.

Jangan membuka akses baru dari Halo. Halo hanya menjelaskan akses yang sudah diberikan oleh RBAC frontend.

## 5. Standar Card Waktu

Label countdown harian wajib:

```text
Sisa waktu misi harian
```

Card jadwal pekerjaan wajib:

```text
Kendali Waktu Pekerjaan
```

Card `Kendali Waktu Pekerjaan` boleh membaca data existing yang sudah tersedia di frontend/store, misalnya:

- `tanggalMulai`;
- `tanggalSelesai`;
- jadwal tugas/kontrak jika kelak tersedia.

Card tidak boleh membuat endpoint baru, field baru, form admin, atau countdown palsu.

## 6. Standar Fallback Data Jadwal

Jika data tanggal pekerjaan tidak tersedia, fallback wajib:

```text
Jadwal pekerjaan belum tersedia.
```

Copy pendamping wajib tetap jujur secara makna:

```text
Data waktu akan mengikuti jadwal tugas atau kontrak jika sudah tersedia di sistem.
```

Tidak boleh menampilkan angka countdown jika tanggal akhir tidak tersedia atau tidak valid.

## 7. Standar Posisi Card Panduan

Tiga card panduan berikut wajib berada di bagian bawah panel Halo, tepat di atas area `Tanya Halo SIAGA-SDA`:

1. `Panduan Role Saya`
2. `Panduan Halaman Aktif`
3. `Mengapa Menu Tidak Muncul?`

Isi card boleh diperbarui hanya untuk menyelaraskan SOP/role resmi, tetapi posisinya tidak boleh dipindahkan tanpa instruksi eksplisit.

## 8. Standar Desktop dan Mobile

Panel Halo wajib tetap:

- aman di desktop dan mobile;
- tidak melebar keluar layar;
- memakai scroll internal;
- memiliki close button yang mudah dijangkau;
- berada di bawah modal Dashboard/Approval secara z-index;
- tidak mengubah shared modal portal;
- tidak menimpa modal Dashboard 4D.2;
- tidak menimpa Approval Center runtime.

Standar struktur yang perlu dijaga:

- floating button tetap `Halo SIAGA-SDA`;
- panel memakai `fixed inset-0` sebagai area overlay Halo;
- body panel memakai `overflow-y-auto` / scroll internal;
- ukuran mobile dibatasi agar tidak overflow horizontal;
- z-index Halo tidak boleh dinaikkan sampai mengalahkan modal utama.

## 9. Hal yang Tidak Boleh Diubah Tanpa Instruksi Eksplisit

Jangan mengubah hal berikut hanya karena mengerjakan modul lain:

- nama `Halo SIAGA-SDA`;
- mode panduan lokal;
- role-aware FAQ/suggestion;
- guard Peil/Surat/Approval/User Management;
- label `Sisa waktu misi harian`;
- card `Kendali Waktu Pekerjaan`;
- fallback `Jadwal pekerjaan belum tersedia.`;
- posisi tiga card panduan;
- z-index Halo;
- layout modal Dashboard 4D.2;
- Approval Center runtime;
- Auth / NextAuth;
- middleware;
- Prisma schema;
- migration;
- database;
- seed;
- endpoint API;
- package/dependency.

## 10. Tahap Berikutnya yang Boleh Dilakukan

Tahap lanjutan yang aman:

- audit visual manual Halo pada desktop/mobile setelah ada perubahan besar lain;
- sinkronisasi copy Halo dengan SOP resmi setelah SOP disetujui;
- desain adapter tugas/jadwal resmi sebelum membaca data misi database;
- desain AI/SOP resmi hanya setelah scope, privacy, audit trail, dan RBAC disetujui;
- audit integrasi addendum/perpanjangan waktu pada tahap kontrak khusus.

Tidak boleh langsung menghubungkan Halo ke AI eksternal, database resmi, atau aksi approval tanpa desain tahap khusus.
