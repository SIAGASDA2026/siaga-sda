# SIAGA-SDA UI-CARD-SYSTEM.2 - Warna Solid dan Efek 3D Card

Tanggal: 22 Juni 2026

## 1. Ringkasan Tahap

Tahap ini memperkuat standar visual card SIAGA-SDA agar card tidak terlalu pucat, hirarki antar canvas/sub-card lebih jelas, dan card interaktif terasa lebih elevated. Perubahan bersifat visual-only pada utility global CSS dan tidak mengubah workflow, role, RBAC, Auth, Prisma, database, route, menu utama, package, dependency, login final, atau modal Dashboard 4D.2.

## 2. Status Acuan

- Commit acuan: `7dd937b feat: rapikan halo dan standar visual card siaga sda`
- UI-CARD-SYSTEM.1 sudah selesai.
- Login final tetap tidak disentuh.
- Dashboard modal 4D.2 tetap tidak disentuh.
- Prisma schema, migration, database, API, Auth, RBAC, route, dan dependency tidak disentuh.

## 3. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/roadmap/ROADMAP_SIAGA_SDA_MENUJU_100_PERSEN.md`
- `docs/audit/SIAGA_SDA_UI_CARD_SYSTEM_1_CANVAS_CARD_STANDARDIZATION.md`
- `docs/audit/SIAGA_SDA_DATA_CONSISTENCY_2_TASK_WARNING_HALO_SOURCE.md`
- `src/app/globals.css`
- `package.json`

## 4. File yang Diubah

- `src/app/globals.css`

## 5. File Baru

- `docs/audit/SIAGA_SDA_UI_CARD_SYSTEM_2_SOLID_3D_CARD_STYLE.md`

## 6. Backup Dibuat

Backup dibuat di:

`backup/backup-ui-card-system-2-solid-3d-before-change/`

File backup:

- `globals.css`

## 7. Masalah Visual Sebelum Revisi

- Beberapa card masih terasa terlalu pucat karena dominan putih/transparan.
- Border antara canvas utama dan sub-card belum cukup tegas.
- Shadow card sudah konsisten, tetapi efek kedalaman masih terlalu ringan pada beberapa konteks.
- Varian warna status masih lembut sehingga kurang cepat dibedakan pada layar mobile atau monitor dengan kontras rendah.
- Card interaktif perlu state hover/selected yang lebih jelas tanpa mengubah logic klik.

## 8. Standar Warna Solid yang Diterapkan

Warna tetap mengikuti SIAGA-SDA Fluent Water Theme, tetapi dibuat lebih solid dan mudah dibaca:

- `siaga-card-info`: biru solid lembut untuk informasi.
- `siaga-card-warning`: amber solid lembut untuk perhatian.
- `siaga-card-critical`: merah/salmon lembut untuk kondisi kritis.
- `siaga-card-success`: hijau solid lembut untuk aman/selesai.
- `siaga-card-recommendation`: cyan/tosca solid lembut untuk rekomendasi.
- `siaga-card-neutral`: slate/putih kebiruan untuk konten netral.

Perubahan ini tidak menambah data, tidak mengubah label, dan tidak mengubah status aplikasi.

## 9. Border dan Efek 3D

Utility yang diperkuat:

- `government-card`
- `siaga-card`
- `siaga-section-canvas`
- `siaga-section-canvas-muted`
- `siaga-card-compact`
- `siaga-card-interactive`
- varian `siaga-card-*`

Perubahan visual:

- border dibuat lebih terlihat dengan opacity lebih tinggi;
- background memakai gradient halus agar tidak datar;
- shadow memakai beberapa layer agar card terasa terangkat;
- inset highlight atas memperjelas permukaan card;
- inset edge bawah memberi kesan kedalaman;
- state `aria-pressed="true"` pada card interaktif dibuat lebih jelas.

## 10. Shadow dan Elevation

Shadow baru tetap soft dan profesional:

- tidak memakai style neon/gaming;
- tidak memakai warna terlalu gelap;
- tidak membuat card terlalu berat secara visual;
- tetap mempertahankan radius dan `min-width: 0` untuk mencegah overflow horizontal;
- hover card interaktif tetap memakai translasi ringan `translateY(-2px)`.

## 11. Dampak ke Halo SIAGA-SDA

Halo SIAGA-SDA terdampak melalui utility global yang sudah dipakai dari UI-CARD-SYSTEM.1:

- canvas Halo lebih terlihat sebagai wadah utama;
- card panduan, peringatan, ringkasan, rekomendasi, dan status lebih terbaca;
- card interaktif lebih jelas tanpa mengubah logika role-aware;
- tidak ada perubahan filter Peil, Surat, Approval, User Management, atau sumber data Halo.

## 12. Dampak ke Dashboard

Dashboard terdampak hanya pada visual utility card:

- KPI, command navigation, decision panel, dan card pendukung yang memakai utility SIAGA mendapat border dan shadow lebih kuat;
- modal Dashboard 4D.2 tidak diubah;
- overlay, blur/dim, scroll lock, dan struktur modal tetap sama;
- link, route, role-aware behavior, dan source data tidak diubah.

## 13. Dampak ke Tab dan Module Landing

Tab atau halaman yang sudah memakai utility `siaga-card`, `siaga-section-canvas`, dan varian `siaga-card-*` otomatis mendapat standar visual baru. Halaman yang masih memakai class manual tidak dipaksa diubah pada tahap ini agar scope tetap kecil.

## 14. Risiko yang Dikurangi

- Card tidak lagi terlalu pucat pada layar mobile.
- Hirarki canvas, card utama, dan sub-card lebih jelas.
- Warna status lebih mudah dibedakan tanpa mengubah makna status.
- Card interaktif lebih terasa clickable.
- Standar visual lebih konsisten untuk tahap perapihan UI berikutnya.

## 15. Risiko Tersisa

- Belum semua halaman memakai utility global SIAGA, sehingga beberapa card manual mungkin masih perlu tahap lanjutan.
- Cek visual manual browser tetap diperlukan untuk memastikan kontras terasa pas pada desktop dan mobile nyata.
- Jika ada card dengan warna manual yang terlalu kuat, perlu audit terpisah agar tidak bertabrakan dengan standar baru.

## 16. Validasi

- `git diff --check`: lulus.
- `npx.cmd tsc --noEmit`: lulus.
- `npm run lint`: tidak tersedia pada `package.json`.
- `npm run build`: tidak dijalankan pada tahap ini karena perubahan hanya CSS/dokumen dan build dapat berat.

## 17. Hal yang Tidak Disentuh

- Halaman login.
- Auth, NextAuth, middleware.
- RBAC runtime dan role besar.
- Prisma schema, migration, database.
- API/backend.
- Endpoint Approval, Bootstrap, Sync Version.
- Sidebar, MobileNav, route utama, menu utama.
- Package/dependency.
- Dashboard modal 4D.2.

## 18. Rekomendasi Tahap Berikutnya

- Lakukan cek visual manual pada Dashboard, Halo SIAGA-SDA, Tugas Saya, dan beberapa module landing.
- Jika ada halaman dengan card manual yang masih pucat, migrasikan bertahap ke utility global SIAGA.
- Pertahankan perubahan visual global ini sebagai fondasi, bukan alasan untuk rewrite komponen.

## 19. Saran Commit Message

`style: perkuat warna dan efek 3d card siaga sda`
