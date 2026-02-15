#!/bin/bash

# MetaMe Commerce - Local Development Startup Script

echo "🚀 Starting MetaMe Commerce (Local Development)"
echo ""
echo "─────────────────────────────────────────────────────"
echo "Terminal 1: API Server (http://localhost:3001)"
echo "Terminal 2: Website (http://localhost:3000)"
echo "─────────────────────────────────────────────────────"
echo ""

# Function to start API
start_api() {
  echo "📡 Starting API server..."
  cd /Users/yaron/AGI/metame-commerce/api
  npm run dev
}

# Function to start website
start_website() {
  echo "🌐 Starting website..."
  cd /Users/yaron/AGI/metame-commerce/website
  npm run dev
}

# Check if running both services
if [ "$1" == "--both" ]; then
  # Start both in background (for testing)
  start_api &
  sleep 3
  start_website &
  wait
else
  # Show instructions for manual startup
  echo "ℹ️  Run in separate terminals:"
  echo ""
  echo "Terminal 1:"
  echo "  $ cd /Users/yaron/AGI/metame-commerce/api"
  echo "  $ npm run dev"
  echo ""
  echo "Terminal 2:"
  echo "  $ cd /Users/yaron/AGI/metame-commerce/website"
  echo "  $ npm run dev"
  echo ""
  echo "Then visit: http://localhost:3000"
fi
