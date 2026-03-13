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
    workingHours: { start: 8, end: 17 },
    appointmentDurationMinutes: 60,
    workingDays: [1, 2, 3, 4, 5],
  },
}));

jest.mock('../src/models/conversationModel', () => ({
  getConversation: jest.fn(),
  upsertConversation: jest.fn(),
}));

jest.mock('../src/models/patientModel', () => ({
  findOrCreate: jest.fn(),
  updatePatient: jest.fn(),
}));

jest.mock('../src/services/calendarService', () => ({
  getAvailableSlots: jest.fn(),
  createAppointment: jest.fn(),
}));

jest.mock('../src/models/appointmentModel', () => ({
  createAppointment: jest.fn(),
}));

const { processMessage } = require('../src/services/stateMachine');
const { getConversation, upsertConversation } = require('../src/models/conversationModel');
const { findOrCreate, updatePatient } = require('../src/models/patientModel');
const calendarService = require('../src/services/calendarService');

const BASE_CONTEXT = {
  service: {
    key: 'limpieza',
    name: 'Limpieza Dental',
    price: '₡25,000',
  },
};

const pad2 = (n) => String(n).padStart(2, '0');

describe('stateMachine date validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();

    findOrCreate.mockResolvedValue({ id: 'patient-1' });
    updatePatient.mockResolvedValue({ id: 'patient-1' });
    getConversation.mockResolvedValue({
      state: 'esperando_fecha',
      context: BASE_CONTEXT,
    });
    upsertConversation.mockResolvedValue({});
    calendarService.getAvailableSlots.mockResolvedValue([]);
  });

  test('rejects invalid calendar date like 31/02/2026', async () => {
    const replies = [];

    await processMessage('whatsapp', '50688887777', '31/02/2026', async (msg) => {
      replies.push(msg);
    });

    expect(replies).toHaveLength(1);
    expect(replies[0]).toContain('No pude interpretar esa fecha');
    expect(calendarService.getAvailableSlots).not.toHaveBeenCalled();
    expect(upsertConversation).toHaveBeenCalledWith(
      'patient-1',
      'esperando_fecha',
      BASE_CONTEXT,
      '31/02/2026'
    );
  });

  test('accepts valid leap-year date like 29/02/2028', async () => {
    const replies = [];
    calendarService.getAvailableSlots.mockResolvedValue([
      {
        label: '08:00 a. m. – 09:00 a. m.',
        isoStart: '2028-02-29T14:00:00.000Z',
        isoEnd: '2028-02-29T15:00:00.000Z',
      },
    ]);

    await processMessage('whatsapp', '50688887777', '29/02/2028', async (msg) => {
      replies.push(msg);
    });

    expect(calendarService.getAvailableSlots).toHaveBeenCalledTimes(1);
    expect(replies[0]).toContain('Horarios disponibles');
    expect(upsertConversation).toHaveBeenCalledWith(
      'patient-1',
      'esperando_hora',
      expect.objectContaining({
        slots: expect.any(Array),
      }),
      '29/02/2028'
    );
  });

  test('does not reject same-day date as past by hour', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 1, 18, 15, 30, 0));

    const now = new Date();
    const sameDayInput = `${pad2(now.getDate())}/${pad2(now.getMonth() + 1)}/${now.getFullYear()}`;
    const replies = [];

    await processMessage('whatsapp', '50688887777', sameDayInput, async (msg) => {
      replies.push(msg);
    });

    expect(replies).toHaveLength(1);
    expect(replies[0]).not.toContain('Esa fecha ya pasó');
    expect(calendarService.getAvailableSlots).toHaveBeenCalledTimes(1);
  });
});
