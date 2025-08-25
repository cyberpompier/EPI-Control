import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Index from './pages/Index';
import Login from './pages/Login';
import EquipementDetail from './pages/EquipementDetail';
import ControleDetail from './pages/ControleDetail';
import NewControle from './pages/NewControleForm';
import EditEquipement from './pages/EditEquipement';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/equipement/:id" element={<EquipementDetail />} />
          <Route path="/equipement/edit/:id" element={<EditEquipement />} />
          <Route path="/controle/:equipementId" element={<NewControle />} />
          <Route path="/controle/:equipementId/:controleId" element={<ControleDetail />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;