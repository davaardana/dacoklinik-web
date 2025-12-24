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
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '3rem',
        maxWidth: '450px',
        width: '100%'
      }}>
        {/* Logo and Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src="/Logo DJM.png"
            alt="Daco Logo" 
            style={{ height: '100px', marginBottom: '1rem' }} 
          />
          <h1 style={{ 
            margin: '0.5rem 0', 
            fontSize: '1.5rem', 
            fontWeight: 700,
            color: '#1a202c',
            lineHeight: 1.3
          }}>
            Inhouse Clinic<br/>Daco Jaya Medika
          </h1>
          <p style={{ 
            margin: '0.5rem 0 0', 
            fontSize: '0.95rem',
            color: '#667eea',
            fontWeight: 600
          }}>
            Apotek & Klinik
          </p>
          <p style={{ 
            margin: '0.5rem 0 0', 
            fontSize: '0.875rem', 
            opacity: 0.6 
          }}>
            Sistem Pencatatan Medis
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          background: '#f7fafc',
          padding: '0.25rem',
          borderRadius: '8px'
        }}>
          <button
            type="button"
            onClick={() => isLogin || toggleMode()}
            style={{
              flex: 1,
              padding: '0.625rem',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: isLogin ? '#667eea' : 'transparent',
              color: isLogin ? 'white' : '#4a5568'
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => !isLogin || toggleMode()}
            style={{
              flex: 1,
              padding: '0.625rem',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: !isLogin ? '#667eea' : 'transparent',
              color: !isLogin ? 'white' : '#4a5568'
            }}
          >
            Register
          </button>
        </div>

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

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? (isLogin ? '⏳ Memverifikasi...' : '⏳ Mendaftar...') : (isLogin ? '🔐 Masuk' : '✨ Daftar')}
          </button>
        </form>

        {/* Footer */}
        <p style={{ 
          marginTop: '1.5rem', 
          textAlign: 'center', 
          fontSize: '0.875rem',
          color: '#718096'
        }}>
          © 2024 Daco Jaya Medika
        </p>
      </div>
    </section>
  )
}

export default Login
