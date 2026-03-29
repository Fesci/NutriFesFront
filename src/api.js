const API_URL = 'https://nutrifesbackend.onrender.com/api';

export const getPatients = async () => {
  const res = await fetch(`${API_URL}/patients`);
  if (!res.ok) throw new Error('Failed to fetch patients');
  return res.json();
};

export const getPatient = async (id) => {
  const res = await fetch(`${API_URL}/patients/${id}`);
  if (!res.ok) throw new Error('Failed to fetch patient');
  return res.json();
};

export const createPatient = async (patientData) => {
  const res = await fetch(`${API_URL}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  });
  if (!res.ok) throw new Error('Failed to create patient');
  return res.json();
};

export const updatePatientGoal = async (patientId, goal) => {
  const res = await fetch(`${API_URL}/patients/${patientId}/goal`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal })
  });
  if (!res.ok) throw new Error('Failed to update patient goal');
  return res.json();
};

export const updatePatient = async (patientId, patientData) => {
  const res = await fetch(`${API_URL}/patients/${patientId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  });
  if (!res.ok) throw new Error('Failed to update patient');
  return res.json();
};

export const updatePatientNextAppointment = async (patientId, nextAppointment) => {
  const res = await fetch(`${API_URL}/patients/${patientId}/next_appointment`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ next_appointment: nextAppointment })
  });
  if (!res.ok) throw new Error('Failed to update next appointment');
  return res.json();
};

export const getConsultations = async (patientId) => {
  const res = await fetch(`${API_URL}/patients/${patientId}/consultations`);
  if (!res.ok) throw new Error('Failed to fetch consultations');
  return res.json();
};

export const createConsultation = async (patientId, consultationData) => {
  const res = await fetch(`${API_URL}/patients/${patientId}/consultations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(consultationData)
  });
  if (!res.ok) throw new Error('Failed to add consultation');
  return res.json();
};

