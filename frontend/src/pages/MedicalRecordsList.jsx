import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function MedicalRecordsList() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecords();
  }, [search]);

  const loadRecords = async () => {
    try {
      const { data } = await api.get('/medical', { params: { search } });
      setRecords(data);
    } catch (err) {
      console.error('Failed to load records', err);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus rekam medis ini?')) return;

    try {
      await api.delete(`/medical/${id}`);
      loadRecords();
    } catch (err) {
      alert('Gagal menghapus rekam medis');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      await api.put(`/medical/${editingRecord.id}`, editingRecord);
      setShowModal(false);
      setEditingRecord(null);
      loadRecords();
    } catch (err) {
      alert('Gagal menyimpan perubahan');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 600 }}>Data Rekam Medis</h1>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.7 }}>Daftar lengkap rekam medis karyawan</p>
        </div>
        <button className="primary" onClick={() => navigate('/medical/new')}>
          + Tambah Rekam Medis
        </button>
      </div>

      <div className="panel">
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="🔍 Cari nama pasien, departemen, PIC, pemeriksa, diagnosa, terapi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem' }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Pasien</th>
                <th>TTL</th>
                <th>Departemen</th>
                <th>PIC</th>
                <th>Vital Signs</th>
                <th>Diagnosa</th>
                <th>Terapi</th>
                <th>Pemeriksa</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', opacity: 0.6, padding: '2rem' }}>
                    {search ? 'Tidak ada hasil pencarian' : 'Belum ada data rekam medis'}
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id}>
                    <td><strong>{rec.patient_name}</strong></td>
                    <td>
                      {rec.birth_place && rec.birth_date 
                        ? `${rec.birth_place}, ${formatDate(rec.birth_date)}`
                        : '-'}
                    </td>
                    <td>{rec.department}</td>
                    <td>{rec.pic || '-'}</td>
                    <td style={{ fontSize: '0.875rem' }}>
                      {rec.blood_pressure && <div>TD: {rec.blood_pressure}</div>}
                      {rec.spo2 && <div>SpO2: {rec.spo2}</div>}
                      {rec.pulse && <div>Nadi: {rec.pulse}</div>}
                      {rec.respiration && <div>RR: {rec.respiration}</div>}
                      {!rec.blood_pressure && !rec.spo2 && !rec.pulse && !rec.respiration && '-'}
                    </td>
                    <td>
                      {rec.medical_history && <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <strong>Riwayat:</strong> {rec.medical_history}
                      </div>}
                      {rec.subjective && <div style={{ fontSize: '0.875rem' }}>
                        <strong>Keluhan:</strong> {rec.subjective}
                      </div>}
                      {!rec.medical_history && !rec.subjective && '-'}
                    </td>
                    <td>{rec.therapy || '-'}</td>
                    <td>{rec.examiner}</td>
                    <td>{formatDate(rec.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap' }}>
                        <button
                          onClick={() => handleEdit(rec)}
                          className="ghost"
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
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
          Total: {records.length} rekam medis
        </p>
      </div>

      {/* Edit Modal */}
      {showModal && editingRecord && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '2rem'
          }}>
            <h2 style={{ marginTop: 0 }}>Edit Rekam Medis</h2>
            
            <form onSubmit={handleSave} className="form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label>
                  <span>Nama Pasien *</span>
                  <input
                    value={editingRecord.patient_name}
                    onChange={(e) => setEditingRecord({ ...editingRecord, patient_name: e.target.value })}
                    required
                  />
                </label>

                <label>
                  <span>Departemen *</span>
                  <input
                    value={editingRecord.department}
                    onChange={(e) => setEditingRecord({ ...editingRecord, department: e.target.value })}
                    required
                  />
                </label>

                <label>
                  <span>Tempat Lahir</span>
                  <input
                    value={editingRecord.birth_place || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, birth_place: e.target.value })}
                  />
                </label>

                <label>
                  <span>Tanggal Lahir</span>
                  <input
                    type="date"
                    value={editingRecord.birth_date ? editingRecord.birth_date.split('T')[0] : ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, birth_date: e.target.value })}
                  />
                </label>

                <label>
                  <span>PIC</span>
                  <input
                    value={editingRecord.pic || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, pic: e.target.value })}
                  />
                </label>

                <label>
                  <span>Tekanan Darah</span>
                  <input
                    value={editingRecord.blood_pressure || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, blood_pressure: e.target.value })}
                    placeholder="120/80"
                  />
                </label>

                <label>
                  <span>SpO2 (%)</span>
                  <input
                    value={editingRecord.spo2 || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, spo2: e.target.value })}
                    placeholder="98"
                  />
                </label>

                <label>
                  <span>Nadi (bpm)</span>
                  <input
                    value={editingRecord.pulse || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, pulse: e.target.value })}
                    placeholder="80"
                  />
                </label>

                <label style={{ gridColumn: '1 / -1' }}>
                  <span>Respirasi (x/menit)</span>
                  <input
                    value={editingRecord.respiration || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, respiration: e.target.value })}
                    placeholder="20"
                  />
                </label>
              </div>

              <label>
                <span>Riwayat Penyakit</span>
                <textarea
                  value={editingRecord.medical_history || ''}
                  onChange={(e) => setEditingRecord({ ...editingRecord, medical_history: e.target.value })}
                  rows={2}
                />
              </label>

              <label>
                <span>Keluhan (Subjective)</span>
                <textarea
                  value={editingRecord.subjective || ''}
                  onChange={(e) => setEditingRecord({ ...editingRecord, subjective: e.target.value })}
                  rows={2}
                />
              </label>

              <label>
                <span>Terapi</span>
                <textarea
                  value={editingRecord.therapy || ''}
                  onChange={(e) => setEditingRecord({ ...editingRecord, therapy: e.target.value })}
                  rows={3}
                />
              </label>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="primary">
                  Simpan Perubahan
                </button>
                <button type="button" className="ghost" onClick={() => { setShowModal(false); setEditingRecord(null); }}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
