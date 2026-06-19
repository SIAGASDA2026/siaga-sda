# SIAGA-SDA DATA-SAFETY.2 — Guard Server-Side Foto URL

Tanggal: 19 Juni 2026

## 1. Ringkasan Tahap

Tahap DATA-SAFETY.2 menambahkan guard server-side minimal agar API record proyek tidak menyimpan URL foto sementara atau tidak sah sebagai `Foto.url`. Tahap ini tidak membuat endpoint upload permanen, tidak membuat storage baru, tidak mengubah Prisma schema, dan tidak membuat migration.

## 2. File yang Dibaca

- `AGENTS.md`
- `docs/core/SIAGA_SDA_MASTER_BLUEPRINT_FINAL.md`
- `docs/core/SIAGA_SDA_GLOBAL_CLICKABLE_NAVIGATION_RULE.md`
- `docs/design/SIAGA_SDA_DESIGN_SYSTEM.md`
- `docs/audit/SIAGA_SDA_DATA_SAFETY_1_UPLOAD_FOTO_SEMENTARA.md`
- `docs/database/SIAGA_SDA_STORAGE_RULES.md`
- `src/app/api/projects/[id]/records/[kind]/route.ts`
- `src/app/api/projects/[id]/records/[kind]/[recordId]/route.ts`
- `src/store/useAppStore.ts`
- `src/app/(dashboard)/survey/page.tsx`
- `src/app/(dashboard)/laporan/page.tsx`
- `src/app/(dashboard)/proyek/[id]/page.tsx`
- `src/types/index.ts`
- `prisma/schema.prisma` hanya dibaca

## 3. Backup

Backup dibuat di:

`backup/backup-data-safety-2-server-guard-foto-before-change/`

File backup:

- `records-kind-route.ts`
- `records-kind-recordId-route.ts`

## 4. File yang Diubah

- `src/app/api/projects/[id]/records/[kind]/route.ts`
- `docs/audit/SIAGA_SDA_DATA_SAFETY_2_SERVER_GUARD_FOTO_URL.md`

File `src/app/api/projects/[id]/records/[kind]/[recordId]/route.ts` hanya dibaca dan dibackup. Audit menunjukkan file ini tidak menyimpan ulang foto pada PATCH; file tersebut hanya menghapus foto saat DELETE record.

## 5. Temuan Penyimpanan `foto.url`

Penyimpanan foto aktif ditemukan pada helper `saveFotos` di:

`src/app/api/projects/[id]/records/[kind]/route.ts`

Helper tersebut dipanggil saat POST untuk:

- `surveys`
- `laporan`
- `catatan`
- `masalah`

Sebelum perubahan, helper menyimpan `foto.url` langsung ke tabel `Foto` melalui `prisma.foto.createMany`, sehingga caller non-UI masih dapat mengirim URL sementara seperti `blob:` atau `data:`.

## 6. Guard Server-Side yang Ditambahkan

Helper baru di API record:

- `isTemporaryPhotoUrl(url)`
- `isLocalBrowserPhotoUrl(url)`
- `isAllowedStoredPhotoUrl(url)`
- `sanitizeFotoPayload(fotos)`

Aturan guard:

- Menolak `blob:`.
- Menolak `data:`.
- Menolak string kosong.
- Menolak URL lokal/browser seperti `file:`, `about:`, `javascript:`, `chrome:`, `edge:`, dan `devtools:`.
- Menolak URL HTTP lokal `localhost`, `127.0.0.1`, dan `::1`.
- Mengizinkan path permanen relatif seperti `/storage/...`.
- Mengizinkan URL `http://` atau `https://` non-lokal.
- Mengizinkan storage key/path permanen sederhana yang tidak memakai skema browser lokal.

## 7. Perilaku API untuk URL Invalid

Jika API menerima sebagian foto invalid:

- data utama tetap disimpan;
- foto invalid diabaikan;
- foto valid tetap disimpan;
- log server mencatat jumlah URL foto invalid yang diabaikan tanpa membocorkan URL.

Jika semua foto invalid:

- data utama tetap disimpan;
- tidak ada foto yang disimpan sebagai `Foto.url`;
- request tidak gagal total hanya karena semua foto masih preview lokal.

Untuk laporan harian, detail audit `UPLOAD_LAPORAN` sekarang menghitung foto yang benar-benar tersimpan, bukan jumlah mentah dari payload.

## 8. Risiko yang Dikurangi

- Caller selain frontend tidak dapat menyimpan `blob:` sebagai foto permanen lewat endpoint POST record proyek.
- Caller tidak dapat menyimpan `data:` base64 sebagai URL bukti foto.
- URL lokal browser dan string kosong tidak masuk ke tabel `Foto`.
- Audit log laporan tidak lagi menghitung foto invalid sebagai foto tersimpan.

## 9. Risiko Tersisa

- Belum ada endpoint upload foto resmi.
- Belum ada validasi mime, ukuran, kompresi, watermark, thumbnail, atau storage metadata.
- Belum ada cleanup data lama jika sudah pernah tersimpan `blob:` sebelum guard ini.
- Guard ini belum memverifikasi keberadaan file di storage permanen; guard hanya mencegah URL sementara/tidak sah yang jelas.

## 10. Rekomendasi Tahap Upload Permanen

- Buat endpoint upload foto resmi dengan validasi server-side.
- Simpan file ke storage permanen sesuai `docs/database/SIAGA_SDA_STORAGE_RULES.md`.
- Tambahkan metadata foto: module, entity id, uploader, role, timestamp, koordinat, file size, mime type, thumbnail, watermark status.
- Tambahkan audit data manual untuk mencari record lama yang mungkin berisi `blob:` atau `data:`.
- Tambahkan test API untuk payload foto invalid setelah struktur test tersedia.

## 11. Validasi

- `git diff --check`: lulus.
- `npx tsc --noEmit`: lulus.
- `npm run lint`: tidak dijalankan karena script `lint` tidak tersedia di `package.json`.
