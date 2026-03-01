process.env.PUPPETEER_CACHE_DIR = process.env.PUPPETEER_CACHE_DIR || "/tmp/puppeteer";

const express = require('express');
const { runFlow } = require('./flow');
const { getClient, getLatestQr } = require('./whatsapp');
const QRCode = require('qrcode');
require('dotenv').config();

const app = express();
app.use(express.json());

// Initialize WhatsApp client on startup
getClient();

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// QR code endpoint — open in browser to scan WhatsApp
app.get('/qr', async (req, res) => {
  const qr = getLatestQr();
  if (!qr) {
    return res.send('<h2>WhatsApp is already connected ✓</h2>');
  }
  const imgUrl = await QRCode.toDataURL(qr);
  res.send(`<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#111">
    <img src="${imgUrl}" style="width:300px;height:300px"/>
  </body></html>`);
});

// Trigger endpoint (called by GitHub Actions)
app.post('/trigger', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.TRIGGER_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Respond immediately so GitHub Actions doesn't timeout
  res.json({ status: 'triggered', time: new Date().toISOString() });

  // Run flow in background
  runFlow().catch((err) => {
    console.error('[server] Flow error:', err.message);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[server] Listening on port ${PORT}`);
});
