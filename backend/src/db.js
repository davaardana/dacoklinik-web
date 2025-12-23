const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pgConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'daco_clinic',
    };

if (process.env.PG_SSL === 'true') {
  pgConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(pgConfig);

pool.on('error', (err) => {
  console.error('Unexpected database error', err);
  process.exit(1);
});

module.exports = {
  pool,
};
