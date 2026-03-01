const { buildMessage, isBeforeEndDate, isPdfFromFriend } = require('./core');
const { sendEmailNotification, makeTtsCall } = require('./notifier');
const { getClient, isClientReady } = require('./whatsapp');
require('dotenv').config();

const WAIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

async function runFlow() {
  // 1. Date guard
  const today = new Date().toISOString().split('T')[0];
  if (!isBeforeEndDate(process.env.END_DATE, today)) {
    console.log('[flow] Past END_DATE. Skipping.');
    return;
  }

  // 2. WhatsApp client must be ready
  if (!isClientReady()) {
    throw new Error('WhatsApp client not ready. Scan QR code first.');
  }

  const client = getClient();

  // 3. Send message
  const message = buildMessage(
    process.env.MESSAGE_TEXT,
    process.env.FRIEND_NAME
  );
  const chatId = process.env.FRIEND_PHONE.replace('+', '') + '@c.us';
  await client.sendMessage(chatId, message);
  console.log('[flow] WhatsApp message sent.');

  // 4. Wait up to 5 minutes for a PDF reply
  const pdfReceived = await new Promise((resolve) => {
    const handler = (msg) => {
      if (isPdfFromFriend(msg, process.env.FRIEND_PHONE)) {
        client.off('message', handler);
        resolve(true);
      }
    };
    client.on('message', handler);

    setTimeout(() => {
      client.off('message', handler);
      resolve(false);
    }, WAIT_WINDOW_MS);
  });

  // 5. Act on result
  if (pdfReceived) {
    console.log('[flow] PDF received! Sending email notification.');
    await sendEmailNotification();
  } else {
    console.log('[flow] No PDF after 5 minutes. Making TTS call.');
    await makeTtsCall();
  }
}

module.exports = { runFlow };
