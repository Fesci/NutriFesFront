import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatient, getConsultations, updatePatientGoal } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState('');

  useEffect(() => {
    Promise.all([getPatient(id), getConsultations(id)])
      .then(([patientData, consultationsData]) => {
        setPatient(patientData);
        setTempGoal(patientData.goal || '');
        setConsultations(consultationsData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSaveGoal = async () => {
    try {
      await updatePatientGoal(id, tempGoal);
      setPatient({ ...patient, goal: tempGoal });
      setIsEditingGoal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (!patient) return <p>Paciente no encontrado.</p>;

  // Preparar datos para el gráfico (orden cronológico)
  const chartData = [...consultations].reverse().map(c => ({
    name: new Date(c.date).toLocaleDateString(),
    imc: parseFloat(c.bmi)
  }));

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>{patient.first_name} {patient.last_name}</h2>
          <Link to={`/patients/${id}/consultations/new`} className="btn btn-primary">
            Añadir Consulta
          </Link>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Edad</div>
            <div className="stat-value">{patient.age}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Altura</div>
            <div className="stat-value">{patient.height} m</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Teléfono</div>
            <div className="stat-value" style={{ fontSize: '1.2rem', marginTop: '0.4rem' }}>{patient.phone || 'N/A'}</div>
          </div>
          <div className="stat-card" style={{ gridColumn: 'span 2' }}>
            <div className="stat-label flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Objetivo</span>
              {!isEditingGoal && (
                <button onClick={() => setIsEditingGoal(true)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="Editar objetivo">
                  ✏️ Editar
                </button>
              )}
            </div>
            {isEditingGoal ? (
              <div style={{ marginTop: '0.5rem' }}>
                <textarea 
                  className="form-input" 
                  value={tempGoal} 
                  onChange={e => setTempGoal(e.target.value)}
                  style={{ minHeight: '60px' }}
                />
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleSaveGoal} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Guardar</button>
                  <button onClick={() => { setIsEditingGoal(false); setTempGoal(patient.goal || ''); }} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '1.2rem', fontWeight: '500', color: 'var(--text-main)', marginTop: '0.5rem' }}>
                {patient.goal || 'Sin objetivo establecido'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h3>Evolución de IMC</h3>
        {consultations.length > 0 ? (
          <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="imc" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickMargin={10} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                  labelStyle={{ fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '4px' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Requiere al menos una consulta para visualizar evolución.</p>
        )}
      </div>

      <div className="card mt-4">
        <h3>Historial de Consultas ({consultations.length})</h3>
        
        {consultations.length === 0 ? (
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Este paciente aún no tiene consultas.</p>
        ) : (
          <div className="table-container mt-4">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Peso (kg)</th>
                  <th>IMC</th>
                  <th>Notas</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map(c => (
                  <tr key={c.id}>
                    <td>{new Date(c.date).toLocaleDateString()}</td>
                    <td><strong>{c.weight} kg</strong></td>
                    <td>{c.bmi}</td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>{c.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
