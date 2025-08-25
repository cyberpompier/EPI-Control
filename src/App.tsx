"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Personnel from './pages/Personnel';
import Equipements from './pages/Equipements';
import Controles from './pages/Controles';
import PersonnelDetail from './pages/PersonnelDetail';
import PersonnelEdit from './pages/PersonnelEdit';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/personnel" element={<Personnel />} />
            <Route path="/equipements" element={<Equipements />} />
            <Route path="/controles" element={<Controles />} />
            <Route path="/personnel/:id" element={<PersonnelDetail />} />
            <Route path="/personnel/:id/edit" element={<PersonnelEdit />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;