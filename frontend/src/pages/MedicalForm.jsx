import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMedicalRecord } from '../services/api'
import BrandLogo from '../components/BrandLogo.jsx'

const initialForm = {
  patient_name: '',
  birth_place: '',
  birth_date: '',
  department: '',
  pic: '',
  medical_history: '',
  subjective: '',
  blood_pressure: '',
  spo2: '',
  pulse: '',
  respiration: '',
  therapy: '',
}

const MedicalForm = () => {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const nowText = useMemo(() => new Date().toLocaleString('id-ID'), [])
  const examiner = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('daco_user')) || {}
    } catch {
      return {}
    }
  }, [])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await createMedicalRecord(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan rekam medis')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="form-page">
      <header className="page-header">
        <div>
          <BrandLogo size="sm" />
          <p className="badge subtle">Input Rekam Medis</p>
          <h1>Formulir Pemeriksaan</h1>
          <p className="subtitle">
            Pemeriksa otomatis: {examiner?.username || '-'} | {nowText}
          </p>
        </div>
        <button className="ghost" onClick={() => navigate('/dashboard')}>
          Kembali
        </button>
      </header>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <div className="stack">
          <label>
            <span>Nama Pasien *</span>
            <input
              name="patient_name"
              value={form.patient_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Tempat Lahir</span>
            <input name="birth_place" value={form.birth_place} onChange={handleChange} />
          </label>

          <label>
            <span>Tanggal Lahir</span>
            <input
              type="date"
              name="birth_date"
              value={form.birth_date}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Bagian *</span>
            <input name="department" value={form.department} onChange={handleChange} required />
          </label>

          <label>
            <span>PIC</span>
            <input name="pic" value={form.pic} onChange={handleChange} />
          </label>
        </div>

        <div className="stack">
          <label>
            <span>Riwayat Penyakit</span>
            <textarea
              name="medical_history"
              rows="3"
              value={form.medical_history}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Subjektif</span>
            <textarea name="subjective" rows="3" value={form.subjective} onChange={handleChange} />
          </label>
        </div>

        <div className="stack">
          <div className="grid four">
            <label>
              <span>Blood Pressure</span>
              <input
                name="blood_pressure"
                value={form.blood_pressure}
                onChange={handleChange}
                placeholder="120/80"
              />
            </label>
            <label>
              <span>SpO₂</span>
              <input name="spo2" value={form.spo2} onChange={handleChange} placeholder="98" />
            </label>
            <label>
              <span>Nadi</span>
              <input name="pulse" value={form.pulse} onChange={handleChange} placeholder="80" />
            </label>
            <label>
              <span>Respirasi</span>
              <input name="respiration" value={form.respiration} onChange={handleChange} placeholder="20" />
            </label>
          </div>

          <label>
            <span>Terapi yang Diberikan</span>
            <textarea name="therapy" rows="3" value={form.therapy} onChange={handleChange} />
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Menyimpan...' : 'Simpan dan kembali ke dashboard'}
        </button>
      </form>
    </section>
  )
}

export default MedicalForm
