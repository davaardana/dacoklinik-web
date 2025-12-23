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
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 600 }}>Medicine Management</h1>
        <p style={{ margin: '0.5rem 0 0', opacity: 0.7 }}>Kelola data obat dan harga</p>
      </div>

      <div className="grid two" style={{ gap: '2rem', alignItems: 'start' }}>
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit Obat' : 'Tambah Obat Baru'}</h2>
          
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

        <div className="panel">
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="🔍 Cari nama obat, harga, atau stok..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Nama Obat</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Satuan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {medicines.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', opacity: 0.6 }}>
                      Belum ada data obat
                    </td>
                  </tr>
                ) : (
                  medicines.map((med) => (
                    <tr key={med.id}>
                      <td>
                        <strong>{med.name}</strong>
                        {med.description && (
                          <div style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.25rem' }}>
                            {med.description}
                          </div>
                        )}
                      </td>
                      <td>Rp {Number(med.price).toLocaleString('id-ID')}</td>
                      <td>{med.stock}</td>
                      <td>{med.unit}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEdit(med)}
                            className="ghost"
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(med.id)}
                            className="danger"
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
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

          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>
            Total: {medicines.length} obat
          </p>
        </div>
      </div>
    </div>
  );
}
