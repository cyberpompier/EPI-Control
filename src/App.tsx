import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Index from './pages/Index';
import Login from './pages/Login';
import EquipementDetail from './pages/EquipementDetail';
import ControleDetail from './pages/ControleDetail';
import NewControle from './pages/NewControleForm';
import EditEquipement from './pages/EditEquipement';
import Dashboard from './pages/Dashboard';
import Equipements from './pages/Equipements';
import EquipementsBarcode from './pages/EquipementsBarcode';
import EquipementForm from './pages/EquipementForm';
import Controles from './pages/Controles';
import Personnel from './pages/Personnel';
import PersonnelDetail from './pages/PersonnelDetail';
import PersonnelForm from './pages/PersonnelForm';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import { SessionProvider } from './components/auth/SessionProvider';

function App() {
  return (
    <SessionProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/equipements" element={<Equipements />} />
            <Route path="/equipements/barcode" element={<EquipementsBarcode />} />
            <Route path="/equipements/nouveau" element={<EquipementForm />} />
            <Route path="/equipement/:id" element={<EquipementDetail />} />
            <Route path="/equipement/edit/:id" element={<EditEquipement />} />
            <Route path="/controle/:equipementId" element={<NewControle />} />
            <Route path="/controle/:equipementId/:controleId" element={<ControleDetail />} />
            <Route path="/controles" element={<Controles />} />
            <Route path="/personnel" element={<Personnel />} />
            <Route path="/personnel/:id" element={<PersonnelDetail />} />
            <Route path="/personnel/nouveau" element={<PersonnelForm />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;