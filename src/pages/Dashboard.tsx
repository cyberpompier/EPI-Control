"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Tout est opérationnel.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accès rapides</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              Accueil
            </Link>
            <Link
              to="/equipements/barcode"
              className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300 transition"
            >
              Scanner un équipement
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}