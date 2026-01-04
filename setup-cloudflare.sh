#!/bin/bash
set -euo pipefail

echo "🌐 Checking for cloudflared..."

# Detect OS
OS="$(uname)"
CLOUDFLARED_CMD="cloudflared"

# Check if cloudflared is installed
if ! command -v $CLOUDFLARED_CMD &> /dev/null; then
  echo "📦 Installing cloudflared globally via npm..."
  npm install -g cloudflared
else
  echo "✅ cloudflared is already installed."
fi

# Path to cert.pem
CERT_PATH="$HOME/.cloudflared/cert.pem"

# Check if cert.pem exists
if [ ! -f "$CERT_PATH" ]; then
  echo "🔐 Cloudflare login is required."
  echo "👉 A browser window will open for authentication..."
  $CLOUDFLARED_CMD login
  if [ ! -f "$CERT_PATH" ]; then
    echo "❌ Login failed or was cancelled. Exiting..."
    exit 1
  fi
else
  echo "🔐 Cloudflare certificate found. Skipping login."
fi

# Prompt for port
read -p "🚀 Enter the local port to expose (default: 5000): " PORT
PORT=${PORT:-5000}

# Start tunnel
echo "🌍 Starting Cloudflare Tunnel for http://localhost:$PORT ..."
$CLOUDFLARED_CMD tunnel --url http://localhost:$PORT

