import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import NewPatient from './pages/NewPatient';
import EditPatient from './pages/EditPatient';
import NewConsultation from './pages/NewConsultation';

function Layout({ children }) {
  return (
    <div className="container">
      <header className="app-header">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="app-title">Sistema de Nutrición</h1>
        </Link>
        <Link to="/patients/new" className="btn btn-primary">Nuevo Paciente</Link>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<PatientList />} />
          <Route path="/patients/new" element={<NewPatient />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/patients/:id/edit" element={<EditPatient />} />
          <Route path="/patients/:id/consultations/new" element={<NewConsultation />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
