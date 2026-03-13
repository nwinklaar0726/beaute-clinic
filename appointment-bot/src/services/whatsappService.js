/**
 * whatsappService.js
 *
 * Handles inbound WhatsApp messages and sends outbound replies
 * via the Meta WhatsApp Cloud API.
 *
 * Public API:
 *   handleWhatsAppMessage(senderPhone, text) → void
 *   sendWhatsAppMessage(to, text)            → boolean (used by reminderScheduler too)
 */

const axios = require('axios');
const config = require('../config');
const logger = require('../config/logger');
const { processMessage } = require('./stateMachine');

const API_BASE = `https://graph.facebook.com/${config.meta.apiVersion}`;

// ─── Outbound ─────────────────────────────────────────────────────────────────

/**
 * Send a plain text message via WhatsApp Cloud API.
 *
 * @param {string} to   - recipient phone number (E.164 without '+', e.g. "50688887777")
 * @param {string} text - message body (supports WhatsApp markdown: *bold*, _italic_)
 * @returns {Promise<boolean>} true if message was accepted by Meta, false otherwise
 */
const sendWhatsAppMessage = async (to, text) => {
  const url = `${API_BASE}/${config.meta.whatsappPhoneId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { preview_url: false, body: text },
  };

  try {
    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${config.meta.whatsappToken}`,
        'Content-Type': 'application/json',
      },
    });
    logger.info('WhatsApp message sent', { to, preview: text.slice(0, 60) });
    return true;
  } catch (err) {
    const detail = err.response?.data || err.message;
    logger.error('WhatsApp send error', { to, error: detail });
    return false;
  }
};

// ─── Inbound handler ──────────────────────────────────────────────────────────

/**
 * Called by webhookController for each inbound WhatsApp text message.
 *
 * @param {string} senderPhone - E.164 phone without '+' (comes from msg.from)
 * @param {string} text        - extracted message text
 */
const handleWhatsAppMessage = async (senderPhone, text) => {
  const sendFn = (reply) => sendWhatsAppMessage(senderPhone, reply);

  try {
    await processMessage('whatsapp', senderPhone, text, sendFn);
  } catch (err) {
    logger.error('FSM error (WhatsApp)', { from: senderPhone, error: err.message });
    const delivered = await sendWhatsAppMessage(
      senderPhone,
      '😔 Ocurrió un error inesperado. Por favor escribe *Hola* para intentar de nuevo.'
    );
    if (!delivered) {
      logger.error('Failed to send WhatsApp fallback error message', { to: senderPhone });
    }
  }
};

module.exports = { handleWhatsAppMessage, sendWhatsAppMessage };
