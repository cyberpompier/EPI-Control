import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import Navbar from '@/components/Navbar';
import PersonnelList from '@/pages/PersonnelList';
import PersonnelDetail from '@/pages/PersonnelDetail';
import { PersonnelForm } from '@/pages/PersonnelForm'; // Fixed import - named export
import PersonnelEquipements from '@/pages/PersonnelEquipements';
import ControlesList from '@/pages/ControlesList';
import ControleDetail from '@/pages/ControleDetail';
import EquipementsList from '@/pages/EquipementsList';
import EquipementDetail from '@/pages/EquipementDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<PersonnelList />} />
            <Route path="/personnel" element={<PersonnelList />} />
            <Route path="/personnel/:id" element={<PersonnelDetail />} />
            <Route path="/personnel/form" element={<PersonnelForm isEditing={false} onSubmit={function (data: any): void | Promise<void> {
              throw new Error('Function not implemented.');
            } } />} />
            <Route path="/personnel/:id/edit" element={<PersonnelForm isEditing={true} onSubmit={function (data: any): void | Promise<void> {
              throw new Error('Function not implemented.');
            } } />} />
            <Route path="/personnel/:id/equipements" element={<PersonnelEquipements />} />
            <Route path="/controles" element={<ControlesList />} />
            <Route path="/controles/:id" element={<ControleDetail />} />
            <Route path="/equipements" element={<EquipementsList />} />
            <Route path="/equipements/:id" element={<EquipementDetail />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;