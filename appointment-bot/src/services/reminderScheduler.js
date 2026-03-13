/**
 * reminderScheduler.js
 *
 * Cron-based scheduler that fires reminder messages 24 hours
 * before each confirmed appointment.
 *
 * Runs every 15 minutes. Appointments within the 23–25 h window
 * are picked up by getPendingReminders() (defined in appointmentModel).
 *
 * Public API:
 *   runReminders() → void
 *   startReminderScheduler() → void
 */

const cron = require('node-cron');
const logger = require('../config/logger');
const { getPendingReminders, markReminderSent } = require('../models/appointmentModel');
const { sendWhatsAppMessage } = require('./whatsappService');
const { sendInstagramMessage } = require('./instagramService');
const config = require('../config');

// ─── Message builder ──────────────────────────────────────────────────────────

const buildReminderText = (appointment) => {
  const friendlyDate = new Intl.DateTimeFormat('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: config.clinic.timezone,
  }).format(new Date(appointment.appointment_at));

  return (
    `🔔 *Recordatorio de cita — ${config.clinic.name}*\n\n` +
    `Hola *${appointment.full_name || 'paciente'}*,\n` +
    `te recordamos que mañana tienes una cita:\n\n` +
    `📅 *${friendlyDate}*\n` +
    `🦷 *${appointment.service_name}*\n\n` +
    `Con el ${config.clinic.doctorName}.\n` +
    `Si necesitas cancelar o reprogramar, por favor escríbenos con anticipación. ¡Te esperamos!`
  );
};

// ─── Reminder runner ──────────────────────────────────────────────────────────

const runReminders = async () => {
  logger.info('Reminder scheduler: checking pending reminders...');

  let reminders;
  try {
    reminders = await getPendingReminders();
  } catch (err) {
    logger.error('Reminder scheduler: DB error fetching reminders', { error: err.message });
    return;
  }

  if (reminders.length === 0) {
    logger.info('Reminder scheduler: no pending reminders.');
    return;
  }

  logger.info(`Reminder scheduler: found ${reminders.length} reminder(s) to send.`);

  for (const appt of reminders) {
    const text = buildReminderText(appt);

    try {
      let sent = false;

      if (appt.channel === 'whatsapp') {
        sent = await sendWhatsAppMessage(appt.channel_id, text);
      } else if (appt.channel === 'instagram') {
        sent = await sendInstagramMessage(appt.channel_id, text);
      } else {
        logger.warn('Reminder scheduler: unknown channel', { channel: appt.channel, id: appt.id });
        continue;
      }

      if (!sent) {
        logger.warn('Reminder scheduler: message send failed, will retry in next run', {
          appointmentId: appt.id,
          channel: appt.channel,
        });
        continue;
      }

      await markReminderSent(appt.id);
      logger.info('Reminder sent', { appointmentId: appt.id, channel: appt.channel });
    } catch (err) {
      logger.error('Reminder scheduler: failed to send reminder', {
        appointmentId: appt.id,
        error: err.message,
      });
      // Continue to next appointment — don't let one failure block others
    }
  }
};

// ─── Scheduler bootstrap ──────────────────────────────────────────────────────

/**
 * Start the cron job. Called once from server.js at startup.
 * Schedule: every 15 minutes.
 */
const startReminderScheduler = () => {
  // '*/15 * * * *' = every 15 minutes
  cron.schedule('*/15 * * * *', runReminders, {
    timezone: config.clinic.timezone,
  });

  logger.info('Reminder scheduler started (runs every 15 minutes).');

  // Also run immediately at startup to catch any missed reminders
  runReminders();
};

module.exports = { startReminderScheduler, runReminders };
