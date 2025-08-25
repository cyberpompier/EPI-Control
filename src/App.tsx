"use client";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        {/* Autres routes */}
      </Routes>
    </Router>
  );
}

export default App;