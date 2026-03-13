/**
 * Conversation State Machine — Finite State Machine (FSM)
 *
 * States:
 *   inicio → esperando_servicio → esperando_fecha → esperando_hora
 *         → esperando_nombre → esperando_telefono → confirmando → confirmado
 *
 * Each handler receives: { patientId, text, context, sendFn }
 * and must return: { nextState, nextContext, reply }
 */
const logger = require('../config/logger');
const { getConversation, upsertConversation } = require('../models/conversationModel');
const { findOrCreate } = require('../models/patientModel');
const { getServiceByKeyword, formatServicesMenu } = require('./servicesService');
const calendarService = require('./calendarService');
const { createAppointment } = require('../models/appointmentModel');
const config = require('../config');

// ─── Keywords ─────────────────────────────────────────────────────────────────
const RESET_KEYWORDS = ['hola', 'inicio', 'menu', 'menú', 'reiniciar', 'empezar', 'start'];
const CANCEL_KEYWORDS = ['cancelar', 'cancel', 'salir', 'exit'];

// ─── State Handlers ───────────────────────────────────────────────────────────

const handlers = {
  /**
   * inicio: Welcome message + show services menu.
   */
  inicio: async ({ text }) => {
    const reply =
      `¡Hola! Bienvenido/a al *${config.clinic.name}* 🦷\n` +
      `Soy el asistente virtual del *${config.clinic.doctorName}*.\n\n` +
      `¿En qué servicio estás interesado/a?\n\n` +
      formatServicesMenu();

    return {
      nextState: 'esperando_servicio',
      nextContext: {},
      reply,
    };
  },

  /**
   * esperando_servicio: Match user input to a dental service.
   */
  esperando_servicio: async ({ text }) => {
    const service = getServiceByKeyword(text);

    if (!service) {
      return {
        nextState: 'esperando_servicio',
        nextContext: {},
        reply:
          `No reconocí ese servicio. Por favor escribe el *número* o el *nombre* del servicio:\n\n` +
          formatServicesMenu(),
      };
    }

    return {
      nextState: 'esperando_fecha',
      nextContext: { service },
      reply:
        `Excelente! Seleccionaste: *${service.name}* 💰 Precio: *${service.price}*\n\n` +
        `¿Para qué *fecha* te gustaría tu cita?\n` +
        `Escribe en formato: *DD/MM/YYYY* (ej: 25/07/2025)\n\n` +
        `Atendemos de lunes a viernes, ${config.clinic.workingHours.start}:00 a ${config.clinic.workingHours.end}:00 hrs.`,
    };
  },

  /**
   * esperando_fecha: Parse and validate a date from the user.
   */
  esperando_fecha: async ({ text, context }) => {
    const date = parseDate(text);

    if (!date) {
      return {
        nextState: 'esperando_fecha',
        nextContext: context,
        reply: `No pude interpretar esa fecha. Por favor usa el formato *DD/MM/YYYY* (ej: 25/07/2025).`,
      };
    }

    if (!isWorkingDay(date)) {
      return {
        nextState: 'esperando_fecha',
        nextContext: context,
        reply: `😅 Ese día no atendemos. Por favor elige un día de *lunes a viernes*.`,
      };
    }

    if (isDateBeforeTodayInTimezone(date, config.clinic.timezone)) {
      return {
        nextState: 'esperando_fecha',
        nextContext: context,
        reply: `⚠️ Esa fecha ya pasó. Elige una fecha *futura* por favor.`,
      };
    }

    // Fetch available slots for that date
    const slots = await calendarService.getAvailableSlots(date);

    if (slots.length === 0) {
      return {
        nextState: 'esperando_fecha',
        nextContext: context,
        reply:
          `📅 No hay horarios disponibles para *${formatDateFriendly(date)}*.\n` +
          `Por favor elige otra fecha.`,
      };
    }

    const slotsText = slots.map((s, i) => `  ${i + 1}. ${s.label}`).join('\n');

    return {
      nextState: 'esperando_hora',
      nextContext: { ...context, date: date.toISOString(), slots },
      reply:
        `📅 Horarios disponibles para *${formatDateFriendly(date)}*:\n\n` +
        `${slotsText}\n\n` +
        `Escribe el *número* o la *hora* que prefieras.`,
    };
  },

  /**
   * esperando_hora: Match slot selection.
   */
  esperando_hora: async ({ text, context }) => {
    const { slots } = context;
    const slot = matchSlot(text, slots);

    if (!slot) {
      const slotsText = slots.map((s, i) => `  ${i + 1}. ${s.label}`).join('\n');
      return {
        nextState: 'esperando_hora',
        nextContext: context,
        reply: `No reconocí esa hora. Elige un número de la lista:\n\n${slotsText}`,
      };
    }

    return {
      nextState: 'esperando_nombre',
      nextContext: { ...context, slot },
      reply: `Perfecto! Hora seleccionada: *${slot.label}* ✅\n\n¿Cuál es tu *nombre completo*?`,
    };
  },

  /**
   * esperando_nombre: Capture patient full name.
   */
  esperando_nombre: async ({ text, context }) => {
    if (text.trim().length < 3) {
      return {
        nextState: 'esperando_nombre',
        nextContext: context,
        reply: `Por favor escribe tu *nombre completo*.`,
      };
    }

    return {
      nextState: 'esperando_telefono',
      nextContext: { ...context, nombre: text.trim() },
      reply: `Gracias, *${text.trim()}* 😊\n\n¿Cuál es tu *número de teléfono* (para confirmación)?`,
    };
  },

  /**
   * esperando_telefono: Capture phone, then show confirmation summary.
   */
  esperando_telefono: async ({ text, context }) => {
    const phone = text.replace(/\D/g, '');
    if (phone.length < 7) {
      return {
        nextState: 'esperando_telefono',
        nextContext: context,
        reply: `Por favor ingresa un número de teléfono válido.`,
      };
    }

    const { service, slot, nombre } = context;
    const confirmMsg =
      `📋 *Resumen de tu cita:*\n\n` +
      `👤 Nombre: *${nombre}*\n` +
      `📞 Teléfono: *${phone}*\n` +
      `🦷 Servicio: *${service.name}*\n` +
      `💰 Precio: *${service.price}*\n` +
      `📅 Fecha: *${slot.label}*\n\n` +
      `¿Confirmamos tu cita? Escribe *SÍ* para confirmar o *NO* para cancelar.`;

    return {
      nextState: 'confirmando',
      nextContext: { ...context, telefono: phone },
      reply: confirmMsg,
    };
  },

  /**
   * confirmando: Final yes/no from patient.
   */
  confirmando: async ({ text, context, patientId, updatePatient }) => {
    const answer = text.toLowerCase().trim();

    if (['no', 'cancelar', 'nope'].includes(answer)) {
      return {
        nextState: 'inicio',
        nextContext: {},
        reply: `Cita cancelada. ¡No hay problema! Si necesitas ayuda escribe *Hola* cuando quieras. 😊`,
      };
    }

    if (!['sí', 'si', 'yes', 'confirmar', 'confirmo', 'ok'].includes(answer)) {
      return {
        nextState: 'confirmando',
        nextContext: context,
        reply: `Por favor responde *SÍ* para confirmar o *NO* para cancelar.`,
      };
    }

    // ── Book the appointment ─────────────────────────────────────────────────
    const { service, slot, nombre, telefono } = context;
    const appointmentDate = new Date(slot.isoStart);

    let googleEventId = null;
    try {
      const event = await calendarService.createAppointment({
        summary: `${service.name} — ${nombre}`,
        description: `Paciente: ${nombre}\nTeléfono: ${telefono}\nServicio: ${service.name}\nPrecio: ${service.price}`,
        startIso: slot.isoStart,
        endIso: slot.isoEnd,
        patientName: nombre,
        patientPhone: telefono,
      });
      googleEventId = event.id;
    } catch (err) {
      logger.error('Google Calendar booking failed', { error: err.message });
      return {
        nextState: 'confirmando',
        nextContext: context,
        reply: `⚠️ Hubo un error al agendar en el calendario. Por favor intenta de nuevo en unos minutos.`,
      };
    }

    // Save to DB
    await createAppointment({
      patientId,
      serviceKey: service.key,
      serviceName: service.name,
      appointmentAt: appointmentDate,
      durationMinutes: config.clinic.appointmentDurationMinutes,
      status: 'confirmada',
      googleEventId,
      notes: `Agendado via bot`,
    });

    // Update patient profile
    await updatePatient(patientId, { full_name: nombre, phone: telefono });

    const friendlyDate = new Intl.DateTimeFormat('es-CR', {
      weekday: 'long', day: 'numeric', month: 'long',
      hour: '2-digit', minute: '2-digit', timeZone: config.clinic.timezone,
    }).format(appointmentDate);

    return {
      nextState: 'confirmado',
      nextContext: { lastAppointment: { service, slot, nombre, telefono } },
      reply:
        `✅ *¡Cita confirmada!*\n\n` +
        `📅 *${friendlyDate}*\n` +
        `🦷 *${service.name}*\n\n` +
        `Te esperamos en ${config.clinic.name} con el ${config.clinic.doctorName}.\n` +
        `Recibirás un recordatorio 24 horas antes. ¡Hasta pronto! 😊`,
    };
  },

  /**
   * confirmado: Catch-all after booking — restart conversation.
   */
  confirmado: async () => {
    return {
      nextState: 'inicio',
      nextContext: {},
      reply: `Escribe *Hola* si deseas agendar otra cita o consultar algo más. 😊`,
    };
  },
};

