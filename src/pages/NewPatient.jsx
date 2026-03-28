import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPatient } from '../api';

export default function NewPatient() {
  const navigate = useNavigate();
  const availableTags = [
    'Vegano', 'Vegetariano', 'Celiaquía', 'Sedentario', 'Deportista', 
    'Adulto Mayor', 'Obesidad', 'Diabetes', 'TCA', 'Embarazo/Lactancia'
  ];

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    height: '',
    goal: '',
    phone: '',
    tags: []
  });

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newPatient = await createPatient({
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: parseInt(formData.age, 10),
        height: parseFloat(formData.height),
        goal: formData.goal,
        phone: formData.phone,
        tags: formData.tags
      });
      navigate(`/patients/${newPatient.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
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

        <div className="form-group mt-4">
          <label className="form-label">Etiquetas Clínicas y de Estilo de Vida (Opcional)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  border: formData.tags.includes(tag) ? '2px solid var(--primary-color)' : '1px solid #d1d5db',
                  backgroundColor: formData.tags.includes(tag) ? '#e0f2fe' : '#f8fafc',
                  color: formData.tags.includes(tag) ? 'var(--primary-dark)' : '#475569',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: formData.tags.includes(tag) ? '600' : '400',
                  boxShadow: formData.tags.includes(tag) ? '0 2px 4px rgba(56, 189, 248, 0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-row mt-4" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary">Cancelar</Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando paciente...' : 'Guardar Paciente'}
          </button>
        </div>
      </form>
    </div>
  );
}
