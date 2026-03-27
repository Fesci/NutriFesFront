import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPatients } from '../api';

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
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Edad</th>
                <th>Registrado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center" style={{ color: 'var(--text-muted)' }}>
                    No se encontraron pacientes.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => (
                  <tr 
                    key={patient.id} 
                    className="clickable-row"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <td>{patient.first_name}</td>
                    <td>{patient.last_name}</td>
                    <td>{patient.age} años</td>
                    <td>{new Date(patient.created_at).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right', color: 'var(--primary-color)' }}>❯</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
