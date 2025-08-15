import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionProvider } from '@/components/auth/SessionProvider';
import PrivateRoute from '@/components/auth/PrivateRoute';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import Equipements from '@/pages/Equipements';
import ControleForm from '@/pages/ControleForm';
import NotFound from '@/pages/NotFound';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <SessionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/equipements" element={
            <PrivateRoute>
              <Equipements />
            </PrivateRoute>
          } />
          <Route path="/controle/:id" element={
            <PrivateRoute>
              <ControleForm />
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </SessionProvider>
  );
}