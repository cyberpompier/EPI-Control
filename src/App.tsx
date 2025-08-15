import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Controles from './pages/Controles';
import ControleDetails from './pages/ControleDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/controles" element={<Controles />} />
        <Route path="/controles/:id" element={<ControleDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;