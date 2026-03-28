import React from 'react';

export const getTagStyle = (tag) => {
  const styles = {
    'Vegano': { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
    'Vegetariano': { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
    'Celiaquía': { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
    'Sedentario': { bg: '#ffedd5', color: '#9a3412', border: '#fed7aa' },
    'Deportista': { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
    'Adulto Mayor': { bg: '#f3e8ff', color: '#6b21a8', border: '#e9d5ff' },
    'Obesidad': { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
    'Diabetes': { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
    'TCA': { bg: '#e0e7ff', color: '#3730a3', border: '#c7d2fe' },
    'Embarazo/Lactancia': { bg: '#fce7f3', color: '#9d174d', border: '#fbcfe8' }
  };
  return styles[tag] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
};

export default function TagBadge({ tag }) {
  const s = getTagStyle(tag);
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.15rem 0.5rem',
      margin: '0.15rem',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '600',
      backgroundColor: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`
    }}>
      {tag}
    </span>
  );
}
