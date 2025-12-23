import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Medicine() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', price: '', stock: '', unit: 'pcs', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMedicines();
  }, [search]);

  const loadMedicines = async () => {
    try {
      const { data } = await api.get('/medicine', { params: { search } });
      setMedicines(data);
    } catch (err) {
      console.error('Failed to load medicines', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingId) {
        await api.put(`/medicine/${editingId}`, form);
      } else {
        await api.post('/medicine', form);
      }
      
      setForm({ name: '', price: '', stock: '', unit: 'pcs', description: '' });
      setEditingId(null);
      loadMedicines();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save medicine');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (medicine) => {
    setForm({
      name: medicine.name,
      price: medicine.price,
      stock: medicine.stock,
      unit: medicine.unit,
      description: medicine.description || ''
    });
    setEditingId(medicine.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus obat ini?')) return;

    try {
      await api.delete(`/medicine/${id}`);
      loadMedicines();
    } catch (err) {
      alert('Gagal menghapus obat');
    }
  };

  const handleCancel = () => {
    setForm({ name: '', price: '', stock: '', unit: 'pcs', description: '' });
    setEditingId(null);
    setError('');
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 600, color: '#1a56db' }}>
          💊 Medicine Management
        </h1>
        <p style={{ margin: '0.5rem 0 0', opacity: 0.7, fontSize: '0.95rem' }}>
          Kelola data obat dan harga
        </p>
      </div>

      {/* Search Bar - Full Width */}
      <div className="panel" style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="🔍 Cari nama obat, harga, atau stok..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            width: '100%', 
            fontSize: '1rem',
            padding: '0.75rem 1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth > 1024 ? '400px 1fr' : '1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Form Panel - Left/Top */}
        <div className="panel" style={{ position: window.innerWidth > 1024 ? 'sticky' : 'relative', top: '20px' }}>
          <h2 style={{ 
            marginTop: 0, 
            fontSize: '1.25rem',
            color: editingId ? '#059669' : '#1a56db',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {editingId ? '✏️ Edit Obat' : '➕ Tambah Obat Baru'}
          </h2>
          
          <form onSubmit={handleSubmit} className="form">
            <label>
              <span>Nama Obat *</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Contoh: Paracetamol 500mg"
                required
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label>
                <span>Harga *</span>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Rp"
                  required
                />
              </label>

              <label>
                <span>Stok</span>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                />
              </label>
            </div>

            <label>
              <span>Satuan</span>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <option value="pcs">Pcs</option>
                <option value="box">Box</option>
                <option value="botol">Botol</option>
                <option value="strip">Strip</option>
                <option value="tube">Tube</option>
              </select>
            </label>

            <label>
              <span>Deskripsi</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Deskripsi obat (opsional)"
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="primary" disabled={loading}>
                {loading ? 'Menyimpan...' : (editingId ? 'Update' : 'Simpan')}
              </button>
              {editingId && (
                <button type="button" className="ghost" onClick={handleCancel}>
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Panel - Right/Bottom */}
        <div className="panel">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#374151' }}>
              📋 Daftar Obat
            </h3>
            <span style={{ 
              fontSize: '0.875rem', 
              opacity: 0.7,
              background: '#f3f4f6',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontWeight: 500
            }}>
              Total: {medicines.length} obat
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>NAMA OBAT</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem' }}>HARGA</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem' }}>STOK</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem' }}>SATUAN</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {medicines.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ 
                      textAlign: 'center', 
                      padding: '3rem 1rem',
                      opacity: 0.5,
                      fontSize: '0.95rem'
                    }}>
                      <div>📦</div>
                      <div style={{ marginTop: '0.5rem' }}>
                        {search ? 'Tidak ada obat ditemukan' : 'Belum ada data obat'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  medicines.map((med) => (
                    <tr key={med.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.875rem' }}>
                        <strong style={{ color: '#111827', fontSize: '0.95rem' }}>
                          {med.name}
                        </strong>
                        {med.description && (
                          <div style={{ 
                            fontSize: '0.8rem', 
                            opacity: 0.6, 
                            marginTop: '0.25rem',
                            lineHeight: 1.4
                          }}>
                            {med.description}
                          </div>
                        )}
                      </td>
                      <td style={{ 
                        padding: '0.875rem',
                        textAlign: 'right',
                        fontWeight: 600,
                        color: '#059669'
                      }}>
                        Rp {Number(med.price).toLocaleString('id-ID')}
                      </td>
                      <td style={{ 
                        padding: '0.875rem',
                        textAlign: 'center',
                        fontWeight: 500
                      }}>
                        {med.stock}
                      </td>
                      <td style={{ 
                        padding: '0.875rem',
                        textAlign: 'center',
                        fontSize: '0.875rem'
                      }}>
                        <span style={{
                          background: '#e0e7ff',
                          color: '#3730a3',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}>
                          {med.unit}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem' }}>
                        <div style={{ 
                          display: 'flex', 
                          gap: '0.5rem',
                          justifyContent: 'center'
                        }}>
                          <button
                            onClick={() => handleEdit(med)}
                            style={{ 
                              padding: '0.375rem 0.875rem', 
                              fontSize: '0.875rem',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 500,
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#2563eb'}
                            onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(med.id)}
                            style={{ 
                              padding: '0.375rem 0.875rem', 
                              fontSize: '0.875rem',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 500,
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#dc2626'}
                            onMouseOut={(e) => e.target.style.background = '#ef4444'}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
