import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts'

import SummaryCard from '../components/SummaryCard.jsx'
import { fetchDashboardSummary, fetchMedicalRecords } from '../services/api'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [summaryResponse, recordsResponse] = await Promise.all([
          fetchDashboardSummary(),
          fetchMedicalRecords(),
        ])
        setSummary(summaryResponse.data)
        setRecords(recordsResponse.data)
      } catch (error) {
        console.error('Failed to load dashboard data', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const chartData = useMemo(() => {
    if (!summary?.chartData) return []
    return summary.chartData.labels.map((label, index) => ({
      label,
      value: summary.chartData.values[index] || 0,
    }))
  }, [summary])

  const handleLogout = () => {
    localStorage.removeItem('daco_token')
    localStorage.removeItem('daco_user')
    navigate('/login', { replace: true })
  }

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('daco_user')) || {}
    } catch {
      return {}
    }
  }, [])

  return (
    <section className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__brand">
          <h1>Dashboard Analytics</h1>
          <p className="subtitle">Selamat datang, {user?.username || 'User'}.</p>
        </div>
      </header>

      <div className="grid two">
        <SummaryCard
          label="Total Pasien"
          value={loading ? '...' : summary?.totalPatients || 0}
          accent="var(--teal-500)"
        />
        <SummaryCard
          label="Pemeriksaan Hari Ini"
          value={loading ? '...' : summary?.todayCheckups || 0}
          accent="var(--blue-500)"
        />
      </div>

      <div className="panel">
        <div className="panel__header">
          <div>
            <p className="badge subtle">Analytics</p>
            <h2>Vital Sign Snapshot</h2>
          </div>
        </div>
        <div className="chart-wrapper">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(9,42,61,0.1)" />
                <XAxis dataKey="label" tick={{ fill: '#123047', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(38,142,163,0.08)' }} />
                <Bar dataKey="value" fill="var(--teal-500)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="muted">Belum ada data chart.</p>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel__header">
          <div>
            <p className="badge subtle">Data Terbaru</p>
            <h2>Daftar Rekam Medis</h2>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Pasien</th>
                <th>Bagian</th>
                <th>PIC</th>
                <th>Pemeriksa</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(0, 8).map((record) => (
                <tr key={record.id || record.created_at}>
                  <td>
                    <strong>{record.patient_name}</strong>
                    <span className="muted">{record.medical_history || '-'}</span>
                  </td>
                  <td>{record.department || '-'}</td>
                  <td>{record.pic || '-'}</td>
                  <td>{record.examiner || '-'}</td>
                  <td>
                    {record.created_at
                      ? new Date(record.created_at).toLocaleString('id-ID')
                      : '-'}
                  </td>
                </tr>
              ))}
              {!records.length && !loading && (
                <tr>
                  <td colSpan="5" className="muted center">
                    Belum ada rekam medis.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
