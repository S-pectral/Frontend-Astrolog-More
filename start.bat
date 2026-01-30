@echo off
echo ========================================
echo  COSMIC EXPLORER - Starting Server...
echo ========================================
echo.
echo Starting local server on port 3000...
echo.

start "" http://localhost:3000
node server.js

pause