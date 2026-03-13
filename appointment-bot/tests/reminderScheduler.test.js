jest.mock('../src/models/appointmentModel', () => ({
  getPendingReminders: jest.fn(),
  markReminderSent: jest.fn(),
}));

jest.mock('../src/services/whatsappService', () => ({
  sendWhatsAppMessage: jest.fn(),
}));

jest.mock('../src/services/instagramService', () => ({
  sendInstagramMessage: jest.fn(),
}));

jest.mock('../src/config/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

jest.mock('../src/config', () => ({
  clinic: {
    name: 'Clinica Test',
    doctorName: 'Dr. Test',
    timezone: 'America/Costa_Rica',
  },
}));

const { getPendingReminders, markReminderSent } = require('../src/models/appointmentModel');
const { sendWhatsAppMessage } = require('../src/services/whatsappService');
const { sendInstagramMessage } = require('../src/services/instagramService');
const logger = require('../src/config/logger');
const { runReminders } = require('../src/services/reminderScheduler');

describe('reminderScheduler.runReminders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getPendingReminders.mockResolvedValue([]);
    markReminderSent.mockResolvedValue(undefined);
    sendWhatsAppMessage.mockResolvedValue(true);
    sendInstagramMessage.mockResolvedValue(true);
  });

  test('does nothing when no reminders are pending', async () => {
    await runReminders();

    expect(sendWhatsAppMessage).not.toHaveBeenCalled();
    expect(sendInstagramMessage).not.toHaveBeenCalled();
    expect(markReminderSent).not.toHaveBeenCalled();
  });

  test('marks reminder as sent when WhatsApp delivery succeeds', async () => {
    getPendingReminders.mockResolvedValue([
      {
        id: 'appt-1',
        channel: 'whatsapp',
        channel_id: '50688887777',
        full_name: 'Ana',
        service_name: 'Limpieza Dental',
        appointment_at: '2026-02-20T15:00:00.000Z',
      },
    ]);

    await runReminders();

    expect(sendWhatsAppMessage).toHaveBeenCalledTimes(1);
    expect(markReminderSent).toHaveBeenCalledWith('appt-1');
  });

  test('does not mark reminder when WhatsApp delivery fails', async () => {
    getPendingReminders.mockResolvedValue([
      {
        id: 'appt-2',
        channel: 'whatsapp',
        channel_id: '50688887777',
        full_name: 'Luis',
        service_name: 'Revisión General',
        appointment_at: '2026-02-20T15:00:00.000Z',
      },
    ]);
    sendWhatsAppMessage.mockResolvedValue(false);

    await runReminders();

    expect(sendWhatsAppMessage).toHaveBeenCalledTimes(1);
    expect(markReminderSent).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalled();
  });

  test('marks reminder as sent when Instagram delivery succeeds', async () => {
    getPendingReminders.mockResolvedValue([
      {
        id: 'appt-3',
        channel: 'instagram',
        channel_id: '17841400000000000',
        full_name: 'Carla',
        service_name: 'Ortodoncia',
        appointment_at: '2026-02-20T15:00:00.000Z',
      },
    ]);

    await runReminders();

    expect(sendInstagramMessage).toHaveBeenCalledTimes(1);
    expect(markReminderSent).toHaveBeenCalledWith('appt-3');
  });

  test('skips unknown channels and does not mark reminder as sent', async () => {
    getPendingReminders.mockResolvedValue([
      {
        id: 'appt-4',
        channel: 'email',
        channel_id: 'user@example.com',
        full_name: 'Mario',
        service_name: 'Limpieza Dental',
        appointment_at: '2026-02-20T15:00:00.000Z',
      },
    ]);

    await runReminders();

    expect(sendWhatsAppMessage).not.toHaveBeenCalled();
    expect(sendInstagramMessage).not.toHaveBeenCalled();
    expect(markReminderSent).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      'Reminder scheduler: unknown channel',
      expect.any(Object)
    );
  });
});
