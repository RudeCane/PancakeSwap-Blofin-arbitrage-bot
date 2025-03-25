#!/bin/bash

echo "🔧 Updating packages..."
sudo apt update && sudo apt upgrade -y

echo "🧩 Installing Node.js, Git, Nginx, PM2..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git nginx
sudo npm install -g pm2

echo "📦 Installing backend & frontend dependencies..."
cd backend && npm install
cd ../frontend && npm install && npm run build

echo "🚀 Starting backend and bot with PM2..."
cd ../backend
pm2 start server.js --name backend-api
pm2 start pancakeswap-blofin-bot.js --name bot-core
pm2 save

echo "✅ Deployment complete!"
