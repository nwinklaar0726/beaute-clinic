const { query } = require('./db');

const createAppointment = async ({
  patientId,
  serviceKey,
  serviceName,
  appointmentAt,
  durationMinutes,
  status = 'confirmada',
  googleEventId,
  notes,
}) => {
  const res = await query(
    `INSERT INTO appointments
       (patient_id, service_key, service_name, appointment_at, duration_minutes, status, google_event_id, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [patientId, serviceKey, serviceName, appointmentAt, durationMinutes, status, googleEventId, notes]
  );
  return res.rows[0];
};

const getPendingReminders = async () => {
  // Returns confirmed appointments within the next 24-25 hours that haven't been reminded
  const res = await query(
    `SELECT a.*, p.channel, p.channel_id, p.full_name, p.phone
     FROM appointments a
     JOIN patients p ON p.id = a.patient_id
     WHERE a.status = 'confirmada'
       AND a.reminder_sent = FALSE
       AND a.appointment_at BETWEEN NOW() + INTERVAL '23 hours'
                                 AND NOW() + INTERVAL '25 hours'`
  );
  return res.rows;
};

const markReminderSent = async (appointmentId) => {
  await query(
    `UPDATE appointments SET reminder_sent = TRUE, status = 'recordatorio_enviado'
     WHERE id = $1`,
    [appointmentId]
  );
};

const updateStatus = async (appointmentId, status) => {
  await query(
    'UPDATE appointments SET status = $1 WHERE id = $2',
    [status, appointmentId]
  );
};

module.exports = { createAppointment, getPendingReminders, markReminderSent, updateStatus };
