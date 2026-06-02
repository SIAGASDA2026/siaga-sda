# LAPORAN REVISI DOKUMENTASI SIAGA-SDA

## Ringkasan

Dokumentasi dalam folder `/docs` sudah disinkronkan dengan keputusan final diskusi SIAGA-SDA.

## Perubahan Utama

1. Project ditegaskan sebagai **SIAGA-SDA**.
2. Instruksi penggantian nama/rebranding ulang dibersihkan dari dokumen aktif.
3. `ADMIN_KEGIATAN` tidak digunakan lagi.
4. Role administrasi kegiatan/sub kegiatan dipusatkan ke `ADMIN_SUB_KEGIATAN`.
5. File role `SIAGA_SDA_ADMIN_KEGIATAN_UI.md` diganti menjadi `SIAGA_SDA_ADMIN_SUB_KEGIATAN_UI.md`.
6. Istilah “Menjadi Paket” diganti menjadi “Ditindaklanjuti”.
7. Menu utama final dikunci:
   - Dashboard
   - Peta Monitoring
   - Survey Investigasi
   - Paket Pekerjaan
   - Approval Center
   - Surat Masuk & Keluar
   - Administrasi
   - Peil Banjir
   - Asset SDA
   - Audit Log
   - Pengaturan
8. Master Data diarahkan ke Pengaturan, bukan menu utama.
9. Operasional SDA diarahkan sebagai sub-tab Asset SDA.
10. Notulen & Tindak Lanjut Rapat diarahkan sebagai sub-fitur Surat Masuk & Keluar.
11. Laporan diarahkan sebagai export/rekap Dashboard pada tahap awal.
12. Warning Center diarahkan sebagai panel Dashboard + icon notifikasi.
13. Login dilarang memakai Google/Microsoft/social login dan dropdown role.
14. Dashboard dilarang memuat peta interaktif besar.
15. Peta Monitoring ditegaskan sebagai pusat spasial utama.
16. Direksi Teknis wajib tetap ada pada paket fisik.
17. Petugas biasa tidak wajib login.
18. Mandor wajib login dan memilih petugas dari master data.
19. Foto absensi dihapus.
20. Codex wajib audit dan mapping sistem aktual sebelum coding.

## File Yang Diubah / Dibuat

Total file yang tersentuh: 46

```text
docs/archive/SIAGA_SDA_HISTORY_NOTE.md
docs/auth/SIAGA_SDA_LOGIN_AUTH_UI.md
docs/auth/SIAGA_SDA_PERMISSION_SYSTEM.md
docs/auth/SIAGA_SDA_SECURITY_RULES.md
docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md
docs/core/SIAGA_SDA_MASTER_CODEX_GUIDE_FINAL.md
docs/core/SIAGA_SDA_SYSTEM_ARCHITECTURE.md
docs/core/SIAGA_SDA_WORKFLOW_MASTER.md
docs/database/SIAGA_SDA_DATABASE_RULES.md
docs/database/SIAGA_SDA_DATABASE_SCHEMA.md
docs/database/SIAGA_SDA_STORAGE_RULES.md
docs/design/SIAGA_SDA_DESIGN_SYSTEM.md
docs/design/SIAGA_SDA_LOGO_GUIDELINE.md
docs/design/SIAGA_SDA_UI_DIRECTION.md
docs/modules/SIAGA_SDA_APPROVAL_CENTER_UI.md
docs/modules/SIAGA_SDA_ASSET_UI.md
docs/modules/SIAGA_SDA_AUDIT_LOG_UI.md
docs/modules/SIAGA_SDA_DASHBOARD_UI.md
docs/modules/SIAGA_SDA_MAP_MONITORING_UI.md
docs/modules/SIAGA_SDA_PACKAGE_WORKSPACE_UI.md
docs/modules/SIAGA_SDA_PASANG_SURUT_GRAFIK_UI.md
docs/modules/SIAGA_SDA_PEIL_UI.md
docs/modules/SIAGA_SDA_REPORT_EXPORT_UI.md
docs/modules/SIAGA_SDA_SURAT_UI.md
docs/modules/SIAGA_SDA_SURVEY_UI.md
docs/operational/SIAGA_SDA_OPERASIONAL_SDA_UI.md
docs/operational/SIAGA_SDA_PASANG_SURUT_SYSTEM.md
docs/operational/SIAGA_SDA_REKAP_KEHADIRAN.md
docs/operational/SIAGA_SDA_SHIFT_SYSTEM.md
docs/prompts/SIAGA_SDA_CODEX_PROMPTS_STEP_BY_STEP.md
docs/prompts/SIAGA_SDA_CODEX_PROMPTS_STEP_BY_STEP_UPDATED.md
docs/roles/SIAGA_SDA_ADMIN_PEIL_UI.md
docs/roles/SIAGA_SDA_ADMIN_SUB_KEGIATAN_UI.md
docs/roles/SIAGA_SDA_ADMIN_SURAT_UI.md
docs/roles/SIAGA_SDA_ADMIN_SYSTEM_UI.md
docs/roles/SIAGA_SDA_DASHBOARD_PIMPINAN.md
docs/roles/SIAGA_SDA_DIREKSI_TEKNIS_UI.md
docs/roles/SIAGA_SDA_KONSULTAN_PENGAWAS_UI.md
docs/roles/SIAGA_SDA_KONSULTAN_PERENCANA_UI.md
docs/roles/SIAGA_SDA_KONTRAKTOR_UI.md
docs/roles/SIAGA_SDA_MANDOR_OPERASIONAL_UI.md
docs/roles/SIAGA_SDA_MANDOR_REHAB_UI.md
docs/roles/SIAGA_SDA_PPHP_UI.md
docs/roles/SIAGA_SDA_PPK_UI.md
docs/roles/SIAGA_SDA_PPTK_UI.md
docs/roles/SIAGA_SDA_SUPER_ADMIN_UI.md
```

## File Khusus

- `AGENTS.md` dibuat di root folder hasil revisi.
- `docs/archive/SIAGA_SDA_HISTORY_NOTE.md` dibuat sebagai catatan non-aktif.
- `docs/prompts/SIAGA_SDA_CODEX_PROMPTS_STEP_BY_STEP_UPDATED.md` dibuat sebagai prompt bertahap terbaru.

## Catatan Untuk Codex

Gunakan prompt audit terlebih dahulu. Jangan langsung coding besar.

Dokumen ini tidak menjamin semua tabel/route/role sudah ada di sistem aktual. Codex wajib mapping terlebih dahulu.
