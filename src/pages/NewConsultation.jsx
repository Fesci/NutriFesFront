import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createConsultation, getPatient } from '../api';

export default function NewConsultation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  // Obtener la fecha local real, no la UTC
  const today = new Date();
  const rawDateStr = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

  const [formData, setFormData] = useState({
    weight: '',
    notes: '',
    date: rawDateStr,
    next_appointment: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    getPatient(id).then(setPatient).catch(() => setError('No se pudo cargar el paciente.'));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createConsultation(id, {
        weight: parseFloat(formData.weight),
        notes: formData.notes,
        date: formData.date,
        next_appointment: formData.next_appointment || null
      });
      navigate(`/patients/${id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!patient && !error) return <p>Cargando información del paciente...</p>;

  // Simulate calculated BMI interactively if weight is provided
  const interactiveBmi = formData.weight && patient?.height
    ? (parseFloat(formData.weight) / (patient.height * patient.height)).toFixed(2)
    : '--';

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card-header">
        <h2>Nueva Consulta: {patient?.first_name} {patient?.last_name}</h2>
      </div>

      {error && (
        <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontWeight: 'bold' }}>
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex-row" style={{ gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Fecha de la Consulta</label>
            <input
              required
              type="date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex-row" style={{ gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Peso Promedio (kg)</label>
            <input
              required
              type="number"
              step="0.1"
              name="weight"
              className="form-input"
              min="1"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" style={{ color: 'var(--text-muted)' }}>IMC Calculado (Auto)</label>
            <div style={{
              padding: '0.75rem',
              background: '#f1f5f9',
              borderRadius: 'var(--border-radius)',
              fontSize: '1.2rem',
              fontWeight: '700',
              textAlign: 'center',
              border: '1px solid var(--border-color)'
            }}>
              {interactiveBmi}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notas / Observaciones</label>
          <textarea
            name="notes"
            className="form-input"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Añade observaciones de la visita, cambios en la dieta, humor del paciente..."
          ></textarea>
        </div>

        <div className="flex-row mt-2" style={{ gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1, borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <label className="form-label" style={{ color: 'var(--primary-dark)', fontWeight: 'bold' }}>📅 Próxima Cita (Opcional)</label>
            <input
              type="datetime-local"
              name="next_appointment"
              className="form-input"
              value={formData.next_appointment}
              onChange={handleChange}
            />
            <small style={{ color: 'var(--text-muted)' }}>Esto actualizará el perfil del paciente y aparecerá en tu panel principal de próximos turnos.</small>
          </div>
        </div>

        <div className="flex-row mt-4" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
          <Link to={`/patients/${id}`} className="btn btn-secondary">Cancelar</Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando consulta...' : 'Registrar Consulta'}
          </button>
        </div>
      </form>
    </div>
  );
}
