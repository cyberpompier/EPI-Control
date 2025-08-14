import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionProvider } from '@/components/auth/SessionProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Personnel from '@/pages/Personnel';
import PersonnelDetail from '@/pages/PersonnelDetail';
import PersonnelForm from '@/pages/PersonnelForm';
import PersonnelEquipements from '@/pages/PersonnelEquipements';
import Equipements from '@/pages/Equipements';
import EquipementForm from '@/pages/EquipementForm';
import EquipementDetail from '@/pages/EquipementDetail';
import Controles from '@/pages/Controles';
import ControleDetail from '@/pages/ControleDetail';
import ControleForm from '@/pages/ControleForm';
import Notifications from '@/pages/Notifications';
import Profile from '@/pages/Profile';
import Reports from '@/pages/Reports';
import Habillement from '@/pages/Habillement';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <SessionProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/personnel" element={
              <ProtectedRoute>
                <Personnel />
              </ProtectedRoute>
            } />
            <Route path="/personnel/nouveau" element={
              <ProtectedRoute>
                <PersonnelForm />
              </ProtectedRoute>
            } />
            <Route path="/personnel/:id" element={
              <ProtectedRoute>
                <PersonnelDetail />
              </ProtectedRoute>
            } />
            <Route path="/personnel/:id/equipements" element={
              <ProtectedRoute>
                <PersonnelEquipements />
              </ProtectedRoute>
            } />
            <Route path="/equipements" element={
              <ProtectedRoute>
                <Equipements />
              </ProtectedRoute>
            } />
            <Route path="/equipements/nouveau" element={
              <ProtectedRoute>
                <EquipementForm />
              </ProtectedRoute>
            } />
            <Route path="/equipements/:id" element={
              <ProtectedRoute>
                <EquipementDetail />
              </ProtectedRoute>
            } />
            <Route path="/controles" element={
              <ProtectedRoute>
                <Controles />
              </ProtectedRoute>
            } />
            <Route path="/controles/nouveau" element={
              <ProtectedRoute>
                <ControleForm />
              </ProtectedRoute>
            } />
            <Route path="/controles/:id" element={
              <ProtectedRoute>
                <ControleDetail />
              </ProtectedRoute>
            } />
            <Route path="/controle/:id" element={
              <ProtectedRoute>
                <ControleForm />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/habillement" element={
              <ProtectedRoute>
                <Habillement />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </SessionProvider>
    </Router>
  );
}

export default App;