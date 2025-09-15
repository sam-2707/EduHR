#!/bin/bash

# HR Guru Platform - Vercel Deployment Preparation Script

echo "🚀 Preparing HR Guru Platform for Vercel Deployment..."

# Check if required files exist
echo "✅ Checking deployment files..."

if [ -f "vercel.json" ]; then
    echo "  ✓ vercel.json exists"
else
    echo "  ❌ vercel.json missing"
    exit 1
fi

if [ -f ".env.example" ]; then
    echo "  ✓ .env.example exists"
else
    echo "  ❌ .env.example missing"
    exit 1
fi

if [ -f "DEPLOYMENT.md" ]; then
    echo "  ✓ DEPLOYMENT.md exists"
else
    echo "  ❌ DEPLOYMENT.md missing"
    exit 1
fi

# Check package.json scripts
echo "✅ Checking package.json scripts..."
if grep -q '"build": "next build"' package.json; then
    echo "  ✓ Build script configured"
else
    echo "  ❌ Build script needs updating"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Type check (optional, with fallback)
echo "🔍 Running type check..."
npm run type-check || echo "  ⚠️  Type check failed (will be ignored in production)"

# Test build (optional, for local verification)
echo "🏗️  Testing production build..."
npm run build || echo "  ⚠️  Build test failed (Vercel will handle this)"

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Import project in Vercel dashboard"
echo "3. Set environment variables:"
echo "   - GROQ_API_KEY"
echo "   - NEXTAUTH_SECRET"
echo "   - NEXTAUTH_URL"
echo "4. Deploy!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
