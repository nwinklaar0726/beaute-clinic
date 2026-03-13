/**
 * instagramService.js
 *
 * Handles inbound Instagram DMs and sends outbound replies
 * via the Instagram Graph API (Send Message endpoint).
 *
 * Public API:
 *   handleInstagramMessage(senderId, text) → void
 *   sendInstagramMessage(recipientId, text) → boolean (used by reminderScheduler too)
 */

const axios = require('axios');
const config = require('../config');
const logger = require('../config/logger');
const { processMessage } = require('./stateMachine');

const API_BASE = `https://graph.facebook.com/${config.meta.apiVersion}`;

// ─── Outbound ─────────────────────────────────────────────────────────────────

/**
 * Send a plain text message to an Instagram user via the Send API.
 *
 * Note: Instagram DMs do NOT support WhatsApp markdown (*bold*, etc.).
 * Text is sent as plain UTF-8. Emojis are supported.
 *
 * @param {string} recipientId - Instagram-scoped user ID (IGSID)
 * @param {string} text        - message body
 * @returns {Promise<boolean>} true if message was accepted by Meta, false otherwise
 */
const sendInstagramMessage = async (recipientId, text) => {
  const url = `${API_BASE}/${config.meta.instagramPageId}/messages`;

  // Strip WhatsApp-style markdown (*bold*, _italic_) for Instagram
  const cleanText = text
    .replace(/\*([^*]+)\*/g, '$1')   // *bold* → bold
    .replace(/_([^_]+)_/g, '$1');    // _italic_ → italic

  const payload = {
    recipient: { id: recipientId },
    message: { text: cleanText },
    messaging_type: 'RESPONSE',
  };

  try {
    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${config.meta.instagramToken}`,
        'Content-Type': 'application/json',
      },
    });
    logger.info('Instagram message sent', { to: recipientId, preview: cleanText.slice(0, 60) });
    return true;
  } catch (err) {
    const detail = err.response?.data || err.message;
    logger.error('Instagram send error', { to: recipientId, error: detail });
    return false;
  }
};

// ─── Inbound handler ──────────────────────────────────────────────────────────

/**
 * Called by webhookController for each inbound Instagram DM text.
 *
 * @param {string} senderId - Instagram-scoped user ID from messagingEvent.sender.id
 * @param {string} text     - message text
 */
const handleInstagramMessage = async (senderId, text) => {
  const sendFn = (reply) => sendInstagramMessage(senderId, reply);

  try {
    await processMessage('instagram', senderId, text, sendFn);
  } catch (err) {
    logger.error('FSM error (Instagram)', { from: senderId, error: err.message });
    const delivered = await sendInstagramMessage(
      senderId,
      'Ocurrió un error inesperado. Por favor escribe Hola para intentar de nuevo.'
    );
    if (!delivered) {
      logger.error('Failed to send Instagram fallback error message', { to: senderId });
    }
  }
};

module.exports = { handleInstagramMessage, sendInstagramMessage };
