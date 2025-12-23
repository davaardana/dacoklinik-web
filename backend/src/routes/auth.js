const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../db');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username);
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, username, password, role FROM users WHERE username = $1 LIMIT 1',
      [username]
    );

    if (!result.rows.length) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    console.log('User found, comparing password...');
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValid);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ username: user.username, role: user.role });
    console.log('Login successful for:', username);
    return res.json({ token, user: { username: user.username, role: user.role } });
  } catch (error) {
    console.error('Login error', error);
    return res.status(500).json({ message: 'Unable to process login' });
  }
});

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Check if username already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role || 'staff']
    );

    const newUser = result.rows[0];
    const token = generateToken({ username: newUser.username, role: newUser.role });

    return res.status(201).json({ 
      token, 
      user: { username: newUser.username, role: newUser.role },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error', error);
    return res.status(500).json({ message: 'Unable to process registration' });
  }
});

router.put('/change-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  
  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  try {
    // Get user with current password
    const result = await pool.query(
      'SELECT id, username, password FROM users WHERE username = $1',
      [username]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    
    // Verify old password
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, user.id]
    );

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error', error);
    return res.status(500).json({ message: 'Unable to change password' });
  }
});

module.exports = router;
