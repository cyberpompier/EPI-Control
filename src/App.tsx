"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Equipements from '@/pages/Equipements';
import EquipementDetails from '@/pages/EquipementDetails';
import EquipementEdit from '@/pages/EquipementEdit';
import EquipementsBarcode from '@/pages/EquipementsBarcode';
import Controles from '@/pages/Controles';
import ControleDetails from '@/pages/ControleDetails';
import ControleEdit from '@/pages/ControleEdit';
import Personnel from '@/pages/Personnel';
import PersonnelDetails from '@/pages/PersonnelDetails';
import PersonnelEdit from '@/pages/PersonnelEdit';
import Habillement from '@/pages/Habillement';
import HabillementDetails from '@/pages/HabillementDetails';
import HabillementEdit from '@/pages/HabillementEdit';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/equipements" element={<Equipements />} />
        <Route path="/equipements/barcode" element={<EquipementsBarcode />} />
        <Route path="/equipements/:id" element={<EquipementDetails />} />
        <Route path="/equipements/:id/edit" element={<EquipementEdit />} />
        <Route path="/controles" element={<Controles />} />
        <Route path="/controles/:id" element={<ControleDetails />} />
        <Route path="/controles/:id/edit" element={<ControleEdit />} />
        <Route path="/personnel" element={<Personnel />} />
        <Route path="/personnel/:id" element={<PersonnelDetails />} />
        <Route path="/personnel/:id/edit" element={<PersonnelEdit />} />
        <Route path="/habillement" element={<Habillement />} />
        <Route path="/habillement/:id" element={<HabillementDetails />} />
        <Route path="/habillement/:id/edit" element={<HabillementEdit />} />
      </Routes>
    </Router>
  );
}