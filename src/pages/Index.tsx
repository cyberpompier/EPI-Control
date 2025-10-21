"use client";

import React from 'react';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <h1 className="text-xl font-semibold">Accueil</h1>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold">Bienvenue</h2>
          <p className="text-gray-600 mt-2">
            Choisissez une action pour continuer.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              Aller au tableau de bord
            </Link>

            <Link
              to="/equipements-barcode"
              className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300 transition"
            >
              Scanner un équipement
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}