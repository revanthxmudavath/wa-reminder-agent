const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client = null;
let isReady = false;
let latestQr = null;

function getClient() {
  if (client) return client;

  client = new Client({
    authStrategy: new LocalAuth({ dataPath: '.wwebjs_auth' }),
    puppeteer: {
      headless: true,
      ...(process.env.PUPPETEER_EXECUTABLE_PATH && {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      }),
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
