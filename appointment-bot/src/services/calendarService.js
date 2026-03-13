/**
 * calendarService.js
 *
 * Wraps Google Calendar API (OAuth2 with refresh token).
 *
 * Public API:
 *   getAvailableSlots(date)         → Array<{ label, isoStart, isoEnd }>
 *   createAppointment({...})        → Google Calendar event object
 */

const { google } = require('googleapis');
const config = require('../config');
const logger = require('../config/logger');

// ─── OAuth2 client ────────────────────────────────────────────────────────────

const buildOAuthClient = () => {
  const auth = new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri
  );
  auth.setCredentials({ refresh_token: config.google.refreshToken });
  return auth;
};

const getCalendar = () => {
  const auth = buildOAuthClient();
  return google.calendar({ version: 'v3', auth });
};

// ─── Slot helpers ─────────────────────────────────────────────────────────────

const DURATION = config.clinic.appointmentDurationMinutes; // minutes per slot
const TZ = config.clinic.timezone;
const pad2 = (n) => String(n).padStart(2, '0');

/**
 * Build all theoretical time slots for a given date within working hours.
 * Returns array of { start: Date, end: Date }
 */
const buildDaySlots = (date) => {
  const slots = [];
  const start = config.clinic.workingHours.start; // e.g. 8
  const end = config.clinic.workingHours.end;     // e.g. 17

  let cursor = new Date(date);
  cursor.setHours(start, 0, 0, 0);

  while (true) {
    const slotEnd = new Date(cursor.getTime() + DURATION * 60_000);
    if (slotEnd.getHours() > end || (slotEnd.getHours() === end && slotEnd.getMinutes() > 0)) break;
    slots.push({ start: new Date(cursor), end: new Date(slotEnd) });
    cursor = slotEnd;
  }

  return slots;
};

/**
 * Given a list of existing Google Calendar events, check whether a slot overlaps.
 */
const isSlotFree = (slot, events) => {
  return !events.some((evt) => {
    const evtStart = new Date(evt.start.dateTime || evt.start.date);
    const evtEnd = new Date(evt.end.dateTime || evt.end.date);
    // Overlap if slot starts before event ends AND slot ends after event starts
    return slot.start < evtEnd && slot.end > evtStart;
  });
};

/**
 * Format a Date into a human-friendly hour label in the clinic timezone.
 */
const formatSlotLabel = (start, end) => {
  const fmt = (d) =>
    new Intl.DateTimeFormat('es-CR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: TZ,
    }).format(d);
  return `${fmt(start)} – ${fmt(end)}`;
};

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

// ─── Public functions ─────────────────────────────────────────────────────────

/**
 * Return available appointment slots for a given date.
 *
 * @param {Date} date
 * @returns {Promise<Array<{ label: string, isoStart: string, isoEnd: string }>>}
 */
const getAvailableSlots = async (date) => {
  const calendar = getCalendar();

  // Query events for the entire day
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  let existingEvents = [];
  try {
    const res = await calendar.events.list({
      calendarId: config.google.calendarId,
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    existingEvents = res.data.items || [];
  } catch (err) {
    logger.error('Google Calendar fetch error', { error: err.message });
    throw err;
  }

  const allSlots = buildDaySlots(date);
  let freeSlots = allSlots.filter((s) => isSlotFree(s, existingEvents));

  // When user asks for today's date, only offer future slots.
  const selectedDateKey = getLocalDateKey(date);
  const todayClinicKey = getDateKeyInTimezone(new Date(), TZ);
  if (selectedDateKey === todayClinicKey) {
    const now = new Date();
    freeSlots = freeSlots.filter((slot) => slot.start > now);
  }

  return freeSlots.map((s) => ({
    label: formatSlotLabel(s.start, s.end),
    isoStart: s.start.toISOString(),
    isoEnd: s.end.toISOString(),
  }));
};

/**
 * Create a Google Calendar appointment event.
 *
 * @param {object} params
 * @param {string} params.summary       - event title
 * @param {string} params.description   - event body
 * @param {string} params.startIso      - ISO start datetime
 * @param {string} params.endIso        - ISO end datetime
 * @param {string} params.patientName
 * @param {string} params.patientPhone
 * @returns {Promise<object>} Google Calendar event resource
 */
const createAppointment = async ({ summary, description, startIso, endIso, patientName, patientPhone }) => {
  const calendar = getCalendar();

  const event = {
    summary,
    description,
    start: { dateTime: startIso, timeZone: TZ },
    end:   { dateTime: endIso,   timeZone: TZ },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email',  minutes: 24 * 60 },
        { method: 'popup',  minutes: 30 },
      ],
    },
    extendedProperties: {
      private: {
        patientName,
        patientPhone,
        bookedVia: 'dental-bot',
      },
    },
  };

  try {
    const res = await calendar.events.insert({
      calendarId: config.google.calendarId,
      resource: event,
    });
    logger.info('Google Calendar event created', { eventId: res.data.id });
    return res.data;
  } catch (err) {
    logger.error('Google Calendar insert error', { error: err.message });
    throw err;
  }
};

module.exports = { getAvailableSlots, createAppointment };
