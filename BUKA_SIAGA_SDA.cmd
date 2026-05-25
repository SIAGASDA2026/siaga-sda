@echo off
title BUKA SIAGA-SDA
cd /d "G:\2_ PRODUK\SIMONPRO\SIMONPRO_FINAL\simonpro"

echo.
echo ======================================
echo   SIAGA-SDA - Menjalankan Aplikasi
echo ======================================
echo.
echo Jendela server akan dibuka.
echo JANGAN tutup jendela server selama aplikasi digunakan.
echo.

start "SIAGA-SDA SERVER - JANGAN DITUTUP" cmd /k ""C:\Program Files\nodejs\node.exe" "G:\2_ PRODUK\SIMONPRO\SIMONPRO_FINAL\simonpro\node_modules\next\dist\bin\next" dev --hostname 127.0.0.1 --port 3000"

echo Menunggu server siap...
timeout /t 10 /nobreak >nul

echo Membuka halaman Peta Monitoring...
start http://127.0.0.1:3000/peta

echo.
echo Jika halaman belum terbuka, tunggu sampai server menampilkan "Ready",
echo lalu tekan refresh di browser.
echo.
pause
