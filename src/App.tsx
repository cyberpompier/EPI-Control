"use client";

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppErrorBoundary from './components/AppErrorBoundary';
import Index from './pages/Index';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const EquipementsBarcode = lazy(() => import('./pages/EquipementsBarcode'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-gray-700">Chargement…</div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/equipements/barcode" element={<EquipementsBarcode />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

export default App;