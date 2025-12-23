const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const statsQuery = `
      SELECT
        COUNT(*) AS total_patients,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) AS today_checkups,
        AVG(NULLIF(split_part(blood_pressure, '/', 1), '')::INT) AS blood_pressure_avg,
        AVG(NULLIF(spo2, '')::INT) AS spo2_avg,
        AVG(NULLIF(pulse, '')::INT) AS pulse_avg,
        AVG(NULLIF(respiration, '')::INT) AS respiration_avg
      FROM medical_records;
    `;

    const { rows } = await pool.query(statsQuery);
    const summary = rows[0] || {};

    return res.json({
      totalPatients: Number(summary.total_patients) || 0,
      todayCheckups: Number(summary.today_checkups) || 0,
      chartData: {
        labels: ['Blood Pressure', 'SpO2', 'Nadi', 'Respirasi'],
        values: [
          Number(summary.blood_pressure_avg) || 0,
          Number(summary.spo2_avg) || 0,
          Number(summary.pulse_avg) || 0,
          Number(summary.respiration_avg) || 0,
        ],
      },
    });
  } catch (error) {
    console.error('Dashboard summary error', error);
    return res.status(500).json({ message: 'Unable to load dashboard data' });
  }
});

module.exports = router;
