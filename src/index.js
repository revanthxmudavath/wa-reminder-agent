// Ensure Chrome cache dir points inside project folder (required on Render)
process.env.PUPPETEER_CACHE_DIR = process.env.PUPPETEER_CACHE_DIR || '/opt/render/project/src/.cache/puppeteer';

const express = require('express');
const { runFlow } = require('./flow');
const { getClient } = require('./whatsapp');
require('dotenv').config();

const app = express();
app.use(express.json());

// Initialize WhatsApp client on startup
getClient();

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
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
