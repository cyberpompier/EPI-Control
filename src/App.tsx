import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Equipements from './pages/Equipements';
import EquipementDetail from './pages/EquipementDetail';
import EquipementForm from './pages/EquipementForm';
import Controles from './pages/Controles';
import ControleDetail from './pages/ControleDetail';
import ControleForm from './pages/ControleForm';
import ControleEditForm from './pages/ControleEditForm';
import Personnel from './pages/Personnel';
import PersonnelDetail from './pages/PersonnelDetail';
import PersonnelForm from './pages/PersonnelForm';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Routes protégées */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/equipements" element={<ProtectedRoute><Equipements /></ProtectedRoute>} />
          <Route path="/equipements/nouveau" element={<ProtectedRoute><EquipementForm /></ProtectedRoute>} />
          <Route path="/equipements/:id" element={<ProtectedRoute><EquipementDetail /></ProtectedRoute>} />
          <Route path="/equipements/:id/modifier" element={<ProtectedRoute><EquipementForm /></ProtectedRoute>} />
          
          <Route path="/controles" element={<ProtectedRoute><Controles /></ProtectedRoute>} />
          <Route path="/controles/:id" element={<ProtectedRoute><ControleDetail /></ProtectedRoute>} />
          <Route path="/controle/:id" element={<ProtectedRoute><ControleForm /></ProtectedRoute>} />
          <Route path="/controles/:id/modifier" element={<ProtectedRoute><ControleEditForm /></ProtectedRoute>} />

          <Route path="/personnel" element={<ProtectedRoute><Personnel /></ProtectedRoute>} />
          <Route path="/personnel/nouveau" element={<ProtectedRoute><PersonnelForm /></ProtectedRoute>} />
          <Route path="/personnel/:id" element={<ProtectedRoute><PersonnelDetail /></ProtectedRoute>} />
          <Route path="/personnel/:id/modifier" element={<ProtectedRoute><PersonnelForm /></ProtectedRoute>} />

          <Route path="/parametres" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;