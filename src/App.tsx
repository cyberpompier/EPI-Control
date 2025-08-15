import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import AuthCallback from '@/pages/AuthCallback';
import ControleDetail from '@/pages/ControleDetail';
import Controles from '@/pages/Controles';
import Dashboard from '@/pages/Dashboard';
import Equipements from '@/pages/Equipements';
import Habillement from '@/pages/Habillement';
import Login from '@/pages/Login';
import NouveauControle from '@/pages/NouveauControle';
import Personnel from '@/pages/Personnel';
import PersonnelDetail from '@/pages/PersonnelDetail';
import Profile from '@/pages/Profile';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/personnel/:id" element={<PersonnelDetail />} />
          <Route path="/equipements" element={<Equipements />} />
          <Route path="/controles" element={<Controles />} />
          <Route path="/controles/:id" element={<ControleDetail />} />
          <Route path="/nouveau-controle" element={<NouveauControle />} />
          <Route path="/nouveau-controle/:equipementId" element={<NouveauControle />} />
          <Route path="/habillement" element={<Habillement />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;