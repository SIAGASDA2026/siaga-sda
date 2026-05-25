# SIAGA-SDA Rebranding Rules

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


## Identitas Lama dan Baru

| Komponen | Ketentuan |
|---|---|
| Nama lama | SIMONPRO |
| Nama baru | SIAGA-SDA |
| Kepanjangan | Sistem Informasi, Analisis, Gerak Cepat dan Administrasi Sumber Daya Air |
| Tagline | Command Center SDA |
| Prinsip | Rebranding dan pengembangan bertahap, bukan project baru |

## Aturan Rebranding

1. Ubah label UI dari SIMONPRO menjadi SIAGA-SDA secara bertahap.
2. Jangan mengubah struktur data lama tanpa mapping.
3. Jangan mengganti nama tabel lama secara langsung bila berisiko merusak aplikasi.
4. Buat compatibility layer bila nama lama masih dipakai oleh kode lama.
5. Footer resmi wajib:
   ```text
   SIAGA-SDA
   ©2026 Budi Legawan, ST
   All Rights Reserved
   ```
6. Nama instansi wajib konsisten:
   ```text
   Dinas Pekerjaan Umum
   Bidang Sumber Daya Air
   Kota Dumai
   ```

## Larangan

- Jangan menganggap SIAGA-SDA sebagai aplikasi kosong.
- Jangan menghapus istilah SIMONPRO dari database lama tanpa audit.
- Jangan menghapus user, paket, survey, file, role, dan histori lama.
- Jangan menaruh watermark/copyright yang berbeda dari ketentuan final.

## Checklist Rebranding

- [ ] Nama aplikasi di login berubah ke SIAGA-SDA.
- [ ] Kepanjangan tampil di bawah logo.
- [ ] Footer resmi diterapkan.
- [ ] Logo baru ditempatkan di `/docs/assets/logo-siaga-sda.png`.
- [ ] Semua halaman utama menggunakan istilah SIAGA-SDA.
- [ ] Referensi internal lama tetap aman melalui compatibility mapping.
