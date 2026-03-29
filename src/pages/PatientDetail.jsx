import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatient, getConsultations, updatePatientGoal, updatePatientNextAppointment } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TagBadge from '../components/TagBadge';
import { formatAppointment } from '../utils';

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState('');
  const [isEditingAppointment, setIsEditingAppointment] = useState(false);
  const [tempAppointment, setTempAppointment] = useState('');
  const [graphMetric, setGraphMetric] = useState('weight'); // 'weight' or 'imc'

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

  const handleSaveAppointment = async () => {
    try {
      await updatePatientNextAppointment(id, tempAppointment);
      setPatient(prev => ({ ...prev, next_appointment: tempAppointment || null }));
      setIsEditingAppointment(false);
    } catch (err) {
      console.error(err);
    }
  };

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
    imc: parseFloat(c.bmi),
    weight: parseFloat(c.weight)
  }));

  let parsedTags = [];
  try {
    if (typeof patient.tags === 'string') parsedTags = JSON.parse(patient.tags);
    else if (Array.isArray(patient.tags)) parsedTags = patient.tags;
  } catch (e) { parsedTags = []; }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          ← Volver a Pacientes
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isEditingAppointment ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f0fdf4', padding: '0.4rem', borderRadius: 'var(--border-radius)', border: '1px solid #bbf7d0' }}>
              <input 
                type="datetime-local" 
                className="form-input" 
                value={tempAppointment} 
                onChange={e => setTempAppointment(e.target.value)} 
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.9rem' }}
              />
              <button onClick={handleSaveAppointment} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Guardar</button>
              <button 
                onClick={() => setIsEditingAppointment(false)} 
                className="btn btn-secondary" 
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
              >
                Cancelar
              </button>
            </div>
          ) : (
            patient.next_appointment && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f0fdf4', color: '#166534', padding: '0.5rem 1rem', borderRadius: 'var(--border-radius)', fontWeight: 'bold', border: '1px solid #bbf7d0' }}>
                📅 Próximo Turno: {formatAppointment(patient.next_appointment)}
                <button 
                  onClick={() => { 
                    const d = new Date(patient.next_appointment);
                    const localISOTime = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0,16);
                    setTempAppointment(localISOTime);
                    setIsEditingAppointment(true); 
                  }} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', fontSize: '1rem', marginLeft: '0.5rem' }} 
                  title="Editar turno"
                >
                  ✏️
                </button>
              </span>
            )
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800', 
                background: 'linear-gradient(90deg, var(--primary-dark), var(--primary-color))', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                margin: '0',
                lineHeight: '1.2'
              }}>
                {patient.first_name} {patient.last_name}
              </h2>
              <Link to={`/patients/${id}/edit`} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="Editar perfil">
                ✏️ Editar
              </Link>
            </div>
            {parsedTags.length > 0 && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                {parsedTags.map(t => <TagBadge key={t} tag={t} />)}
              </div>
            )}
          </div>
          <Link to={`/patients/${id}/consultations/new`} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
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
          <div className="stat-card" style={{ gridColumn: 'span 2', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="stat-label flex-row" style={{ width: '100%', justifyContent: 'center', alignItems: 'center', gap: '1rem', position: 'relative' }}>
              <span>Objetivo Principal</span>
              {!isEditingGoal && (
                <button onClick={() => setIsEditingGoal(true)} className="btn btn-secondary" style={{ position: 'absolute', right: '0', padding: '0.2rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="Editar objetivo">
                  ✏️ Editar
                </button>
              )}
            </div>
            {isEditingGoal ? (
              <div style={{ marginTop: '1rem', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <textarea 
                  className="form-input" 
                  value={tempGoal} 
                  onChange={e => setTempGoal(e.target.value)}
                  style={{ width: '100%', minHeight: '80px', textAlign: 'center', resize: 'vertical' }}
                  placeholder="Define el objetivo principal del paciente..."
                />
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button onClick={handleSaveGoal} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Guardar</button>
                  <button onClick={() => { setIsEditingGoal(false); setTempGoal(patient.goal || ''); }} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '1.3rem', fontWeight: '500', color: 'var(--text-main)', marginTop: '1rem', maxWidth: '800px', lineHeight: '1.5' }}>
                {patient.goal || 'Sin objetivo establecido'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card mt-4" style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Historial de Consultas ({consultations.length})</h3>
        
        {consultations.length === 0 ? (
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Este paciente aún no tiene consultas.</p>
        ) : (
          <div className="table-container mt-4" style={{ textAlign: 'left' }}>
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

      <div className="card mt-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Evolución de {graphMetric === 'weight' ? 'Peso (kg)' : 'IMC'}</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             <button 
               className="btn" 
               style={{ padding: '0.3rem 0.8rem', backgroundColor: graphMetric === 'weight' ? 'var(--primary-color)' : '#e2e8f0', color: graphMetric === 'weight' ? 'white' : 'var(--text-main)', border: 'none' }} 
               onClick={() => setGraphMetric('weight')}
             >
               Peso
             </button>
             <button 
               className="btn" 
               style={{ padding: '0.3rem 0.8rem', backgroundColor: graphMetric === 'imc' ? 'var(--primary-color)' : '#e2e8f0', color: graphMetric === 'imc' ? 'white' : 'var(--text-main)', border: 'none' }} 
               onClick={() => setGraphMetric('imc')}
             >
               IMC
             </button>
          </div>
        </div>

        {consultations.length > 0 ? (
          <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey={graphMetric} stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickMargin={10} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip 
                  formatter={(value) => [`${value} ${graphMetric === 'weight' ? 'kg' : ''}`, graphMetric === 'weight' ? 'Peso' : 'IMC']}
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
    </div>
  );
}
