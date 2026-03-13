const { query } = require('./db');

const getConversation = async (patientId) => {
  const res = await query(
    'SELECT * FROM conversations WHERE patient_id = $1',
    [patientId]
  );
  return res.rows[0] || null;
};

const upsertConversation = async (patientId, state, context = {}, lastMessage = null) => {
  const res = await query(
    `INSERT INTO conversations (patient_id, state, context, last_message)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (patient_id) DO UPDATE
       SET state = EXCLUDED.state,
           context = EXCLUDED.context,
           last_message = EXCLUDED.last_message,
           updated_at = NOW()
     RETURNING *`,
    [patientId, state, JSON.stringify(context), lastMessage]
  );
  return res.rows[0];
};

const resetConversation = async (patientId) => {
  return upsertConversation(patientId, 'inicio', {}, null);
};

module.exports = { getConversation, upsertConversation, resetConversation };
