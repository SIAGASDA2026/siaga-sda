<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Security Rules

> Dokumen acuan SIAGA-SDA 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Prinsip Security

1. Password wajib hash, tidak plaintext.
2. Failed login dicatat di audit log.
3. Role tidak dipilih dari login screen.
4. User nonaktif tidak boleh login.
5. User nonaktif tidak boleh approve.
6. Data difilter berdasarkan assignment.
7. File resmi harus memiliki metadata upload.
8. Semua aksi penting masuk audit log.

## Audit Security Event

Catat:
- login
- logout
- failed login
- reset password
- user dibuat
- user diverifikasi
- role diubah
- assignment dibuat/diubah
- approval
- upload dokumen
- perubahan threshold pasang surut

## External Registration

Status:
```text
MENUNGGU_VERIFIKASI
AKTIF
DITOLAK
NONAKTIF
ARSIP
```

## Larangan

- Jangan menyimpan password di Zustand/localStorage.
- Jangan menyimpan token sensitif sembarangan.
- Jangan memberikan akses hanya karena label role di frontend.
- Jangan hard delete user yang punya histori.
