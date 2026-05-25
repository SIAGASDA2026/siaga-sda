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

## Aturan Navigasi dan Clickable Data

- Semua menu dan navigasi penting wajib terlihat tanpa zoom in/out pada desktop, tablet, dan mobile.
- Semua card, angka, tabel, list, dokumen, laporan, status, panel kanan, dan ringkasan data yang relevan wajib bisa diklik menuju tab asal, detail data, atau sumber data terkait.
- Setiap sub menu, sub tab, halaman detail, mode drill-down, form tambah/edit, atau hasil filter khusus wajib menyediakan tombol `Kembali`.
- Semua klik tetap mengikuti role, permission, dan assignment existing.
- Jangan membuat tombol atau link palsu. Jika data belum punya tujuan nyata, tampilkan sebagai informasi non-clickable.
- Perubahan UI tidak boleh merusak auth, role, API, database, state, route, logic lama, atau audit trail.
- Sebelum editing UI, backup file ke folder `backup-ui`.
- Desain wajib dicek untuk desktop 1366px, desktop besar, tablet, dan mobile 360-430px.
