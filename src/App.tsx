"use client";

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import Index from '@/pages/Index';
import Equipements from '@/pages/Equipements';
import PersonnelDetail from '@/pages/PersonnelDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/equipements" element={<Equipements />} />
            <Route path="/personnel/:id" element={<PersonnelDetail />} />
          </Routes>
        </main>
        <footer className="border-t text-xs text-muted-foreground py-4 text-center">
          © {new Date().getFullYear()} EPI Manager
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;