Write-Host "🚀 Starting HR Email Automation Service..." -ForegroundColor Green
Write-Host ""

Set-Location email-service

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🚀 Starting email service on port 3001..." -ForegroundColor Green
Write-Host "📧 Email automation ready for HR system integration" -ForegroundColor Cyan
Write-Host ""

npm start
