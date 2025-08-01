#!/bin/bash

echo "🎨 Glassmorphic Asset Generation"
echo "================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "✅ Created .env file with Leonardo AI key"
fi

# Check command line arguments
if [ "$1" == "--icons-only" ]; then
    echo "🎨 Generating static icons with Leonardo AI..."
    node generate-assets.js --icons-only
elif [ "$1" == "--videos-only" ]; then
    echo "🎬 Generating videos with Sora (via Doppler)..."
    
    # Check if Doppler is available
    if command -v doppler &> /dev/null; then
        doppler run -- node generate-assets.js --videos-only
    else
        echo "❌ Doppler not found. Please install Doppler CLI first:"
        echo "   brew install dopplerhq/cli/doppler"
        echo "   Then run: npm run setup-doppler"
        exit 1
    fi
elif [ "$1" == "--integrate" ]; then
    echo "🔧 Integrating assets into website..."
    node integrate-assets.js
else
    echo "🚀 Generating all assets..."
    echo ""
    echo "Step 1: Static icons with Leonardo AI"
    echo "======================================"
    node generate-assets.js --icons-only
    
    echo ""
    echo "Step 2: Videos with Sora (requires Doppler)"
    echo "==========================================="
    if command -v doppler &> /dev/null; then
        doppler run -- node generate-assets.js --videos-only
    else
        echo "⚠️  Skipping videos - Doppler not configured"
        echo "   To generate videos, run: npm run setup-doppler"
    fi
    
    echo ""
    echo "Step 3: Integrate assets"
    echo "========================"
    node integrate-assets.js
fi

echo ""
echo "✨ Done! Check ./assets/generated/ for your files"