export const formatAppointment = (dateString) => {
  if (!dateString) return 'Sin turno';
  
  const date = new Date(dateString);
  const options = { 
    weekday: 'long', 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  };
  
  let formatted = date.toLocaleDateString('es-AR', options);
  
  // Limpiar coma si la hubiese (ej: "sábado, 04/04/2026 13:00")
  formatted = formatted.replace(',', '');
  
  // Capitalizar el día (ej: "Sábado 04/04/2026 13:00")
  const parts = formatted.split(' ');
  if (parts.length > 0) {
    parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }
  
  return parts.join(' ') + 'hrs';
};
