"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { Toaster } from 'sonner';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import Personnel from '@/pages/Personnel';
import PersonnelForm from '@/pages/PersonnelForm';
import Equipements from '@/pages/Equipements';
import EquipementDetail from '@/pages/EquipementDetail';
import Controles from '@/pages/Controles';
import ControleDetail from '@/pages/ControleDetail';
import Habillement from '@/pages/Habillement';
import HabillementDetail from '@/pages/HabillementDetail';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <SessionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/personnel/new" element={<PersonnelForm />} />
          <Route path="/personnel/:id" element={<PersonnelForm />} />
          <Route path="/equipements" element={<Equipements />} />
          <Route path="/equipements/:id" element={<EquipementDetail />} />
          <Route path="/controles" element={<Controles />} />
          <Route path="/controles/:id" element={<ControleDetail />} />
          <Route path="/habillement" element={<Habillement />} />
          <Route path="/habillement/:id" element={<HabillementDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </SessionProvider>
  );
}

export default App;