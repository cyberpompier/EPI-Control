import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from './pages/Index';
import PersonnelList from './pages/PersonnelList';
import PersonnelForm from './pages/PersonnelForm';
import EquipementsList from './pages/EquipementsList';
import ControlesList from './pages/ControlesList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/personnel" element={<PersonnelList />} />
            <Route path="/personnel/new" element={<PersonnelForm />} />
            <Route path="/personnel/edit/:id" element={<PersonnelForm />} />
            <Route path="/equipements" element={<EquipementsList />} />
            <Route path="/controles" element={<ControlesList />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </Router>
  );
}

export default App;