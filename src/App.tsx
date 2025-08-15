import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionProvider } from '@/components/auth/SessionProvider';
import PrivateRoute from '@/components/auth/PrivateRoute';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import Equipements from '@/pages/Equipements';
import ControleForm from '@/pages/ControleForm';
import NotFound from '@/pages/NotFound';
import { Toaster } from 'react-hot-toast';
import Dashboard from '@/pages/Dashboard';
import ControlesPage from '@/pages/Controles';
import ControleDetail from '@/pages/ControleDetail';
import ControleEdit from '@/pages/ControleEdit';
import EquipementDetail from '@/pages/EquipementDetail';
import EquipementForm from '@/pages/EquipementForm';
import EquipementEdit from '@/pages/EquipementEdit';
import EquipementsBarcode from '@/pages/EquipementsBarcode';
import Personnel from '@/pages/Personnel';
import PersonnelDetail from '@/pages/PersonnelDetail';
import PersonnelForm from '@/pages/PersonnelForm';
import PersonnelEquipements from '@/pages/PersonnelEquipements';
import Habillement from '@/pages/Habillement';
import Notifications from '@/pages/Notifications';
import Rapports from '@/pages/Rapports';
import Settings from '@/pages/Settings';

export default function App() {
  return (
    <SessionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/equipements" element={
            <PrivateRoute>
              <Equipements />
            </PrivateRoute>
          } />
          <Route path="/equipements/nouveau" element={
            <PrivateRoute>
              <EquipementForm />
            </PrivateRoute>
          } />
          <Route path="/equipements/barcode" element={
            <PrivateRoute>
              <EquipementsBarcode />
            </PrivateRoute>
          } />
          <Route path="/equipements/:id" element={
            <PrivateRoute>
              <EquipementDetail />
            </PrivateRoute>
          } />
          <Route path="/equipements/:id/modifier" element={
            <PrivateRoute>
              <EquipementEdit />
            </PrivateRoute>
          } />
          <Route path="/controle/:id" element={
            <PrivateRoute>
              <ControleForm />
            </PrivateRoute>
          } />
          <Route path="/controles" element={
            <PrivateRoute>
              <ControlesPage />
            </PrivateRoute>
          } />
          <Route path="/controles/:id" element={
            <PrivateRoute>
              <ControleDetail />
            </PrivateRoute>
          } />
          <Route path="/controles/:id/modifier" element={
            <PrivateRoute>
              <ControleEdit />
            </PrivateRoute>
          } />
          <Route path="/personnel" element={
            <PrivateRoute>
              <Personnel />
            </PrivateRoute>
          } />
          <Route path="/personnel/nouveau" element={
            <PrivateRoute>
              <PersonnelForm />
            </PrivateRoute>
          } />
          <Route path="/personnel/:id" element={
            <PrivateRoute>
              <PersonnelDetail />
            </PrivateRoute>
          } />
          <Route path="/personnel/:id/equipements" element={
            <PrivateRoute>
              <PersonnelEquipements />
            </PrivateRoute>
          } />
          <Route path="/habillement" element={
            <PrivateRoute>
              <Habillement />
            </PrivateRoute>
          } />
          <Route path="/notifications" element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          } />
          <Route path="/reports" element={
            <PrivateRoute>
              <Rapports />
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </SessionProvider>
  );
}