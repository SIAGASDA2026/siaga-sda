# SIAGA-SDA Workflow Master

> Dokumen acuan SIAGA-SDA / SIMONPRO 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.



## Instruksi Wajib untuk Codex

1. Project ini adalah pengembangan SIMONPRO menjadi SIAGA-SDA, bukan project baru.
2. Jangan rebuild total dan jangan menghapus sistem lama tanpa audit.
3. Semua perubahan database wajib melalui migration Supabase.
4. Semua UI wajib responsive untuk laptop/desktop dan mobile/phone.
5. Jangan hardcode role, permission, status, atau assignment.
6. Semua aksi penting wajib tercatat ke audit log.
7. Data lama harus dipertahankan sejauh mungkin.
8. Setelah perubahan, jalankan build, lint/typecheck, dan cek tampilan desktop + mobile.


## Workflow Utama SIAGA-SDA

### 1. Survey Investigasi

```text
Survey dibuat
→ Ditinjau teknis
→ Menunggu Tindak Lanjut
→ Tanggapan/Kebijakan Kabid jika dibutuhkan
→ Approval PPK jika menjadi pekerjaan/administrasi formal
→ Ditindaklanjuti
→ Selesai/Arsip
```

Gunakan istilah:
- Ditindaklanjuti
- Tindak Lanjuti

Jangan gunakan:
- Menjadi Paket
- Jadikan Paket
- Tindak Menjadi Paket

### 2. Paket Fisik

Jika ada Konsultan Pengawas:

```text
Kontraktor
→ Konsultan Pengawas
→ Direksi Teknis
→ PPTK
→ PPK
```

Jika tidak ada Konsultan Pengawas:

```text
Kontraktor
→ Direksi Teknis
→ PPTK
→ PPK
```

### 3. Paket Rutin

```text
Kontraktor/Penyedia
→ Tim Pengawas Rutin
→ PPTK
→ PPK
```

### 4. Konsultan Perencanaan

```text
Penugasan
→ Survey awal
→ Gambar teknis
→ RAB/BOQ/HPS/AHSP
→ Dokumen teknis
→ Review PPTK/PPK
→ Revisi bila perlu
→ Final/Arsip
```

### 5. Surat Masuk Aduan/Permohonan

```text
Surat Masuk
→ Disposisi
→ Survey Investigasi
→ Tanggapan/Tindak Lanjut
→ Paket jika dibutuhkan
→ Selesai/Arsip
```

### 6. Surat Undangan Rapat

```text
Surat masuk
→ Dibaca admin
→ Disposisi Kabid
→ Peserta ditunjuk
→ Rapat dilaksanakan
→ Hasil rapat dicatat
→ Tindak lanjut jika ada
→ Selesai/Arsip
```

### 7. Peil Banjir

```text
Permohonan masuk
→ Survey
→ Pemeriksaan PPTK
→ Approval PPK
→ Surat rekomendasi
→ Selesai/Arsip
```

### 8. PHO/FHO

```text
Kontraktor mengajukan
→ Pengawas/Direksi Teknis memeriksa
→ PPTK memeriksa
→ PPHP memeriksa hasil pekerjaan
→ PPK approve final
→ BA PHO/FHO
→ Arsip
```
