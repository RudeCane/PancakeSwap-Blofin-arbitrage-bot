PancakeSwap–Blofin Arbitrage Bot
A Node.js bot for real-time arbitrage trading between PancakeSwap (DEX) and Blofin (CEX) on the BNB/USDT pair.

🚀 Features
Live price tracking from PancakeSwap and Blofin
Arbitrage detection with 0.5% profit threshold
Auto-triggered trade execution
DRY RUN mode for safe testing
Swaps BNB ⇄ USDT via Web3 and authenticated Blofin API
🔧 Setup
1. Clone the Repo
git clone https://github.com/RudeCane/PancakeSwap-Blofin-arbitrage-bot.git
cd PancakeSwap-Blofin-arbitrage-bot
2. Install Dependencies
npm install
3. Set Up .env
Create a .env file in the root directory:

BLOFIN_API_KEY=your_blofin_key
BLOFIN_API_SECRET=your_blofin_secret
WALLET_PRIVATE_KEY=your_wallet_private_key
DRY_RUN=true
Tip: Use DRY_RUN=true while testing. Add --live when you’re ready for real trades.

4. Add PancakeSwap Router ABI
Download from BscScan and save to:

./abi/router.json
🧪 Running the Bot
Dry Run (default):

node pancakeswap-blofin-bot.js
Live Mode:

node pancakeswap-blofin-bot.js --live
📁 Project Structure
.
├── abi/                  # PancakeSwap ABI
├── .env                 # Your credentials (gitignored)
├── .env.example         # Sample environment file
├── pancakeswap-blofin-bot.js  # Main bot script
└── README.md
⚠️ Disclaimers
Use at your own risk.
Test in DRY RUN mode before deploying live.
Never share your private key or API keys publicly.
🧠 Credits
Built by @RudeCane
