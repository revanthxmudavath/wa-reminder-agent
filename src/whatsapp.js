const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client = null;
let isReady = false;
let latestQr = null;

const fs = require("fs");

function resolveChromePath() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
  ].filter(Boolean);

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}


function getClient() {
  if (client) return client;

  const chromePath = resolveChromePath();
  console.log("[puppeteer] chromePath =", chromePath);

  if (!chromePath) {
  throw new Error(
    "No Chrome/Chromium found. Install chromium in the Railway image (nixpacks.toml) or set PUPPETEER_EXECUTABLE_PATH to a valid binary."
  );
}

  client = new Client({
    authStrategy: new LocalAuth({ dataPath: process.env.WWEBJS_AUTH_PATH || '/data/.wwebjs_auth' }),
    puppeteer: {
      headless: true,
      ...(chromePath ? { executablePath: chromePath } : {}),
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
      ],
    },
  });

  client.on('qr', (qr) => {
    latestQr = qr;
    console.log('[whatsapp] QR ready — open /qr in browser to scan.');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    latestQr = null;
    console.log('[whatsapp] Client is ready.');
    isReady = true;
  });

  client.on('disconnected', (reason) => {
    console.error('[whatsapp] Disconnected:', reason);
    isReady = false;
  });

  client.initialize();
  return client;
}

function isClientReady() {
  return isReady;
}

function getLatestQr() {
  return latestQr;
}

module.exports = { getClient, isClientReady, getLatestQr };
