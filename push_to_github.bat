@echo off
chcp 65001 > nul
title Đẩy Trang Web Lên GitHub
color 0B

echo ======================================================================
echo    🏮 CÔNG CỤ TỰ ĐỘNG ĐẨY DỰ ÁN TRUNG THU LÊN GITHUB
echo ======================================================================
echo.

set "GIT_EXE=C:\Users\Le Khanh Luan\AppData\Local\Programs\Git\cmd\git.exe"
if not exist "%GIT_EXE%" (
    where git >nul 2>&1
    if %errorlevel% equ 0 (
        set "GIT_EXE=git"
    ) else (
        echo [!] Không tìm thấy Git. Vui lòng kiểm tra lại.
        pause
        exit /b 1
    )
)

echo [1/3] Kiểm tra trạng thái Git repository...
cd /d "D:\TrungThu"
"%GIT_EXE%" add .
"%GIT_EXE%" commit -m "Cap nhat trang web Trung Thu" >nul 2>&1

echo.
echo [2/3] Nhập liên kết GitHub Repository của bạn:
echo (Ví dụ: https://github.com/ten-cua-ban/trung-thu.git)
echo.
set /p REPO_URL=">> Nhập link GitHub tại đây: "

if "%REPO_URL%"=="" (
    echo [!] Bạn chưa nhập liên kết. Hủy thao tác.
    pause
    exit /b 1
)

echo.
echo [3/3] Đang kết nối và đẩy code lên GitHub...
"%GIT_EXE%" remote remove origin >nul 2>&1
"%GIT_EXE%" remote add origin %REPO_URL%
"%GIT_EXE%" branch -M main
"%GIT_EXE%" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ======================================================================
    echo  ✅ ĐÃ ĐẨY LÊN GITHUB THÀNH CÔNG!
    echo ======================================================================
    echo  Bây giờ bạn chỉ cần:
    echo  1. Mở https://vercel.com
    echo  2. Chọn "Add New Project" ^> Chọn repository vừa tạo
    echo  3. Bấm "Deploy" là web sẽ chạy trực tuyến 24/7 miễn phí!
    echo ======================================================================
) else (
    echo.
    echo [!] Đẩy lên GitHub chưa thành công. Vui lòng kiểm tra lại URL hoặc quyền đăng nhập GitHub.
)

echo.
pause
