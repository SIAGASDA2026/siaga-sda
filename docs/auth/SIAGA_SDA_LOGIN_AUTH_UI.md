<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Login Auth UI

> Dokumen acuan SIAGA-SDA 2026  
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

---

# UPDATE FINAL LOGIN

Login menggunakan Email/NIP/Username dan Password.

Dilarang:
- Google Login
- Microsoft Login
- Social Login
- Dropdown pilih role di login

Login menampilkan:
- Logo SIAGA-SDA
- Kepanjangan SIAGA-SDA
- Command Center SDA
- Dinas PU Bidang SDA Kota Dumai
- Widget pasang surut
- Waktu salat
- Status sistem
- Footer resmi
