@echo off
chcp 65001 > nul
title Đẩy Mã Nguồn Trung Thu Lên GitHub
color 0B

echo ======================================================================
echo    🏮 ĐANG ĐẨY TRANG WEB TRUNG THU LÊN GITHUB CỦA BẠN
echo    Repository: https://github.com/Fenriru666/TrungThu
echo ======================================================================
echo.

set "GIT_EXE=C:\Users\Le Khanh Luan\AppData\Local\Programs\Git\cmd\git.exe"
if not exist "%GIT_EXE%" (
    set "GIT_EXE=git"
)

cd /d "D:\TrungThu"

echo [1/3] Chuẩn bị tệp và commit mới nhất...
"%GIT_EXE%" add .
"%GIT_EXE%" commit -m "Khoi tao trang web Trung Thu day du tinh nang" >nul 2>&1

echo.
echo [2/3] Cấu hình remote và nhánh main...
"%GIT_EXE%" remote remove origin >nul 2>&1
"%GIT_EXE%" remote add origin https://github.com/Fenriru666/TrungThu.git
"%GIT_EXE%" branch -M main

echo.
echo [3/3] Đang tải lên GitHub...
echo (Lưu ý: Nếu trình duyệt hiện cửa sổ đăng nhập GitHub, bạn chỉ cần bấm xác nhận "Authorize" là xong!)
echo.

"%GIT_EXE%" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ======================================================================
    echo  🎉 CHÚC MỪNG! ĐÃ ĐẨY LÊN GITHUB THÀNH CÔNG RỒI ĐẤY!
    echo ======================================================================
    echo  Repository: https://github.com/Fenriru666/TrungThu
    echo.
    echo  👉 BƯỚC TIẾP THEO:
    echo  1. Mở trang: https://vercel.com
    echo  2. Chọn "Add New Project" -> Tìm repository "TrungThu"
    echo  3. Bấm "Deploy" là nhận ngay link web miễn phí gửi cho cô ấy!
    echo ======================================================================
) else (
    echo.
    echo ======================================================================
    echo  [!] Chưa thể đẩy lên. Nếu GitHub yêu cầu đăng nhập (Sign in with browser),
    echo      hãy bấm đăng nhập trên trình duyệt vừa mở ra rồi chạy lại nhé.
    echo ======================================================================
)

echo.
pause

