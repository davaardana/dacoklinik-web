import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login, register } from '../services/api'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (localStorage.getItem('daco_token')) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = isLogin ? await login(form) : await register(form)
      localStorage.setItem('daco_token', data.token)
      localStorage.setItem('daco_user', JSON.stringify(data.user))
      const redirectTo = location.state?.from?.pathname || '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || (isLogin ? 'Username atau password salah' : 'Registrasi gagal'))
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setForm({ username: '', password: '' })
  }

  return (
    <section className="auth-shell">
      <div className="auth-panel">
        <img src="/logo_daco.png" alt="Daco Logo" style={{ height: '80px', marginBottom: '1rem' }} />
        <p className="badge">Inhouse Clinic</p>
        <h1>Inhouse Clinic Daco Jaya Medika</h1>
        <p className="subtitle">Portal internal pencatatan medis</p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              autoComplete="username"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary" disabled={loading}>
            {loading ? (isLogin ? 'Memverifikasi...' : 'Mendaftar...') : (isLogin ? 'Masuk' : 'Daftar')}
          </button>

          <button type="button" className="ghost" onClick={toggleMode} style={{ marginTop: '0.5rem' }}>
            {isLogin ? 'Belum punya akun? Daftar disini' : 'Sudah punya akun? Masuk'}
          </button>
        </form>
      </div>
      <div className="auth-hero">
        <div>
          <img src="/logo_daco.png" alt="Daco Logo" style={{ height: '120px', marginBottom: '2rem' }} />
          <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
            Sistem Pencatatan Medis Modern
          </p>
          <p style={{ opacity: 0.9 }}>
            Mengelola data rekam medis karyawan dengan aman, cepat, dan terstandar.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Login
