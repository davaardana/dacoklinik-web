const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all medicines with optional search
router.get('/', authMiddleware, async (req, res) => {
  const { search } = req.query;
  
  try {
    let query = 'SELECT * FROM medicines ORDER BY created_at DESC';
    let params = [];

    if (search) {
      query = `
        SELECT * FROM medicines 
        WHERE name ILIKE $1 OR price::TEXT ILIKE $1 OR stock::TEXT ILIKE $1
        ORDER BY created_at DESC
      `;
      params = [`%${search}%`];
    }

    const result = await pool.query(query, params);
    return res.json(result.rows);
  } catch (error) {
    console.error('Get medicines error', error);
    return res.status(500).json({ message: 'Unable to fetch medicines' });
  }
});

// Create new medicine
router.post('/', authMiddleware, async (req, res) => {
  const { name, price, stock, unit, description } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO medicines (name, price, stock, unit, description) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, price, stock || 0, unit || 'pcs', description || '']
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create medicine error', error);
    return res.status(500).json({ message: 'Unable to create medicine' });
  }
});

// Update medicine
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, unit, description } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  try {
    const result = await pool.query(
      `UPDATE medicines 
       SET name = $1, price = $2, stock = $3, unit = $4, description = $5
       WHERE id = $6
       RETURNING *`,
      [name, price, stock || 0, unit || 'pcs', description || '', id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Update medicine error', error);
    return res.status(500).json({ message: 'Unable to update medicine' });
  }
});

// Delete medicine
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM medicines WHERE id = $1 RETURNING id', [id]);
    
    if (!result.rows.length) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    return res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Delete medicine error', error);
    return res.status(500).json({ message: 'Unable to delete medicine' });
  }
});

module.exports = router;
