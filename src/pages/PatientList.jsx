import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPatients } from '../api';
import TagBadge from '../components/TagBadge';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getPatients()
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredPatients = patients.filter(p => 
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = patients
    .filter(p => {
      if (!p.next_appointment) return false;
      const apptDate = new Date(p.next_appointment);
      // Incluir también los de hoy agregándole la restricción actualitzada
      const apptDateStart = new Date(apptDate);
      apptDateStart.setDate(apptDateStart.getDate() + 1); // Postgres date string needs adjustment to avoid TZ timezone shift, parsing next_appointment normally returns midnight UTC of the previous day if not careful. Let's just do a string compare or simple parse.
      return apptDateStart >= today;
    })
    .sort((a, b) => new Date(a.next_appointment) - new Date(b.next_appointment));

  // Helper function to render table rows
  const renderPatientRows = (patientList, emptyMessage) => {
    if (patientList.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center" style={{ color: 'var(--text-muted)' }}>
            {emptyMessage}
          </td>
        </tr>
      );
    }
    return patientList.map(patient => {
      let tags = [];
      try {
        if (typeof patient.tags === 'string') tags = JSON.parse(patient.tags);
        else if (Array.isArray(patient.tags)) tags = patient.tags;
      } catch (e) { tags = []; }

      return (
        <tr 
          key={patient.id} 
          className="clickable-row"
          onClick={() => navigate(`/patients/${patient.id}`)}
        >
          <td style={{ fontWeight: '500' }}>{patient.first_name} {patient.last_name}</td>
          <td>{patient.age} años</td>
          <td style={{ maxWidth: '250px' }}>
            {tags.length > 0 ? tags.map(t => <TagBadge key={t} tag={t} />) : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</span>}
          </td>
          <td>{patient.next_appointment ? new Date(patient.next_appointment).toLocaleDateString() + ' (GMT)' : 'Sin turno'}</td>
          <td style={{ textAlign: 'right', color: 'var(--primary-color)' }}>❯</td>
        </tr>
      );
    });
  };

  return (
    <div>
      <div className="card-header">
        <h2>Listado de Pacientes</h2>
        <div>
          <input 
            type="text" 
            placeholder="Buscar paciente..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '250px' }}
          />
        </div>
      </div>

      {loading ? (
        <p>Cargando pacientes...</p>
      ) : (
        <>
          {upcomingAppointments.length > 0 && (
            <div className="card mb-4" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <h3 style={{ color: '#166534', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📅 Próximos Turnos (7 días)
              </h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Paciente</th>
                      <th>Edad</th>
                      <th>Etiquetas</th>
                      <th>Fecha de Turno</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                     {renderPatientRows(upcomingAppointments.slice(0, 10), "No hay turnos agendados.")}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="table-container mt-4">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Edad</th>
                  <th>Etiquetas</th>
                  <th>Próximo Turno</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {renderPatientRows(filteredPatients, "No se encontraron pacientes.")}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
