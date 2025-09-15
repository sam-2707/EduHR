# HR Guru Platform - Vercel Deployment Preparation

Write-Host "🚀 Preparing HR Guru Platform for Vercel Deployment..." -ForegroundColor Green

# Check required files
Write-Host "✅ Checking deployment files..." -ForegroundColor Yellow

if (Test-Path "vercel.json") {
    Write-Host "  ✓ vercel.json exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ vercel.json missing" -ForegroundColor Red
}

if (Test-Path ".env.example") {
    Write-Host "  ✓ .env.example exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ .env.example missing" -ForegroundColor Red
}

if (Test-Path "DEPLOYMENT.md") {
    Write-Host "  ✓ DEPLOYMENT.md exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ DEPLOYMENT.md missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Deployment preparation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Push your code to GitHub" -ForegroundColor White
Write-Host "2. Import project in Vercel dashboard" -ForegroundColor White
Write-Host "3. Set environment variables in Vercel:" -ForegroundColor White
Write-Host "   - GROQ_API_KEY" -ForegroundColor Gray
Write-Host "   - NEXTAUTH_SECRET" -ForegroundColor Gray
Write-Host "   - NEXTAUTH_URL" -ForegroundColor Gray
Write-Host "4. Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
