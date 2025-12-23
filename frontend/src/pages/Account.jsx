import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/api';

export default function Account() {
  const [user, setUser] = useState({ username: '', role: '' });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('daco_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru tidak cocok' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password baru minimal 6 karakter' });
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        username: user.username,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });

      setMessage({ type: 'success', text: 'Password berhasil diubah!' });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Gagal mengubah password'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('daco_token');
    localStorage.removeItem('daco_user');
    navigate('/login');
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 600 }}>Account Settings</h1>
        <p style={{ margin: '0.5rem 0 0', opacity: 0.7 }}>Kelola informasi akun Anda</p>
      </div>

      <div className="grid two" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Account Info */}
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>Informasi Akun</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.7 }}>Username</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '1.125rem', fontWeight: 600 }}>
                {user.username}
              </p>
            </div>

            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.7 }}>Role</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '1.125rem', fontWeight: 600 }}>
                {user.role}
              </p>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
              <button onClick={handleLogout} className="danger" style={{ width: '100%' }}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>Ubah Password</h2>
          
          <form onSubmit={handlePasswordChange} className="form">
            <label>
              <span>Password Lama *</span>
              <input
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                placeholder="Masukkan password lama"
                required
              />
            </label>

            <label>
              <span>Password Baru *</span>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Minimal 6 karakter"
                required
              />
            </label>

            <label>
              <span>Konfirmasi Password Baru *</span>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Ulangi password baru"
                required
              />
            </label>

            {message.text && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                color: message.type === 'success' ? '#155724' : '#721c24',
                fontSize: '0.875rem'
              }}>
                {message.text}
              </div>
            )}

            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Mengubah...' : 'Ubah Password'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: '4px', fontSize: '0.875rem' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>Tips Keamanan:</p>
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
              <li>Gunakan password minimal 6 karakter</li>
              <li>Kombinasikan huruf, angka, dan simbol</li>
              <li>Jangan gunakan password yang sama dengan akun lain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
