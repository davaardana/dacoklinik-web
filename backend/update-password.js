const bcrypt = require('bcrypt');
const { pool } = require('./src/db');

(async () => {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    console.log('Generated hash:', hash);
    
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE username = $2 RETURNING username',
      [hash, 'admin']
    );
    
    console.log('Password updated successfully for:', result.rows[0].username);
    
    // Verify
    const verify = await pool.query('SELECT username, password FROM users WHERE username = $1', ['admin']);
    console.log('Stored password hash:', verify.rows[0].password);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
