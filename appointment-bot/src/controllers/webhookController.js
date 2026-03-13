const logger = require('../config/logger');
const { handleWhatsAppMessage } = require('../services/whatsappService');
const { handleInstagramMessage } = require('../services/instagramService');
const { query } = require('../models/db');

/**
 * Central webhook dispatcher.
 * Parses the Meta payload, identifies the channel, and routes to the right handler.
 */
const handleWebhook = async (req, res) => {
  // Always respond 200 immediately — Meta will retry if we don't.
  res.status(200).json({ status: 'EVENT_RECEIVED' });

  const body = req.body;

  if (!body || !body.object) {
    logger.warn('Webhook received with no body.object');
    return;
  }

  // ─── Route by channel ─────────────────────────────────────────────────────
  switch (body.object) {
    case 'whatsapp_business_account':
      await processWhatsAppEvents(body);
      break;

    case 'instagram':
      await processInstagramEvents(body);
      break;

    default:
      logger.warn('Unknown webhook object type', { object: body.object });
  }
};

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
const processWhatsAppEvents = async (body) => {
  try {
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== 'messages') continue;

        const value = change.value;
        const messages = value.messages || [];

        for (const msg of messages) {
          // Log raw payload
          await logMessage('whatsapp', 'inbound', msg.type, value);

          const senderPhone = msg.from;
          const messageText = extractText(msg);

          if (!messageText) {
            logger.info('Non-text WA message, skipping', { type: msg.type, from: senderPhone });
            continue;
          }

          logger.info('WhatsApp message received', { from: senderPhone, text: messageText });
          await handleWhatsAppMessage(senderPhone, messageText);
        }
      }
    }
  } catch (err) {
    logger.error('Error processing WhatsApp events', { error: err.message });
  }
};

// ─── Instagram ────────────────────────────────────────────────────────────────
const processInstagramEvents = async (body) => {
  try {
    for (const entry of body.entry || []) {
      // Instagram DMs come inside entry.messaging[]
      for (const messagingEvent of entry.messaging || []) {
        const senderId = messagingEvent.sender?.id;
        if (!senderId) continue;

        // Log raw payload
        await logMessage('instagram', 'inbound', 'text', messagingEvent);

        const msg = messagingEvent.message;
        if (!msg || msg.is_echo) continue; // skip echo events

        const messageText = msg.text || null;
        if (!messageText) {
          logger.info('Non-text IG message, skipping', { senderId });
          continue;
        }

        logger.info('Instagram message received', { from: senderId, text: messageText });
        await handleInstagramMessage(senderId, messageText);
      }
    }
  } catch (err) {
    logger.error('Error processing Instagram events', { error: err.message });
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const extractText = (msg) => {
  if (msg.type === 'text') return msg.text?.body || null;
  if (msg.type === 'interactive') {
    return (
      msg.interactive?.button_reply?.title ||
      msg.interactive?.list_reply?.title ||
      null
    );
  }
  return null;
};

const logMessage = async (channel, direction, messageType, payload) => {
  try {
    await query(
      `INSERT INTO message_logs (channel, direction, message_type, payload)
       VALUES ($1, $2, $3, $4)`,
      [channel, direction, messageType, JSON.stringify(payload)]
    );
  } catch (_) {
    // Non-critical — never crash on log failure
  }
};

module.exports = { handleWebhook };
