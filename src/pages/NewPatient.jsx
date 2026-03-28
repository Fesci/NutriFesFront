import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPatient } from '../api';

export default function NewPatient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    height: '',
    goal: '',
    phone: ''
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPatient = await createPatient({
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: parseInt(formData.age, 10),
        height: parseFloat(formData.height),
        goal: formData.goal,
        phone: formData.phone
      });
      navigate(`/patients/${newPatient.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'height') {
      // Reemplaza comas por puntos y elimina letras
      value = value.replace(',', '.').replace(/[^0-9.]/g, '');
      
      // Asegurarse de que solo haya un punto
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }

      // Auto-insertar el punto después del primer dígito si hay 2 o más números sin punto
      if (value.length >= 2 && !value.includes('.')) {
        value = value.substring(0, 1) + '.' + value.substring(1);
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card-header">
        <h2>Crear Nuevo Paciente</h2>
      </div>

      {error && (
        <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontWeight: 'bold' }}>
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex-row" style={{ gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Nombre</label>
            <input 
              required 
              type="text" 
              name="first_name" 
              className="form-input" 
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Apellido</label>
            <input 
              required 
              type="text" 
              name="last_name" 
              className="form-input" 
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex-row" style={{ gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Edad</label>
            <input 
              required 
              type="number" 
              name="age" 
              className="form-input" 
              min="1"
              value={formData.age}
              onChange={handleChange}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Altura (en metros, ej: 1.75)</label>
            <input 
              required 
              type="text" 
              inputMode="decimal"
              name="height" 
              className="form-input" 
              value={formData.height}
              placeholder="Ej: 1.75"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex-row" style={{ gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Teléfono de contacto (Opcional)</label>
            <input 
              type="tel" 
              name="phone" 
              className="form-input" 
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej: +123456789"
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Objetivo (Opcional, para recomendaciones IA en el futuro)</label>
            <input 
              type="text" 
              name="goal" 
              className="form-input" 
              value={formData.goal}
              onChange={handleChange}
              placeholder="Ej: Bajar 5kg, ganar masa muscular..."
            />
          </div>
        </div>

        <div className="flex-row mt-4" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary">Cancelar</Link>
          <button type="submit" className="btn btn-primary">Guardar Paciente</button>
        </div>
      </form>
    </div>
  );
}
