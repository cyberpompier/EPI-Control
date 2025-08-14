import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from '@/components/auth/SessionProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Login from '@/pages/Login';
import Index from '@/pages/Index';
import Personnel from '@/pages/Personnel';
import PersonnelDetail from '@/pages/PersonnelDetail';
import PersonnelForm from '@/pages/PersonnelForm';
import Equipements from '@/pages/Equipements';
import EquipementDetail from '@/pages/EquipementDetail';
import EquipementForm from '@/pages/EquipementForm';
import Controles from '@/pages/Controles';
import ControleDetail from '@/pages/ControleDetail';
import ControleForm from '@/pages/ControleForm';
import Rapports from '@/pages/Rapports';

function App() {
  return (
    <Router>
      <SessionProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/personnel" element={<ProtectedRoute><Personnel /></ProtectedRoute>} />
          <Route path="/personnel/:id" element={<ProtectedRoute><PersonnelDetail /></ProtectedRoute>} />
          <Route path="/personnel/nouveau" element={<ProtectedRoute><PersonnelForm /></ProtectedRoute>} />
          <Route path="/equipements" element={<ProtectedRoute><Equipements /></ProtectedRoute>} />
          <Route path="/equipements/:id" element={<ProtectedRoute><EquipementDetail /></ProtectedRoute>} />
          <Route path="/equipements/nouveau" element={<ProtectedRoute><EquipementForm /></ProtectedRoute>} />
          <Route path="/controles" element={<ProtectedRoute><Controles /></ProtectedRoute>} />
          <Route path="/controles/:id" element={<ProtectedRoute><ControleDetail /></ProtectedRoute>} />
          <Route path="/controles/nouveau" element={<ProtectedRoute><ControleForm /></ProtectedRoute>} />
          <Route path="/rapports" element={<ProtectedRoute><Rapports /></ProtectedRoute>} />
        </Routes>
        <Toaster position="top-right" />
      </SessionProvider>
    </Router>
  );
}

export default App;