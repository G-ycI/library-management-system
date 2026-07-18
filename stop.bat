@echo off
chcp 65001 >nul
title 图书管理系统停止脚本

echo.
echo ==============================================
echo          图书管理系统 - 停止服务
echo ==============================================
echo.

echo 正在停止后端服务...
taskkill /f /im python.exe >nul 2>&1
echo 后端服务已停止

echo.
echo 正在停止前端服务...
taskkill /f /im node.exe >nul 2>&1
echo 前端服务已停止

echo.
echo ==============================================
echo          所有服务已停止！
echo ==============================================
echo.
echo 按任意键退出...
pause >nul