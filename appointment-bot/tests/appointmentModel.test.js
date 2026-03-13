jest.mock('../src/models/db', () => ({
  query: jest.fn(),
}));

const { query } = require('../src/models/db');
const { createAppointment } = require('../src/models/appointmentModel');

describe('appointmentModel.createAppointment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('uses status confirmada by default', async () => {
    const fakeRow = { id: 'appt-1', status: 'confirmada' };
    query.mockResolvedValue({ rows: [fakeRow] });

    const result = await createAppointment({
      patientId: 'patient-1',
      serviceKey: 'limpieza',
      serviceName: 'Limpieza Dental',
      appointmentAt: new Date('2026-02-20T15:00:00.000Z'),
      durationMinutes: 60,
      googleEventId: 'google-1',
      notes: 'Agendado via bot',
    });

    expect(result).toEqual(fakeRow);
    expect(query).toHaveBeenCalledTimes(1);

    const [sql, params] = query.mock.calls[0];
    expect(sql).toContain('status');
    expect(params[5]).toBe('confirmada');
  });

  test('respects explicit status value', async () => {
    const fakeRow = { id: 'appt-2', status: 'cancelada' };
    query.mockResolvedValue({ rows: [fakeRow] });

    await createAppointment({
      patientId: 'patient-2',
      serviceKey: 'revision',
      serviceName: 'Revisión General',
      appointmentAt: new Date('2026-03-01T15:00:00.000Z'),
      durationMinutes: 45,
      status: 'cancelada',
      googleEventId: null,
      notes: 'Cancelada manualmente',
    });

    const [, params] = query.mock.calls[0];
    expect(params[5]).toBe('cancelada');
  });
});
