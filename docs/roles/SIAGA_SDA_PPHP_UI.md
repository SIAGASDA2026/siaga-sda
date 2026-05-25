# SIAGA-SDA PPHP UI

> Dokumen acuan SIAGA-SDA / SIMONPRO 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Role

```text
PPHP
```

## Tujuan Halaman

Halaman ini menjadi ruang kerja khusus role `PPHP` sesuai assignment aktif, bukan akses global sembarangan.

## Hak Akses Utama

- Pemeriksaan hasil pekerjaan
- Checklist dokumen
- Punch list
- BA PHO
- BA FHO

## Tidak Boleh

- Mengubah kontrak tanpa kewenangan

## Komponen UI Desktop

- Header role dan ringkasan assignment aktif.
- Kartu statistik ringkas.
- Daftar tugas/pending item.
- Filter tahun anggaran, kegiatan, paket, status.
- Tabel desktop dengan action jelas.
- Detail drawer untuk melihat data tanpa pindah konteks.

## Komponen UI Mobile

- Header ringkas.
- Card list pengganti tabel.
- Filter collapsible.
- Tombol aksi utama sticky di bawah bila diperlukan.
- Font dan padding disesuaikan agar tidak boros ruang.

## Audit Log

Semua aksi create/update/approval/upload/catatan wajib masuk audit log dengan:
- actor_user_id
- action
- entity_type
- entity_id
- old_data
- new_data
- created_at
