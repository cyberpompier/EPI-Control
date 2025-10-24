import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Equipements from '@/pages/Equipements';
import Personnel from '@/pages/Personnel';
import PersonnelDetail from '@/pages/PersonnelDetail';
import ControleForm from '@/pages/ControleForm';
import EquipementForm from '@/pages/EquipementForm';
import PersonnelForm from '@/pages/PersonnelForm';
import Habillement from '@/pages/Habillement';
import EPIAVerifier from '@/pages/EPIAVerifier';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipements"
          element={
            <ProtectedRoute>
              <Equipements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personnel"
          element={
            <ProtectedRoute>
              <Personnel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personnel/:id"
          element={
            <ProtectedRoute>
              <PersonnelDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personnel/:id/edit"
          element={
            <ProtectedRoute>
              <PersonnelForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/controle/:id"
          element={
            <ProtectedRoute>
              <ControleForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipement/new"
          element={
            <ProtectedRoute>
              <EquipementForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipement/:id"
          element={
            <ProtectedRoute>
              <EquipementForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personnel/new"
          element={
            <ProtectedRoute>
              <PersonnelForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habillement"
          element={
            <ProtectedRoute>
              <Habillement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/epi-a-verifier"
          element={
            <ProtectedRoute>
              <EPIAVerifier />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;