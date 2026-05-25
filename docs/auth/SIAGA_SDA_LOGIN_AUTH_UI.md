# SIAGA-SDA Login Auth UI

> Dokumen acuan SIAGA-SDA / SIMONPRO 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Tujuan Login

Login harus resmi, sederhana, audit-safe, dan tidak membingungkan user.

## Field Login

```text
Username / Email / NIP
Password
[Masuk]
Lupa Password
Daftar Akun Eksternal
```

## Tidak Boleh Ada

- Login Google
- Login Microsoft
- Login sosial
- Role dropdown di login utama

Role ditentukan setelah login berdasarkan database/assignment, bukan dipilih manual.

## Konten Login

Wajib menampilkan:

```text
SIAGA-SDA
Sistem Informasi, Analisis, Gerak Cepat dan Administrasi Sumber Daya Air
Command Center SDA

Dinas Pekerjaan Umum
Bidang Sumber Daya Air
Kota Dumai
```

## Panel Status

```text
Server Online
Database Aktif
Peta Monitoring Aktif
Pasang Surut Terpantau
Peringatan SDA Normal
```

## Footer

```text
SIAGA-SDA
©2026 Budi Legawan, ST
All Rights Reserved
```

## Mobile Login

- Logo jangan terlalu besar.
- Font mobile ringkas.
- Form login mudah diklik.
- Tombol utama jelas.
- Footer tetap tampil, namun tidak memakan ruang.
