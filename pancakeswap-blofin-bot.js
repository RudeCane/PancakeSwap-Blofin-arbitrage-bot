// Load env variables
require('dotenv').config();

const Web3 = require('web3');
const axios = require('axios');
const { ethers } = require('ethers');
const crypto = require('crypto');
const fs = require('fs');

// === CONFIG ===
const BSC_RPC = 'https://bsc-dataseed.binance.org/';
const web3 = new Web3(BSC_RPC);

const PANCAKESWAP_ROUTER = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
const BNB_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';

const BLOFIN_API_KEY = process.env.BLOFIN_API_KEY;
const BLOFIN_API_SECRET = process.env.BLOFIN_API_SECRET;
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

// CLI override for dry-run
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--live') ? false : (process.env.DRY_RUN === 'true');

const ARB_THRESHOLD = 0.005; // 0.5%

const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Load PancakeSwap Router ABI
const routerAbi = JSON.parse(fs.readFileSync('./abi/router.json'));
const router = new ethers.Contract(PANCAKESWAP_ROUTER, routerAbi, wallet);

// === HELPERS ===
async function getPancakePrice() {
  try {
    const res = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/bsc/${USDT_ADDRESS}`);
    const pair = res.data.pairs.find(p => p.baseToken.symbol === 'BNB');
    return parseFloat(pair.priceUsd);
  } catch (err) {
    console.error('Error fetching PancakeSwap price:', err);
    return null;
  }
}

async function getBlofinPrice() {
  try {
    const res = await axios.get('https://api.blofin.com/api/v1/market/ticker?symbol=BNBUSDT');
    return parseFloat(res.data.data.lastPrice);
  } catch (err) {
    console.error('Error fetching Blofin price:', err);
    return null;
  }
}

function calculateSpread(pDex, pCex) {
  return (pCex - pDex) / pDex;
}

async function checkArbitrage() {
  const dexPrice = await getPancakePrice();
  const cexPrice = await getBlofinPrice();

  if (!dexPrice || !cexPrice) return;

  const spread = calculateSpread(dexPrice, cexPrice);
  console.log(`DEX: $${dexPrice} | CEX: $${cexPrice} | Spread: ${(spread * 100).toFixed(2)}%`);

  if (spread >= ARB_THRESHOLD) {
    console.log('🔁 Arbitrage opportunity detected! Executing...');
    executeTrade(dexPrice, cexPrice);
  } else {
    console.log('No arbitrage opportunity right now.');
  }
}

async function executeTrade(dexPrice, cexPrice) {
  const amountInBNB = 0.1;
  const amountOutMin = (amountInBNB * dexPrice * 0.995).toFixed(2);

  if (dexPrice < cexPrice) {
    console.log('💥 Buying BNB on PancakeSwap, selling on Blofin...');
    if (DRY_RUN) {
      console.log('[DRY RUN] Would buy on PancakeSwap and sell on Blofin');
    } else {
      await buyBNB(amountOutMin, amountInBNB);
      await placeBlofinOrder('sell', amountInBNB);
    }
  } else {
    console.log('💥 Buying BNB on Blofin, selling on PancakeSwap...');
    if (DRY_RUN) {
      console.log('[DRY RUN] Would buy on Blofin and sell on PancakeSwap');
    } else {
      await placeBlofinOrder('buy', amountInBNB);
      await sellBNB(amountInBNB);
    }
  }
}

async function buyBNB(amountOutMin, amountInMaxBNB) {
  const deadline = Math.floor(Date.now() / 1000) + 300;
  const tx = await router.swapExactETHForTokens(
    ethers.utils.parseUnits(amountOutMin.toString(), 18),
    [BNB_ADDRESS, USDT_ADDRESS],
    wallet.address,
    deadline,
    { value: ethers.utils.parseEther(amountInMaxBNB.toString()) }
  );
  console.log('🟨 PancakeSwap TX Hash:', tx.hash);
  await tx.wait();
}

async function sellBNB(amountInBNB) {
  const deadline = Math.floor(Date.now() / 1000) + 300;
  const tx = await router.swapExactTokensForETH(
    ethers.utils.parseUnits(amountInBNB.toString(), 18),
    0,
    [USDT_ADDRESS, BNB_ADDRESS],
    wallet.address,
    deadline
  );
  console.log('🟨 Sell TX Hash:', tx.hash);
  await tx.wait();
}

async function placeBlofinOrder(side, quantity) {
  const url = '/api/v1/order/place';
  const base = 'https://api.blofin.com';
  const timestamp = Date.now().toString();

  const body = {
    symbol: 'BNBUSDT',
    side: side,
    type: 'market',
    quantity: quantity.toString()
  };

  const signaturePayload = timestamp + 'POST' + url + JSON.stringify(body);
  const signature = crypto.createHmac('sha256', BLOFIN_API_SECRET).update(signaturePayload).digest('hex');

  try {
    const res = await axios.post(base + url, body, {
      headers: {
        'X-BLOFIN-APIKEY': BLOFIN_API_KEY,
        'X-BLOFIN-SIGNATURE': signature,
        'X-BLOFIN-TIMESTAMP': timestamp,
        'Content-Type': 'application/json'
      }
    });
    console.log('🟦 Blofin order response:', res.data);
  } catch (err) {
    console.error('Blofin order error:', err.response?.data || err.message);
  }
}

// === MAIN LOOP ===
setInterval(checkArbitrage, 10000);

console.log(`🚀 Bot started in ${DRY_RUN ? 'DRY RUN' : 'LIVE'} mode.`);
require('dotenv').config();
const BLOFIN_API_KEY = process.env.BLOFIN_API_KEY;
const BLOFIN_API_SECRET = process.env.BLOFIN_API_SECRET;
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const DRY_RUN = process.env.DRY_RUN === 'true';
# .gitignore
.env

