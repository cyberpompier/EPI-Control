import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Index from '@/pages/Index';
import Personnel from '@/pages/Personnel';
import PersonnelEquipements from '@/pages/PersonnelEquipements';
import Equipements from '@/pages/Equipements';
import EquipementForm from '@/pages/EquipementForm';
import Controles from '@/pages/Controles';
import Habillement from '@/pages/Habillement';
import Login from '@/pages/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/personnel/:id/equipements" element={<PersonnelEquipements />} />
          <Route path="/equipements" element={<Equipements />} />
          <Route path="/equipements/nouveau" element={<EquipementForm />} />
          <Route path="/controles" element={<Controles />} />
          <Route path="/habillement" element={<Habillement />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;