import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { HelmetProvider } from 'react-helmet-async';

// Import des pages
import Dashboard from '@/pages/Dashboard';
import Equipements from '@/pages/Equipements';
import Controles from '@/pages/Controles';
import Personnel from '@/pages/Personnel';
import Habillement from '@/pages/Habillement';
import Login from '@/pages/Login';
import AuthProvider from '@/components/auth/AuthProvider';
import PrivateRoute from '@/components/auth/PrivateRoute';
import ControleEquipement from '@/pages/ControleEquipement';
import PersonnelDetail from '@/pages/PersonnelDetail';
import EquipementDetail from '@/pages/EquipementDetail';
import ControleDetail from '@/pages/ControleDetail';

function App() {
  return (
    <HelmetProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/equipements" element={<PrivateRoute><Equipements /></PrivateRoute>} />
              <Route path="/equipements/:id" element={<PrivateRoute><EquipementDetail /></PrivateRoute>} />
              <Route path="/controles" element={<PrivateRoute><Controles /></PrivateRoute>} />
              <Route path="/controles/:id" element={<PrivateRoute><ControleDetail /></PrivateRoute>} />
              <Route path="/controle/:equipementId" element={<PrivateRoute><ControleEquipement /></PrivateRoute>} />
              <Route path="/personnel" element={<PrivateRoute><Personnel /></PrivateRoute>} />
              <Route path="/personnel/:id" element={<PrivateRoute><PersonnelDetail /></PrivateRoute>} />
              <Route path="/habillement" element={<PrivateRoute><Habillement /></PrivateRoute>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </HelmetProvider>
  );
}

export default App;