const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const { search } = req.query;
  
  try {
    let query = 'SELECT * FROM medical_records ORDER BY created_at DESC LIMIT 100';
    let params = [];

    if (search) {
      query = `
        SELECT * FROM medical_records 
        WHERE patient_name ILIKE $1 
           OR department ILIKE $1 
           OR pic ILIKE $1 
           OR examiner ILIKE $1
           OR medical_history ILIKE $1
           OR subjective ILIKE $1
           OR therapy ILIKE $1
        ORDER BY created_at DESC LIMIT 100
      `;
      params = [`%${search}%`];
    }

    const { rows } = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    console.error('Fetch medical records error', error);
    return res.status(500).json({ message: 'Unable to load medical records' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const {
    patient_name,
    birth_place,
    birth_date,
    department,
    pic,
    medical_history,
    subjective,
    blood_pressure,
    spo2,
    pulse,
    respiration,
    therapy,
  } = req.body;

  if (!patient_name || !department) {
    return res.status(400).json({ message: 'Patient name and department are required' });
  }

  try {
    const insertQuery = `
      INSERT INTO medical_records (
        patient_name,
        birth_place,
        birth_date,
        department,
        pic,
        medical_history,
        subjective,
        blood_pressure,
        spo2,
        pulse,
        respiration,
        therapy,
        examiner,
        created_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, NOW()
      )
      RETURNING *;
    `;

    const params = [
      patient_name,
      birth_place,
      birth_date,
      department,
      pic,
      medical_history,
      subjective,
      blood_pressure,
      spo2,
      pulse,
      respiration,
      therapy,
      req.user.username,
    ];

    const { rows } = await pool.query(insertQuery, params);
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Create medical record error', error);
    return res.status(500).json({ message: 'Unable to save medical record' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    patient_name,
    birth_place,
    birth_date,
    department,
    pic,
    medical_history,
    subjective,
    blood_pressure,
    spo2,
    pulse,
    respiration,
    therapy,
  } = req.body;

  if (!patient_name || !department) {
    return res.status(400).json({ message: 'Patient name and department are required' });
  }

  try {
    const result = await pool.query(
      `UPDATE medical_records 
       SET patient_name = $1, birth_place = $2, birth_date = $3, department = $4,
           pic = $5, medical_history = $6, subjective = $7, blood_pressure = $8,
           spo2 = $9, pulse = $10, respiration = $11, therapy = $12
       WHERE id = $13
       RETURNING *`,
      [patient_name, birth_place, birth_date, department, pic, medical_history,
       subjective, blood_pressure, spo2, pulse, respiration, therapy, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Update medical record error', error);
    return res.status(500).json({ message: 'Unable to update medical record' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM medical_records WHERE id = $1 RETURNING id', [id]);
    
    if (!result.rows.length) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    return res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('Delete medical record error', error);
    return res.status(500).json({ message: 'Unable to delete medical record' });
  }
});

module.exports = router;
