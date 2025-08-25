import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SessionProvider } from '@/components/auth/SessionProvider';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { Toaster } from '@/components/ui/toaster';

// Public pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

// Private pages
import Dashboard from '@/pages/Dashboard';
import Personnel from '@/pages/Personnel';
import PersonnelDetail from '@/pages/PersonnelDetail';
import PersonnelForm from '@/pages/PersonnelForm';
import PersonnelEquipements from '@/pages/PersonnelEquipements';
import Equipements from '@/pages/Equipements';
import EquipementDetail from '@/pages/EquipementDetail';
import EquipementForm from '@/pages/EquipementForm';
import EquipementEdit from '@/pages/EquipementEdit';
import EquipementsBarcode from '@/pages/EquipementsBarcode';
import Controles from '@/pages/Controles';
import ControleDetail from '@/pages/ControleDetail';
import ControleForm from '@/pages/ControleForm';
import ControleEdit from '@/pages/ControleEdit';
import Reports from '@/pages/Reports';
import Notifications from '@/pages/Notifications';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Habillement from '@/pages/Habillement';

function App() {
  return (
    <SessionProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          
          <Route path="/personnel" element={<PrivateRoute><Personnel /></PrivateRoute>} />
          <Route path="/personnel/nouveau" element={<PrivateRoute><PersonnelForm /></PrivateRoute>} />
          <Route path="/personnel/:id" element={<PrivateRoute><PersonnelDetail /></PrivateRoute>} />
          <Route path="/personnel/:id/equipements" element={<PrivateRoute><PersonnelEquipements /></PrivateRoute>} />

          <Route path="/equipements" element={<PrivateRoute><Equipements /></PrivateRoute>} />
          <Route path="/equipements/nouveau" element={<PrivateRoute><EquipementForm /></PrivateRoute>} />
          <Route path="/equipements/barcode" element={<PrivateRoute><EquipementsBarcode /></PrivateRoute>} />
          <Route path="/equipements/:id" element={<PrivateRoute><EquipementDetail /></PrivateRoute>} />
          <Route path="/equipements/:id/modifier" element={<PrivateRoute><EquipementEdit /></PrivateRoute>} />

          <Route path="/controles" element={<PrivateRoute><Controles /></PrivateRoute>} />
          <Route path="/controle/:id" element={<PrivateRoute><ControleForm /></PrivateRoute>} />
          <Route path="/controles/:id" element={<PrivateRoute><ControleDetail /></PrivateRoute>} />
          <Route path="/controles/:id/modifier" element={<PrivateRoute><ControleEdit /></PrivateRoute>} />

          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/habillement" element={<PrivateRoute><Habillement /></PrivateRoute>} />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </SessionProvider>
  );
}

export default App;