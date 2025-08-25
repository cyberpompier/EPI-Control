"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import PersonnelForm from './pages/PersonnelForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/personnel/new" element={<PersonnelForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;