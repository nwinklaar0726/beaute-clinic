const { Pool } = require('pg');
const config = require('../config');
const logger = require('../config/logger');

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  ssl: config.db.ssl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  logger.error('Unexpected DB pool error', { error: err.message });
});

/**
 * Execute a parameterized query.
 * @param {string} text  - SQL string with $1, $2 placeholders
 * @param {Array}  params - Values for placeholders
 */
const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  logger.debug('Query executed', { duration: Date.now() - start, rows: res.rowCount });
  return res;
};

module.exports = { query, pool };
