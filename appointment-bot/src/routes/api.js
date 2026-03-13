/**
 * API Routes for Admin Panel
 */

const express = require('express');
const router = express.Router();
const { query } = require('../models/db');
const logger = require('../config/logger');

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

/**
 * GET /api/dashboard/stats
 * Returns dashboard statistics
 */
router.get('/dashboard/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Today's appointments count
    const todayResult = await query(
      `SELECT COUNT(*) as count FROM appointments 
       WHERE DATE(appointment_at) = CURRENT_DATE`
    );
    
    // Confirmed appointments
    const confirmedResult = await query(
      `SELECT COUNT(*) as count FROM appointments 
       WHERE status = 'confirmada' 
       AND DATE(appointment_at) >= CURRENT_DATE`
    );
    
    // Pending appointments
    const pendingResult = await query(
      `SELECT COUNT(*) as count FROM appointments 
       WHERE status = 'pendiente' 
       AND DATE(appointment_at) >= CURRENT_DATE`
    );
    
    // Total patients
    const patientsResult = await query(
      `SELECT COUNT(*) as count FROM patients`
    );
    
    res.json({
      todayAppointments: parseInt(todayResult.rows[0].count),
      confirmedAppointments: parseInt(confirmedResult.rows[0].count),
      pendingAppointments: parseInt(pendingResult.rows[0].count),
      totalPatients: parseInt(patientsResult.rows[0].count)
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ─── Appointments ────────────────────────────────────────────────────────────

/**
 * GET /api/appointments
 * Returns all appointments with optional filters
 */
router.get('/appointments', async (req, res) => {
  try {
    const { status, date, patient, limit = 50 } = req.query;
    
    let sql = `
      SELECT 
        a.*,
        p.full_name as patient_name,
        p.phone as patient_phone,
        p.channel,
        p.channel_id
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (status) {
      sql += ` AND a.status = $${paramIndex++}`;
      params.push(status);
    }
    
    if (date) {
      sql += ` AND DATE(a.appointment_at) = $${paramIndex++}`;
      params.push(date);
    }
    
    if (patient) {
      sql += ` AND p.full_name ILIKE $${paramIndex++}`;
      params.push(`%${patient}%`);
    }
    
    sql += ` ORDER BY a.appointment_at DESC LIMIT $${paramIndex}`;
    params.push(parseInt(limit));
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching appointments', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

/**
 * GET /api/appointments/today
 * Returns today's appointments
 */
router.get('/appointments/today', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        a.*,
        p.full_name as patient_name,
        p.phone as patient_phone,
        p.channel
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      WHERE DATE(a.appointment_at) = CURRENT_DATE
      ORDER BY a.appointment_at ASC
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching today appointments', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

/**
 * GET /api/appointments/upcoming
 * Returns upcoming appointments
 */
router.get('/appointments/upcoming', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const result = await query(`
      SELECT 
        a.*,
        p.full_name as patient_name,
        p.phone as patient_phone,
        p.channel
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      WHERE a.appointment_at >= CURRENT_DATE
      AND a.appointment_at < CURRENT_DATE + INTERVAL '${days} days'
      AND a.status != 'cancelada'
      ORDER BY a.appointment_at ASC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching upcoming appointments', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

/**
 * GET /api/appointments/:id
 * Returns a single appointment
 */
router.get('/appointments/:id', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        a.*,
        p.full_name as patient_name,
        p.phone as patient_phone,
        p.channel,
        p.channel_id
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      WHERE a.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching appointment', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

/**
 * POST /api/appointments
 * Creates a new appointment
 */
router.post('/appointments', async (req, res) => {
  try {
    const { patientId, serviceKey, serviceName, appointmentAt, durationMinutes, notes } = req.body;
    
    const result = await query(`
      INSERT INTO appointments 
        (patient_id, service_key, service_name, appointment_at, duration_minutes, notes, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'confirmada')
      RETURNING *
    `, [patientId, serviceKey, serviceName, appointmentAt, durationMinutes, notes]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating appointment', { error: error.message });
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

/**
 * PATCH /api/appointments/:id
 * Updates an appointment
 */
router.patch('/appointments/:id', async (req, res) => {
  try {
    const { status, appointmentAt, notes } = req.body;
    
    const result = await query(`
      UPDATE appointments 
      SET 
        status = COALESCE($1, status),
        appointment_at = COALESCE($2, appointment_at),
        notes = COALESCE($3, notes),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [status, appointmentAt, notes, req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating appointment', { error: error.message });
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

/**
 * DELETE /api/appointments/:id
 * Deletes an appointment
 */
router.delete('/appointments/:id', async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM appointments WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    logger.error('Error deleting appointment', { error: error.message });
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// ─── Patients ────────────────────────────────────────────────────────────────

/**
 * GET /api/patients
 * Returns all patients
 */
router.get('/patients', async (req, res) => {
  try {
    const { search, channel, limit = 50 } = req.query;
    
    let sql = `
      SELECT 
        p.*,
        COUNT(a.id) as appointments_count,
        MAX(a.appointment_at) as last_appointment
      FROM patients p
      LEFT JOIN appointments a ON a.patient_id = p.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (search) {
      sql += ` AND (p.full_name ILIKE $${paramIndex} OR p.phone ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    if (channel) {
      sql += ` AND p.channel = $${paramIndex++}`;
      params.push(channel);
    }
    
    sql += ` GROUP BY p.id ORDER BY p.created_at DESC LIMIT $${paramIndex}`;
    params.push(parseInt(limit));
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching patients', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

/**
 * GET /api/patients/:id
 * Returns a single patient with appointment history
 */
router.get('/patients/:id', async (req, res) => {
  try {
    // Get patient
    const patientResult = await query(
      'SELECT * FROM patients WHERE id = $1',
      [req.params.id]
    );
    
    if (patientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Get appointment history
    const appointmentsResult = await query(`
      SELECT * FROM appointments 
      WHERE patient_id = $1 
      ORDER BY appointment_at DESC
    `, [req.params.id]);
    
    res.json({
      ...patientResult.rows[0],
      appointments: appointmentsResult.rows
    });
  } catch (error) {
    logger.error('Error fetching patient', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

/**
 * PATCH /api/patients/:id
 * Updates a patient
 */
router.patch('/patients/:id', async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    
    const result = await query(`
      UPDATE patients 
      SET 
        full_name = COALESCE($1, full_name),
        phone = COALESCE($2, phone),
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [fullName, phone, req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating patient', { error: error.message });
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// ─── Messages ────────────────────────────────────────────────────────────────

/**
 * GET /api/messages
 * Returns message logs
 */
router.get('/messages', async (req, res) => {
  try {
    const { channel, direction, limit = 50 } = req.query;
    
    let sql = `
      SELECT 
        ml.*,
        p.full_name as patient_name
      FROM message_logs ml
      LEFT JOIN patients p ON 
        (ml.payload->>'from') = p.channel_id 
        OR (ml.payload->'sender'->>'id') = p.channel_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (channel) {
      sql += ` AND ml.channel = $${paramIndex++}`;
      params.push(channel);
    }
    
    if (direction) {
      sql += ` AND ml.direction = $${paramIndex++}`;
      params.push(direction);
    }
    
    sql += ` ORDER BY ml.created_at DESC LIMIT $${paramIndex}`;
    params.push(parseInt(limit));
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching messages', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ─── Services ────────────────────────────────────────────────────────────────

/**
 * GET /api/services
 * Returns available services
 */
router.get('/services', async (req, res) => {
  try {
    // Services are typically stored in config, returning default set
    const services = [
      { key: 'limpieza', name: 'Limpieza Dental', duration: 45, price: 35000 },
      { key: 'consulta', name: 'Consulta General', duration: 30, price: 25000 },
      { key: 'blanqueamiento', name: 'Blanqueamiento', duration: 60, price: 85000 },
      { key: 'extraccion', name: 'Extracción', duration: 45, price: 45000 },
      { key: 'ortodoncia', name: 'Ortodoncia', duration: 30, price: 150000 },
      { key: 'empaste', name: 'Empaste', duration: 45, price: 40000 }
    ];
    
    res.json(services);
  } catch (error) {
    logger.error('Error fetching services', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// ─── Available Slots ─────────────────────────────────────────────────────────

/**
 * GET /api/slots/available
 * Returns available time slots for a given date
 */
router.get('/slots/available', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter required' });
    }
    
    // Get existing appointments for the date
    const result = await query(`
      SELECT appointment_at, duration_minutes 
      FROM appointments 
      WHERE DATE(appointment_at) = $1
      AND status != 'cancelada'
    `, [date]);
    
    const bookedSlots = result.rows;
    
    // Generate all possible slots (8:00 - 17:00, 30 min intervals)
    const slots = [];
    for (let hour = 8; hour < 17; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        
        // Check if slot is booked
        const isBooked = bookedSlots.some(slot => {
          const slotTime = new Date(slot.appointment_at);
          const slotHour = slotTime.getHours();
          const slotMin = slotTime.getMinutes();
          return slotHour === hour && slotMin === min;
        });
        
        if (!isBooked) {
          slots.push(timeStr);
        }
      }
    }
    
    res.json(slots);
  } catch (error) {
    logger.error('Error fetching available slots', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

module.exports = router;