// ─── Main FSM entry point ─────────────────────────────────────────────────────

/**
 * processMessage — resolves the current state for a user and runs the handler.
 *
 * @param {string} channel   - 'whatsapp' | 'instagram'
 * @param {string} channelId - sender identifier
 * @param {string} text      - raw message text
 * @param {Function} sendFn  - async fn to send reply back to user
 */
const processMessage = async (channel, channelId, text, sendFn) => {
  const normalizedText = text.trim();

  // Find/create patient
  const patient = await findOrCreate(channel, channelId);

  // Load conversation state
  let conversation = await getConversation(patient.id);
  let currentState = conversation?.state || 'inicio';
  let currentContext = conversation?.context || {};

  // Override: reset keywords always restart
  if (RESET_KEYWORDS.some(k => normalizedText.toLowerCase() === k)) {
    currentState = 'inicio';
    currentContext = {};
  }

  // Override: cancel keywords
  if (CANCEL_KEYWORDS.some(k => normalizedText.toLowerCase() === k)) {
    await upsertConversation(patient.id, 'inicio', {}, normalizedText);
    await sendFn(`Entendido. Escribe *Hola* cuando quieras volver a empezar. 👋`);
    return;
  }

  const handler = handlers[currentState] || handlers['inicio'];

  logger.info('FSM processing', { channel, state: currentState, patientId: patient.id });

  const { updatePatient } = require('../models/patientModel');
  const { nextState, nextContext, reply } = await handler({
    text: normalizedText,
    context: currentContext,
    patientId: patient.id,
    updatePatient,
  });

  // Persist new state
  await upsertConversation(patient.id, nextState, nextContext, normalizedText);

  // Send reply
  await sendFn(reply);
};

