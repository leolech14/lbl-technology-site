#!/bin/bash

# Doppler Setup Script for Sora/OpenAI API Access
echo "🔐 Setting up Doppler for OpenAI/Sora API access..."

# Check if Doppler is installed
if ! command -v doppler &> /dev/null; then
    echo "❌ Doppler CLI not found. Installing..."
    
    # Install Doppler CLI
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install dopplerhq/cli/doppler
    else
        # Linux
        curl -sLf --retry 3 --tlsv1.2 --proto "=https" https://cli.doppler.com/install.sh | sh
    fi
fi

# Login to Doppler (if not already logged in)
if ! doppler whoami &> /dev/null; then
    echo "📝 Please login to Doppler:"
    doppler login
fi

# Select project and config
echo "🎯 Selecting Doppler project..."
doppler setup

# Export environment variables for current session
echo "💉 Injecting Doppler secrets..."
eval "$(doppler secrets download --no-file --format env)"

echo "✅ Doppler setup complete!"
echo "🚀 You can now run: doppler run -- npm run generate-assets"