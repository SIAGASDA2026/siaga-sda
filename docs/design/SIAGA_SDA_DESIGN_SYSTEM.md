<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Design System

> Dokumen acuan SIAGA-SDA 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.



## Instruksi Wajib untuk Codex

1. Project ini adalah SIAGA-SDA, sistem aktif yang sedang dikembangkan bertahap.
2. Jangan rebuild total dan jangan menghapus sistem lama tanpa audit.
3. Semua perubahan database wajib melalui migration Supabase.
4. Semua UI wajib responsive untuk laptop/desktop dan mobile/phone.
5. Jangan hardcode role, permission, status, atau assignment.
6. Semua aksi penting wajib tercatat ke audit log.
7. Data lama harus dipertahankan sejauh mungkin.
8. Setelah perubahan, jalankan build, lint/typecheck, dan cek tampilan desktop + mobile.


## Filosofi UI

SIAGA-SDA harus terasa seperti:

```text
Smart Government Command Center SDA
```

Bukan aplikasi CRUD biasa, bukan ERP jadul, bukan tampilan gaming/neon.

## Warna Utama

```css
:root {
  --dark-navy: #0D2C54;
  --primary-blue: #1976D2;
  --cyan-info: #00ACC1;
  --success-green: #43A047;
  --warning-orange: #FFB300;
  --danger-red: #E53935;
  --main-bg: #F4F7FA;
  --card-bg: #FFFFFF;
  --soft-gray: #E9EEF5;
  --text-primary: #1B2430;
  --text-secondary: #5C6B7A;
  --text-muted: #8A97A6;
}
```

## Typography

```css
font-family: Inter, system-ui, sans-serif;
```

| Elemen | Ukuran | Weight |
|---|---:|---:|
| H1 | 40px | 700 |
| H2 | 32px | 700 |
| H3 | 24px | 600 |
| H4 | 20px | 600 |
| Body Large | 16px | 500 |
| Body | 14px | 400 |
| Caption | 12px | 400 |

## Spacing

Gunakan 4px scale:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64
```

## Radius dan Shadow

```css
--radius-card: 16px;
--radius-modal: 20px;
--radius-button: 12px;
--radius-small: 8px;

--shadow-card: 0 4px 12px rgba(13,44,84,0.08);
--shadow-floating: 0 8px 24px rgba(13,44,84,0.12);
```

## Desktop dan Mobile

Setiap perubahan UI wajib punya:
- Layout desktop/laptop.
- Layout mobile/phone.
- Sidebar desktop yang bisa minimize/maximize.
- Bottom navigation atau compact menu untuk mobile.
- Ukuran font mobile tidak terlalu besar.
- Card mobile ringkas dan mudah dibaca.