// ─── Utility helpers ──────────────────────────────────────────────────────────

const parseDate = (text) => {
  // Accept only DD/MM/YYYY or DD-MM-YYYY
  const match = text.trim().match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (!match) return null;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return null;

  // Prevent JS Date rollover (e.g., 31/02 becoming 03/03)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
};

const isWorkingDay = (date) => {
  const day = date.getDay(); // 0=Sun, 6=Sat
  return config.clinic.workingDays.includes(day);
};

const pad2 = (n) => String(n).padStart(2, '0');

const getLocalDateKey = (date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

const getDateKeyInTimezone = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;
  return `${year}-${month}-${day}`;
};

const isDateBeforeTodayInTimezone = (date, timeZone) => {
  const selectedKey = getLocalDateKey(date);
  const todayKey = getDateKeyInTimezone(new Date(), timeZone);
  return selectedKey < todayKey;
};

const formatDateFriendly = (date) => {
  return new Intl.DateTimeFormat('es-CR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(date);
};

const matchSlot = (text, slots) => {
  const num = parseInt(text);
  if (!isNaN(num) && num >= 1 && num <= slots.length) return slots[num - 1];
  return slots.find(s => s.label.includes(text.replace(/[^0-9:]/g, ''))) || null;
};

module.exports = { processMessage };
