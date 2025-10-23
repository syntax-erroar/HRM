@echo off
echo 🚀 Starting HR Email Automation Service...
echo.

cd email-service

echo 📦 Installing dependencies...
call npm install

echo.
echo 🚀 Starting email service on port 3001...
echo 📧 Email automation ready for HR system integration
echo.

call npm start

pause
