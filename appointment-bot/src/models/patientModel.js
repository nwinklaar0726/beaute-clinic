const { query } = require('./db');

/**
 * Find or create a patient record by channel + channelId.
 * Returns the patient row.
 */
const findOrCreate = async (channel, channelId) => {
  const existing = await query(
    'SELECT * FROM patients WHERE channel = $1 AND channel_id = $2',
    [channel, channelId]
  );
  if (existing.rows.length > 0) return existing.rows[0];

  const created = await query(
    `INSERT INTO patients (channel, channel_id)
     VALUES ($1, $2)
     RETURNING *`,
    [channel, channelId]
  );
  return created.rows[0];
};

const updatePatient = async (id, fields) => {
  const { full_name, phone } = fields;
  const res = await query(
    `UPDATE patients SET full_name = COALESCE($1, full_name), phone = COALESCE($2, phone)
     WHERE id = $3 RETURNING *`,
    [full_name, phone, id]
  );
  return res.rows[0];
};

module.exports = { findOrCreate, updatePatient };
