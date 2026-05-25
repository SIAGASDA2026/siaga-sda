# SIAGA-SDA Pasang Surut System

> Dokumen acuan SIAGA-SDA / SIMONPRO 2026  
> Instansi: Dinas Pekerjaan Umum — Bidang Sumber Daya Air — Kota Dumai  
> Prinsip: audit-safe, mobile-first, assignment-based, dan tidak rebuild total.


## Fungsi

Data pasang surut tampil di Peta Monitoring dan Dashboard sebagai ringkasan.

## Prinsip Teknis

- Gunakan API/BMKG jika tersedia.
- Scheduler backend mengambil dan cache data ke Supabase/database.
- Jangan fetch langsung dari frontend saat membuka peta.

## Tampilan

- Muka air saat ini.
- Tren naik/turun.
- Countdown.
- Prediksi pasang tertinggi.
- Prediksi surut terendah.
- Data 3 jam sebelum, saat ini, 3 jam sesudah.
- Status: AMAN, WASPADA, SIAGA, KRITIS.

## Warning Status

```text
AMAN
WASPADA
SIAGA
KRITIS
```

## Audit

Perubahan threshold warning wajib masuk audit log.
