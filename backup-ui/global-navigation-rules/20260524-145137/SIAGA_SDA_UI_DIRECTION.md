# SIAGA-SDA UI Direction

> Dokumen acuan SIAGA-SDA / SIMONPRO 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Arah Visual

UI harus modern, clean, government enterprise, command center, map-centric, mobile-first, cepat dibaca, ringan, profesional, dan konsisten.

## Struktur Layout Desktop

```text
Sidebar kiri
├── Logo + nama aplikasi
├── Menu utama
└── User/account area

Topbar
├── Breadcrumb
├── Search global
├── Notifikasi
└── Profil

Content
├── Header halaman
├── Summary card
├── Filter
├── Data table / map / workspace
└── Detail drawer
```

## Struktur Layout Mobile

```text
Top compact header
├── Logo kecil
├── Judul halaman
└── Menu button

Content
├── Card ringkas
├── Filter collapsible
├── List card
└── Bottom action

Navigation
└── Bottom nav / drawer menu
```

## Prinsip Komponen

- Gunakan card putih di atas background soft gray.
- Gunakan warna status yang konsisten.
- Gunakan drawer untuk detail, bukan pindah halaman terus-menerus.
- Gunakan badge status yang jelas.
- Hindari tabel lebar di mobile; ubah menjadi card list.
- Jangan tampilkan peta besar di dashboard.
