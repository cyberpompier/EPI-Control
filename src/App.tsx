import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EditEquipment from "./pages/equipements/EditEquipment";
import ControlEquipment from "./pages/equipements/ControlEquipment";
import EquipmentHistory from "./pages/equipements/EquipmentHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/equipements/:id/edit" element={<EditEquipment />} />
        <Route path="/equipements/:id/controler" element={<ControlEquipment />} />
        <Route path="/equipements/:id/historique" element={<EquipmentHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;