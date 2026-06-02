<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Admin Sub Kegiatan UI

## Role

```text
ADMIN_SUB_KEGIATAN
```

ADMIN_SUB_KEGIATAN adalah role pengelola administrasi dan data paket berdasarkan sub kegiatan yang ditugaskan.

Role `ADMIN_SUB_KEGIATAN` tidak digunakan lagi.

---

## Tujuan Halaman

Halaman ini menjadi ruang kerja khusus ADMIN_SUB_KEGIATAN sesuai assignment aktif.

ADMIN_SUB_KEGIATAN tidak boleh memiliki akses global ke semua sub kegiatan kecuali diberi assignment eksplisit.

---

## Akses Utama

ADMIN_SUB_KEGIATAN dapat:

- melihat paket dalam sub kegiatan yang ditugaskan;
- mengelola data administrasi paket dalam sub kegiatan;
- menghubungkan paket dengan program/kegiatan/sub kegiatan;
- mengelola dokumen kontrak/SPK;
- mengelola addendum;
- mengelola SPM/pembayaran;
- mengelola arsip dokumen;
- membantu rekap sub kegiatan;
- melihat status approval terkait paket dalam sub kegiatan.

---

## Batasan

ADMIN_SUB_KEGIATAN tidak boleh:

- mengubah role;
- mengubah workflow approval;
- menghapus paket tanpa izin;
- melihat/mengubah sub kegiatan yang bukan assignment-nya;
- mengambil alih kewenangan PPK/PPTK;
- membuat ulang role ADMIN_SUB_KEGIATAN.

---

## Relasi Modul

ADMIN_SUB_KEGIATAN bekerja terutama pada:

- Paket Pekerjaan;
- Administrasi;
- Approval Center;
- Dashboard rekap sub kegiatan;
- Audit Log;
- Pengaturan terbatas jika diberi izin.

---

## UI

UI harus:

- clean;
- role-based;
- assignment-based;
- responsive desktop/mobile;
- mengikuti SIAGA-SDA Fluent Water Theme.

---

## Empty State

Jika user ADMIN_SUB_KEGIATAN belum memiliki assignment aktif, tampilkan:

```text
Belum Ada Penugasan Aktif

Anda memiliki role Admin Sub Kegiatan, tetapi belum ditugaskan ke sub kegiatan mana pun.
Silakan hubungi Admin Sistem.
```
