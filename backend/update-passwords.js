const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function updatePasswords() {
  try {
    // Update admin password with faster hash (4 rounds)
    const adminHash = await bcrypt.hash('admin123', 4);
    await pool.query(
      'UPDATE users SET password = $1 WHERE username = $2',
      [adminHash, 'admin']
    );
    console.log('✅ Admin password updated');
    
    // Update sultan password if exists
    const sultanResult = await pool.query('SELECT id FROM users WHERE username = $1', ['sultan']);
    if (sultanResult.rows.length > 0) {
      const sultanHash = await bcrypt.hash('sultan123', 4);
      await pool.query(
        'UPDATE users SET password = $1 WHERE username = $2',
        [sultanHash, 'sultan']
      );
      console.log('✅ Sultan password updated');
    }
    
    console.log('✅ All passwords updated with faster hash (4 rounds)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updatePasswords();
