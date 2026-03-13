const crypto = require('crypto');
const config = require('../config');
const logger = require('../config/logger');

/**
 * Validates the X-Hub-Signature-256 header that Meta sends with every webhook.
 * Requires express.raw() to be used BEFORE this middleware so req.body is a Buffer.
 */
const verifyMetaSignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];

  if (!signature) {
    logger.warn('Missing X-Hub-Signature-256 header');
    return res.status(401).json({ error: 'Missing signature' });
  }

  if (!config.meta.appSecret) {
    logger.error('META_APP_SECRET is not configured');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));
  const expected = `sha256=${crypto
    .createHmac('sha256', config.meta.appSecret)
    .update(rawBody)
    .digest('hex')}`;

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    logger.warn('Invalid Meta webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Parse body after signature check
  try {
    req.body = JSON.parse(rawBody.toString());
  } catch (_err) {
    logger.warn('Invalid JSON payload');
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next();
};

module.exports = { verifyMetaSignature };
