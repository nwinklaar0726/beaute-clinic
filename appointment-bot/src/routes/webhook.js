const express = require('express');
const router = express.Router();
const { verifyMetaSignature } = require('../middlewares/verifyMeta');
const webhookController = require('../controllers/webhookController');
const config = require('../config');

/**
 * GET /webhook
 * Meta verification handshake for both WhatsApp and Instagram.
 * Meta sends hub.mode, hub.verify_token, hub.challenge — we echo the challenge.
 */
router.get('/', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.meta.verifyToken) {
    return res.status(200).send(challenge);
  }
  return res.status(403).json({ error: 'Forbidden' });
});

/**
 * POST /webhook
 * Main entry point. Meta delivers webhook events here for:
 *   - WhatsApp Cloud API  → object: "whatsapp_business_account"
 *   - Instagram Graph API → object: "instagram"
 */
router.post('/', verifyMetaSignature, webhookController.handleWebhook);

module.exports = router;
