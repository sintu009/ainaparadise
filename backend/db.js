const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('error', (err) => console.error('Unexpected DB error', err));

// Auto-migrate: add images column if missing
pool.query("ALTER TABLE rooms ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'").catch(() => {});

module.exports = pool;
