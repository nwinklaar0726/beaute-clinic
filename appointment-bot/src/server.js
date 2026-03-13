require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const logger = require('./config/logger');
const webhookRoutes = require('./routes/webhook');
const apiRoutes = require('./routes/api');
const { requireAuth, checkAuth } = require('./middlewares/auth');
const { startReminderScheduler } = require('./services/reminderScheduler');

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
// Raw body needed for Meta signature verification
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// ─── Auth Configuration Check ────────────────────────────────────────────────
if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  logger.warn('===============================================');
  logger.warn('⚠️  ADMIN AUTH NOT CONFIGURED');
  logger.warn('Set ADMIN_USERNAME and ADMIN_PASSWORD in .env');
  logger.warn('The admin panel is currently UNPROTECTED');
  logger.warn('===============================================');
}

// ─── Static Files (Admin Panel) ─────────────────────────────────────────────-
// Protect static files with basic auth in production
if (process.env.NODE_ENV === 'production' || process.env.ADMIN_USERNAME) {
  app.use(requireAuth);
}
app.use(express.static(path.join(__dirname, '../public')));

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api', checkAuth, apiRoutes);
app.use('/webhook', webhookRoutes);

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = config.server.port;
app.listen(PORT, () => {
  logger.info(`Dental Bot server running on port ${PORT} [${config.server.env}]`);
  logger.info(`Admin panel available at http://localhost:${PORT}`);
  startReminderScheduler();
});

module.exports = app;
