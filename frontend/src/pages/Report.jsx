import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from '../services/api';

export default function Report() {
  const [records, setRecords] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const { data } = await api.get('/medical');
      setRecords(data);
    } catch (err) {
      console.error('Failed to load records', err);
    }
  };

  const filterRecords = () => {
    if (filterType === 'all') return records;

    return records.filter((rec) => {
      const date = new Date(rec.created_at);
      const today = new Date();

      switch (filterType) {
        case 'today':
          return date.toDateString() === today.toDateString();
        
        case 'month': {
          if (!filterValue) return true;
          const [year, month] = filterValue.split('-');
          return date.getFullYear() === parseInt(year) && date.getMonth() === parseInt(month) - 1;
        }
        
        case 'year': {
          if (!filterValue) return true;
          return date.getFullYear() === parseInt(filterValue);
        }
        
        case 'date': {
          if (!filterValue) return true;
          return date.toISOString().split('T')[0] === filterValue;
        }
        
        default:
          return true;
      }
    });
  };

  const generatePDF = () => {
    setLoading(true);

    try {
      const doc = new jsPDF('landscape');
      const filteredData = filterRecords();

      // Header
      doc.setFontSize(18);
      doc.text('Laporan Rekam Medis', 14, 20);
      
      doc.setFontSize(11);
      doc.text('Inhouse Clinic Daco Jaya Medika', 14, 28);
      
      const filterText = getFilterText();
      doc.setFontSize(10);
      doc.text(filterText, 14, 35);

      // Table
      const tableData = filteredData.map((rec) => [
        rec.patient_name,
        rec.department,
        rec.pic || '-',
        rec.blood_pressure || '-',
        rec.spo2 || '-',
        rec.pulse || '-',
        rec.medical_history || '-',
        rec.therapy || '-',
        rec.examiner,
        new Date(rec.created_at).toLocaleDateString('id-ID')
      ]);

      doc.autoTable({
        startY: 40,
        head: [['Pasien', 'Dept', 'PIC', 'TD', 'SpO2', 'Nadi', 'Diagnosa', 'Terapi', 'Pemeriksa', 'Tanggal']],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [11, 107, 203] },
        margin: { top: 40 }
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(
          `Halaman ${i} dari ${pageCount} | Total: ${filteredData.length} rekam medis`,
          14,
          doc.internal.pageSize.height - 10
        );
      }

      const filename = `Laporan_Rekam_Medis_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('PDF generation error', error);
      alert('Gagal membuat PDF');
    } finally {
      setLoading(false);
    }
  };

  const getFilterText = () => {
    switch (filterType) {
      case 'today':
        return `Tanggal: Hari ini (${new Date().toLocaleDateString('id-ID')})`;
      case 'month':
        return filterValue
          ? `Periode: ${new Date(filterValue).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}`
          : 'Periode: Pilih bulan';
      case 'year':
        return filterValue ? `Periode: Tahun ${filterValue}` : 'Periode: Pilih tahun';
      case 'date':
        return filterValue
          ? `Tanggal: ${new Date(filterValue).toLocaleDateString('id-ID')}`
          : 'Periode: Pilih tanggal';
      default:
        return 'Periode: Semua data';
    }
  };

  const filteredData = filterRecords();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 600 }}>Laporan Rekam Medis</h1>
        <p style={{ margin: '0.5rem 0 0', opacity: 0.7 }}>Cetak laporan dengan filter periode</p>
      </div>

      <div className="panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Filter Laporan</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <label>
            <span>Jenis Filter</span>
            <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setFilterValue(''); }}>
              <option value="all">Semua Data</option>
              <option value="today">Hari Ini</option>
              <option value="date">Pilih Tanggal</option>
              <option value="month">Pilih Bulan</option>
              <option value="year">Pilih Tahun</option>
            </select>
          </label>

          {filterType === 'date' && (
            <label>
              <span>Tanggal</span>
              <input
                type="date"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </label>
          )}

          {filterType === 'month' && (
            <label>
              <span>Bulan</span>
              <input
                type="month"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </label>
          )}

          {filterType === 'year' && (
            <label>
              <span>Tahun</span>
              <input
                type="number"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="2025"
                min="2000"
                max="2100"
              />
            </label>
          )}

          <button
            onClick={generatePDF}
            className="primary"
            disabled={loading}
            style={{ height: 'fit-content' }}
          >
            {loading ? 'Membuat PDF...' : '📄 Cetak PDF'}
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            <strong>Preview:</strong> {getFilterText()}
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', opacity: 0.7 }}>
            Data yang akan dicetak: <strong>{filteredData.length}</strong> rekam medis
          </p>
        </div>
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Preview Data</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Pasien</th>
                <th>Departemen</th>
                <th>Vital Signs</th>
                <th>Diagnosa</th>
                <th>Pemeriksa</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', opacity: 0.6, padding: '2rem' }}>
                    Tidak ada data untuk filter yang dipilih
                  </td>
                </tr>
              ) : (
                filteredData.slice(0, 10).map((rec) => (
                  <tr key={rec.id}>
                    <td><strong>{rec.patient_name}</strong></td>
                    <td>{rec.department}</td>
                    <td style={{ fontSize: '0.875rem' }}>
                      {rec.blood_pressure && `TD: ${rec.blood_pressure}`}
                      {rec.spo2 && ` | SpO2: ${rec.spo2}`}
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>{rec.medical_history || rec.subjective || '-'}</td>
                    <td>{rec.examiner}</td>
                    <td>{new Date(rec.created_at).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 10 && (
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>
            Menampilkan 10 dari {filteredData.length} data. Cetak PDF untuk melihat semua data.
          </p>
        )}
      </div>
    </div>
  );
}
