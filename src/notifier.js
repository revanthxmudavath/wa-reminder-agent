const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

async function sendEmailNotification() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.YOUR_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.YOUR_EMAIL,
    to: process.env.YOUR_EMAIL,
    subject: 'PDF Received ✓ — Computer Architecture Assignment',
    text: `Your friend sent the Computer Architecture Assignment PDF at ${new Date().toLocaleString()}.`,
  });

  console.log('[notifier] Email sent successfully.');
}

async function makeTtsCall() {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const twiml = `<Response><Say voice="woman">${process.env.CALL_MESSAGE}</Say></Response>`;

  const call = await client.calls.create({
    twiml,
    to: process.env.FRIEND_PHONE,
    from: process.env.TWILIO_FROM_NUMBER,
  });

  console.log(`[notifier] Call initiated: ${call.sid}`);
}

module.exports = { sendEmailNotification, makeTtsCall };
