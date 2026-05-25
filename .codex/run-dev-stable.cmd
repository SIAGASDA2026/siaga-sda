@echo off
cd /d "G:\2_ PRODUK\SIMONPRO\SIMONPRO_FINAL\simonpro"
"C:\Program Files\nodejs\npm.cmd" run dev -- --hostname 127.0.0.1 --port 3000 > ".codex\next-dev.out.log" 2> ".codex\next-dev.err.log"
echo.
echo SIAGA-SDA dev server stopped. Check .codex\next-dev.out.log and .codex\next-dev.err.log
pause
