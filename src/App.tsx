"use client";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Personnel from './pages/Personnel';
import Equipements from './pages/Equipements';
import Controles from './pages/Controles';
import Rapports from './pages/Rapports';
import Notifications from './pages/Notifications';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/personnel" element={<PrivateRoute><Personnel /></PrivateRoute>} />
        <Route path="/equipements" element={<PrivateRoute><Equipements /></PrivateRoute>} />
        <Route path="/controles" element={<PrivateRoute><Controles /></PrivateRoute>} />
        <Route path="/rapports" element={<PrivateRoute><Rapports /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;