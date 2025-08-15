"use client";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Controles from "./pages/Controles";
import ControleDetail from "./pages/ControleDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/controles" element={<Controles />} />
        <Route path="/controles/:id" element={<ControleDetail />} />
      </Routes>
    </Router>
  );
}

export default App;