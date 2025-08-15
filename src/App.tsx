import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Personnel from './pages/Personnel';
import Equipements from './pages/Equipements';
import Controles from './pages/Controles';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { SessionProvider } from '@/components/auth/SessionProvider';
import PrivateRoute from './components/auth/PrivateRoute';
import PersonnelDetail from './pages/PersonnelDetail';
import PersonnelForm from './pages/PersonnelForm';
import EquipementForm from './pages/EquipementForm';
import PersonnelEquipements from './pages/PersonnelEquipements';
import EquipementDetail from './pages/EquipementDetail';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import ControleForm from './pages/ControleForm';
import ControleDetail from './pages/ControleDetail';

function App() {
  return (
    <Router>
      <SessionProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/personnel" element={<PrivateRoute><Personnel /></PrivateRoute>} />
          <Route path="/personnel/nouveau" element={<PrivateRoute><PersonnelForm /></PrivateRoute>} />
          <Route path="/personnel/:id" element={<PrivateRoute><PersonnelDetail /></PrivateRoute>} />
          <Route path="/personnel/:id/equipements" element={<PrivateRoute><PersonnelEquipements /></PrivateRoute>} />
          <Route path="/equipements" element={<PrivateRoute><Equipements /></PrivateRoute>} />
          <Route path="/equipements/nouveau" element={<PrivateRoute><EquipementForm /></PrivateRoute>} />
          <Route path="/equipements/:id" element={<PrivateRoute><EquipementDetail /></PrivateRoute>} />
          <Route path="/controle/:id" element={<PrivateRoute><ControleForm /></PrivateRoute>} />
          <Route path="/controles" element={<PrivateRoute><Controles /></PrivateRoute>} />
          <Route path="/controles/:id" element={<PrivateRoute><ControleDetail /></PrivateRoute>} />
          <Route path="/parametres" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </SessionProvider>
    </Router>
  );
}

export default App;