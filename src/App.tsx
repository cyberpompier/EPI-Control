"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Equipements from '@/pages/Equipements';
import AddEquipement from '@/pages/AddEquipement';
import EditEquipement from '@/pages/EditEquipement';
import HistoriqueEquipement from '@/pages/HistoriqueEquipement';
import Personnel from '@/pages/Personnel';
import AddPersonnel from '@/pages/AddPersonnel';
import Controles from '@/pages/Controles';
import AddControle from '@/pages/AddControle';
import Habillement from '@/pages/Habillement';
import AddHabillement from '@/pages/AddHabillement';
import Profile from '@/pages/Profile';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/equipements" element={
              <ProtectedRoute>
                <Equipements />
              </ProtectedRoute>
            } />
            <Route path="/equipements/ajouter" element={
              <ProtectedRoute>
                <AddEquipement />
              </ProtectedRoute>
            } />
            <Route path="/equipements/:id/edit" element={
              <ProtectedRoute>
                <EditEquipement />
              </ProtectedRoute>
            } />
            <Route path="/equipements/:id/historique" element={
              <ProtectedRoute>
                <HistoriqueEquipement />
              </ProtectedRoute>
            } />
            <Route path="/personnel" element={
              <ProtectedRoute>
                <Personnel />
              </ProtectedRoute>
            } />
            <Route path="/personnel/ajouter" element={
              <ProtectedRoute>
                <AddPersonnel />
              </ProtectedRoute>
            } />
            <Route path="/controles" element={
              <ProtectedRoute>
                <Controles />
              </ProtectedRoute>
            } />
            <Route path="/controles/ajouter" element={
              <ProtectedRoute>
                <AddControle />
              </ProtectedRoute>
            } />
            <Route path="/habillement" element={
              <ProtectedRoute>
                <Habillement />
              </ProtectedRoute>
            } />
            <Route path="/habillement/ajouter" element={
              <ProtectedRoute>
                <AddHabillement />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;