import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Index from './pages/Index';
import EquipmentScannerPage from './pages/EquipmentScannerPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex gap-4">
          <Link to="/" className="hover:text-gray-300">Accueil</Link>
          <Link to="/scanner" className="hover:text-gray-300">Scanner</Link>
        </div>
      </nav>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/scanner" element={<EquipmentScannerPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;